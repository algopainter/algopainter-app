<template>
  <q-dialog
    ref="dialogRef"
    :persistent="placingBid"
    @hide="onDialogHide"
  >
    <q-card class="place-bid-card">
      <q-card-section class="header">
        {{ $t('dashboard.auctionPage.placeABid') }}
      </q-card-section>
      <v-form v-slot="{ handleSubmit }">
        <q-form @submit="handleSubmit(placeBid)">
          <q-card-section>
            <div>
              {{ `${minimumLabel}:` }} {{ minimumValue }} {{ auction.minimumBid.tokenSymbol }}
            </div>
            <div>
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.auctionPage.amount')"
                name="amount"
                :rules="`required|min_value:${minimumBidAllowed}`"
              >
                <q-input
                  :model-value="field.value"
                  :label="$t('dashboard.auctionPage.amount')"
                  type="number"
                  color="primary"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:modelValue="handleChange"
                />
              </v-field>
            </div>
          </q-card-section>
          <q-card-section class="flex">
            <q-space />
            <div>
              <algo-button
                type="submit"
                color="primary"
                :label="$t('dashboard.auctionPage.placeABid')"
                :loading="placingBid"
              />
            </div>
          </q-card-section>
        </q-form>
      </v-form>
    </q-card>
    <q-dialog
      v-model="displayingStatus"
      persistent
    >
      <new-bid-status-card
        :bid-status="placingBidStatus"
        @request-close="onCloseStatusDialog"
      />
    </q-dialog>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, Ref, Prop } from 'vue-property-decorator';
import { QDialog } from 'quasar';
import { mapGetters } from 'vuex';
import { Form as VForm, Field as VField } from 'vee-validate';

import ERC20TokenProxy from 'src/eth/ERC20TokenProxy';
import AlgoPainterAuctionSystemProxy from 'src/eth/AlgoPainterAuctionSystemProxy';
import { getAuctionSystemContractByNetworkId } from 'src/eth/Config';
import { currencyToBlockchain } from 'src/helpers/format/currencyToBlockchain';
import { numberToString } from 'src/helpers/format/numberToString';
import { NetworkInfo } from 'src/store/user/types';
import { IAuctionItem } from 'src/models/IAuctionItem';
import AlgoButton from 'components/common/Button.vue';
import NewBidStatusCard from './NewBidStatusCard.vue';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';

enum PlacingBidStatus {
  CheckingAllowance,
  IncreateAllowanceAwaitingInput,
  IncreateAllowanceAwaitingConfirmation,
  IncreateAllowanceError,
  PlaceBidAwaitingInput,
  PlaceBidAwaitingConfirmation,
  PlaceBidError,
  BidCreated,
}

interface INewBid {
  amount: number;
}

@Options({
  components: {
    AlgoButton,
    NewBidStatusCard,
    VForm,
    VField,
  },
  computed: {
    ...mapGetters('user', {
      userAccount: 'account',
      networkInfo: 'networkInfo',
    }),
  },
})
export default class NewBidDialog extends Vue {
  @Ref() dialogRef!: QDialog;
  @Prop() auction!: IAuctionItem;

  auctionSystem!: AlgoPainterAuctionSystemProxy;
  auctionCoinTokenProxy!: ERC20TokenProxy;
  networkInfo!: NetworkInfo;
  userAccount!: string;

  placingBid: boolean = false;
  placingBidStatus: PlacingBidStatus | null = null;
  displayingStatus: boolean = false;

  get auctionSystemContractAddress() {
    return getAuctionSystemContractByNetworkId(this.networkInfo.id);
  }

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      const { tokenPriceAddress } = this.auction.minimumBid;

      return coin.tokenAddress.toLowerCase() === tokenPriceAddress;
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  get minimumLabel() {
    const { highestBid } = this.auction;

    return highestBid
      ? this.$t('dashboard.auctionPage.highestBid')
      : this.$t('dashboard.auctionPage.minimumBid');
  }

  get minimumValue() {
    const { highestBid, minimumBid } = this.auction;
    const { decimalPlaces } = this.coinDetails;

    const value = highestBid ? highestBid.amount : minimumBid.amount;

    const amount = blockchainToCurrency(value, decimalPlaces);

    return this.$n(amount, 'decimal', {
      maximumFractionDigits: decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  get minimumBidAllowed() {
    const { highestBid, minimumBid } = this.auction;
    const { decimalPlaces } = this.coinDetails;

    const value = highestBid ? highestBid.amount + 1: minimumBid.amount;

    return blockchainToCurrency(value, decimalPlaces);
  }

  mounted() {
    this.show();
    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    this.auctionCoinTokenProxy = new ERC20TokenProxy(this.auction.minimumBid.tokenPriceAddress);
  }

  show() {
    this.dialogRef.show();
  }

  hide() {
    this.dialogRef.hide();
  }

  onDialogHide() {
    this.$emit('hide');
  }

  async approveContractTransfer(amount: number) {
    this.placingBidStatus = PlacingBidStatus.CheckingAllowance;

    const allowance = await this.auctionCoinTokenProxy
      .allowance(this.userAccount, this.auctionSystemContractAddress);

    if (allowance < amount) {
      this.placingBidStatus = PlacingBidStatus.IncreateAllowanceAwaitingInput;

      await this.auctionCoinTokenProxy.approve(
        this.auctionSystemContractAddress,
        numberToString(amount),
        this.userAccount,
      ).on('error', () => {
        this.placingBidStatus = PlacingBidStatus.IncreateAllowanceError;
      }).on('transactionHash', () => {
        this.placingBidStatus =
          PlacingBidStatus.IncreateAllowanceAwaitingConfirmation;
      });
    }
  }

  async placeBid({ amount }: INewBid) {
    try {
      this.placingBid = true;
      this.displayingStatus = true;

      const decimalPlaces = this.coinDetails.decimalPlaces;

      const bidAmount = currencyToBlockchain(
        Number(amount),
        decimalPlaces,
      );

      await this.approveContractTransfer(bidAmount);

      this.placingBidStatus = PlacingBidStatus.PlaceBidAwaitingInput;

      await this.auctionSystem.bid(
        this.auction.index,
        numberToString(bidAmount),
        this.userAccount,
      ).on('error', () => {
        this.placingBidStatus = PlacingBidStatus.PlaceBidError;
      }).on('transactionHash', () => {
        this.placingBidStatus = PlacingBidStatus.PlaceBidAwaitingConfirmation;
      });

      this.placingBidStatus = PlacingBidStatus.BidCreated;

      this.placingBid = false;
    } catch (error) {
      this.placingBidStatus = PlacingBidStatus.PlaceBidError;
      this.placingBid = false;
    }
  }

  onCloseStatusDialog() {
    this.displayingStatus = false;

    if (this.placingBidStatus === PlacingBidStatus.BidCreated) {
      this.hide();
    }
  }
}
</script>

<style lang="scss" scoped>
.place-bid-card {
  width: 600px;

  .header {
    background: $primary;
    font-size: 1.4rem;
    color: #FFF;
  }
}
</style>
