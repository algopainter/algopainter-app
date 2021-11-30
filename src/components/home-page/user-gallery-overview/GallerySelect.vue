<template>
  <div class="row justify-between q-mb-md">
    <div class="col-12 col-md-3 col-lg-3 col-xl-3 col-xl-2 col-sm-6 col-xs-12">
      <q-img
        class="previewImage"
        :src="art.item.previewImage"
        alt="img art"
      />
    </div>
    <div class="col-12 col-md-3 col-lg-4 col-xl-3 col-sm-6 col-xs-12 text-last">
      <div class="text">
        <div class="text-title text-bold text-h6">
          {{ $t('dashboard.gallery.bidBackTab.symbol') }}{{ art.item.index }}
          {{ art.item.title }}
          <q-tooltip
            anchor="bottom middle"
            max-width="200px"
            class="bg-primary"
          >
            {{ art.item.title }}
          </q-tooltip>
        </div>
        {{ art.item.description }}
      </div>
      <div>
        <div class="text-bold text-h4 q-mt-md">
          {{ $t('dashboard.gallery.bidBackTab.lastBid') }}
        </div>
        <p class="coin text-h6">
          {{ getLastBid + ' ' + art.highestBid.tokenSymbol }}
        </p>
      </div>
      <div class="text-bold text-h6">
        <div
          v-if="isEnded"
          class="text-bold text-end"
        >
          {{ $t('dashboard.bid.auctionEnd') }}
          <div class="text-bold">
            {{ monthExpirations }}
            <span class="text-bold">
              {{ dayExpirations }} {{ $t('dashboard.bid.of') }}</span>
            {{ yearExpirations }}
          </div>
          <p>{{ hoursExpirations }}</p>
        </div>
        <div v-else>
          <div class="text-bold row justify-start text-end">
            {{ $t('dashboard.bid.auctionTime') }}
          </div>
          <div class="text-bold">
            <div class="row justify-start time q-gutter-sm">
              <div>
                <div class="text-bold">
                  <!-- {{ days }}  -->{{ countDays }}
                </div>
                <span> {{ $t('dashboard.bid.days') }} </span>
              </div>
              <div>
                <div class="text-bold">
                  <!-- {{ hours }}-->
                  {{ countHours }}
                </div>
                <span>{{ $t('dashboard.bid.hours') }}</span>
              </div>
              <div>
                <div class="text-bold">
                  <!-- {{ minutes }} -->{{ countMinutes }}
                </div>
                <span>{{ $t('dashboard.bid.minis') }}</span>
              </div>
              <div>
                <div class="text-bold">
                  <!-- {{ seconds }} -->
                  {{ countSeconds }}
                </div>
                <span>{{ $t('dashboard.bid.seconds') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="
        col-12 col-md-3 col-lg-3 col-sm-8 col-xs-12
        items-center
        field-stack
      "
    >
      <div>
        <template v-if="showHarvestBtn">
          <span class="text-bold flex">
            {{ $t('dashboard.gallery.bidBackTab.earned') }}
          </span>
          <div class="flex container">
            <q-input
              v-model="userCurrentPrizeAmount"
              fill-mask="0"
              input-class="text-left"
              class="input-stack-algop"
              readonly
            />
            <algo-button
              :label="$t('dashboard.gallery.bidBackTab.harvest')"
              color="primary"
              class="btn-havest"
              :disable="isCoinHarvestDisabled"
              @click="claimBidBack"
            />
          </div>
        </template>
        <template v-else-if="showHarvestMsg">
          <span class="text-bold flex q-my-md">
            {{ $t('dashboard.gallery.bidBackTab.harvestMsg') }}
          </span>
        </template>
        <span class="text-bold">
          {{ $t('dashboard.gallery.bidBackTab.stakedAlgop') }}
        </span>
        <div class="flex container">
          <span
            class="input-stack-algop"
          > {{ algopStacked ? setFormatCurrency(algopStacked) : 0 }}
          </span>
          <algo-button
            label="-"
            color="primary"
            class="btn-staked"
            :disable="disableUnstackBtn"
            @click="unstackCoin()"
          />
          <algo-button
            label="+"
            color="primary"
            class="btn-staked"
            :disable="art.ended"
            @click="stackCoin()"
          />
          <stack-modal-algop
            v-model="openModal"
            :art="art"
          />
          <UnstackModalAlgop
            v-model="openModalUnstack"
            :art="art"
          />
        </div>
      </div>
    </div>
    <div class="col-12 col-md-2 col-lg-2 col-sm-4 col-xs-12 ended-part">
      <div
        class="bidBack text-white column justify-center content-center q-mb-xl"
      >
        <div class="row justify-center items-center content-center">
          {{ auctionBidBackRate + '%' }}
        </div>
        <div class="row justify-center items-center content-center">
          {{ $t('dashboard.gallery.bidBackTab.bidBack') }}
        </div>
      </div>
      <div class="row justify-center">
        <algo-button
          :label="$t('dashboard.gallery.bidBackTab.bidBackBtn')"
          color="primary"
          outline
          class="load-more q-px-xl q-mx-auto q-mb-sm"
          @click="openBidBackModal()"
        />
        <algo-button
          :label="$t('dashboard.gallery.bidBackTab.bidBackSimulatorBtn')"
          color="primary"
          outline
          class="load-more q-px-xl q-mx-auto"
          @click="openBidBackSimulatorModal()"
        />
      </div>
    </div>
    <q-dialog
      v-model="displayingStatus"
      persistent
    >
      <withdraw-bidBack-status-card
        :withdraw-bid-back-status="withdrawBidBackStatus"
        @request-close="onCloseStatusDialog"
      />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, prop, Options } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import StackModalAlgop from 'src/components/modal/StackModalAlgop.vue';
import UnstackModalAlgop from 'src/components/modal/UnstackModalAlgop.vue';
import { IAuctionItem } from 'src/models/IAuctionItem';
import AlgoPainterBidBackPirsProxy from 'src/eth/AlgoPainterBidBackPirsProxy';
import AlgoPainterRewardsSystemProxy from 'src/eth/AlgoPainterRewardsSystemProxy';
import { mapGetters } from 'vuex';
import { NetworkInfo } from 'src/store/user/types';
import WithdrawBidBackStatusCard from 'src/components/auctions/auction/WithdrawBidBackStatusCard.vue';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { auctionCoins } from 'src/helpers/auctionCoins';
import moment from 'moment';
import { now } from 'src/helpers/timer';
import 'moment-duration-format';
import { Watch } from 'vue-property-decorator';

class Props {
  art = prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  });
}

enum WithdrawBidBackStatus {
  CheckingContractApproved,
  ContractApprovedAwaitingInput,
  ContractApprovedAwaitingConfirmation,
  ContractApprovedError,
  WithdrawBidBackAwaitingInput,
  WithdrawBidBackAwaitingConfirmation,
  WithdrawBidBackError,
  BidBackWithdrawn,
}

@Options({
  components: {
    AlgoButton,
    StackModalAlgop,
    UnstackModalAlgop,
    WithdrawBidBackStatusCard,
  },
  watch: {
    now: ['getTime'],
  },
  computed: {
    ...mapGetters('user', ['networkInfo', 'account', 'isConnected']),
  },
})
export default class gallerySelect extends Vue.with(Props) {
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  isConnected!: boolean;

  openModal: boolean = false;
  openModalUnstack: boolean = false;
  algopStacked: number = 0;
  teste: number = 0;
  showHarvestBtn: boolean = false;
  showHarvestMsg: boolean = false;
  lastBid: string = '';
  disableUnstackBtn: boolean = true;
  auctionBidBackRate: number = 0;
  userCurrentPrizeAmount: number = 0;
  isCoinHarvestDisabled: boolean = false;

  displayingStatus: boolean = false;
  withdrawBidBackStatus: WithdrawBidBackStatus | null = null;

  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  minuReal: number = 0;
  seconds: number = 0;
  monthExpirations: string = '';
  dayExpirations: string = '';
  yearExpirations: string = '';
  hoursExpirations!: string;
  countDays: number = 0;
  countHours: number = 0;
  countMinutes: number = 0;
  countSeconds: number = 0;
  lastCountDays: number = 0;
  lastCountHours: number = 0;
  lastCountMinutes: number = 0;
  lastCountSeconds: number = 0;
  stopCount: boolean = false;

  created() {
    this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
    this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
  }

  mounted() {
    void this.getBidBackPercentage();
    void this.getTime();
    void this.formatTime();
  }

  async getBidBackPercentage() {
    try {
      this.auctionBidBackRate = await this.bidBackPirsSystem.getBidBackRate(
        this.art.index,
      ) / 100;
      if (this.auctionBidBackRate > 0) {
        void this.getCurrentPrizeAmount();
      }
      void this.getUserStackedBidBack();
    } catch (error) {
      console.log('Error - getBidBackPercentage - GallerySelect');
    }
  }

  get getLastBid() {
    const bidAmount = blockchainToCurrency(
      this.art.highestBid.netAmount,
      this.coinDetails.decimalPlaces,
    );

    return this.$n(bidAmount, 'decimal', {
      maximumFractionDigits: this.coinDetails.decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return (
        coin.tokenAddress.toLowerCase() ===
        this.art.minimumBid.tokenPriceAddress
      );
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  setFormatCurrency(amount: number) {
    return blockchainToCurrency(amount, this.coinDetails.decimalPlaces);
  }

  getUserStackedBidBack() {
    this.algopStacked = this.art.bidbacks[this.account] || 0;

    this.disableUnstackBtn = this.algopStacked <= 0 || this.art.ended;
    this.showHarvestBtn = this.art.ended && this.algopStacked > 0 && this.auctionBidBackRate > 0;
    this.showHarvestMsg = !this.art.ended && this.algopStacked > 0 && this.auctionBidBackRate > 0;
  }

  async claimBidBack() {
    try {
      this.displayingStatus = true;

      this.withdrawBidBackStatus = WithdrawBidBackStatus.WithdrawBidBackAwaitingConfirmation;

      await this.rewardsSystem
        .claimBidBack(this.art.index, this.account)
        .on('transactionHash', () => {
          this.withdrawBidBackStatus = WithdrawBidBackStatus.WithdrawBidBackAwaitingConfirmation;
        })
        .on('error', () => {
          this.withdrawBidBackStatus = WithdrawBidBackStatus.WithdrawBidBackError;
        });

      this.isCoinHarvestDisabled = true;
      this.disableUnstackBtn = true;
      this.withdrawBidBackStatus = WithdrawBidBackStatus.BidBackWithdrawn;
    } catch (e) {
      console.log('error claimBidBack bidBack', e);
    }
  }

  async getCurrentPrizeAmount() {
    const totalBidBackStaked = await this.rewardsSystem.getTotalBidBackStakes(
      this.art.index,
    );

    const auctionHighestBid = this.art.highestBid.netAmount / 1000000000000000000;

    const auctionBidBackRate = this.auctionBidBackRate / 100;

    const totalBidBackPrize = auctionBidBackRate * auctionHighestBid;

    const userBidBackShare =
      totalBidBackStaked > 0 ? this.algopStacked / totalBidBackStaked : 0;

    this.userCurrentPrizeAmount = userBidBackShare * totalBidBackPrize;
  }

  stackCoin() {
    this.openModal = true;
  }

  unstackCoin() {
    this.openModalUnstack = true;
  }

  openBidBackModal() {
    void this.$store.dispatch({
      type: 'auctions/openBidBackModal',
      auction: this.art,
    });
  }

  openBidBackSimulatorModal() {
    void this.$store.dispatch({
      type: 'auctions/openBidBackSimulatorModal',
      auction: this.art,
    });
  }

  onCloseStatusDialog() {
    this.displayingStatus = false;

    if (this.withdrawBidBackStatus === WithdrawBidBackStatus.BidBackWithdrawn) {
      this.$q.notify({
        type: 'positive',
        message: 'Auction created successfully',
      });
    }
  }

  formatTime(): void {
    this.monthExpirations = moment(this.art.expirationDt).format('MMM');
    this.dayExpirations = moment(this.art.expirationDt).format('DD');
    this.yearExpirations = moment(this.art.expirationDt).format('YYYY');
    this.hoursExpirations = moment(this.art.expirationDt).format('LT');
  }

  getTime() {
    const newEnded = moment(this.art.expirationDt);
    const timeLeft = moment.duration(newEnded.diff(moment()));
    this.countDays = timeLeft.days() || 0;
    this.countHours = timeLeft.hours() || 0;
    this.countMinutes = timeLeft.minutes() || 0;
    this.countSeconds = timeLeft.seconds() || 0;
  }

  get now() {
    return now.value;
  }

  get isEnded() {
    return moment().isAfter(this.art.expirationDt);
  }

  @Watch('now')
  onPropertyChanged() {
    if (!this.stopCount) {
      if (
        this.countDays <= 0 &&
        this.countHours <= 0 &&
        this.countMinutes <= 0 &&
        this.countSeconds <= 0
      ) {
        if (
          this.lastCountDays === 0 &&
          this.lastCountHours === 0 &&
          this.lastCountMinutes === 0 &&
          this.lastCountSeconds === 1
        ) {
          this.formatTime();
          window.location.reload();
        }
        this.stopCount = true;
      } else {
        this.getTime();
      }
    }
    this.lastCountDays = this.countDays;
    this.lastCountHours = this.countHours;
    this.lastCountMinutes = this.countMinutes;
    this.lastCountSeconds = this.countSeconds;
  }
}
</script>

<style scoped lang="scss">
.text-title {
  white-space: nowrap;
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.won-bid {
  color: $positive;
}

.btn-staked {
  min-width: 30px !important;
  margin-right: 10px;
  height: 30px;
  margin-top: 20px;
}

.btn-havest {
  min-width: 100px !important;
  height: 50px;
  margin-top: 10px;
}

.previewImage {
  width: 290px;
}
.input-stack-algop {
  width: 170px;
  margin-right: 10px;
  margin-top: 25px;
  border-bottom: dashed;
  border-bottom-width: 1px;
}
.container {
  width: 300px;
}
.bidBack {
  text-align: unset;
  height: 100px;
  width: 100px;
  margin-left: 45px;
  border-radius: 50%;
  background-color: $primary;
}
.time{
    font-size: 0.9rem;
    width: 100%;
  }
.coin {
  color: $primary;
}
.text-end {
  width: 170px;
  font-size: 16px;
}
@media (max-width: 460px) {
  .text {
    text-align: center;
    align-items: center;
  }
  .bidBack{
    margin-top: 5px;
    margin-left: 1px;
  }
  .time{
    justify-content: center;
  }
  .text-title {
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
  }
  .text-last {
    text-align: center;
  }
  .previewImage {
    width: 100%;
  }
  .field-stack {
    width: 100%;
    margin-left: 10%;
    margin-top: 10px;
    justify-content: space-between;
    align-items: center;
  }
  .ended-part {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: baseline;
    justify-items: center;
  }
  .load-more {
    height: 10px;
    margin-top: 10%;
  }
  .text-end {
    width: 100%;
    justify-content: center;
  }
}
</style>
