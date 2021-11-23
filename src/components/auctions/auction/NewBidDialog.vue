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
          <q-card-section class="row q-col-gutter-md">
            <div class="col-12">
              <i18n-t keypath="dashboard.auctionPage.newBidDescription">
                <template #title>
                  <span class="art-title">
                    {{ auction.item.title }}
                  </span>
                </template>
              </i18n-t>
            </div>
            <div
              v-if="auction"
              class="col-12">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.auctionPage.amount')"
                name="amount"
              >
                <q-input
                  :model-value="field.value"
                  :label="$t('dashboard.auctionPage.amount')"
                  inputmode="number"
                  mask="#.####"
                  reverse-fill-mask
                  fill-mask="0"
                  color="primary"
                  :hint="`${minimumLabel}: ${minimumValue} ${coinSymbol}`"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  :rules="[val => val <= balance || $t('dashboard.auctionPage.newBidModal.rules.noFunds'),
                           val => val >= minimumBid || $t('dashboard.auctionPage.newBidModal.rules.minimumBid', {
                             coinSymbol: coinSymbol,
                             auctionMinimumBid: auctionMinimumBid,
                           }),
                           val => val > highestBid || $t('dashboard.auctionPage.newBidModal.rules.highestBid', {
                             coinSymbol: coinSymbol,
                             minimumValue: minimumValue,
                           }),
                  ]"
                  @update:modelValue="updateAmount(handleChange, $event)"
                />
                {{ minimumBid }}
              </v-field>
            </div>
            <div
              v-if="loadingBlockchainData"
              class="col-12 flex flex-center q-pa-lg"
            >
              <q-spinner
                size="80px"
                color="primary"
              />
            </div>
            <div
              v-else
              class="col-12 info-list"
            >
              <div class="info-item">
                <div class="label">
                  {{ $t('dashboard.auctionPage.yourBalance') }}
                </div>
                <div class="value">
                  {{ `${userBalanceFormatted} ${coinSymbol}` }}
                </div>
              </div>
              <div class="info-item">
                <div class="label">
                  {{ $t('dashboard.auctionPage.serviceFee') }}
                </div>
                <div class="value">
                  {{ `${bidFeeAmount} ${coinSymbol}` }}
                </div>
              </div>
              <div class="info-item">
                <div class="label">
                  {{ $t('dashboard.auctionPage.netAmount') }}
                </div>
                <div class="value">
                  {{ `${netAmount} ${coinSymbol}` }}
                </div>
              </div>
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
import { Vue, Options, Ref, Prop, Watch } from 'vue-property-decorator';
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
import UserUtils from 'src/helpers/user';
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
      isConnected: 'isConnected',
    }),
  },
})
export default class NewBidDialog extends Vue {
  @Ref() dialogRef!: QDialog;
  @Prop() auction!: IAuctionItem;

  auctionSystemProxy!: AlgoPainterAuctionSystemProxy;
  auctionCoinTokenProxy!: ERC20TokenProxy;
  networkInfo!: NetworkInfo;
  userAccount!: string;

  loadingBlockchainData: boolean = false;
  userBalance: number = 0;
  bidFee: number = 0;
  bidAmount: number = 0;
  balance: number = 0;
  highestBid: number = 0;
  minimumBid: number = 0;
  isConnected!: boolean;

  placingBid: boolean = false;
  placingBidStatus: PlacingBidStatus | null = null;
  displayingStatus: boolean = false;
  formattedBalance: string = '';

  get auctionSystemContractAddress() {
    return getAuctionSystemContractByNetworkId(this.networkInfo.id);
  }

  @Watch('balance')
  onBalanceChanged() {
    if (this.isConnected) {
      void this.setAccountBalance();
    }
  }

  async setAccountBalance() {
    if (this.isConnected) {
      this.balance = (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await UserUtils.fetchAccountBalance(this.$store.getters['user/networkInfo'], this.$store.getters['user/account']));
      void this.setformattedBalance();
    }
  }

  setformattedBalance() {
    this.formattedBalance = UserUtils.formatAccountBalance(this.balance, 2);
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

  get coinSymbol() {
    return this.coinDetails.label;
  }

  validateBid() {
    const highestBid = this.auction.bids;
    const { decimalPlaces } = this.coinDetails;

    if (highestBid.length === 0) {
      this.minimumBid = blockchainToCurrency(this.auction.minimumBid.amount, decimalPlaces);
    } else {
      this.highestBid = blockchainToCurrency(this.auction.highestBid.netAmount, decimalPlaces);
    }
  }

  get auctionHighestBid() {
    const { decimalPlaces } = this.coinDetails;
    const value = this.highestBid;

    const amount = blockchainToCurrency(value, decimalPlaces);

    return this.$n(amount, 'decimal', {
      maximumFractionDigits: decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  get auctionMinimumBid() {
    const { decimalPlaces } = this.coinDetails;
    const value = this.minimumBid;
    const amount = blockchainToCurrency(value, decimalPlaces);

    return this.$n(amount, 'decimal', {
      maximumFractionDigits: decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  get minimumLabel() {
    const { highestBid } = this.auction;

    return highestBid
      ? this.$t('dashboard.auctionPage.highestBid')
      : this.$t('dashboard.auctionPage.minimumBid');
  }

  get userBalanceFormatted() {
    const { decimalPlaces } = this.coinDetails;
    const amount = blockchainToCurrency(this.userBalance, decimalPlaces);
    return this.formatValue(amount);
  }

  get bidFeeAmount() {
    return this.formatValue(this.bidAmount * this.bidFee);
  }

  get netAmount() {
    return this.formatValue(this.bidAmount + (this.bidAmount * this.bidFee));
  }

  get minimumValue() {
    const { highestBid, minimumBid } = this.auction;
    const { decimalPlaces } = this.coinDetails;

    const value = highestBid ? highestBid.netAmount : minimumBid.amount;

    const amount = blockchainToCurrency(value, decimalPlaces);

    return this.$n(amount, 'decimal', {
      maximumFractionDigits: decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  mounted() {
    this.show();
    this.auctionSystemProxy = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    this.auctionCoinTokenProxy = new ERC20TokenProxy(this.auction.minimumBid.tokenPriceAddress);
    void this.loadBlockchainData();
    void this.setAccountBalance();
    void this.validateBid();
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

  formatValue(value: number) {
    const { decimalPlaces } = this.coinDetails;

    return this.$n(value, 'decimal', {
      maximumFractionDigits: decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  async loadBlockchainData() {
    try {
      this.loadingBlockchainData = true;

      const [balance, fee] = await Promise.all([
        this.auctionCoinTokenProxy.balanceOf(this.userAccount),
        this.auctionSystemProxy.getBidFeeRate(),
      ]);

      this.userBalance = balance;
      this.bidFee = fee / 10000;

      this.loadingBlockchainData = false;
    } catch {
      this.loadingBlockchainData = false;
    }
  }

  updateAmount(handleFormInput: (value: number) => void, value: number) {
    this.bidAmount = Number(value);
    handleFormInput(this.bidAmount);
  }

  async approveContractTransfer(amount: number) {
    this.placingBidStatus = PlacingBidStatus.CheckingAllowance;

    const allowance = await this.auctionCoinTokenProxy
      .allowance(this.userAccount, this.auctionSystemContractAddress);

    if (allowance < amount) {
      this.placingBidStatus = PlacingBidStatus.IncreateAllowanceAwaitingInput;

      const { decimalPlaces } = this.coinDetails;

      const allowanceAmount = currencyToBlockchain(
        Number.MAX_SAFE_INTEGER,
        decimalPlaces,
      );

      await this.auctionCoinTokenProxy.approve(
        this.auctionSystemContractAddress,
        numberToString(allowanceAmount),
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

      const { decimalPlaces } = this.coinDetails;

      const bidAmount = currencyToBlockchain(
        Number(amount),
        decimalPlaces,
      );

      await this.approveContractTransfer(bidAmount);

      this.placingBidStatus = PlacingBidStatus.PlaceBidAwaitingInput;

      await this.auctionSystemProxy.bid(
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
  border-radius: 12px;
  width: 600px;

  .header {
    background: $primary;
    font-size: 1.4rem;
    color: #FFF;
  }

  .art-title {
    font-weight: bold;
    color: $primary;
  }

  .info-list {
    .info-item {
      display: flex;
      justify-content: space-between;
      font-weight: bold;

      .label {
        color: $grey-5;
      }
    }
  }
}
</style>
