/* eslint-disable @typescript-eslint/no-unsafe-assignment */
<template>
  <div class="btn-container q-mx-auto row items-center justify-center ">
    <q-select
      v-model="currentCollection"
      :options="collectionFilter"
      color="primary"
      :loading="getCollectionsLoading"
      rounded
      outlined
      bottom-slots
      @update:model-value="filterCollection(1, currentCollection.label)"
    >
      <template #before>
        <q-icon
          name="filter_list"
          color="primary"
        />
      </template>
    </q-select>
    <div class="q-mx-auto row items-center justify-center">
      <div class="btn-container q-mx-auto flex justify-center items-center">
        <algo-button
          :label="$t('dashboard.homePage.gallery') + contImg"
          outline
          class="algo-button q-px-md q-ml-sm"
          :color="currentBtnClicked === 1 ? 'primary' : 'grey-5' "
          @click="showGalleryArts()"
        />
        <algo-button
          :label="$t('dashboard.homePage.onSale') + contSale"
          outline
          class="algo-button q-px-md q-ml-sm"
          :color="currentBtnClicked === 2 ? 'primary' : 'grey-5' "
          @click="showOnSale()"
        />
        <algo-button
          :label="$t('dashboard.homePage.like') + contLiked"
          outline
          class="algo-button q-px-md q-ml-sm"
          :color="currentBtnClicked === 3 ? 'primary' : 'grey-5' "
          @click="showLikes()"
        />
      </div>
    </div>
  </div>
  <div
    class="row q-col-gutter-lg"
  >
    <div
      v-if="loadingGalleryArtsButtons === false && currentBtnClicked === 1"
      class=" col-md-9 col-lg-9 flex q-col-gutter-md"
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
        <MyGallerySkeleton
          :buttons="false"
        />
      </div>
      <div
        class=" q-mx-auto q-mb-md"
      >
        <q-btn
          v-for="(btn, index) in showingPages"
          :key="index"
          :color="currentPage === index + 1 ? 'primary' : 'grey-4' "
          :label="index + 1"
          class="q-mr-xs desktop-only"
          :loading="currentPage === index + 1 ? loadingGalleryArts : false"
          @click="getGalleryArts(index + 1, currentCollection.label)"
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
          @click="loadMore(currentCollection.label)"
        />
      </div>
    </div>
    <div
      v-else-if="currentBtnClicked === 1"
      class="col-md-9 col-lg-9 flex q-col-gutter-md"
    >
      <MyGallerySkeleton
        :buttons="true"
      />
    </div>
    <div
      v-else-if="currentBtnClicked === 2"
      class="col-md-9 col-lg-9 flex q-col-gutter-md"
    >
      <p class="q-mt-lg text-primary text-bold text-h5 q-mx-auto">
        {{ $t('dashboard.auctions.coming') }}
      </p>
    </div>
    <div
      v-else-if="currentBtnClicked === 3"
      class="col-md-9 col-lg-9 flex q-col-gutter-md"
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
          class="col-md-9 col-lg-9 q-mt-lg"
        >
          <div class="text-h6 text-primary text-center q-pb-md q-mt-lg">
            {{ $t('dashboard.homePage.noItemPublic') }}
          </div>
        </div>
      </div>
      <div
        v-else
      >
        <MyGallerySkeleton
          :buttons="false"
        />
      </div>
      <div
        class="q-mx-auto q-mb-md"
      >
        <q-btn
          v-for="(btn, index) in showingPageslike"
          :key="index"
          :color="currentPage === index + 1 ? 'primary' : 'grey-4'"
          :label="index + 1"
          class="q-mr-xs desktop-only"
          :loading="currentPage === index + 1 ? loadingLikes : false"
          @click="getLikes(index + 1, currentCollection.label)"
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
          @click="loadMoreLike(currentCollection.label)"
        />
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
import { IMyGallery } from 'src/models/IMyGallery';
import { ICollection } from 'src/models/ICollection';
import { IAxios, IAxiosPaginated } from 'src/models/IAxios';
import LatestBidsItemSkeleton from './LatestBidsItemSkeleton.vue';
import MyGallerySkeleton from './MyGallerySkeleton.vue';
import { Watch } from 'vue-property-decorator';

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

  // Filter
  currentCollection: string = 'All Collections';
  filteredGallery:IMyGallery[] = [];

  collectionFilter: unknown[] = [{ label: 'All Collections' }];
  getCollectionsLoading: boolean = true;

  imgData: IMyGallery[] = [];
  contImg: string = '';
  contLiked: string = '';
  contSale: string = '';

  // Gets all images in the background
  mounted() {
    // void this.getGalleryBidders();
    void this.getLikes(1, this.currentCollection);
    void this.getGalleryArts(1, this.currentCollection);
    void this.getCollections();
    // temporary until there's an API for onsale images
    const contSale: number = 0;
    this.contSale = `(${contSale})`;
  }

  // If the filter changes, the filter is also applied in the other tabs in the background
  @Watch('currentCollection')
  onCollectionChanged() {
    if (this.currentBtnClicked !== 1) {
      void this.getGalleryArts(1, this.currentCollection, true);
    } else {
      void this.getLikes(1, this.currentCollection, true);
    }
  }

  // Get all available collections and put in the filter dropdown
  async getCollections() {
    this.getCollectionsLoading = true;
    await this.$store.dispatch({
      type: 'collections/getAllCollections',
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const response = this.$store.getters['collections/GET_COLLECTIONS'] as IAxios;
      const collectionFilter = response.data;
      collectionFilter.forEach((item: ICollection) => {
        this.collectionFilter.push({ label: item.title });
      });
      this.getCollectionsLoading = false;
    });
  }

  // Filter's action after user chooses an option
  filterCollection(page: number = 1, currentCollection: string = 'All Collections') {
    // Updated the current collection to trigger the 'currentCollection' watcher
    this.currentCollection = currentCollection;
    // Checks if the user is on a desktop or mobile to call the apropriate function
    const device = (window.innerWidth <= 768) ? 'mobile' : 'desktop';

    if (device === 'desktop') {
      if (this.currentBtnClicked === 1) {
        void this.getGalleryArts(page, currentCollection);
      } else if (this.currentBtnClicked === 3) {
        void this.getLikes(page, currentCollection);
      }
    } else if (device === 'mobile') {
      this.loadMoreCounter = 0;
      this.loadMoreCounterLike = 0;
      this.noMoreImages = false;
      this.btnLoadMoreMsg = 'Load More';
      if (this.currentBtnClicked === 1) {
        void this.loadMore(currentCollection, true);
      } else if (this.currentBtnClicked === 3) {
        void this.loadMoreLike(currentCollection, true);
      }
    }
  }

  // Gets all items that the user possess on desktop -> pagination method
  async getGalleryArts(page:number = 1, collection:string = this.currentCollection, watcher:boolean = false) {
    this.loadingGalleryArts = true;
    this.currentPage = page;
    if (!watcher) {
      this.currentBtnClicked = 1;
    }
    await this.$store.dispatch({
      type: 'collections/getUserItems',
      account: this.$route.params.account,
      page: page,
      perPage: '9',
      collectionName: collection,
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const response = this.$store.getters['collections/GET_IMAGES'] as IAxiosPaginated;
      this.maxPage = response.pages;
      if (this.maxPage <= 15) {
        this.showingPages = this.maxPage;
      } else {
        this.showingPages = 15;
      }
      this.galleryArts = response.data as [];
      const contImg: number = response.count;
      this.contImg = ` (${contImg})`;

      if (this.galleryArts.length === 0) {
        this.nullGalleryArts = true;
      } else {
        this.nullGalleryArts = false;
      }
      this.loadingGalleryArtsButtons = false;
      this.loadingGalleryArts = false;
    });
  }

  // Gets all items liked by the user on desktop -> pagination method
  async getLikes(page:number = 1, collection:string = this.currentCollection, watcher:boolean = false) {
    this.loadingLikes = true;
    if (!watcher) {
      this.currentBtnClicked = 3;
    }
    this.currentPage = page;
    await this.$store.dispatch({
      type: 'user/getUserLikes',
      account: this.$route.params.account,
      page: page,
      perPage: '9',
      collectionName: collection,
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const response = this.$store.getters['user/GET_USER_LIKES'] as IAxiosPaginated;
      this.maxPage = response.pages;
      if (this.maxPage <= 15) {
        this.showingPageslike = this.maxPage;
      } else {
        this.showingPageslike = 15;
      }
      this.likesGallery = response.data as [];
      const contLiked: number = response.count;
      this.contLiked = `(${contLiked})`;
      if (this.likesGallery.length === 0) {
        this.nullTabLike = true;
      } else {
        this.nullTabLike = false;
      }
      this.loadingLikesButtons = false;
      this.loadingLikes = false;
    });
  }

  // Gets all items that the user possess on mobile -> load more method
  async loadMore(collection:string = this.currentCollection, filter: boolean = false) {
    if (filter) {
      this.loadingGalleryArts = true;
      this.galleryArts = [];
    }
    this.loadMoreCounter++;
    this.loadingBtn = true;
    await this.$store.dispatch({
      type: 'collections/getUserItems',
      account: this.$route.params.account,
      page: this.loadMoreCounter,
      perPage: '9',
      collectionName: collection,
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const response = this.$store.getters['collections/GET_IMAGES'] as IAxiosPaginated;
      const tempGalleryArts = response.data;
      if (tempGalleryArts.length === 0) {
        this.noMoreImages = true;
        this.btnLoadMoreMsg = 'Nothing else to show';
      } else {
        tempGalleryArts.forEach((item) => {
          this.galleryArts.push(item);
        });
      }
      this.loadingBtn = false;
      this.loadingGalleryArts = false;
    });
  }

  // Gets all items liked by the user on mobile -> load more method
  async loadMoreLike(collection:string = this.currentCollection, filter: boolean = false) {
    if (filter) {
      this.loadingLikes = true;
      this.likesGallery = [];
    }
    this.loadMoreCounterLike++;
    this.loadingBtn = true;
    await this.$store.dispatch({
      type: 'user/getUserLikes',
      account: this.$route.params.account,
      page: this.loadMoreCounterLike,
      perPage: '9',
      collectionName: collection,
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const response = this.$store.getters['user/GET_USER_LIKES'] as IAxiosPaginated;
      const contLiked: number = response.count;
      const likeMobile = response.data as [];
      this.contLiked = `(${contLiked})`;
      if (likeMobile.length === 0) {
        this.noMoreImages = true;
        this.btnLoadMoreMsg = 'Nothing else to show';
      } else {
        likeMobile.forEach((i) => {
          this.likesGallery.push(i);
        });
      }
      this.loadingBtn = false;
      this.loadingLikes = false;
    });
  }

  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  showGalleryArts() {
    this.currentBtnClicked = 1;
  }

  showOnSale() {
    this.currentBtnClicked = 2;
  }

  showLikes() {
    this.currentBtnClicked = 3;
  }

  /*
  Allbids() {
    this.btnBidsClicked = !this.btnBidsClicked;
    if (this.btnBidsClicked === false) {
      this.galleryBidShow = this.galleryBidClosed;
    } else {
      this.galleryBidShow = this.galleryBid;
    }
  }
  */

  /*
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
  */
}
</script>

<style lang="scss">

.btn-container {
  width: 100%;
  height: 80px;
  @media (max-width: $breakpoint-xs-max){
    height: 50%;
  }
}
.algo-button{
  @media (max-width: $breakpoint-xs-max){
    margin-bottom: 10px;
  }
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
