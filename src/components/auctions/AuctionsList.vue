<template>
  <div class="q-gutter-lg q-pb-lg">
    <div>
      <div class="q-mb-sm">
        <div class="header" style="display: inline;">
          {{ $t('dashboard.auctions.hotBids') }}
        </div>
        <div style="font-size: 1.8rem; display: inline;">🔥</div>
      </div>
      <div v-if="notHaveHot || auctions.length === 0">
        <p class="q-mt-lg text-primary text-bold text-h5">
          {{ $t('dashboard.commingSoon') }}
        </p>
      </div>
      <div
        v-else-if="auctions.length <= 3"
        :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'row justify-center' : 'row justify-start']"
      >
        <div
          v-for="(isHot, index) in auctions"
          :key="index"
          :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'row justify-center' : 'row justify-start']"
        >
          <auction-item
            :is-hot="isHot"
            @favoriteClicked="favoriteClicked()"
          />
        </div>
      </div>
      <div v-else>
        <div
          v-if="hotBidsLoading === false"
        >
          <carousel
            :items-to-show="4"
            :wrap-around="true"
            :breakpoints="breakpoints"
          >
            <slide
              v-for="(isHot, index) in auctions"
              :key="index"
              :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'row justify-center' : 'row justify-start']"
            >
              <auction-item
                :is-hot="isHot"
                @favoriteClicked="favoriteClicked()"
              />
            </slide>

            <template #addons>
              <navigation
                class="navigation"
              />
            </template>
          </carousel>
        </div>
        <div
          v-else
          class="flex items-center justify-center"
        >
          <CarouselSkeleton />
        </div>
      </div>
      <!-- <div
        class="row q-pt-xl"
      >
        <div class="header">
          <i18n-t keypath="dashboard.auctions.topSellers.top">
            <template #sellers>
              <span class="text-primary">
                {{ currentOptionsTop.label }}
              </span>
            </template>
          </i18n-t>
        </div>
        <div>
          <q-select
            v-model="currentOptionsTop"
            hide-selected
            class="text-primary"
            borderless
            :options="optionsTop"
            behavior="menu"
            dense
          />
        </div>
      </div>
      <div v-if="currentOptionsTop.id === 1">
        <div
          v-if="topSellersLoading === false"
          class="top-sellers"
        >
          <div v-if="haveTopSellers === false">
            <p class="q-mt-lg text-primary text-bold text-h5">
              {{ $t('dashboard.sellerSoon') }}
            </p>
          </div>
          <div
            v-else
            class="flex q-col-gutter-xl"
          >
            <div
              v-for="(seller, index) in topSellers"
              :key="index"
            >
              <div class="flex q-col-gutter-md items-center">
                <div class="text-h6 text-bold">
                  {{ index + 1 }}
                </div>
                <div>
                  <router-link :to="{path: 'user-gallery', query: { customProfile: seller.account }}">
                    <q-avatar
                      round
                      size="64px"
                    >
                      <img
                        v-if="seller.avatar != ''"
                        :src="seller.avatar"
                      >
                      <img
                        v-else
                        src="/images/do-utilizador (1).png"
                      >
                    </q-avatar>
                  </router-link>
                </div>
                <div>
                  <div class="text-h5 text-bold">
                    {{ seller.name }}
                  </div>
                  <div>{{ $n(seller.amount, 'currency',) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="flex"
        >
          <div
            v-for="(item, index) in 5"
            :key="index"
          >
            <q-card
              flat
              style="width: 235px"
              class="q-ml-sm q-my-sm"
            >
              <q-item>
                <q-item-section avatar>
                  <q-skeleton
                    type="QAvatar"
                    animation="fade"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <q-skeleton
                      type="text"
                      animation="fade"
                    />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton
                      type="text"
                      animation="fade"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
        </div>
      </div>
      <div v-if="currentOptionsTop.id === 2">
        <div
          v-if="topBuyersLoading === false"
          class="top-sellers"
        >
          <div v-if="haveTopBuyers === false">
            <p class="q-mt-lg text-primary text-bold text-h5">
              {{ $t('dashboard.buyerSoon') }}
            </p>
          </div>
          <div
            v-else
            class="flex q-col-gutter-xl"
          >
            <div
              v-for="(buyer, index) in topBuyers"
              :key="index"
            >
              <div class="flex q-col-gutter-md items-center">
                <div class="text-h6 text-bold">
                  {{ index + 1 }}
                </div>
                <div>
                  <router-link :to="{path: 'user-gallery', query: { customProfile: buyer.account }}">
                    <q-avatar
                      round
                      size="64px"
                    >
                      <img
                        v-if="buyer.avatar != ''"
                        :src="buyer.avatar"
                      >
                      <img
                        v-else
                        src="/images/do-utilizador (1).png"
                      >
                    </q-avatar>
                  </router-link>
                </div>
                <div>
                  <div class="text-h5 text-bold">
                    {{ buyer.name }}
                  </div>
                  <div>{{ $n(buyer.amount, 'currency') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { IAuctionItem } from 'src/models/IAuctionItem';
import { ITopSellersBuyers } from 'src/models/ITopSellersBuyers';
import { AuctionItem } from 'components/auctions';
import AlgoButton from 'components/common/Button.vue';
import moment from 'moment';
import 'vue3-carousel/dist/carousel.css';
import CarouselSkeleton from 'components/auctions/auction/CarouselSkeleton.vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

@Options({
  components: {
    AuctionItem,
    AlgoButton,
    Carousel,
    Slide,
    Pagination,
    Navigation,
    CarouselSkeleton,
  },
})
export default class AuctionsList extends Vue {
  areHot: IAuctionItem[] = [];
  auctions: IAuctionItem[] = [];
  hotBidsLoading: boolean = true;

  topSellers: ITopSellersBuyers[] = [];
  topSellersLoading: boolean = true;

  topBuyers: ITopSellersBuyers[] = [];
  topBuyersLoading: boolean = true;

  notHaveHot: boolean = false;
  haveTopSellers: boolean = false;
  haveTopBuyers: boolean = false;

  mounted() {
    void this.getHotBids();
    void this.getTopSellers();
    void this.getTopBuyers();
  }

  getHotBids() {
    void this.$store.dispatch({
      type: 'auctions/getHotBids',
    }).then(() => {
      this.areHot = this.$store.state.auctions.hotBids;
      this.auctions = this.areHot.filter(function(items) {
        return moment().isAfter(items.expirationDt) === false;
      });
      this.findHotBids();
      this.hotBidsLoading = false;
    });
  }

  findHotBids() {
    this.areHot.length === 0 ? this.notHaveHot = true : this.notHaveHot = false;
  }

  getTopSellers() {
    void this.$store.dispatch({
      type: 'auctions/getTopSellers',
    }).then(() => {
      this.topSellersLoading = false;
      this.topSellers = this.$store.state.auctions.topSellers;
      this.findTopSellers();
    });
  }

  findTopSellers() {
    this.topSellers.length === 0 ? this.haveTopSellers = false : this.haveTopSellers = true;
  }

  getTopBuyers() {
    void this.$store.dispatch({
      type: 'auctions/getTopBuyers',
    }).then(() => {
      this.topBuyersLoading = false;
      this.topBuyers = this.$store.state.auctions.topBuyers;
      this.findTopBuyers();
    });
  }

  findTopBuyers() {
    this.topBuyers.length === 0 ? this.haveTopBuyers = false : this.haveTopBuyers = true;
  }

  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  breakpoints = {
    0: {
      itemsToShow: 1,
      snapAlign: 'start',
    },
    // 700px and up
    800: {
      itemsToShow: 2,
      snapAlign: 'center',
    },
    // 1024 and up
    1130: {
      itemsToShow: 3,
      snapAlign: 'start',
    },
    1450: {
      itemsToShow: 3,
      snapAlign: 'start',
    },
  };

  optionsTop: unknown[] = [
    {
      id: 1,
      label: 'Sellers',
    },
    {
      id: 2,
      label: 'Buyers',
    },
  ]

  currentOptionsTop: unknown = {
    id: 1,
    label: 'Sellers',
  }
}
</script>

<style lang="scss">
.category {
  font-weight: bold;
}

.header.gallery{
  padding-bottom: 1rem;
}

.carousel__slide {
  padding: 10px;
}

.carousel__prev {
  background-color: #f4538d;
  box-sizing: content-box;
  border: 5px solid white;
  margin-left: 20px;
}

@media (max-width: 480px) {
  .carousel__prev {
  margin-left: 10px;
}
.carousel__next{
  margin-right: 25px !important;
}
}

.carousel__next {
  background-color: #f4538d;
  box-sizing: content-box;
  border: 5px solid white;
  margin-right: 20px;
}

.custom-skeleton-border {
  width: 35px;
  height: 35px;
}
</style>
