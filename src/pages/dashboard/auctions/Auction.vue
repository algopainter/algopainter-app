<template>
  <q-page
    class="q-page q-gutter-lg q-pb-lg"
  >
    <div
      v-if="loadingAuctionData === false"
      class="row q-col-gutter-sm"
    >
      <div class="col-12 col-md-6">
        <div class="row">
          <div class="col-12 col-md-11">
            <div class="q-pb-md">
              <algo-button
                v-if="isAuctionImageEnabled"
                :icon="'img:' + distributionSVG"
                color="primary"
                outline
                @click="auctionDistributionBtnClicked()"
              >
                <div class="q-pl-sm">
                  {{ $t('dashboard.auctionPage.auctionDistribution') }}
                </div>
              </algo-button>
              <algo-button
                v-if="isAuctionDistributionEnabled"
                color="primary"
                outline
                @click="auctionDistributionBtnClicked()"
              >
                {{ $t('dashboard.auctionPage.auction') }}
              </algo-button>
            </div>

            <q-img
              v-if="isAuctionImageEnabled"
              width="100%"
              class="art-image"
              :src="auctionData.item.previewImageUrl"
            />

            <auction-info-chart
              v-if="isAuctionDistributionEnabled"
              :values="[44, 100, 13, 33]"
              width="100%"
            />
          </div>
          <div
            v-if="isAuctionImageEnabled"
            class="col-12 col-md-1 q-my-md"
          >
            <LikeAnimation
              :likes="auctionData.item.likes"
              @favoriteClicked="favoriteClicked"
            />
            <div class="icons text-center justify-center">
              <div class="expand">
                <q-icon
                  color="primary"
                  size="1.7rem"
                  name="mdi-arrow-expand"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="column justify-between auction q-pl-lg col-12 col-md-5"
      >
        <div class="row">
          <div class="auction-details col-md-8">
            <div class="name">
              {{ auctionData.item.title }}
            </div>
            <div
              class="flex q-gutter-md"
            >
              <div
                v-for="categorie in auctionData.item.tags"
                :key="categorie"
                class="keywords "
              >
                {{ $t('dashboard.auctionPage.symbol') }}{{ categorie }}
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <q-img
              width="150px"
              src="../../../assets/icons/bidback.svg"
            />
          </div>
        </div>
        <div>
          <q-tabs
            v-model="tab"
            active-color="primary"
            indicator-color="primary"
            align="left"
            :narrow-indicator="true"
          >
            <q-tab
              class="tab"
              :ripple="false"
              no-caps
              name="info"
              label="Info"
            />
            <q-tab
              class="tab"
              :ripple="false"
              no-caps
              name="bids"
              label="Bids"
            />
            <q-tab
              class="tab"
              :ripple="false"
              no-caps
              name="history"
              label="History"
            />
          </q-tabs>

          <div class="q-my-md q-mx-sm q-py-xs q-px-md highest-bid">
            <highest-bid-avatar :bid="auctionData.highestBid" />
          </div>

          <q-tab-panels
            v-model="tab"
          >
            <q-tab-panel
              name="info"
              class="q-pa-sm"
            >
              <div
                v-for="(user , i) in auctionData.users"
                :key="i"
              >
                <div v-if="user.role === 'creator'">
                  <algo-avatar
                    class="q-py-md"
                    :title="user.role"
                    :image-url="user.avatar"
                    :sub-title="user.name"
                  />
                </div>
                <div v-if="user.role === 'owner'">
                  <algo-avatar
                    class="q-py-md"
                    :title="user.role"
                    :image-url="user.avatar"
                    :sub-title="user.name"
                    :description="
                      $t('dashboard.auctionPage.pirsDestination', {
                        pirs: $n(auctionData.fee.royalties[0].value*10, 'percent'),
                        role: $t('dashboard.auctionPage.creators').toLowerCase(),
                      })
                    "
                  />
                </div>
              </div>
              <q-separator
                class="q-pr-xl"
                spaced="md"
                color="primary"
                size="2px"
              />
              <algo-avatar
                class="q-py-md"
                :title="$t('dashboard.auctionPage.collection')"
                :image-url="auctionData.item.previewImageUrl"
                :sub-title="auctionData.item.collectionName"
                :description="
                  $t('dashboard.auctionPage.pirsDestination', {
                    pirs: $n(auctionData.fee.royalties[0].value*10, 'percent'),
                    role: $t('dashboard.auctionPage.investors').toLowerCase(),
                  })
                "
              />
            </q-tab-panel>

            <q-tab-panel
              name="bids"
              class="q-pa-sm"
            >
              <bid-avatar
                v-for="(bidder,index) in auctionData.bids"
                :key="index"
                class="q-py-md"
                :bid="(bidder)"
                :fee="auctionData.fee"
              />
            </q-tab-panel>

            <q-tab-panel
              name="history"
              class="q-pa-sm"
            >
              <previous-bid-avatar
                v-for="(bidder,index) in auctionData.bids"
                :key="index"
                class="q-py-md"
                :bid="bidder"
              />
            </q-tab-panel>
          </q-tab-panels>
        </div>
        <div>
          <q-input
            v-if="showBidInput"
            v-model="bidInput"
            label="Place a Bid"
          />
          <div class="q-py-sm">
            <algo-button
              class="text-bold full-width"
              size="lg"
              color="primary"
              outline
              @click="placeBidClicked"
            >
              {{ $t('dashboard.auctionPage.placeABid') }}
            </algo-button>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AuctionInfoChart from 'components/charts/AuctionInfoChart.vue';
import AlgoAvatar from 'components/common/AlgoAvatar.vue';
import BidAvatar from 'components/auctions/auction/BidAvatar.vue';
import HighestBidAvatar from 'components/auctions/auction/HighestBidAvatar.vue';
import PreviousBidAvatar from 'components/auctions/auction/PreviousBidAvatar.vue';
import AlgoButton from 'components/common/Button.vue';
import LikeAnimation from 'components/auctions/auction/LikeAnimation.vue';
import { IAuctionItem2 } from 'src/models/IAuctionItem2';
import { api } from 'src/boot/axios';

@Options({
  components: {
    AuctionInfoChart,
    AlgoButton,
    BidAvatar,
    HighestBidAvatar,
    AlgoAvatar,
    PreviousBidAvatar,
    LikeAnimation,
  },

})
export default class Auction extends Vue {
  isAuctionImageEnabled: boolean = true;
  loadingAuctionData: boolean = true;
  isAuctionDistributionEnabled: boolean = false;
  showBidInput: boolean = false;
  auctionData: IAuctionItem2[] = [];

  mounted() {
    const route = this.$route.params.id;
    void this.getAuctionData(route);
    console.log(route);
  }

  async getAuctionData(route: unknown) {
    try {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const data = await api.get(`auctions/${route}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.auctionData = data.data as [];
      this.loadingAuctionData = false;
      console.log(data.data);
    } catch (e) {
      console.log('e', e);
    }
  }

  placeBidClicked() {
    this.showBidInput = !this.showBidInput;
  }

  auctionDistributionBtnClicked() {
    this.toggleAuctionDistribution();
  }

  toggleAuctionDistribution() {
    this.isAuctionImageEnabled = !this.isAuctionImageEnabled;
    this.isAuctionDistributionEnabled = !this.isAuctionDistributionEnabled;
  }

  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  // MOCKING DATA

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  distributionSVG: string = require('../../../assets/icons/chart-distribution.svg');

  tab: string = 'info';
}
</script>
<style lang="scss" scoped>
.art-image {
  border-radius: 10px;
}

.auction {
  border-left: 2px solid $primary;
}

.auction-details {
  .name {
    font-weight: bold;
    font-size: 2rem;
  }

  .keywords {
    font-size: 1.3rem;
    color: #bdbdbd;
  }
}

.highest-bid {
  background-color: $primary;
  border-radius: 12px;
}

.icons {
  i {
    cursor: pointer;
    margin: 10px 12px 8px;
  }
}
</style>
