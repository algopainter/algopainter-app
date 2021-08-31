<template>
  <div>
    <div class="btn-container q-mx-auto flex justify-center items-center">
      <algo-button
        :label="$t('dashboard.homePage.gallery') + contImg"
        outline
        class="algo-button q-px-md q-ml-sm"
        :color="currentBtnClicked === 1 ? 'primary' : 'grey-5' "
        @click="showGalleryArts()"
      />
      <algo-button
        :label="$t('dashboard.homePage.onSale')"
        outline
        class="algo-button q-px-md q-ml-sm"
        :color="currentBtnClicked === 2 ? 'primary' : 'grey-5' "
        @click="getOnSale()"
      />
      <algo-button
        :label="$t('dashboard.homePage.like')"
        outline
        class="algo-button q-px-md q-ml-sm"
        :color="currentBtnClicked === 3 ? 'primary' : 'grey-5' "
        @click="getLikes()"
      />
    </div>
  </div>
  <div
    class="row q-col-gutter-lg"
  >
    <div
      v-if="loadingGalleryArtsButtons === false && currentBtnClicked === 1"
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
          <div class="text-h6 text-primary text-center q-pb-md q-mt-lg">
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
          v-if="nullGalleryArts === false"
          :label="$t('dashboard.homePage.loadMore', {
            msg: btnLoadMoreMsg
          })"
          color="primary"
          outline
          class="load-more q-px-xl q-mx-auto mobile-only"
          :disable="noMoreImages"
          :loading="loadingBtn"
          @click="loadMore()"
        />
      </div>
    </div>
    <div
      v-else-if="currentBtnClicked === 1"
      class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md"
    >
      <MyGallerySkeleton />
    </div>
    <div
      v-else-if="currentBtnClicked === 2"
      class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md"
    >
      <p class="q-mt-lg text-primary text-bold text-h5 q-mx-auto">
        {{ $t('dashboard.auctions.coming') }}
      </p>
    </div>
    <div
      v-else-if="currentBtnClicked === 3"
      class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md"
    >
      <div
        v-if=" currentBtnClicked === 3"
        class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md"
      >
        <div
          v-if="loadingLikes === false"
        >
          <div
            v-if="nullTabLike === false"
            class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md"
          >
            <div
              v-for="(item, index) in likesGallery"
              :key="index"
            >
              <div>
                <gallery-item
                  :art="item"
                  @favoriteClicked="favoriteClicked"
                />
              </div>
            </div>
          </div>
          <div
            v-else
            class="col-12 col-md-9 col-lg-9 q-mt-lg"
          >
            <div class="text-h6 text-primary text-center q-pb-md q-mr-xl">
              {{ $t('dashboard.homePage.noItemaPublic') }}
            </div>
          </div>
        </div>
        <div
          v-else
        >
          <MyGallerySkeleton />
        </div>
        <div class=" q-mx-auto q-mb-md">
          <q-btn
            v-for="(btn, index) in showingPageslike"
            :key="index"
            :color="currentPage === index + 1 ? 'primary' : 'grey-4'"
            :label="index + 1"
            class="q-mr-xs desktop-only"
            :loading="currentPage === index + 1 ? loadingLikes : false"
            @click="getLikes(index + 1)"
          />
          <algo-button
            v-if="nullTabLike === false"
            :label="$t('dashboard.homePage.loadMore', {
              msg: btnLoadMoreMsg
            })"
            color="primary"
            outline
            class="load-more q-px-xl q-mx-auto mobile-only"
            :disable="noMoreImages"
            :loading="loadingBtn"
            @click="loadMoreLike()"
          />
        </div>
      </div>
    </div>
    <div class="col-11 col-md-3 col-lg-3 q-pt-md q-mt-lg column items-center border q-pl-none latest-bids">
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
  loadingBtn: boolean = false;
  loadingLatestBidsItem: boolean = true;
  loadingGalleryArtsButtons: boolean = true;
  loadingLikesButtons: boolean = true;

  btnBidsClicked: boolean = false;

  galleryArts:IMyGallery[] = [];
  likesGallery:IMyGallery[] = [];
  loadingGalleryArts: boolean = true;
  loadingLikes: boolean = true;
  nullGalleryArts: boolean = false;
  nullTabLike: boolean = false;

  maxPage: number = 1;
  showingPages: number = 1;
  showingPageslike: number = 1;
  currentPage: number = 1;

  btnLoadMoreMsg: string = 'Load More';
  loadMoreCounter: number = 1;
  loadMoreCounterLike: number = 1;
  noMoreImages: boolean = false;

  // Buttons
  currentBtnClicked: number = 1;

  imgData: IMyGallery[] = [];
  contImg: string = '';

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
    // void this.getGalleryBidders();
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
    this.currentBtnClicked = 1;
    try {
      this.currentPage = page;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const response = await api.get(`users/${this.$route.params.account}/images?page=${page}&perPage=9`); // this.accountAddress
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.maxPage = response.data.pages as number;
      if (this.maxPage <= 15) {
        this.showingPages = this.maxPage;
      } else {
        this.showingPages = 15;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.galleryArts = response.data.data as [];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const contImg: number = response.data.count as number;
      this.contImg = ` (${contImg})`;

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

  showGalleryArts() {
    this.currentBtnClicked = 1;
  }

  getOnSale() {
    console.log('Coming soon');
    this.currentBtnClicked = 2;
  }

  async getLikes(page:number = 1) {
    this.loadingLikes = true;
    this.currentBtnClicked = 3;
    try {
      this.currentPage = page;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const response = await api.get(`likes/${this.$route.params.account}?page=${page}&perPage=6`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.maxPage = response.data.pages as number;
      if (this.maxPage <= 15) {
        this.showingPageslike = this.maxPage;
      } else {
        this.showingPages = 15;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.likesGallery = response.data.data as [];
      if (this.likesGallery.length === 0) {
        this.nullTabLike = true;
      } else {
        this.nullTabLike = false;
      }
    } catch (error) {
      console.log('erro no likesGallery');
    } finally {
      this.loadingLikesButtons = false;
      this.loadingLikes = false;
    }
  }

  async loadMoreLike() {
    try {
      this.loadMoreCounterLike++;
      this.loadingBtn = true;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const response = await api.get(`likes/${this.$route.params.account}?page=${this.loadMoreCounterLike}&perPage=9`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const likeMobile = response.data.data as [];
      if (likeMobile.length === 0) {
        this.noMoreImages = true;
        this.btnLoadMoreMsg = 'Nothing else to show';
      } else {
        likeMobile.forEach((i) => {
          this.likesGallery.push(i);
        });
      }
    } catch (error) {
      console.log('erro no galleryArts');
    }
    this.loadingBtn = false;
  }

  async loadMore() {
    try {
      this.loadMoreCounter++;
      this.loadingBtn = true;
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
    this.loadingBtn = false;
  }
}
</script>

<style lang="scss">
.btn-container {
  width: 100%;
  height: 80px;
}

.border {
  border: 2px dashed $primary;
  border-radius: 20px;
  max-height: 150px;
}

.pagination {
  align-self: center;
  justify-self: center;
}

.latest-bids{
  @media (max-width: $breakpoint-xs-max){
  margin-left: 25px;
  margin-right: 25px;
  }
  margin-left: 16px;
}
</style>
