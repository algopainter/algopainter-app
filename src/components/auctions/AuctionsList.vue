        <!--
          <auction-item
            v-for="isHot in areHot"
            :key="isHot._id"
            :is-hot="isHot"
            @favoriteClicked="favoriteClicked()"
          />
        -->
<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <div class="header">
      {{ $t('dashboard.auctions.hotBids') }}
    </div>
    <div
      v-if="hotBidsLoading === false"
    >
      <carousel
        :items-to-show="4"
        :wrap-around="true"
        :breakpoints="breakpoints"
        :autoplay="5000"
      >
        <slide
          v-for="(isHot, index) in areHot"
          :key="index"
        >
          <auction-item
            :is-hot="isHot"
            @favoriteClicked="favoriteClicked()"
          />
        </slide>

        <template #addons>
          <navigation class="navigation"/>
        </template>
      </carousel>
    </div>
    <div class="row q-pt-xl">
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
        class="top-sellers q-pb-md"
      >
        <div class="flex q-col-gutter-xl">
          <div
            v-for="(seller, index) in topSellers"
            :key="index"
          >
            <div class="flex q-col-gutter-md items-center">
              <div class="text-h6 text-bold">
                {{ index + 1 }}
              </div>
              <div>
                <q-avatar
                  round
                  size="64px"
                >
                  <img :src="seller.avatar">
                </q-avatar>
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
    </div>
    <div v-if="currentOptionsTop.id === 2">
      <div
        v-if="topBuyersLoading === false"
        class="top-sellers q-pb-xl"
      >
        <div class="flex q-col-gutter-xl">
          <div
            v-for="(seller, index) in topBuyers"
            :key="index"
          >
            <div class="flex q-col-gutter-md items-center">
              <div class="text-h6 text-bold">
                {{ index + 1 }}
              </div>
              <div>
                <q-avatar
                  round
                  size="64px"
                >
                  <img :src="seller.avatar">
                </q-avatar>
              </div>
              <div>
                <div class="text-h5 text-bold">
                  {{ seller.name }}
                </div>
                <div>{{ $n(seller.amount, 'currency') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="explore-results flex q-col-gutter-md">
      <auction-item
        v-for="auction in auctions"
        :key="auction.id"
        :auction="auction"
        @favoriteClicked="favoriteClicked"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { IAuctionItem2 } from 'src/models/IAuctionItem2';
import { ITopSellersBuyers } from 'src/models/ITopSellersBuyers';
import { AuctionItem } from 'components/auctions';
import AlgoButton from 'components/common/Button.vue';
import { api } from 'src/boot/axios';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

@Options({
  components: {
    AuctionItem,
    AlgoButton,
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
})
export default class AuctionsList extends Vue {
  areHot: IAuctionItem2[] = [];
  hotBidsLoading: boolean = true;

  topSellers: ITopSellersBuyers[] = [];
  topSellersLoading: boolean = true;

  topBuyers: ITopSellersBuyers[] = [];
  loadingTopBuyers: boolean = true;
  topBuyersLoading: boolean = true;

  mounted() {
    void this.getHotBids();
    void this.getTopSellers();
    void this.getTopBuyers();
  }

  getHotBids() {
    void this.$store.dispatch({
      type: 'auctions/getHotBids',
    }).then(() => {
      this.hotBidsLoading = this.$store.state.auctions.hotBidsLoading;
      this.areHot = this.$store.state.auctions.hotBids;
    });
  }

  getTopSellers() {
    void this.$store.dispatch({
      type: 'auctions/getTopSellers',
    }).then(() => {
      this.topSellersLoading = this.$store.state.auctions.topSellersLoading;
      this.topSellers = this.$store.state.auctions.topSellers;
    });
  }

  getTopBuyers() {
    void this.$store.dispatch({
      type: 'auctions/getTopBuyers',
    }).then(() => {
      this.topBuyersLoading = this.$store.state.auctions.topBuyersLoading;
      this.topBuyers = this.$store.state.auctions.topBuyers;
    });
  }

  async getDataTopBuyers() {
    try {
      const data = await api.get('reports/top/buyers');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.topBuyers = data.data as [];
      this.loadingTopBuyers = false;
    } catch (e) {
      console.log('e', e);
    }
  }

  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  breakpoints = {
    0: {
      itemsToShow: 1,
      snapAlign: 'center',
    },
    // 700px and up
    800: {
      itemsToShow: 2,
      snapAlign: 'center',
    },
    // 1024 and up
    1130: {
      itemsToShow: 3,
      snapAlign: 'center',
    },
    1450: {
      itemsToShow: 4,
      snapAlign: 'start',
    },
  };

  categories: unknown[] = [{
    id: '1',
    label: 'Digital',
  }, {
    id: '2',
    label: 'Photo',
  }, {
    id: '3',
    label: 'Classic',
  }, {
    id: '4',
    label: 'Modern',
  }, {
    id: '5',
    label: 'Abstract',
  }, {
    id: '6',
    label: 'Fractal',
  }];

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

.carousel__prev,
.carousel__next {
  background-color: #f4538d;
  box-sizing: content-box;
  border: 5px solid white;
}
</style>
