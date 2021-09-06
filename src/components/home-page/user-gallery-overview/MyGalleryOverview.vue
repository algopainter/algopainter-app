/* eslint-disable no-new-wrappers */
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
      @update:model-value="filterCollection(1, currentCollection.label, 'desktop')"
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
        <algo-button
          :label="$t('dashboard.homePage.pirs') + contPirs"
          outline
          class="algo-button q-px-md q-ml-sm"
          :color="currentBtnClicked === 4 ? 'primary' : 'grey-5' "
          @click="showPirs()"
        />
        <algo-button
          :label="$t('dashboard.homePage.bid') + contBid"
          outline
          class="algo-button q-px-md q-ml-sm"
          :color="currentBtnClicked === 5 ? 'primary' : 'grey-5' "
          @click="getBid()"
        />
      </div>
    </div>
  </div>
  <div
    class="row"
  >
    <div
      v-if="loadingGalleryArtsButtons === false && currentBtnClicked === 1"
      class=" col-md-9 col-lg-9 flex q-col-gutter-md"
    >
      <div v-if="loadingGalleryArts === false">
        <div
          v-if="nullGalleryArts === false"
          class="col-md-9 col-lg-9 flex q-col-gutter-md"
        >
          <div
            v-for="(item, index) in galleryArts"
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
          class="col-md-9 col-sm-12 col-lg-9 q-mt-lg"
        >
          <p class="text-h6 text-primary text-center q-pb-md text-noItems">
            {{ $t('dashboard.homePage.personalNoItems') }}
          </p>
        </div>
      </div>
      <div v-else>
        <MyGallerySkeleton
          :buttons="false"
        />
      </div>
      <div class=" q-mx-auto q-mb-md">
        <q-btn
          v-for="(btn, index) in showingPages"
          :key="index"
          :color="currentPage === index + 1 ? 'primary' : 'grey-4'"
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
      class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md"
    >
      <MyGallerySkeleton
        :buttons="true"
      />
    </div>
    <div
      v-if="currentBtnClicked === 2"
      class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md"
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
          class=" col-md-9 col-lg-9 flex q-col-gutter-md"
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
          class=" col-md-9 col-lg-9 q-mt-lg"
        >
          <div class="text-h6 text-primary text-center q-pb-md">
            {{ $t('dashboard.homePage.noItems') }}
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
      <div class=" q-mx-auto q-mb-md">
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
    <div
      v-else-if="currentBtnClicked === 4"
    >
      <div v-if="pirsConnected">
        <div
          v-if="havePirs === true"
          class="col-md-6 col-lg-6 flex q-col-gutter-md justify-between"
        >
          <div
            v-for="(item, index) in galleryArts"
            :key="index"
          >
            <div>
              <gallery-select
                :art="item"
                :select="currentBtnClicked"
                @favoriteClicked="favoriteClicked"
              />
            </div>
          </div>
        </div>
        <div
          v-else
          class="text-h6 text-primary text-center q-pb-md"
        >
          {{ $t('dashboard.homePage.personalNoPirs') }}
        </div>
      </div>
      <div
        v-else
      >
        <MyGallerySkeleton />
      </div>
      <div
        v-if="havePirs"
        class="q-mx-auto q-mb-md"
      >
        <q-btn
          v-for="(btn, index) in showingPagesPirs"
          :key="index"
          :color="currentPage === index + 1 ? 'primary' : 'grey-4'"
          :label="index + 1"
          class="q-mr-xs desktop-only"
          @click="getPirs(index + 1)"
        />
        <algo-button
          v-if="nullTabPirs === false"
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
    <div
      v-else-if="currentBtnClicked === 5"
    >
      <div v-if="bidConnect">
        <div
          v-if="haveBid"
          class="col-md-6 col-lg-6 flex q-col-gutter-md justify-between"
        >
          <div
            v-for="(item, index) in galleryArts"
            :key="index"
          >
            <div>
              <gallery-select
                :art="item"
                @favoriteClicked="favoriteClicked"
              />
            </div>
          </div>
        </div>
        <div
          v-else
          class="text-h6 text-primary text-center q-pb-md"
        >
          {{ $t('dashboard.homePage.personalNoBid') }}
        </div>
      </div>
      <div
        v-else
      >
        <MyGallerySkeleton />
      </div>
      <div
        v-if="havePirs"
        class="q-mx-auto q-mb-md"
      >
        <q-btn
          v-for="(btn, index) in showingPagesPirs"
          :key="index"
          :color="currentPage === index + 1 ? 'primary' : 'grey-4'"
          :label="index + 1"
          class="q-mr-xs desktop-only"
          @click="getPirs(index + 1)"
        />
        <algo-button
          v-if="nullTabPirs === false"
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
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import AlgoButton from 'components/common/Button.vue';
import { IMyGallery } from 'src/models/IMyGallery';
import { IAxios, IAxiosPaginated } from 'src/models/IAxios';
import { ICollection } from 'src/models/ICollection';
import GalleryItem from './GalleryItem.vue';
import GallerySelect from './GallerySelect.vue';
import LatestBidsItem from './LatestBidsItem.vue';
import LatestBidsItemSkeleton from './LatestBidsItemSkeleton.vue';
import MyGallerySkeleton from './MyGallerySkeleton.vue';

@Options({
  components: {
    AlgoButton,
    GalleryItem,
    GallerySelect,
    LatestBidsItem,
    LatestBidsItemSkeleton,
    MyGallerySkeleton,
  },
})
export default class MyGalleryOverview extends Vue {
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

  imgData: IMyGallery[] = [];
  contImg: string = '';
  contLiked: string = '';
  contSale: string = '';
  contPirs: string = '';

  pirsConnected: boolean = false;
  havePirs: boolean = true;
  pirs:boolean = false;
  showingPagesPirs: number = 8;
  nullTabPirs: boolean = false;

  // Buttons
  currentBtnClicked: number = 1;

  // Filter
  currentCollection: string = 'All Collections';
  filteredGallery:IMyGallery[] = [];

  collectionFilter: unknown[] = [{ label: 'All Collections' }];
  getCollectionsLoading: boolean = true;

  contBid: string = '';
  bidConnect: boolean = false;
  haveBid: boolean = false;

  // Gets all images in the background
  mounted() {
    void this.getLikes(1, 'All Collections');
    void this.getGalleryArts(1, 'All Collections');
    void this.getCollections();
    // temporary until there's an API for onsale images
    const contSale: number = 0;
    this.contSale = `(${contSale})`;
  }

  // Gets all images in the background if account changes and in mounted
  @Watch('accountAddress')
  onAccountChanged() {
    // void this.getGalleryBidders();
    void this.getLikes(1, 'All Collections');
    void this.getGalleryArts(1, 'All Collections');
    void this.getPirs();
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
      account: '0x7A8476832Eb89189F0aDbC183A1B70C447Bb311a',
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
      if (this.isConnected) {
        this.galleryArts = response.data as [];
        const contImg: number = response.count;
        this.contImg = ` (${contImg})`;
        if (this.galleryArts.length === 0) {
          this.nullGalleryArts = true;
        } else {
          this.nullGalleryArts = false;
        }
      }
      this.loadingGalleryArtsButtons = false;
      this.loadingGalleryArts = false;
    });
  }

  getOnSale() {
    console.log('Coming soon');
    this.currentBtnClicked = 2;
    const contSale: number = 0;
    this.contSale = ` (${contSale})`;
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
      account: this.accountAddress,
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
        this.showingPages = 15;
      }
      if (this.isConnected) {
        this.likesGallery = response.data;
        const contLiked: number = response.count;
        this.contLiked = ` (${contLiked})`;
        if (this.likesGallery.length === 0) {
          this.nullTabLike = true;
        } else {
          this.nullTabLike = false;
        }
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
      account: this.accountAddress,
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
      account: this.accountAddress,
      page: this.loadMoreCounterLike,
      perPage: '9',
      collectionName: collection,
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const response = this.$store.getters['user/GET_USER_LIKES'] as IAxiosPaginated;
      const likeMobile = response.data;
      if (likeMobile.length === 0) {
        this.noMoreImages = true;
        this.btnLoadMoreMsg = 'Nothing else to show';
      } else {
        likeMobile.forEach((i) => {
          this.likesGallery.push(i);
        });
      }
    });
  }

  getPirs(page:number = 1) {
    this.currentPage = page;
    try {
      this.contPirs = '0';
      this.contPirs = ` (${this.contPirs})`;
      this.pirsConnected = true;
      this.pirs = true;
    } catch (error) {

    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return null;
    }
  }

  getBid() {
    this.currentBtnClicked = 5;
    try {
      this.contBid = '0';
      this.contBid = ` (${this.contBid})`;
      this.bidConnect = true;
      this.haveBid = true;
    } catch (error) {

    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return null;
    }
  }

  // Checks if the user is connected
  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/isConnected'] as boolean;
  }

  // Gets the user account
  get accountAddress() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/account'] as string;
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

  showPirs() {
    this.currentBtnClicked = 4;
  }

  /*
  async getGalleryBidders() {
    this.loadingGalleryBid = true;
    try {
      if (this.isConnected) {
        const response = await api.get(`bids?bidder=${this.accountAddress}`);
        this.galleryBid = response.data as [];
        if (this.galleryBid.length !== 0) {
          this.galleryBidClosed = [
            this.galleryBid[0],
            this.galleryBid[1],
            this.galleryBid[2],
          ];
          this.nullGalleryBidShow = false;
        } else {
          this.nullGalleryBidShow = true;
        }
        this.galleryBidShow = this.galleryBidClosed;
      }
    } catch (e) {
      console.log('error', e);
    } finally {
      this.loadingGalleryBid = false;
      this.loadingLatestBidsItem = false;
    }
  }
  */

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
}
</script>

<style lang="scss">
.border {
  border: 2px dashed $primary;
  border-radius: 20px;
  max-height: 150px;
}

body.screen--md, .screen--lg, .screen--xl {
  .latest-bids{
    margin-left: 16px;
  }
}

body.screen--sm, .screen--xs {
  .text-gallery{
    margin-top: -15px;
    margin-right: -20px;
  }
  .latest-bids{
    margin-left: 0;
  }
  .text-noItems{
    align-items: center;
    width: 100%;
    margin: 0;
  }
  .btn-container{
    height: 50%;
  }
  .algo-button{
    margin-bottom: 10px;
  }
}

</style>
