<template>
  <q-page
    class="q-page q-gutter-lg q-pb-lg"
  >
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
          class="q-mt-sm text-subtitle1 text-justify desktop-only"
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
          <div class="col-12 header">
            {{ auction.item.title }}
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
              @click="openPlaceBidDialog"
            />
          </div>
        </div>
      </div>
    </div>
    <q-dialog
      v-model="displayingStatus"
      persistent
    >
      <create-auction-status-card
        :create-auction-status="createAuctionStatus"
        :deleting-auction="true"
        @request-close="onCloseStatusDialog"
      />
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import { IAuctionItem } from 'src/models/IAuctionItem';
import { getAuctionDetails } from 'src/api/auctions';
import AlgoButton from 'components/common/Button.vue';
import HighestBidCard from 'components/auctions/auction/HighestBidCard.vue';
import NewBidDialog from 'components/auctions/auction/NewBidDialog.vue';

import AuctionInfo from './tabs/AuctionInfo.vue';
import BidsList from './tabs/BidsList.vue';
import AuctionHistory from './tabs/AuctionHistory.vue';
import AlgoPainterAuctionSystemProxy from 'src/eth/AlgoPainterAuctionSystemProxy';
import { mapGetters } from 'vuex';
import { NetworkInfo } from 'src/store/user/types';
import CreateAuctionStatusCard from 'components/auctions/auction/CreateAuctionStatusCard.vue';

enum CreatingAuctionStatus {
  CheckingContractApproved,
  ContractApprovedAwaitingInput,
  ContractApprovedAwaitingConfirmation,
  ContractApprovedError,
  CreateAuctionAwaitingInput,
  CreateAuctionAwaitingConfirmation,
  CreateAuctionError,
  AuctionCreated,
}

@Options({
  components: {
    AlgoButton,
    HighestBidCard,
    AuctionInfo,
    BidsList,
    AuctionHistory,
    CreateAuctionStatusCard,
  },
  computed: {
    ...mapGetters('user', ['networkInfo']),
  },
})
export default class Auction extends Vue {
  loading: boolean = false;
  auction: IAuctionItem | null = null;
  tab: string = 'info';
  reloadInterval: number | undefined;
  networkInfo!: NetworkInfo;
  auctionSystem!: AlgoPainterAuctionSystemProxy;
  displayingStatus: boolean = false;
  createAuctionStatus: CreatingAuctionStatus | null = null;

  get auctionId(): string {
    const { id } = this.$route.params;

    return id as string;
  }

  get account() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/account'];
  }

  cancelAuction() {
    this.displayingStatus = true;

    if (this.auction) {
      void this.auctionSystem.cancelAuction(this.auction.index, this.account);
    }
  }

  created() {
    void this.getAuctionData();
    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);
  }

  mounted() {
    this.reloadInterval = setInterval(() => {
      void this.loadAuctionDetails();
    }, 5000) as unknown as number;
  }

  unmounted() {
    clearInterval(this.reloadInterval);
  }

  async loadAuctionDetails() {
    this.auction = await getAuctionDetails(this.auctionId);
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

    if (this.createAuctionStatus === CreatingAuctionStatus.AuctionCreated) {
      this.$q.notify({
        type: 'positive',
        message: 'Auction created successfully',
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
</style>
