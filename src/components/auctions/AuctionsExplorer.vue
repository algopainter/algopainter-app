<!--
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
<template>
  <div class="q-gutter-lg q-pb-lg">
    <div
      v-if="hotBidsLoading === false"
    >
      <carousel
        :items-to-show="4"
        :wrap-around="true"
        :breakpoints="breakpoints"
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
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { IAuctionItem2 } from 'src/models/IAuctionItem2';
import { AuctionItem } from 'components/auctions';
import AlgoButton from 'components/common/Button.vue';
import 'vue3-carousel/dist/carousel.css';
import CarouselSkeleton from 'components/auctions/auction/CarouselSkeleton.vue';
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
export default class AuctionsExplorer extends Vue {
  areHot: IAuctionItem2[] = [];
  hotBidsLoading: boolean = true;

  mounted() {
    void this.getAllBids();
  }

  getAllBids() {
    void this.$store.dispatch({
      type: 'auctions/getAllBids',
    }).then(() => {
      this.hotBidsLoading = false;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.areHot = this.$store.getters['auctions/getAllBids'] as [];
    });
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

</style> -->
