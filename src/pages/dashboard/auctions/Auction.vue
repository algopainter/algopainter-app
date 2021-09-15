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
        />
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
                <auction-history :users="auction.users" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <div class="col-12">
            <algo-button
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
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import { getAuctionDetails } from 'src/api/auctions';
import AlgoButton from 'components/common/Button.vue';
import HighestBidCard from 'components/auctions/auction/HighestBidCard.vue';
import NewBidDialog from 'components/auctions/auction/NewBidDialog.vue';

import AuctionInfo from './tabs/AuctionInfo.vue';
import BidsList from './tabs/BidsList.vue';
import AuctionHistory from './tabs/AuctionHistory.vue';

@Options({
  components: {
    AlgoButton,
    HighestBidCard,
    AuctionInfo,
    BidsList,
    AuctionHistory,
  },
})
export default class Auction extends Vue {
  loading: boolean = false;
  auction: unknown[] = [];
  tab: string = 'info';

  get auctionId(): string {
    const { id } = this.$route.params;

    return id as string;
  }

  created() {
    void this.getAuctionData();
  }

  async getAuctionData() {
    try {
      this.loading = true;

      // this.auction = await getAuctionDetails(auctionId);
      this.auction = {
        item: {
          title: 'Abstract Art',
          tags: ['Art', 'Abstract', 'AI'],
        },
        highestBid: {
          amount: 100,
          bidder: {
            _id: '123',
            account: 'account',
            avatar: 'http://localhost:8080/img/ALGOP.svg',
            bio: 'bio',
            createdAt: '2021',
            name: 'HighUser',
            networks: {
              name: 'network',
              type: 'type',
              url: 'url',
            },
            role: 'role',
            type: 'type',
            updatedAt: '2021',
          },
          createdAt: '2021',
          tokenSymbol: 'ALGOP',
        },
      } as unknown as [];

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
}
</script>

<style lang="scss" scoped>
.q-tabs {
  font-weight: bold;
}
</style>
