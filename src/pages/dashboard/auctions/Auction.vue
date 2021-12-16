<template>
  <q-page class="q-page q-gutter-lg q-pb-lg">
    <div
      v-if="loading"
      class="flex flex-center q-pa-xl"
    >
      <q-spinner
        size="80px"
        color="primary"
      />
    </div>
    <div
      v-else-if="auction"
      class="row"
    >
      <div class="col-12 col-sm">
        <q-img
          :src="auction.item.image"
          class="img"
        />
        <div
          class="q-mt-sm text-subtitle1 text-justify desktop-only description"
        >
          {{ auction.item.description }}
        </div>
      </div>
      <q-separator
        class="q-mx-lg gt-xs"
        vertical
      />
      <div class="col-12 col-sm-8">
        <div class="row q-col-gutter-md">
          <div class="col-12 header title">
            {{ auction.item.title }}
            <q-tooltip class="bg-primary">
              {{ auction.item.title }}
            </q-tooltip>
          </div>
          <div
            class="col-12 title"
            color="primary"
          >
            {{
              $t('dashboard.auctionPage.auctionRates', {
                bidBackRate: auctionBidBackRate,
                investorPirsRate: itemInvestorPirsRate,
                creatorRoyaltiesRate: collectionCreatorRoyaltiesRate,
              })
            }}
          </div>
          <div class="col-12">
            <div v-if="auctionEnded">
              {{
                $t('dashboard.auctionPage.auctionEnded', {
                  endDate: endTimeFormatted,
                })
              }}
            </div>
            <div
              v-else
              class="row"
            >
              <div class="col-auto remaining-time-label on-left">
                {{ $t('dashboard.auctionPage.auctionRemainingTime') }}
              </div>
              <div class="col-auto">
                <countdown-timer v-bind="remainingTime" />
              </div>
            </div>
          </div>
          <div class="col-12">
            <q-tabs
              v-model="tab"
              active-color="primary"
              align="left"
              dense
              no-caps
            >
              <q-tab name="info">
                {{ $t('dashboard.auctions.info') }}
              </q-tab>
              <q-tab name="bids">
                {{ $t('dashboard.auctions.bids') }}
              </q-tab>
              <q-tab name="history">
                {{ $t('dashboard.auctions.history') }}
              </q-tab>
            </q-tabs>
            <div
              v-if="auction.highestBid"
              class="q-mt-md"
            >
              <highest-bid-card
                :bid="auction.highestBid"
                :token-price-address="auction.minimumBid.tokenPriceAddress"
              />
            </div>
            <q-tab-panels v-model="tab">
              <q-tab-panel
                class="q-pa-none q-pt-md"
                name="info"
              >
                <auction-info :auction="auction" />
              </q-tab-panel>
              <q-tab-panel
                class="q-pa-none q-pt-md"
                name="bids"
              >
                <bids-list :auction="auction" />
              </q-tab-panel>
              <q-tab-panel
                class="q-pa-none q-pt-md"
                name="history"
              >
                <auction-history :auction="auction" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <div class="col-12">
            <algo-button
              v-if="account === auction.owner"
              class="full-width q-py-sm q-mt-sm"
              color="primary"
              outline
              :label="$t('dashboard.auctionPage.cancelAuction')"
              @click="cancelAuction"
            />
            <algo-button
              v-else
              class="full-width q-py-sm"
              color="primary"
              outline
              :label="$t('dashboard.auctionPage.placeABid')"
              @click="placeABidAction"
            />
          </div>
        </div>
      </div>
    </div>
    <q-dialog
      v-model="displayingStatus"
      persistent
    >
      <delete-auction-status-card
        :delete-auction-status="deleteAuctionStatus"
        @request-close="onCloseStatusDialog"
      />
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import moment from 'moment';
import { Notify } from 'quasar';

import { now } from 'src/helpers/timer';
import { IAuctionItem } from 'src/models/IAuctionItem';
import { getAuctionDetails } from 'src/api/auctions';
import AlgoButton from 'components/common/Button.vue';
import HighestBidCard from 'components/auctions/auction/HighestBidCard.vue';
import NewBidDialog from 'components/auctions/auction/NewBidDialog.vue';
import CountdownTimer from 'components/CountdownTimer.vue';

import AuctionInfo from './tabs/AuctionInfo.vue';
import BidsList from './tabs/BidsList.vue';
import AuctionHistory from './tabs/AuctionHistory.vue';
import AlgoPainterAuctionSystemProxy from 'src/eth/AlgoPainterAuctionSystemProxy';
import AlgoPainterBidBackPirsProxy from 'src/eth/AlgoPainterBidBackPirsProxy';

import { NetworkInfo } from 'src/store/user/types';

import DeleteAuctionStatusCard from 'components/auctions/auction/DeleteAuctionStatusCard.vue';

enum DeletingAuctionStatus {
  DeleteAuctionAwaitingInput,
  DeleteAuctionAwaitingConfirmation,
  DeleteAuctionError,
  AuctionDeleted,
}

@Options({
  components: {
    AlgoButton,
    HighestBidCard,
    AuctionInfo,
    BidsList,
    AuctionHistory,
    DeleteAuctionStatusCard,
    CountdownTimer,
  },
  computed: {
    ...mapGetters('user', ['networkInfo', 'account', 'isConnected']),
  },
})
export default class Auction extends Vue {
  loading: boolean = false;
  auction: IAuctionItem | null = null;
  tab: string = 'info';
  reloadInterval: number | undefined;
  networkInfo!: NetworkInfo;
  account!: string;
  isConnected!: boolean;
  auctionSystem!: AlgoPainterAuctionSystemProxy;
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  displayingStatus: boolean = false;
  deleteAuctionStatus: DeletingAuctionStatus | null = null;
  auctionBidBackRate: number = 0;
  itemInvestorPirsRate: number = 0;
  collectionCreatorRoyaltiesRate: number = 0;

  get auctionId(): string {
    const { id } = this.$route.params;

    return id as string;
  }

  get expirationDate() {
    if (!this.auction) {
      return null;
    }

    return moment(this.auction.expirationDt);
  }

  get endTimeFormatted(): string {
    if (!this.auction || !this.expirationDate) {
      return '';
    }

    return this.expirationDate.calendar();
  }

  get remainingTime() {
    if (!this.expirationDate) {
      return {};
    }

    const timeLeft = moment.duration(this.expirationDate.diff(now.value));
    const year = timeLeft.years() || 0;
    const days = timeLeft.days() || 0;
    const hours = timeLeft.hours() || 0;
    const minutes = timeLeft.minutes() || 0;
    const seconds = timeLeft.seconds() || 0;

    return { year, days, hours, minutes, seconds };
  }

  get auctionEnded(): boolean {
    if (!this.expirationDate) {
      return false;
    }

    return this.expirationDate && this.expirationDate.isBefore(now.value);
  }

  async cancelAuction() {
    this.deleteAuctionStatus = DeletingAuctionStatus.DeleteAuctionAwaitingInput;
    if (this.auction) {
      if (this.auction.bids.length === 0) {
        this.displayingStatus = true;
        await this.auctionSystem
          .cancelAuction(this.auction.index, this.account)
          .on('transactionHash', () => {
            this.deleteAuctionStatus =
              DeletingAuctionStatus.DeleteAuctionAwaitingConfirmation;
          })
          .on('error', () => {
            this.deleteAuctionStatus = DeletingAuctionStatus.DeleteAuctionError;
          });
        this.deleteAuctionStatus = DeletingAuctionStatus.AuctionDeleted;
      } else {
        Notify.create({
          message: "You cannot cancel this auction anymore since there's a bid",
          color: 'red',
          icon: 'mdi-alert',
        });
      }
    }
  }

  created() {
    void this.getAuctionData();
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    }
  }

  mounted() {
    this.reloadInterval = setInterval(() => {
      void this.loadAuctionDetails();
    }, 5000) as unknown as number;
    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
  }

  unmounted() {
    clearInterval(this.reloadInterval);
  }

  async getBidBackRate() {
    if (this.auction) {
      try {
        this.auctionBidBackRate = await this.bidBackPirsSystem.getBidBackRate(
          this.auction.index,
        ) / 100;
      } catch (error) {
        console.log('Error - getBidBackRate - Auction');
      }
    }
  }

  async getInvestorPirsRate() {
    if (this.auction) {
      try {
        this.itemInvestorPirsRate =
          await this.bidBackPirsSystem.getInvestorPirsRate(this.auction.index) / 100;
      } catch (error) {
        console.log('Error - getInvestorPirsRate - Auction');
      }
    }
  }

  async getCreatorRoyaltiesRate() {
    if (this.auction) {
      try {
        this.collectionCreatorRoyaltiesRate = await this.bidBackPirsSystem.getCreatorRoyaltiesRate(this.auction.index);
        this.collectionCreatorRoyaltiesRate = this.collectionCreatorRoyaltiesRate / 100;
      } catch (error) {
        console.log('Error - collectionCreatorRoyaltiesRate - Auction');
      }
    }
  }

  async loadAuctionDetails() {
    this.auction = await getAuctionDetails(this.auctionId);
    void this.getBidBackRate();
    void this.getInvestorPirsRate();
    void this.getCreatorRoyaltiesRate();
  }

  async getAuctionData() {
    try {
      this.loading = true;

      await this.loadAuctionDetails();

      this.loading = false;
    } catch {
      this.loading = false;
    }
  }

  placeABidAction() {
    if (this.isConnected) {
      this.openPlaceBidDialog();
    } else {
      void this.$store.dispatch('user/openConnectYourWalletModal');
    }
  }

  openPlaceBidDialog() {
    this.$q.dialog({
      component: NewBidDialog,
      componentProps: {
        auction: this.auction,
      },
    });
  }

  onCloseStatusDialog() {
    this.displayingStatus = false;

    if (this.deleteAuctionStatus === DeletingAuctionStatus.AuctionDeleted) {
      this.$q.notify({
        type: 'positive',
        message: this.$t(
          'dashboard.auctionPage.cancelAuctionStatuses.deleteAuctionDeleted',
        ),
      });

      void this.$router.push('/');
    }
  }
}
</script>

<style lang="scss" scoped>
.q-tabs {
  font-weight: bold;
}

.title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  width: 100%;
}

.description {
  word-wrap: break-word;
}

.remaining-time-label {
  align-self: center;
}
</style>
