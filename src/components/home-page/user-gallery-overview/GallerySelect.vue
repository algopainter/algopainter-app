<template>
  <div class="row q-mb-md">
    <div class="col-12 col-md-3 col-lg-3  col-xl-2 col-sm-6 col-xs-12">
      <q-img
        class="previewImage"
        :src="art.item.previewImage"
        alt="img art"
      />
    </div>
    <div class="col-12 col-md-3 col-lg-4 col-sm-6 col-xs-12 text-last">
      <div class="text">
        <div class="text text-bold text-h6">
          {{ $t('dashboard.gallery.bidbackTab.symbol') }}{{ art.item.index }} {{ art.item.title }}
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
          {{ $t('dashboard.gallery.bidbackTab.lastBids') }}
        </div>
        <p class="coin text-h6">
          {{ lastBid }}
        </p>
      </div>
      <div class="text-bold text-h6">
        <!--
        <p class="won-bid">
          {{ $t('dashboard.gallery.bidbackTab.auctionStatuses.youWon') }}
        </p>
        -->
        <div
          v-if="isEnded"
          class="text-bold text-end"
        >
          {{ $t('dashboard.bid.auctionEnd') }}
          <div
            class="text-bold"
          >
            {{ monthExpirations }} <span class="text-bold"> {{ dayExpirations }} {{ $t('dashboard.bid.of') }}</span>
            {{ yearExpirations }}
          </div>
          <p> {{ hoursExpirations }} </p>
        </div>
        <div
          v-else
        >
          <div
            class="text-bold row  justify-center text-end"
          >
            {{ $t('dashboard.bid.auctionTime') }}
          </div>
          <div
            class="text-bold"
          >
            <div
              class="row justify-start time q-gutter-sm "
            >
              <div>
                <div class="text-bold">
                  <!-- {{ days }}  -->{{ countDays }}
                </div>
                <span> {{ $t('dashboard.bid.days') }} </span>
              </div>
              <div>
                <div class="text-bold">
                  <!-- {{ hours }}--> {{ countHours }}
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
                  <!-- {{ seconds }} --> {{ countSeconds }}
                </div>
                <span>{{ $t('dashboard.bid.seconds') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-3 col-lg-3 col-sm-8 col-xs-12 items-center field-stack">
      <div>
        <span class="text-bold flex">
          {{ $t('dashboard.gallery.bidbackTab.earned') }}
        </span>
        <div
          class="flex container"
        >
          <q-input
            v-model="coinHarvestAmount"
            fill-mask="0"
            input-class="text-left"
            class="input-stack-algop"
            :disable="true"
            readonly
          />
          <algo-button
            :label="$t('dashboard.gallery.bidbackTab.harvest')"
            color="primary"
            class="btn-havest"
            :disable="isCoinHarvestDisabled"
            @click="harvestAlgop"
          />
        </div>
        <span>
          {{ $t('dashboard.gallery.bidbackTab.stakedAlgop') }}
        </span>
        <div class="flex container">
          <q-input
            v-model="coinStakeAmount"
            fill-mask="0"
            input-class="text-left"
            class="input-stack-algop"
          />
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
        <div class="text-primary q-my-sm">
          {{ $t('dashboard.gallery.bidbackTab.withdrawAmount', {
            amount: coinHarvestAmount,
          }) }}
        </div>
      </div>
    </div>
    <div class="col-12 col-md-2 col-lg-2 col-sm-4 col-xs-12 ended-part">
      <div
        class="bidBack text-white column justify-center content-center q-mb-xl"
      >
        <div class="row justify-center items-center content-center">
          {{ auctionBidBack + "%" }}
        </div>
        <div class="row justify-center items-center content-center">
          {{ $t('dashboard.gallery.bidbackTab.bidback') }}
        </div>
      </div>
      <algo-button
        :label="$t('dashboard.gallery.bidbackTab.bidbackBtn')"
        color="primary"
        outline
        class="load-more q-px-xl q-mx-auto"
        @click="openBidBackModal()"
      />
    </div>
    <q-dialog
      v-model="displayingStatus"
      persistent
    >
      <withdraw-bidback-status-card
        :withdraw-bidback-status="withdrawBidbackStatus"
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
import WithdrawBidbackStatusCard from 'components/auctions/auction/WithdrawBidbackStatusCard.vue';
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
  })

  btnName = prop({
    type: String,
    required: true,
  })
}

enum WithdrawBidbackStatus {
  CheckingContractApproved,
  ContractApprovedAwaitingInput,
  ContractApprovedAwaitingConfirmation,
  ContractApprovedError,
  WithdrawBidbackAwaitingInput,
  WithdrawBidbackAwaitingConfirmation,
  WithdrawBidbackError,
  BidbackWithdrawn,
}

@Options({
  components: {
    AlgoButton,
    StackModalAlgop,
    UnstackModalAlgop,
    WithdrawBidbackStatusCard,
  },
  watch: {
    now: ['getTime'],
  },
  computed: {
    ...mapGetters(
      'user', [
        'networkInfo',
        'account',
        'isConnected',
      ]),
  },
})

export default class gallerySelect extends Vue.with(Props) {
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  isConnected!: boolean;
  canStack: boolean = false;
  coinHarvestAmount: number = 0;
  coinStakeAmount: number = 0;
  openModal: boolean = false;
  openModalUnstack: boolean = false;
  auctionBidBack: number | null = null;
  isCoinHarvestDisabled: boolean = true;
  disableUnstackBtn: boolean = true;
  lastBid: string = '';

  withdrawingBidback: boolean = false;
  displayingStatus: boolean = false;
  withdrawBidbackStatus: WithdrawBidbackStatus | null = null;

  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  minuReal: number = 0;
  seconds: number = 0;
  monthExpirations: string = ''
  dayExpirations: string = ''
  yearExpirations: string = ''
  hoursExpirations!: string ;
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
    void this.getBidbackPercentage();
    void this.getUserStackedBidback();
    void this.getLastBid();
    void this.getTime();
    void this.formatTime();
  }

  getLastBid() {
    const bidAmount = blockchainToCurrency(
      this.art.highestBid.amount,
      this.coinDetails.decimalPlaces,
    );

    this.lastBid = `${bidAmount} ${this.art.highestBid.tokenSymbol}`;
  }

  setFormatCurrency(amount: number) {
    return blockchainToCurrency(
      amount,
      this.coinDetails.decimalPlaces,
    );
  }

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return coin.tokenAddress.toLowerCase() === this.art.minimumBid.tokenPriceAddress;
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  async getUserStackedBidback() {
    try {
      this.coinHarvestAmount = await this.rewardsSystem.getTotalBidbackStakes(this.art.index);
      this.coinHarvestAmount = 1000;

      this.coinStakeAmount = this.coinHarvestAmount;

      this.isCoinHarvestDisabled = (this.coinHarvestAmount <= 0 || !this.art.ended);
      this.disableUnstackBtn = (this.coinHarvestAmount <= 0);
    } catch (error) {
      this.isCoinHarvestDisabled = true;
      this.disableUnstackBtn = true;
    }
  }

  async harvestAlgop() {
    try {
      this.withdrawingBidback = true;
      this.displayingStatus = true;

      this.withdrawBidbackStatus = WithdrawBidbackStatus.WithdrawBidbackAwaitingConfirmation;

      await this.rewardsSystem.claimBidback(
        this.art.index,
        this.account,
      ).on('transactionHash', () => {
        this.withdrawBidbackStatus =
          WithdrawBidbackStatus.WithdrawBidbackAwaitingConfirmation;
      }).on('error', () => {
        this.withdrawBidbackStatus = WithdrawBidbackStatus.WithdrawBidbackError;
      });

      this.withdrawBidbackStatus = WithdrawBidbackStatus.BidbackWithdrawn;
    } catch {
      this.withdrawingBidback = false;
    }
    this.withdrawingBidback = false;
  }

  async getBidbackPercentage() {
    try {
      this.auctionBidBack = await this.bidBackPirsSystem.getBidbackRate(this.art.index);
    } catch (error) {
      console.log('error getBidbackPercentage');
    }
  }

  stackAlgo() {
    this.canStack = true;
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
      auctionId: this.art._id,
      auctionIndex: this.art.index,
    });
  }

  onCloseStatusDialog() {
    this.displayingStatus = false;

    if (this.withdrawBidbackStatus === WithdrawBidbackStatus.BidbackWithdrawn) {
      this.$q.notify({
        type: 'positive',
        message: 'Auction created successfully',
      });

      // void this.$router.push('/');
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
      if (this.countDays <= 0 && this.countHours <= 0 && this.countMinutes <= 0 && this.countSeconds <= 0) {
        if (this.lastCountDays === 0 && this.lastCountHours === 0 && this.lastCountMinutes === 0 && this.lastCountSeconds === 1) {
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
.text{
  white-space: nowrap;
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.won-bid{
  color: $positive;
}

.btn-staked{
  min-width: 30px;
  margin-right: 10px;
  height: 30px;
  margin-top: 20px;
}

.btn-havest{
  min-width: 100px;
  height: 50px;
  margin-top: 10px;
}

.previewImage{
  width: 290px;
}
.input-stack-algop{
  width:170px;
  margin-right: 10px;
}
.container{
  width: 300px;
}
.bidBack{
  text-align: unset;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  background-color: $primary;
}
.coin{
  color: $primary;
}
.text-end{
  width: 170px;
  font-size: 16px;
}
@media  (max-width:470px) {
  .text{
    text-align: center;
    margin-left: 4%;
  }
  .text-last{
    text-align: center;
  }
  .previewImage {
    width: 100%;
  }
  .field-stack{
    width: 100%;
    margin-left: 10%;
  }
  .ended-part{
    text-align: center;
    display: flex;
    justify-content: space-between;
  }
  .load-more{
    height: 10px;
    margin-top: 10%;
  }
  .text-end{
    width: 100%;

  }
}
</style>
