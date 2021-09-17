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
      <q-card-section>
        <q-form>
          <div>
            <q-input
              v-model="bidValue"
              :label="$t('dashboard.auctionPage.amount')"
              type="number"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
      <q-card-section class="flex">
        <q-space />
        <div>
          <algo-button
            color="primary"
            :label="$t('dashboard.auctionPage.placeABid')"
            :loading="placingBid"
            @click="placeBid"
          />
        </div>
      </q-card-section>
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

import AlgoPainterTokenProxy from 'src/eth/AlgoPainterTokenProxy';
import AlgoPainterAuctionSystemProxy from 'src/eth/AlgoPainterAuctionSystemProxy';
import { getAuctionSystemContractByNetworkId } from 'src/eth/Config';
import { currencyToBlockchain } from 'src/helpers/format/currencyToBlockchain';
import { numberToString } from 'src/helpers/format/numberToString';
import { NetworkInfo } from 'src/store/user/types';
import { IAuctionItem } from 'src/models/IAuctionItem';
import AlgoButton from 'components/common/Button.vue';
import NewBidStatusCard from './NewBidStatusCard.vue';
import { auctionCoins } from 'src/helpers/auctionCoins';

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

@Options({
  components: {
    AlgoButton,
    NewBidStatusCard,
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
  algopToken!: AlgoPainterTokenProxy;
  networkInfo!: NetworkInfo;
  userAccount!: string;

  bidValue: string = '';
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

  mounted() {
    this.show();
    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    this.algopToken = new AlgoPainterTokenProxy(this.networkInfo);
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

    const allowance = await this.algopToken
      .allowance(this.userAccount, this.auctionSystemContractAddress);

    if (allowance < amount) {
      this.placingBidStatus = PlacingBidStatus.IncreateAllowanceAwaitingInput;

      await this.algopToken.approve(
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

  async placeBid() {
    try {
      this.placingBid = true;
      this.displayingStatus = true;

      const decimalPlaces = this.coinDetails.decimalPlaces;

      const bidAmount = currencyToBlockchain(
        Number(this.bidValue),
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
