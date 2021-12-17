/* eslint-disable no-new-wrappers */
<template>
  <div class="btn-container q-mx-auto row items-center justify-center">
    <q-select
      v-model="currentCollection"
      :disable="currentBtnClicked === 4 || currentBtnClicked === 5"
      :options="collectionFilter"
      color="primary"
      :loading="getCollectionsLoading"
      rounded
      outlined
      bottom-slots
      @update:model-value="filterCollection(1, currentCollection.label)"
    >
      <template #before>
        <q-icon name="filter_list" color="primary" />
      </template>
    </q-select>
    <div class="q-mx-auto row items-center justify-center">
      <div class="btn-container q-mx-auto flex justify-center items-center">
        <algo-button
          v-for="(btn, index) in galleryTabs"
          :key="index"
          :label="$t(`dashboard.gallery.navigator.${btn.label}`) + btn.contLabel"
          outline
          class="algo-button q-px-md q-ml-sm"
          :color="currentBtnClicked === btn.btnIndex ? 'primary' : 'grey-5'"
          @click="btnClickHandler(index)"
        />
      </div>
    </div>
  </div>
  <div class="row justify-center">
    <div
      v-if="
        !galleryTabs[0].loadingButtons &&
        currentBtnClicked === galleryTabs[0].btnIndex
      "
      class="col-12 flex q-col-gutter-md justify-center"
    >
      <div v-if="!galleryTabs[0].loadingData">
        <div
          v-if="!galleryTabs[0].noData"
          class="col-12 flex q-col-gutter-md justify-center"
        >
          <div v-for="(item, index) in galleryTabs[0].data" :key="index">
            <div>
              <gallery-item
                :art="item"
                :btn-name="'dashboard.gallery.btnName.btnView'"
                @favoriteClicked="favoriteClicked"
              />
            </div>
          </div>
        </div>
        <div v-else class="col-12 q-mt-lg justify-center">
          <p class="text-h6 text-primary text-center q-pb-md text-noItems">
            {{ $t('dashboard.gallery.noItemsPersonal.galleryMsg') }}
          </p>
        </div>
      </div>
      <div v-else>
        <MyGallerySkeleton :buttons="false" />
      </div>
      <div
        v-if="galleryTabs[0].cont > maxItemsPerPage"
        class="q-mx-auto q-mb-md"
      >
        <q-btn
          v-for="index in galleryTabs[0].maxPages"
          :key="index"
          :color="
            galleryTabs[0].currentPage === index + 1 ? 'primary' : 'grey-4'
          "
          :label="index + 1"
          class="q-mr-xs desktop-only"
          :loading="
            galleryTabs[0].currentPage === index + 1
              ? galleryTabs[0].loadingData
              : false
          "
          @click="getGalleryArts(index + 1, currentCollection.label)"
        />
        <algo-button
          v-if="!galleryTabs[0].noData"
          :label="
            $t('dashboard.gallery.btnName.goToAuction', {
              msg: btnLoadMoreMsg,
            })
          "
          color="primary"
          outline
          class="load-more q-px-xl q-mx-auto mobile-only"
          :disable="noMoreImages"
          :loading="loadMoreBtn"
          @click="loadMore(currentCollection.label)"
        />
      </div>
    </div>
    <div
      v-else-if="currentBtnClicked === galleryTabs[0].btnIndex"
      class="col-12 flex q-col-gutter-md justify-center"
    >
      <MyGallerySkeleton :buttons="true" />
    </div>
    <div
      v-else-if="currentBtnClicked === galleryTabs[1].btnIndex"
      class="col-12 flex q-col-gutter-md justify-center"
    >
      <div v-if="!galleryTabs[1].loadingData">
        <div
          v-if="!galleryTabs[1].noData"
          class="col-12 flex q-col-gutter-md justify-center"
        >
          <div v-for="(item, index) in galleryTabs[1].data" :key="index">
            <div>
              <onsale-item
                :art="item"
                :btn-name="'dashboard.gallery.btnName.goToAuction'"
                @favoriteClicked="favoriteClicked"
              />
            </div>
          </div>
        </div>
        <div v-else class="col-12 q-mt-lg">
          <div class="text-h6 text-primary text-center q-pb-md">
            {{ $t('dashboard.gallery.noItemsPersonal.onSaleMsg1') }}
          </div>
          <div class="text-h9 text-primary text-center q-pb-md">
            {{ $t('dashboard.gallery.noItemsPersonal.onSaleMsg2') }}
          </div>
        </div>
      </div>
      <div v-else>
        <MyGallerySkeleton :buttons="false" />
      </div>
      <div
        v-if="galleryTabs[1].cont > maxItemsPerPage"
        class="q-mx-auto q-mb-md"
      >
        <q-btn
          v-for="index in galleryTabs[1].maxPages"
          :key="index"
          :color="
            galleryTabs[1].currentPage === index + 1 ? 'primary' : 'grey-4'
          "
          :label="index + 1"
          class="q-mr-xs desktop-only"
          :loading="
            galleryTabs[1].currentPage === index + 1
              ? galleryTabs[1].loadingData
              : false
          "
          @click="getOnSale(index + 1, currentCollection.label)"
        />
        <algo-button
          v-if="!galleryTabs[1].noData"
          :label="
            $t('dashboard.gallery.loadMore', {
              msg: btnLoadMoreMsg,
            })
          "
          color="primary"
          outline
          class="load-more q-px-xl q-mx-auto mobile-only"
          :disable="noMoreImages"
          :loading="loadMoreBtn"
          @click="loadMoreOnSale(currentCollection.label)"
        />
      </div>
    </div>
    <div
      v-else-if="currentBtnClicked === galleryTabs[2].btnIndex"
      class="col-12 flex q-col-gutter-md justify-center"
    >
      <div v-if="!galleryTabs[2].loadingData">
        <div
          v-if="!galleryTabs[2].noData"
          class="col-12 flex q-col-gutter-md justify-center"
        >
          <div v-for="(item, index) in galleryTabs[2].data" :key="index">
            <div>
              <gallery-item :art="item" @favoriteClicked="favoriteClicked" />
            </div>
          </div>
        </div>
        <div v-else class="col-12 q-mt-lg justify-center">
          <div class="text-h6 text-primary text-center q-pb-md">
            {{ $t('dashboard.gallery.noItemsPersonal.likedMsg') }}
          </div>
        </div>
      </div>
      <div v-else>
        <MyGallerySkeleton :buttons="false" />
      </div>
      <div
        v-if="galleryTabs[2].cont > maxItemsPerPage"
        class="q-mx-auto q-mb-md"
      >
        <q-btn
          v-for="index in galleryTabs[2].maxPages"
          :key="index"
          :color="
            galleryTabs[2].currentPage === index + 1 ? 'primary' : 'grey-4'
          "
          :label="index + 1"
          class="q-mr-xs desktop-only"
          :loading="
            galleryTabs[2].currentPage === index + 1
              ? galleryTabs[2].loadingData
              : false
          "
          @click="getLikes(index + 1, currentCollection.label)"
        />
        <algo-button
          v-if="!galleryTabs[2].noData"
          :label="
            $t('dashboard.gallery.loadMore', {
              msg: btnLoadMoreMsg,
            })
          "
          color="primary"
          outline
          class="load-more q-px-xl q-mx-auto mobile-only"
          :disable="noMoreImages"
          :loading="loadMoreBtn"
          @click="loadMoreLike(currentCollection.label)"
        />
      </div>
    </div>
    <div v-else-if="currentBtnClicked === galleryTabs[3].btnIndex" class="col">
      <div v-if="!galleryTabs[3].loadingData">
        <div v-if="!galleryTabs[3].noData" class="col">
          <div
            v-for="(item, index) in galleryTabs[3].data"
            :key="index"
            class="q-mx-lg galleries-spacing"
          >
            <pirs-item
              :art="item"
              :btn-name="'dashboard.gallery.btnName.stakeAlgop'"
              @favoriteClicked="favoriteClicked"
            />
          </div>
        </div>
        <div v-else class="text-h6 text-primary text-center q-pb-md">
          {{ $t('dashboard.gallery.noItemsPersonal.pirsMsg') }}
        </div>
      </div>
      <div v-else>
        <MyGallerySkeleton />
      </div>
      <div
        v-if="galleryTabs[3].cont > maxItemsPerPage"
        class="row flex justify-center q-mt-md q-mb-md q-mb-md"
      >
        <q-btn
          v-for="index in galleryTabs[3].maxPages"
          :key="index"
          :color="
            galleryTabs[3].currentPage === index + 1 ? 'primary' : 'grey-4'
          "
          :label="index + 1"
          class="q-mr-xs desktop-only"
          :loading="
            galleryTabs[3].currentPage === index + 1
              ? galleryTabs[3].loadingData
              : false
          "
          @click="getPirs(index + 1)"
        />
        <algo-button
          v-if="!galleryTabs[3].noData"
          :label="
            $t('dashboard.gallery.loadMore', {
              msg: btnLoadMoreMsg,
            })
          "
          color="primary"
          outline
          class="load-more q-px-xl q-mx-auto mobile-only"
          :disable="noMoreImages"
          :loading="loadMoreBtn"
          @click="loadMorePirs()"
        />
      </div>
    </div>
    <div v-else-if="currentBtnClicked === galleryTabs[4].btnIndex" class="col">
      <div v-if="!galleryTabs[4].loadingData">
        <div v-if="!galleryTabs[4].noData" class="col">
          <div
            v-for="(item, index) in galleryTabs[4].data"
            :key="index"
            class="q-mx-lg galleries-spacing"
          >
            <gallery-select
              :art="item"
              :btn-name="'dashboard.gallery.btnName.stakeAlgop'"
              @favoriteClicked="favoriteClicked"
            />
          </div>
        </div>
        <div v-else class="text-h6 text-primary text-center q-pb-md">
          {{ $t('dashboard.gallery.noItemsPersonal.bidBackMsg') }}
        </div>
      </div>
      <div v-else>
        <MyGallerySkeleton />
      </div>
      <div
        v-if="galleryTabs[4].cont > maxItemsPerPage"
        class="row flex justify-center q-mt-md q-mb-md q-mb-md"
      >
        <q-btn
          v-for="index in galleryTabs[4].maxPages"
          :key="index"
          :color="
            galleryTabs[4].currentPage === index + 1 ? 'primary' : 'grey-4'
          "
          :label="index + 1"
          class="q-mr-xs desktop-only"
          :loading="
            galleryTabs[4].currentPage === index + 1
              ? galleryTabs[4].loadingData
              : false
          "
          @click="getBidBack(index + 1)"
        />
        <algo-button
          v-if="!galleryTabs[3].noData"
          :label="
            $t('dashboard.gallery.loadMore', {
              msg: btnLoadMoreMsg,
            })
          "
          color="primary"
          outline
          class="load-more q-px-xl q-mx-auto mobile-only"
          :disable="noMoreImages"
          :loading="loadMoreBtn"
          @click="loadMoreBidBack()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import AlgoButton from 'components/common/Button.vue';
import IGalleryTab from 'src/models/IGalleryTab';
import { IAxios, IAxiosPaginated } from 'src/models/IAxios';
import { ICollection } from 'src/models/ICollection';
import GalleryItem from './GalleryItem.vue';
import LatestBidsItem from './LatestBidsItem.vue';
import GallerySelect from './GallerySelect.vue';
import OnsaleItem from './OnsaleItem.vue';
import LatestBidsItemSkeleton from './LatestBidsItemSkeleton.vue';
import MyGallerySkeleton from './MyGallerySkeleton.vue';
import PirsItem from './PirsItem.vue';
import { mapGetters } from 'vuex';

enum GalleryTabsEnum {
  GalleryTab,
  OnSaleTab,
  LikedTab,
  PirsTab,
  BidBackTab,
}

@Options({
  components: {
    AlgoButton,
    GalleryItem,
    LatestBidsItem,
    LatestBidsItemSkeleton,
    MyGallerySkeleton,
    GallerySelect,
    PirsItem,
    OnsaleItem,
  },
  computed: {
    ...mapGetters('collections', {
      pirsTabData: 'pirsTabImages',
      onSaleTabData: 'GET_USER_ON_SALE',
      galleryTabData: 'GET_IMAGES',
      filterCollectionOptions: 'GET_COLLECTIONS',
    }),
    ...mapGetters('auctions', {
      bidBackTabData: 'getBidBack',
    }),
    ...mapGetters('user', {
      userAccount: 'account',
      networkInfo: 'networkInfo',
      isConnected: 'isConnected',
      likedTabData: 'GET_USER_LIKES',
    }),
  },
})
export default class MyGalleryOverview extends Vue {
  isConnected?: boolean;
  userAccount?: string;
  galleryTabData!: IAxiosPaginated;
  onSaleTabData!: IAxiosPaginated;
  likedTabData!: IAxiosPaginated;
  pirsTabData!: IAxiosPaginated;
  bidBackTabData!: IAxiosPaginated;
  filterCollectionOptions!: IAxios;

  galleryTabsEnum: GalleryTabsEnum = GalleryTabsEnum.GalleryTab;
  currentBtnClicked: number = 1;

  loadMoreBtn: boolean = false;
  btnLoadMoreMsg: string = 'Load More';
  loadMoreCounter: number = 1;
  loadMoreCounterOnSale: number = 1;
  loadMoreCounterLike: number = 1;
  loadMoreCounterPirs: number = 1;
  loadMoreCounterBidBack: number = 1;
  noMoreImages: boolean = false;
  maxItemsPerPage: number = 9;

  currentCollection: { label: string } = { label: 'All Collections' };
  collectionFilter: unknown[] = [{ label: 'All Collections' }];
  getCollectionsLoading: boolean = true;

  galleryTabs: IGalleryTab[] = [
    {
      label: 'galleryBtn',
      cont: 0,
      contLabel: '',
      btnIndex: 1,
      maxPages: 0,
      currentPage: 0,
      loadingData: true,
      loadingButtons: true,
      data: [],
      noData: false,
      reloadInterval: 0,
    },
    {
      label: 'onSaleBtn',
      cont: 0,
      contLabel: '',
      btnIndex: 2,
      maxPages: 0,
      currentPage: 0,
      loadingData: true,
      data: [],
      noData: false,
      reloadInterval: 0,
    },
    {
      label: 'likedBtn',
      cont: 0,
      contLabel: '',
      btnIndex: 3,
      maxPages: 0,
      currentPage: 0,
      loadingData: true,
      data: [],
      noData: false,
      reloadInterval: 0,
    },
    {
      label: 'pirsBtn',
      cont: 0,
      contLabel: '',
      btnIndex: 4,
      maxPages: 0,
      currentPage: 0,
      loadingData: true,
      data: [],
      noData: false,
      reloadInterval: 0,
    },
    {
      label: 'bidBackBtn',
      cont: 0,
      contLabel: '',
      btnIndex: 5,
      maxPages: 0,
      currentPage: 0,
      loadingData: true,
      data: [],
      noData: false,
      reloadInterval: 0,
    },
  ];

  @Watch('galleryTabsEnum')
  onGalleryTabsEnumChanged() {
    this.galleryTabs.forEach((tab) => {
      clearInterval(tab.reloadInterval as number);
    });
    switch (this.galleryTabsEnum) {
      case GalleryTabsEnum.GalleryTab:
        this.galleryTabs[0].reloadInterval = setInterval(() => {
          this.getGalleryArts(
            1,
            this.currentCollection.label,
            false,
            true
          ).catch(console.error);
        }, 5000);
        break;
      case GalleryTabsEnum.OnSaleTab:
        this.galleryTabs[1].reloadInterval = setInterval(() => {
          this.getOnSale(1, this.currentCollection.label, false, true).catch(
            console.error
          );
        }, 5000);
        break;
      case GalleryTabsEnum.LikedTab:
        this.galleryTabs[2].reloadInterval = setInterval(() => {
          this.getLikes(1, this.currentCollection.label, false, true).catch(
            console.error
          );
        }, 5000);
        break;
      case GalleryTabsEnum.PirsTab:
        this.galleryTabs[3].reloadInterval = setInterval(() => {
          this.getPirs(1, true);
        }, 5000);
        break;
      case GalleryTabsEnum.BidBackTab:
        this.galleryTabs[4].reloadInterval = setInterval(() => {
          this.getBidBack(1, true);
        }, 5000);
    }
  }

  mounted() {
    this.getCollections().catch(console.error);
    this.getOnSale(1, 'All Collections').catch(console.error);
    this.getLikes(1, 'All Collections').catch(console.error);
    this.getPirs(1);
    this.getBidBack(1);
    this.getGalleryArts(1, 'All Collections').catch(console.error);
    this.setCurrentBtnClicked();
  }

  unmounted() {
    this.galleryTabs.forEach((tab) => {
      clearInterval(tab.reloadInterval as number);
    });
  }

  setCurrentBtnClicked() {
    switch (this.$route.params.btn) {
      case 'Pirs':
        this.getPirs(1);
        break;
      case 'BidBack':
        this.getBidBack(1);
        break;
      default:
        this.galleryTabs[0].reloadInterval = setInterval(() => {
          this.getGalleryArts(1, this.currentCollection.label, false, true).catch(
            console.error
          );
        }, 5000);
    }
  }

  @Watch('userAccount')
  onAccountChanged() {
    this.getGalleryArts(1, 'All Collections').catch(console.error);
    this.getLikes(1, 'All Collections').catch(console.error);
    this.getOnSale(1, 'All Collections').catch(console.error);
    this.getPirs(1);
    this.getBidBack(1);
  }

  @Watch('currentCollection')
  onCollectionChanged() {
    if (this.currentBtnClicked !== 1) {
      this.getGalleryArts(1, this.currentCollection.label, true).catch(
        console.error
      );
    }
    if (this.currentBtnClicked !== 2) {
      this.getOnSale(1, this.currentCollection.label, true).catch(
        console.error
      );
    }
    if (this.currentBtnClicked !== 3) {
      this.getLikes(1, this.currentCollection.label, true).catch(console.error);
    }
  }

  btnClickHandler(index: number) {
    this.currentBtnClicked = index + 1;
    this.galleryTabsEnum = index;
    this.noMoreImages = false;
    this.btnLoadMoreMsg = 'Load More';
  }

  async getCollections() {
    this.getCollectionsLoading = true;

    await this.$store
      .dispatch({
        type: 'collections/getAllCollections',
      })
      .then(() => {
        const collectionFilter = this.filterCollectionOptions.data;

        collectionFilter.forEach((item: ICollection) => {
          this.collectionFilter.push({ label: item.title });
        });

        this.getCollectionsLoading = false;
      });
  }

  filterCollection(
    page: number = 1,
    currentCollection: string = 'All Collections'
  ) {
    this.currentCollection.label = currentCollection;
    const device = window.innerWidth <= 768 ? 'mobile' : 'desktop';
    if (device === 'desktop') {
      if (this.currentBtnClicked === this.galleryTabs[0].btnIndex) {
        this.getGalleryArts(page, currentCollection).catch(console.error);
      } else if (this.currentBtnClicked === this.galleryTabs[1].btnIndex) {
        this.getOnSale(page, currentCollection).catch(console.error);
      } else if (this.currentBtnClicked === this.galleryTabs[2].btnIndex) {
        this.getLikes(page, currentCollection).catch(console.error);
      }
    } else if (device === 'mobile') {
      this.loadMoreCounter = 0;
      this.loadMoreCounterOnSale = 0;
      this.loadMoreCounterLike = 0;
      this.noMoreImages = false;
      this.galleryTabs[0].noData = false;
      this.galleryTabs[1].noData = false;
      this.galleryTabs[2].noData = false;
      this.galleryTabs[3].noData = false;
      this.galleryTabs[4].noData = false;
      this.btnLoadMoreMsg = 'Load More';
      if (this.currentBtnClicked === this.galleryTabs[0].btnIndex) {
        this.loadMore(currentCollection, true).catch(console.error);
      } else if (this.currentBtnClicked === this.galleryTabs[1].btnIndex) {
        this.loadMoreOnSale(currentCollection, true).catch(console.error);
      } else if (this.currentBtnClicked === this.galleryTabs[2].btnIndex) {
        this.loadMoreLike(currentCollection, true).catch(console.error);
      }
    }
  }

  async getGalleryArts(
    page: number = 1,
    collection: string = this.currentCollection.label,
    watcher: boolean = false,
    isRefresh: boolean = false
  ) {
    this.galleryTabs[0].loadingData = !isRefresh;
    this.galleryTabs[0].currentPage = page;
    if (!watcher) {
      this.currentBtnClicked = 1;
      this.galleryTabsEnum = GalleryTabsEnum.GalleryTab;
    }
    await this.$store
      .dispatch({
        type: 'collections/getUserItems',
        account: this.userAccount,
        page: page,
        perPage: this.maxItemsPerPage,
        collectionName: collection,
      })
      .then(() => {
        if (this.isConnected) {
          this.galleryTabs[0].data = this.galleryTabData.data as [];
          this.galleryTabs[0].cont = this.galleryTabData.count;
          this.galleryTabs[0].contLabel = ` (${this.galleryTabData.count})`;
          this.galleryTabs[0].maxPages = this.galleryTabData.pages;
          this.galleryTabs[0].noData = this.galleryTabs[0].data.length === 0;
        }
        this.galleryTabs[0].loadingButtons = false;
        this.galleryTabs[0].loadingData = false;
      });
  }

  async getOnSale(
    page: number = 1,
    collection: string = this.currentCollection.label,
    watcher: boolean = false,
    isRefresh: boolean = false
  ) {
    this.galleryTabs[1].loadingData = !isRefresh;
    this.galleryTabs[1].currentPage = page;
    if (!watcher) {
      this.currentBtnClicked = 2;
      this.galleryTabsEnum = GalleryTabsEnum.OnSaleTab;
    }
    await this.$store
      .dispatch({
        type: 'collections/getUserOnSale',
        account: this.userAccount,
        page: page,
        perPage: this.maxItemsPerPage,
        collectionName: collection,
      })
      .then(() => {
        if (this.isConnected) {
          this.galleryTabs[1].data = this.onSaleTabData.data;
          this.galleryTabs[1].cont = this.onSaleTabData.count;
          this.galleryTabs[1].contLabel = ` (${this.onSaleTabData.count})`;
          this.galleryTabs[1].maxPages = this.onSaleTabData.pages;
          this.galleryTabs[1].noData = this.galleryTabs[1].data.length === 0;
        }
        this.galleryTabs[1].loadingData = false;
      });
  }

  async getLikes(
    page: number = 1,
    collection: string = this.currentCollection.label,
    watcher: boolean = false,
    isRefresh: boolean = false
  ) {
    this.galleryTabs[2].loadingData = !isRefresh;
    this.galleryTabs[2].currentPage = page;
    if (!watcher) {
      this.currentBtnClicked = 3;
      this.galleryTabsEnum = GalleryTabsEnum.LikedTab;
    }
    await this.$store
      .dispatch({
        type: 'user/getUserLikes',
        account: this.userAccount,
        page: page,
        perPage: this.maxItemsPerPage,
        collectionName: collection,
      })
      .then(() => {
        if (this.isConnected) {
          this.galleryTabs[2].data = this.likedTabData.data;
          this.galleryTabs[2].cont = this.likedTabData.count;
          this.galleryTabs[2].contLabel = ` (${this.likedTabData.count})`;
          this.galleryTabs[2].maxPages = this.likedTabData.pages;
          this.galleryTabs[2].noData = this.galleryTabs[2].data.length === 0;
        }
        this.galleryTabs[2].loadingData = false;
      });
  }

  getPirs(
    page: number = 1,
    isRefresh: boolean = false,
  ) {
    this.galleryTabs[3].loadingData = !isRefresh;
    this.galleryTabs[3].currentPage = page;

    this.currentBtnClicked = 4;
    this.galleryTabsEnum = GalleryTabsEnum.PirsTab;

    this.$store
      .dispatch({
        type: 'collections/getUserPirsTabImages',
        account: this.userAccount,
        page: page,
        perPage: this.maxItemsPerPage,
      })
      .then(() => {
        if (this.isConnected) {
          this.galleryTabs[3].data = this.pirsTabData.data;
          this.galleryTabs[3].cont =
          this.pirsTabData.count > 0 ? this.pirsTabData.count : 0;
          this.galleryTabs[3].contLabel = ` (${this.galleryTabs[3].cont})`;
          this.galleryTabs[3].maxPages = this.pirsTabData.pages;
          this.galleryTabs[3].noData = this.galleryTabs[3].data.length === 0;
        }

        this.galleryTabs[3].loadingData = false;
      })
      .catch(console.error);
  }

  getBidBack(
    page: number = 1,
    isRefresh: boolean = false,
  ) {
    this.galleryTabs[4].loadingData = !isRefresh;
    this.galleryTabs[4].currentPage = page;
    this.currentBtnClicked = 5;
    this.galleryTabsEnum = GalleryTabsEnum.BidBackTab;
    this.$store
      .dispatch({
        type: 'auctions/getBidBack',
        account: this.userAccount,
        page: page,
        perPage: this.maxItemsPerPage,
      })
      .then(() => {
        if (this.isConnected) {
          this.galleryTabs[4].data = this.bidBackTabData.data;
          this.galleryTabs[4].cont = this.bidBackTabData.count > 0 ? this.bidBackTabData.count : 0;
          this.galleryTabs[4].contLabel = ` (${this.galleryTabs[4].cont})`;
          this.galleryTabs[4].maxPages = this.bidBackTabData.pages;
          this.galleryTabs[4].noData = this.galleryTabs[4].data.length === 0;
        }
        this.galleryTabs[4].loadingData = false;
      })
      .catch(console.error);
  }

  async loadMore(
    collection: string = this.currentCollection.label,
    filter: boolean = false
  ) {
    if (filter) {
      this.galleryTabs[0].loadingData = true;
      this.galleryTabs[0].data = [];
    }
    this.loadMoreCounter++;
    this.loadMoreBtn = true;
    await this.$store
      .dispatch({
        type: 'collections/getUserItems',
        account: this.userAccount,
        page: this.loadMoreCounter,
        perPage: this.maxItemsPerPage,
        collectionName: collection,
      })
      .then(() => {
        const tempGalleryArts = this.galleryTabData.data;
        this.galleryTabs[0].cont = this.galleryTabData.count;
        this.galleryTabs[0].contLabel = ` (${this.galleryTabData.count})`;
        if (tempGalleryArts.length === 0) {
          this.btnLoadMoreMsg = 'Nothing else to show';
          this.noMoreImages = true;
          this.galleryTabs[0].noData = this.galleryTabs[0].data.length === 0;
        } else {
          tempGalleryArts.forEach((item) => {
            this.galleryTabs[0].data.push(item);
          });
        }
        this.loadMoreBtn = false;
        this.galleryTabs[0].loadingData = false;
      });
  }

  async loadMoreOnSale(
    collection: string = this.currentCollection.label,
    filter: boolean = false
  ) {
    if (filter) {
      this.galleryTabs[1].loadingData = true;
      this.galleryTabs[1].data = [];
    }
    this.loadMoreCounterOnSale++;
    this.loadMoreBtn = true;
    await this.$store
      .dispatch({
        type: 'collections/getUserOnSale',
        account: this.userAccount,
        page: this.loadMoreCounterOnSale,
        perPage: this.maxItemsPerPage,
        collectionName: collection,
      })
      .then(() => {
        const onSaleMobile = this.onSaleTabData.data;
        this.galleryTabs[1].cont = this.onSaleTabData.count;
        this.galleryTabs[1].contLabel = ` (${this.onSaleTabData.count})`;
        if (onSaleMobile.length === 0) {
          this.btnLoadMoreMsg = 'Nothing else to show';
          this.noMoreImages = true;
          this.galleryTabs[1].noData = this.galleryTabs[1].data.length === 0;
        } else {
          onSaleMobile.forEach((i) => {
            this.galleryTabs[1].data.push(i);
          });
        }
        this.loadMoreBtn = false;
        this.galleryTabs[1].loadingData = false;
      });
  }

  async loadMoreLike(
    collection: string = this.currentCollection.label,
    filter: boolean = false
  ) {
    if (filter) {
      this.galleryTabs[2].loadingData = true;
      this.galleryTabs[2].data = [];
    }
    this.loadMoreCounterLike++;
    this.loadMoreBtn = true;
    await this.$store
      .dispatch({
        type: 'user/getUserLikes',
        account: this.userAccount,
        page: this.loadMoreCounterLike,
        perPage: this.maxItemsPerPage,
        collectionName: collection,
      })
      .then(() => {
        const likeMobile = this.likedTabData.data;
        this.galleryTabs[2].cont = this.likedTabData.count;
        this.galleryTabs[2].contLabel = ` (${this.likedTabData.count})`;
        if (likeMobile.length === 0) {
          this.btnLoadMoreMsg = 'Nothing else to show';
          this.noMoreImages = true;
          this.galleryTabs[2].noData = this.galleryTabs[2].data.length === 0;
        } else {
          likeMobile.forEach((i) => {
            this.galleryTabs[2].data.push(i);
          });
        }
        this.loadMoreBtn = false;
        this.galleryTabs[2].loadingData = false;
      });
  }

  async loadMorePirs() {
    this.loadMoreCounterPirs++;
    this.loadMoreBtn = true;

    await this.$store
      .dispatch({
        type: 'collections/getUserPirsTabImages',
        account: this.userAccount,
        page: this.loadMoreCounterPirs,
        perPage: this.maxItemsPerPage,
      })
      .then(() => {
        this.galleryTabs[3].cont = this.pirsTabData.count;
        this.galleryTabs[3].contLabel = ` (${this.pirsTabData.count})`;

        if (this.pirsTabData.data.length === 0) {
          this.btnLoadMoreMsg = 'Nothing else to show';
          this.noMoreImages = true;
          this.galleryTabs[3].noData = this.galleryTabs[3].data.length === 0;
        } else {
          this.pirsTabData.data.forEach((i) => {
            this.galleryTabs[3].data.push(i);
          });
        }
        this.loadMoreBtn = false;

        this.galleryTabs[3].loadingData = false;
      });
  }

  async loadMoreBidBack() {
    this.loadMoreCounterBidBack++;
    this.loadMoreBtn = true;
    await this.$store
      .dispatch({
        type: 'auctions/getBidBack',
        account: this.userAccount,
        page: this.loadMoreCounterBidBack,
        perPage: this.maxItemsPerPage,
      })
      .then(() => {
        const likeMobile = this.bidBackTabData.data;
        this.galleryTabs[4].cont = this.bidBackTabData.count;
        this.galleryTabs[4].contLabel = ` (${this.bidBackTabData.count})`;
        if (likeMobile.length === 0) {
          this.btnLoadMoreMsg = 'Nothing else to show';
          this.noMoreImages = true;
          this.galleryTabs[4].noData = this.galleryTabs[4].data.length === 0;
        } else {
          likeMobile.forEach((i) => {
            this.galleryTabs[4].data.push(i);
          });
        }
        this.loadMoreBtn = false;
        this.galleryTabs[4].loadingData = false;
      });
  }

  favoriteClicked() {
    this.$emit('favoriteClicked');
  }
}
</script>

<style lang="scss">
.border {
  border: 2px dashed $primary;
  border-radius: 20px;
  max-height: 150px;
}
body.screen--md,
.screen--lg,
.screen--xl {
  .latest-bids {
    margin-left: 16px;
  }
}
body.screen--sm,
.screen--xs {
  .text-gallery {
    margin-top: -15px;
    margin-right: -20px;
  }
  .latest-bids {
    margin-left: 0;
  }
  .text-noItems {
    align-items: center;
    width: 100%;
    margin: 0;
  }
  .btn-container {
    height: 50%;
  }
  .btn-container > button {
    min-width: 112px;
  }
  .algo-button {
    margin-bottom: 10px;
  }
}
.galleries-spacing {
  margin-top: 48px;
}
</style>
