<template>
  <div class="row justify-between q-mb-md">
    <div class="col-12 col-md-3 col-lg-3  col-xl-3 col-sm-6 col-xs-12">
      <q-img
        class="previewImage"
        :src="art.nft.previewImage"
        alt="img art"
      />
    </div>
    <div class="col-12 col-md-3 col-lg-4  col-xl-3 col-sm-6 col-xs-12 text-last">
      <div class="text">
        <div class="text-title text-bold text-h6">
          {{ $t('dashboard.gallery.pirsTab.symbol') }}{{ art.nft.index }} {{ art.title }}
          <q-tooltip
            anchor="bottom middle"
            max-width="200px"
            class="bg-primary"
          >
            {{ art.title }}
          </q-tooltip>
        </div>
        {{ art.description }}
      </div>
      <!-- <div>
        <div class="text-bold text-h4 q-mt-md">
          {{ $t('dashboard.gallery.bidbackTab.lastBids') }}
        </div>
        <p class="coin text-h6">
          {{ lastBid }}
        </p>
      </div> -->
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
          <div>
            <div class="text-bold text-h4 q-mt-md">
              {{ $t('dashboard.gallery.pirsTab.lastBids') }}
            </div>
            <p class="coin">
              {{ $t('dashboard.gallery.pirsTab.lastText') }}
            </p>
          </div>
          <div>
            <p class="text-bold text-h6">
              {{ $t('dashboard.bid.auctionEnd') }}
            </p>
          </div>
        </div>
        <div
          v-else
        >
          <div>
            <div class="text-bold text-h4 q-mt-md">
              {{ $t('dashboard.gallery.pirsTab.lastBids') }}
            </div>
            <p class="coin text-h6">
              {{ lastBid }}
            </p>
          </div>
          <div
            class="text-bold row  justify-center text-end"
          >
            {{ $t('dashboard.bid.auctionTime') }}
          </div>
          <div
            class="text-bold"
          >
            <div
              v-if="countYear >= 1"
              class="row justify-center time-year q-gutter-sm "
            >
              <div>
                <div class="text-bold">
                  <!-- {{ days }}  -->{{ countYear }}
                </div>
                <span> {{ $t('dashboard.bid.year') }} </span>
              </div>
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
            <div
              v-else
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
          {{ $t('dashboard.gallery.pirsTab.earned') }}
        </span>
        <div
          v-if="showHarvestBtn"
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
            :label="$t('dashboard.gallery.pirsTab.harvest')"
            color="primary"
            class="btn-havest"
            :disable="isCoinHarvestDisabled"
            @click="harvestAlgop"
          />
        </div>
        <span>
          {{ $t('dashboard.gallery.pirsTab.stakedAlgop') }}
        </span>
        <div class="flex container">
          <q-input
            v-model="algopStacked"
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
          <pirs-stack-modal
            v-model="openModal"
            :art="art"
            :item-pirs="itemPirs"
          />
          <pirs-unstack-modal
            v-model="openModalUnstack"
            :art="art"
            :item-pirs="itemPirs"
          />
        </div>
      </div>
    </div>
    <div class="col-12 col-md-2 col-lg-2 col-sm-4 col-xs-12 ended-part">
      <div
        class="pirs text-white column justify-center content-center q-mb-xl"
      >
        <div class="row justify-center items-center content-center">
          {{ auctionPirsRate + "%" }}
        </div>
        <div class="row justify-center items-center content-center">
          {{ $t('dashboard.gallery.pirsTab.pirs') }}
        </div>
      </div>
      <algo-button
        :label="$t('dashboard.gallery.pirsTab.btnPirs')"
        color="primary"
        outline
        class="load-more q-px-xl q-mx-auto"
        @click="openPirsModal()"
      />
    </div>
    <q-dialog
      v-model="displayingStatus"
      persistent
    >
      <withdraw-pirs-status-card
        :withdraw-pirs-status="withdrawPirsStatus"
        @request-close="onCloseStatusDialog"
      />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, prop, Options } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import PirsStackModal from 'src/components/modal/PirsStackModal.vue';
import PirsUnstackModal from 'src/components/modal/PirsUnstackModal.vue';
import { IMyGallery } from 'src/models/IMyGallery';
import AlgoPainterBidBackPirsProxy from 'src/eth/AlgoPainterBidBackPirsProxy';
import AlgoPainterRewardsSystemProxy from 'src/eth/AlgoPainterRewardsSystemProxy';
import { mapGetters } from 'vuex';
import { NetworkInfo } from 'src/store/user/types';
import WithdrawPirsStatusCard from 'components/auctions/auction/WithdrawPirsStatusCard.vue';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { auctionCoins } from 'src/helpers/auctionCoins';
import moment from 'moment';
import { now } from 'src/helpers/timer';
import 'moment-duration-format';
import { Watch } from 'vue-property-decorator';
import { IAuctionItem } from 'src/models/IAuctionItem';

class Props {
  art = prop({
    type: Object as PropType<IMyGallery>,
    required: true,
  })
}

enum WithdrawPirsStatus {
  CheckingContractApproved,
  ContractApprovedAwaitingInput,
  ContractApprovedAwaitingConfirmation,
  ContractApprovedError,
  WithdrawPirsAwaitingInput,
  WithdrawPirsAwaitingConfirmation,
  WithdrawPirsError,
  PirsWithdrawn,
}

@Options({
  components: {
    AlgoButton,
    PirsStackModal,
    PirsUnstackModal,
    WithdrawPirsStatusCard,
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

export default class PirsItem extends Vue.with(Props) {
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  // isConnected!: boolean;
  canStack: boolean = false;
  coinHarvestAmount: number = 0;
  coinStakeAmount: number = 0;
  openModal: boolean = false;
  openModalUnstack: boolean = false;
  auctionPirsRate: number | null = null;
  isCoinHarvestDisabled: boolean = true;
  disableUnstackBtn: boolean = true;
  lastBid: string = '';
  auctionExpirationDt: string = '';
  tokenPriceAddress: string = '';
  highestBidAmount: number = 0;
  auctionTokenSymbol: string = '';
  auctionIndex: number = 0;
  itemPirs: unknown = [];
  auctionPirs: unknown[] = [];
  auctionEnded: boolean = false;
  auctionId: string = '';
  showHarvestBtn: boolean = false;

  withdrawingPirs: boolean = false;
  displayingStatus: boolean = false;
  withdrawPirsStatus: WithdrawPirsStatus | null = null;
  algopStacked: number = 0;

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
  countYear: number = 0;
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
    void this.getPirsItem();
    void this.formatTime();
  }

  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/isConnected'] as boolean;
  }

  get accountAddress() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/account'] as string;
  }

  getLastBid() {
    if (this.highestBidAmount) {
      const bidAmount = blockchainToCurrency(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.highestBidAmount,
        this.coinDetails.decimalPlaces,
      );
      this.lastBid = `${bidAmount} ${this.auctionTokenSymbol}`;
    } else {
      this.lastBid = 'There is no bid so far';
    }
  }

  setFormatCurrency(amount: number) {
    return blockchainToCurrency(
      amount,
      this.coinDetails.decimalPlaces,
    );
  }

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return coin.tokenAddress.toLowerCase() === this.tokenPriceAddress;
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  getUserStackedPirs() {
    if (this.auctionPirs) {
      Object.keys(this.auctionPirs).forEach(() => {
        this.algopStacked = this.auctionPirs[this.account as unknown as number] as number;
      });
    }

    this.isCoinHarvestDisabled = (this.algopStacked <= 0 || !this.auctionEnded);
    this.disableUnstackBtn = (this.algopStacked <= 0);
    this.showHarvestBtn = (this.auctionEnded && this.algopStacked > 0);
  }

  async harvestAlgop() {
    try {
      this.withdrawingPirs = true;
      this.displayingStatus = true;

      this.withdrawPirsStatus = WithdrawPirsStatus.WithdrawPirsAwaitingConfirmation;

      await this.rewardsSystem.claimPirs(
        this.art.nft.index,
        this.account,
      ).on('transactionHash', () => {
        this.withdrawPirsStatus =
          WithdrawPirsStatus.WithdrawPirsAwaitingConfirmation;
      }).on('error', () => {
        this.withdrawPirsStatus = WithdrawPirsStatus.WithdrawPirsError;
      });

      this.withdrawPirsStatus = WithdrawPirsStatus.PirsWithdrawn;
    } catch {
      this.withdrawingPirs = false;
    }
    this.withdrawingPirs = false;
  }

  async getPirsPercentage() {
    try {
      this.auctionPirsRate = await this.bidBackPirsSystem.getInvestorPirsRate(this.auctionIndex);
    } catch (error) {
      console.log('Error - getPirsPercentage - PirsItem');
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

  openPirsModal() {
    void this.$store.dispatch({
      type: 'auctions/openPirsModal',
      collectionOwner: this.art.collectionOwner,
      itemIndex: this.art.nft.index,
    });
  }

  onCloseStatusDialog() {
    this.displayingStatus = false;

    if (this.withdrawPirsStatus === WithdrawPirsStatus.PirsWithdrawn) {
      this.$q.notify({
        type: 'positive',
        message: 'Auction created successfully',
      });

      // void this.$router.push('/');
    }
  }

  formatTime(): void {
    this.monthExpirations = moment(this.auctionExpirationDt).format('MMM');
    this.dayExpirations = moment(this.auctionExpirationDt).format('DD');
    this.yearExpirations = moment(this.auctionExpirationDt).format('YYYY');
    this.hoursExpirations = moment(this.auctionExpirationDt).format('LT');
  }

  getTime() {
    const newEnded = moment(this.auctionExpirationDt);
    const timeLeft = moment.duration(newEnded.diff(moment()));
    this.countYear = timeLeft.years() || 0;
    this.countDays = timeLeft.days() || 0;
    this.countHours = timeLeft.hours() || 0;
    this.countMinutes = timeLeft.minutes() || 0;
    this.countSeconds = timeLeft.seconds() || 0;
  }

  get now() {
    return now.value;
  }

  get isEnded() {
    return moment().isAfter(this.auctionExpirationDt);
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

  getPirsItem() {
    void this.$store.dispatch({
      type: 'auctions/getAuctions',
      collectionOwner: this.art.collectionOwner,
      itemIndex: this.art.nft.index,
    }).then(() => {
      if (this.isConnected) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const itemPirs = this.$store.getters['auctions/getPirsAuction'] as IAuctionItem;
        this.itemPirs = itemPirs;
        this.auctionExpirationDt = itemPirs.expirationDt;
        this.tokenPriceAddress = itemPirs.minimumBid.tokenPriceAddress;
        this.highestBidAmount = (itemPirs.highestBid) ? itemPirs.highestBid.amount : 0;
        this.auctionTokenSymbol = itemPirs.minimumBid.tokenSymbol;
        this.auctionEnded = itemPirs.ended;
        this.auctionIndex = itemPirs.index;
        void this.getPirsPercentage();
        void this.getUserStackedPirs();
        if (itemPirs) {
          void this.getLastBid();
          void this.getTime();
        }
      }
    });
  }
}

</script>

<style scoped lang="scss">
.text-title{
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
.pirs{
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
  .text-last{
    text-align: center;
  }
  .text-title{
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

  .time{
    justify-content:center;
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
   .text{
    text-align: center;
    align-items: center
  }
}
</style>
