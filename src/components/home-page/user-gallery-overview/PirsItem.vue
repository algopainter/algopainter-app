<template>
  <div class="row justify-between q-mb-md">
    <div class="col-12 col-md-3 col-lg-3 col-xl-3 col-sm-6 col-xs-12">
      <q-img class="previewImage" :src="art.item.previewImage" alt="img art" />
    </div>
    <div class="col-12 col-md-3 col-lg-4 col-xl-3 col-sm-6 col-xs-12 text-last">
      <div class="text">
        <div class="text-title text-bold text-h6">
          {{ $t('dashboard.gallery.pirsTab.symbol') }}{{ art.item.index }}
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
      <div class="text-bold text-h6">
        <div v-if="isEnded" class="text-bold text-end">
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
        <div v-else>
          <div>
            <div class="text-bold text-h4 q-mt-md">
              {{ $t('dashboard.gallery.pirsTab.lastBids') }}
            </div>
            <p class="coin text-h6">
              {{ lastBid + ' ' + art.minimumBid.tokenSymbol }}
            </p>
          </div>
          <div class="text-bold row justify-start text-end">
            {{ $t('dashboard.bid.auctionTime') }}
          </div>
          <div class="text-bold">
            <div
              v-if="countYear >= 1"
              class="row justify-start time-year q-gutter-sm"
            >
              <div>
                <div class="text-bold"><!-- {{ days }}  -->{{ countYear }}</div>
                <span> {{ $t('dashboard.bid.year') }} </span>
              </div>
              <div>
                <div class="text-bold"><!-- {{ days }}  -->{{ countDays }}</div>
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
            <div v-else class="row justify-start time q-gutter-sm">
              <div>
                <div class="text-bold"><!-- {{ days }}  -->{{ countDays }}</div>
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
            {{ $t('dashboard.gallery.pirsTab.earned') }}
          </span>
          <div class="flex container">
            <q-input
              v-model="userCurrentPrizeAmount"
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
        </template>
        <template v-else-if="showHarvestMsg">
          <span class="text-bold flex q-my-md">
            {{ $t('dashboard.gallery.pirsTab.harvestMsg') }}
          </span>
        </template>
        <span class="text-bold">
          {{ $t('dashboard.gallery.pirsTab.stakedAlgop') }}
        </span>
        <div class="flex container">
          <span v-if="!isStakedAlgopInputLoading" class="input-stack-algop">
            {{ algopStaked ? setFormatCurrency(algopStaked) : 0 }}
          </span>
          <q-spinner-dots v-else class="input-stack-algop-loading" color="primary" />
          <algo-button
            label="-"
            color="primary"
            class="btn-staked"
            :disable="disableUnstackBtn || isEnded"
            @click="unstackCoin()"
          />
          <algo-button
            label="+"
            color="primary"
            class="btn-staked"
            :disable="isEnded"
            @click="stackCoin()"
          />
          <pirs-stack-modal v-model="openModal" :art="art" :item-pirs="art" />
          <pirs-unstack-modal
            v-model="openModalUnstack"
            :art="art"
            :item-pirs="art"
          />
        </div>
      </div>
    </div>
    <div class="col-12 col-md-2 col-lg-2 col-sm-4 col-xs-12 ended-part">
      <div class="pirs text-white column justify-center content-center q-mb-xl">
        <div class="row justify-center items-center content-center">
          {{ imagePirsRate + '%' }}
        </div>
        <div class="row justify-center items-center content-center">
          {{ $t('dashboard.gallery.pirsTab.pirs') }}
        </div>
      </div>
      <div class="row justify-center">
        <algo-button
          :label="$t('dashboard.gallery.pirsTab.btnPirs')"
          color="primary"
          outline
          class="load-more q-px-xl q-mx-auto q-mb-sm"
          @click="openPirsModal()"
        />
        <algo-button
          :label="$t('dashboard.gallery.pirsTab.pirsSimulatorBtn')"
          color="primary"
          outline
          class="load-more q-px-xl q-mx-auto"
          @click="openPirsSimulatorModal()"
        />
      </div>
    </div>
    <q-dialog v-model="displayingStatus" persistent>
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
import { IAxios } from 'src/models/IAxios';
import { debounce } from 'quasar';

class Props {
  art = prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  });
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
    ...mapGetters('user', ['networkInfo', 'account', 'isConnected']),
    ...mapGetters('auctions', ['updatePirsStakedAlgop']),
  },
})
export default class PirsItem extends Vue.with(Props) {
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  isConnected!: boolean;
  updatePirsStakedAlgop!: {collectionOwner: string, itemIndex: number} | undefined;

  openModal: boolean = false;
  openModalUnstack: boolean = false;
  algopStaked: number = 0;
  showHarvestBtn: boolean = false;
  showHarvestMsg: boolean = false;
  lastBid: string = '';
  disableUnstackBtn: boolean = true;
  imagePirsRate: number = 0;
  userCurrentPrizeAmount: number = 0;
  isCoinHarvestDisabled: boolean = false;
  isStakedAlgopInputLoading: boolean = false;

  displayingStatus: boolean = false;
  withdrawPirsStatus: WithdrawPirsStatus | null = null;

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
    this.getPirsPercentage().catch(console.error);
    this.getLastBid();
    this.getTime();
    this.formatTime();
  }

  async getPirsPercentage() {
    try {
      this.imagePirsRate =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        (await this.bidBackPirsSystem.getPIRSRate(this.art.index)) /
        100;
    } catch (error) {
      console.log('Error - getPIRSRate - PirsItem');
    }
    if (this.imagePirsRate > 0) {
      this.getCurrentPrizeAmount().catch(console.error);
    }
    this.getUserStakedPirs();
  }

  getLastBid() {
    const highestBidAmount = this.art.highestBid
      ? this.art.highestBid.netAmount
      : 0;

    if (highestBidAmount !== 0) {
      const bidAmount = blockchainToCurrency(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        highestBidAmount,
        this.coinDetails.decimalPlaces
      );
      this.lastBid = this.$n(bidAmount, 'decimal', {
        maximumFractionDigits: this.coinDetails.decimalPlaces,
      } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    } else {
      this.lastBid = 'There is no bid so far';
    }
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

  getUserStakedPirs() {
    if (this.art.pirs) {
      this.algopStaked = this.art.pirs[this.account] || 0;
    }
    this.disableUnstackBtn = this.algopStaked <= 0 || this.art.ended;
    this.showHarvestBtn =
      this.algopStaked > 0 && this.art.ended && this.imagePirsRate > 0;
    this.showHarvestMsg =
      this.algopStaked > 0 && !this.art.ended && this.imagePirsRate > 0;
  }

  async harvestAlgop() {
    try {
      this.displayingStatus = true;

      this.withdrawPirsStatus =
        WithdrawPirsStatus.WithdrawPirsAwaitingConfirmation;

      await this.rewardsSystem
        .claimPirs(this.art.index, this.account)
        .on('transactionHash', () => {
          this.withdrawPirsStatus =
            WithdrawPirsStatus.WithdrawPirsAwaitingConfirmation;
        })
        .on('error', () => {
          this.withdrawPirsStatus = WithdrawPirsStatus.WithdrawPirsError;
        });

      this.isCoinHarvestDisabled = true;
      this.disableUnstackBtn = true;
      this.withdrawPirsStatus = WithdrawPirsStatus.PirsWithdrawn;
    } catch (e) {
      console.log('Error - harvestAlgop - PirsItem', e);
    }
  }

  async getCurrentPrizeAmount() {
    try {
      const totalBidBackStaked = await this.rewardsSystem.getTotalBidBackStakes(this.art.index);

      const auctionHighestBid = this.art.highestBid
        ? this.art.highestBid.netAmount / 1000000000000000000
        : 0;

      const auctionBidBackRate = this.imagePirsRate / 100;

      const totalBidBackPrize = auctionBidBackRate * auctionHighestBid;

      const userBidBackShare =
        totalBidBackStaked > 0 ? this.algopStaked / totalBidBackStaked : 0;

      this.userCurrentPrizeAmount = userBidBackShare * totalBidBackPrize;
    } catch (e) {
      console.log('Error - getTotalBidBackStakes - PirsItem');
    }
  }

  stackCoin() {
    this.openModal = true;
  }

  unstackCoin() {
    this.openModalUnstack = true;
  }

  openPirsModal() {
    this.$store.dispatch({
      type: 'auctions/openPirsModal',
      auction: this.art,
    }).catch(console.error);
  }

  openPirsSimulatorModal() {
    this.$store.dispatch({
      type: 'auctions/openPirsSimulatorModal',
      auction: this.art,
    }).catch(console.error);
  }

  onCloseStatusDialog() {
    this.displayingStatus = false;

    if (this.withdrawPirsStatus === WithdrawPirsStatus.PirsWithdrawn) {
      this.$q.notify({
        type: 'positive',
        message: 'Auction created successfully',
      });
    }
  }

  formatTime() {
    this.monthExpirations = moment(this.art.expirationDt).format('MMM');
    this.dayExpirations = moment(this.art.expirationDt).format('DD');
    this.yearExpirations = moment(this.art.expirationDt).format('YYYY');
    this.hoursExpirations = moment(this.art.expirationDt).format('LT');
  }

  getTime() {
    const newEnded = moment(this.art.expirationDt);
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

  @Watch('updatePirsStakedAlgop')
  onPirsStakedAlgopChanged() {
    if (this.art.item.collectionOwner === this.updatePirsStakedAlgop?.collectionOwner && this.art.item.index === this.updatePirsStakedAlgop.itemIndex) {
      this.isStakedAlgopInputLoading = true;
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.pirsStakedUpdated = debounce(this.pirsStakedUpdated, 5000);
      this.pirsStakedUpdated();
    }
  }

  pirsStakedUpdated() {
    try {
      this.$store.dispatch({
        type: 'auctions/getPirsUpdated',
        account: this.account.toLowerCase(),
        collectionOwner: this.art.item.collectionOwner,
        itemIndex: this.art.item.index,
      }).then(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const response = this.$store.getters['auctions/getPirsUpdated'] as IAxios;
        const updatedAuction = response.data as IAuctionItem[];
        this.algopStaked = (updatedAuction[0].pirs && updatedAuction[0].pirs[this.account]) ? updatedAuction[0].pirs[this.account] : 0;
      }).catch(console.error);
    } catch (e) {
      console.log('Error - getPirsUpdated updatePirsStakedUpdate - PirsItem');
    } finally {
      this.isStakedAlgopInputLoading = false;
    }
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

.time-year {
  font-size: 0.9rem;
  width: 100%;
}
.time {
  font-size: 0.9rem;
  width: 100%;
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
.input-stack-algop-loading {
  width: 170px;
  margin-right: 10px;
  margin-top: 25px;
}
.container {
  width: 300px;
}
.pirs {
  text-align: unset;
  height: 100px;
  width: 100px;
  margin-left: 40px;
  border-radius: 50%;
  background-color: $primary;
}
.coin {
  color: $primary;
}
.text-end {
  width: 170px;
  font-size: 16px;
}
@media (max-width: 470px) {
  .text-last {
    text-align: center;
  }
  .text-title {
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pirs {
    margin-top: 5px;
    margin-left: 1px;
  }
  .time {
    justify-content: center;
  }
  .previewImage {
    width: 100%;
  }
  .field-stack {
    width: 100%;
    margin-left: 10%;
    margin-top: 10px;
    justify-content: center;
  }
  .ended-part {
    text-align: center;
    margin-top: 10px;
    display: flex;
    margin-left: 10px;
    justify-content: space-between;
  }
  .load-more {
    height: 10px;
    margin-top: 10%;
  }
  .text-end {
    width: 100%;
    justify-content: center;
  }
  .text {
    text-align: center;
    align-items: center;
  }
}
</style>
