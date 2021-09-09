<template>
  <q-page
    class="q-page q-gutter-lg q-pb-lg"
  >
    <div class="row">
      <div class="col-12 col-sm">
        <q-img
          src="https://ipfs.io/ipfs/QmWifvG21jySfTYfVtub9PrGVcXZS3VYRuP2bTdFKb531q"
        />
      </div>
      <q-separator
        class="q-mx-lg gt-xs"
        vertical
      />
      <div class="col-12 col-sm-8">
        <div
          v-if="loading"
          class="fit flex flex-center"
        >
          <q-spinner
            size="80px"
            color="primary"
          />
        </div>
        <div
          v-else-if="auction"
          class="row q-col-gutter-md"
        >
          <div class="col-12 header">
            {{ auction.item.title }}
          </div>
          <div class="col-12 flex q-col-gutter-sm tags">
            <div
              v-for="tag in auction.item.tags"
              :key="tag"
              class="tag text-grey-5"
            >
              {{ `#${tag}` }}
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
            <q-tab-panels v-model="tab">
              <q-tab-panel
                class="q-pa-none q-pt-md"
                name="info"
              >
                <auction-info :auction="auction" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import { IAuctionItem } from 'src/models/IAuctionItem';
import { getAuctionDetails } from 'src/api/auctions';
import AuctionInfo from './tabs/AuctionInfo.vue';

@Options({
  components: {
    AuctionInfo,
  },
})
export default class Auction extends Vue {
  loading: boolean = false;
  auction: IAuctionItem | null = null;
  tab: string = 'info';

  created() {
    const { id: auctionId } = this.$route.params;
    void this.getAuctionData(auctionId as string);
  }

  async getAuctionData(auctionId: string) {
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
      } as IAuctionItem;

      this.loading = false;
    } catch {
      this.auction = await getAuctionDetails(auctionId);
      this.loading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
