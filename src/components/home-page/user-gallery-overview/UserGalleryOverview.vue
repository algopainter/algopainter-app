<template>
  <div
    class="row q-col-gutter-lg"
  >
    <div
      v-if="loadingGalleryArtsButtons === false"
      class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md"
    >
      <div v-if="loadingGalleryArts === false">
        <div
          v-if="nullGalleryArts === false"
          class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md"
        >
          <div
            v-for="(item, index) in galleryArts"
            :key="index"
          >
            <gallery-item
              :art="item"
              :user="true"
              @favoriteClicked="favoriteClicked"
            />
          </div>
        </div>
        <div v-else>
          <div class="text-h6 text-primary text-center q-pb-md">
            {{ $t('dashboard.homePage.publicNoItems') }}
          </div>
        </div>
      </div>
      <div v-else>
        <MyGallerySkeleton />
      </div>
      <div class=" q-mx-auto q-mb-md">
        <q-btn
          v-for="(btn, index) in showingPages"
          :key="index"
          :color="currentPage === index + 1 ? 'primary' : 'grey-4' "
          :label="index + 1"
          class="q-mr-xs desktop-only"
          :loading="currentPage === index + 1 ? loadingGalleryArts : false"
          @click="getGalleryArts(index + 1)"
        />
        <algo-button
          :label="$t('dashboard.homePage.loadMore', {
            msg: btnLoadMoreMsg
          })"
          color="primary"
          outline
          class="load-more q-px-xl q-mx-auto mobile-only"
          :disable="noMoreImages"
          @click="loadMore()"
        />
      </div>
    </div>
    <div
      v-else
      class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md"
    >
      <MyGallerySkeleton />
    </div>
    <div class="col-11 col-md-3 col-lg-3 q-pt-md column items-center border q-pl-none latest-bids">
      <div class="text-h5 text-bold text-primary q-pb-md">
        {{ $t('dashboard.homePage.latestBids') }}
      </div>
      <div>
        <p class="q-mt-lg text-primary text-bold text-h5">
          {{ $t('dashboard.auctions.coming') }}
        </p>
      </div>
      <!--
      <div v-if="loadingGalleryBid === false">
        <div
          v-for="(bid, i) in galleryBidShow"
          :key="i"
          class="column q-col-gutter-md"
        >
          <div v-if="bid != undefined">
            <LatestBidsItem :bid="bid" />
          </div>
        </div>
        <div v-if="nullGalleryBidShow === true">
          <div class="flex q-mb-md">
            {{ $t('dashboard.homePage.publicNoBids') }}
          </div>
        </div>
        <div class="q-pt-md row justify-center">
          <algo-button
            v-if="btnBidsClicked"
            color="primary"
            @click="Allbids()"
          >
            {{ $t('dashboard.homePage.seeLess') }}
          </algo-button>
          <algo-button
            v-else
            color="primary"
            @click="Allbids()"
          >
            {{ $t('dashboard.homePage.seeAllBids') }}
          </algo-button>
        </div>
      </div>
      <div v-else>
        <LatestBidsItemSkeleton />
      </div>
      -->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';

import GalleryItem from './GalleryItem.vue';
import LatestBidsItem from './LatestBidsItem.vue';
import { api } from 'src/boot/axios';
import { IMyGallery } from 'src/models/IMyGallery';
import LatestBidsItemSkeleton from './LatestBidsItemSkeleton.vue';
import MyGallerySkeleton from './MyGallerySkeleton.vue';

@Options({
  components: {
    AlgoButton,
    GalleryItem,
    LatestBidsItem,
    LatestBidsItemSkeleton,
    MyGallerySkeleton,
  },
})
export default class UserGalleryOverview extends Vue {
  galleryBid = [];
  loadingGalleryBid: boolean = true;
  galleryBidClosed = [];
  galleryBidShow = [];
  nullGalleryBidShow: boolean = false;
  loadingGalleryArtsButtons: boolean = true;

  btnBidsClicked: boolean = false;

  galleryArts:IMyGallery[] = [];
  loadingGalleryArts: boolean = true;
  nullGalleryArts: boolean = false;

  maxPage: number = 1;
  showingPages: number = 1;
  currentPage: number | null = 1;

  btnLoadMoreMsg: string = 'Load More';
  loadMoreCounter: number = 1;
  noMoreImages: boolean = false;

  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  Allbids() {
    this.btnBidsClicked = !this.btnBidsClicked;
    if (this.btnBidsClicked === false) {
      this.galleryBidShow = this.galleryBidClosed;
    } else {
      this.galleryBidShow = this.galleryBid;
    }
  }

  mounted() {
    void this.getGalleryBidders();
    void this.getGalleryArts();
  }

  async getGalleryBidders() {
    try {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const response = await api.get(`bids?bidder=${this.$route.params.account}`);
      this.galleryBid = response.data as [];
      if (this.galleryBid.length !== 0) {
        this.galleryBidClosed = [
          this.galleryBid[0],
          this.galleryBid[1],
          this.galleryBid[2],
        ];
      } else {
        this.nullGalleryBidShow = true;
      }
      this.galleryBidShow = this.galleryBidClosed;
      this.loadingGalleryBid = false;
    } catch (e) {
      console.log('error', e);
    }
  }

  async getGalleryArts(page:number = 1) {
    this.loadingGalleryArts = true;
    try {
      this.currentPage = page;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const response = await api.get(`users/${this.$route.params.account}/images?page=${page}&perPage=9`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.maxPage = response.data.pages as number;
      if (this.maxPage <= 15) {
        this.showingPages = this.maxPage;
      } else {
        this.showingPages = 15;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.galleryArts = response.data.data as [];
      if (this.galleryArts.length === 0) {
        this.nullGalleryArts = true;
      } else {
        this.nullGalleryArts = false;
      }
    } catch (error) {
      console.log('erro no galleryArts');
    } finally {
      this.loadingGalleryArtsButtons = false;
      this.loadingGalleryArts = false;
    }
  }

  async loadMore() {
    try {
      this.loadMoreCounter++;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const response = await api.get(`users/${this.$route.params.account}/images?page=${this.loadMoreCounter}&perPage=9`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const tempGalleryArts = response.data.data as [];
      if (tempGalleryArts.length === 0) {
        this.noMoreImages = true;
        this.btnLoadMoreMsg = 'Nothing else to show';
      } else {
        tempGalleryArts.forEach((item) => {
          this.galleryArts.push(item);
        });
      }
    } catch (error) {
      console.log('erro no galleryArts');
    }
  }
}
</script>

<style lang="scss">
.border {
  border: 2px dashed $primary;
  border-radius: 20px;
  max-height: 150px;
}

.pagination {
  align-self: center;
  justify-self: center;
}
</style>
