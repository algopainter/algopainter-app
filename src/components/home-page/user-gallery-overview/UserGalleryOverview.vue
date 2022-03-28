<template>
  <div class="btn-container q-mx-auto row items-center justify-center">
    <q-select
      v-model="currentCollection"
      :options="collectionFilter"
      color="primary"
      :loading="getCollectionsLoading"
      rounded
      outlined
      bottom-slots
      @update:model-value="filterCollection(1, currentCollection)"
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
          v-for="(btn, index) in galleryTabs"
          :key="index"
          :label="$t(`dashboard.gallery.navigator.${btn.label}`) + btn.contLabel"
          outline
          class="algo-button q-px-md q-ml-sm"
          :color="currentBtnClicked === btn.btnIndex ? 'primary' : 'grey-5'"
          @click="btnClickHandler(index + 1)"
        />
      </div>
    </div>
  </div>
  <div class="row q-col-gutter-lg">
    <div
      v-if="!galleryTabs[0].loadingButtons && currentBtnClicked === galleryTabs[0].btnIndex"
      class=" col-12 flex q-col-gutter-md justify-center"
    >
      <div v-if="!galleryTabs[0].loadingData">
        <div
          v-if="!galleryTabs[0].noData"
          class="col-12 col-12 flex q-col-gutter-md justify-center"
        >
          <div
            v-for="(item, index) in galleryTabs[0].data"
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
        <MyGallerySkeleton :buttons="false" />
      </div>
      <div
        v-if="galleryTabs[0].cont > maxItemsPerPage"
        class=" q-mx-auto q-mb-md"
      >
        <q-btn
          v-for="index in galleryTabs[0].maxPages"
          :key="index"
          :color="galleryTabs[0].currentPage === index + 1 ? 'primary' : 'grey-4' "
          :label="index + 1"
          class="q-mr-xs desktop-only"
          :loading="galleryTabs[0].currentPage === index + 1 ? galleryTabs[0].loadingData : false"
          @click="getGalleryArts(index + 1, currentCollection.label)"
        />
        <algo-button
          v-if="!galleryTabs[0].noData"
          :label="$t('dashboard.gallery.loadMore', {
            msg: btnLoadMoreMsg
          })"
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
      <div
        v-if="!galleryTabs[1].loadingData"
      >
        <div
          v-if="!galleryTabs[1].noData"
          class="col-12 col-12 flex q-col-gutter-md justify-center"
        >
          <div
            v-for="(item, index) in galleryTabs[1].data"
            :key="index"
          >
            <div>
              <onsale-item
                :art="item"
                :btn-name="'dashboard.gallery.btnName.goToAuction'"
                @favoriteClicked="favoriteClicked"
              />
            </div>
          </div>
        </div>
        <div
          v-else
          class="col-12 q-mt-lg justify-center"
        >
          <div class="text-h6 text-primary text-center q-pb-md q-mt-lg">
            {{ $t('dashboard.homePage.noItemsForSalePublic1') }}
          </div>
          <div class="text-h9 text-primary text-center q-pb-md q-mt-lg">
            {{ $t('dashboard.homePage.noItemsForSalePublic2') }}
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
        v-if="galleryTabs[1].cont > maxItemsPerPage"
        class="q-mx-auto q-mb-md"
      >
        <q-btn
          v-for="index in galleryTabs[1].maxPages"
          :key="index"
          :color="galleryTabs[1].currentPage === index + 1 ? 'primary' : 'grey-4'"
          :label="index + 1"
          class="q-mr-xs desktop-only"
          :loading="galleryTabs[1].currentPage === index + 1 ? galleryTabs[1].loadingData : false"
          @click="getOnSalePublic(index + 1, currentCollection.label)"
        />
        <algo-button
          v-if="!galleryTabs[1].noData"
          :label="$t('dashboard.gallery.loadMore', {
            msg: btnLoadMoreMsg
          })"
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
      <div
        v-if="!galleryTabs[2].loadingData"
      >
        <div
          v-if="!galleryTabs[2].noData"
          class="col-12 col-12 flex q-col-gutter-md justify-center"
        >
          <div
            v-for="(item, index) in galleryTabs[2].data"
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
          class="col-12 q-mt-lg justify-center"
        >
          <div class="text-h6 text-primary text-center q-pb-md q-mt-lg">
            {{ $t('dashboard.homePage.noItemPublic') }}
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
          :color="galleryTabs[2].currentPage === index + 1 ? 'primary' : 'grey-4'"
          :label="index + 1"
          class="q-mr-xs desktop-only"
          :loading="galleryTabs[2].currentPage === index + 1 ? galleryTabs[2].loadingData : false"
          @click="getLikes(index + 1, currentCollection.label)"
        />
        <algo-button
          v-if="!galleryTabs[2].noData"
          :label="$t('dashboard.gallery.loadMore', {
            msg: btnLoadMoreMsg
          })"
          color="primary"
          outline
          class="load-more q-px-xl q-mx-auto mobile-only"
          :disable="noMoreImages"
          :loading="loadMoreBtn"
          @click="loadMoreLike(currentCollection.label)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import GalleryItem from './GalleryItem.vue';
import LatestBidsItem from './LatestBidsItem.vue';
import ICollection from 'src/models/ICollection';
import { IAxios, IAxiosPaginated } from 'src/models/IAxios';
import LatestBidsItemSkeleton from './LatestBidsItemSkeleton.vue';
import MyGallerySkeleton from './MyGallerySkeleton.vue';
import { Watch } from 'vue-property-decorator';
import OnsaleItem from './OnsaleItem.vue';
import IGalleryTab from 'src/models/IGalleryTab';
import CollectionController from 'src/controllers/collection/CollectionController';

@Options({
  components: {
    AlgoButton,
    GalleryItem,
    LatestBidsItem,
    LatestBidsItemSkeleton,
    MyGallerySkeleton,
    OnsaleItem,
  },
})
export default class UserGalleryOverview extends Vue {
  loadMoreBtn: boolean = false;
  maxItemsPerPage: number = 9;
  btnLoadMoreMsg: string = 'Load More';
  loadMoreCounter: number = 1;
  loadMoreCounterOnSale: number = 1;
  loadMoreCounterLike: number = 1;
  noMoreImages: boolean = false;

  currentBtnClicked: number = 1;

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
    },
  ];

  mounted() {
    void this.getCollections();
    void this.getLikes(1, this.currentCollection.label);
    void this.getOnSalePublic(1, this.currentCollection.label);
    void this.getGalleryArts(1, this.currentCollection.label);
  }

  @Watch('currentCollection')
  onCollectionChanged() {
    if (this.currentBtnClicked !== 1) {
      void this.getGalleryArts(1, this.currentCollection.label, true);
    }
    if (this.currentBtnClicked !== 2) {
      void this.getOnSalePublic(1, this.currentCollection.label, true);
    }
    if (this.currentBtnClicked !== 3) {
      void this.getLikes(1, this.currentCollection.label, true);
    }
  }

  btnClickHandler(index: number) {
    this.currentBtnClicked = index;
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
        const res = this.$store.getters['collections/GET_COLLECTIONS'] as IAxios;
        const collectionFilter = res.data;

        collectionFilter.map(async(item: ICollection) => {
          if (item.show === true) {
            const images = await new CollectionController().getCollectionsImages(
              item._id
            );
            if (images.length > 0) {
              this.collectionFilter.push({ label: item.title })
            }
          } else if (item.title === 'Personal Item') {
            this.collectionFilter.push({ label: item.title })
          }
        })

        this.getCollectionsLoading = false;
      });
  }

  filterCollection(page: number = 1, currentCollection = { label: 'All Collections' }) {
    this.currentCollection = currentCollection;
    const device = (window.innerWidth <= 768) ? 'mobile' : 'desktop';

    if (device === 'desktop') {
      if (this.currentBtnClicked === this.galleryTabs[0].btnIndex) {
        void this.getGalleryArts(page, currentCollection.label);
      } else if (this.currentBtnClicked === this.galleryTabs[1].btnIndex) {
        void this.getOnSalePublic(page, currentCollection.label);
      } else if (this.currentBtnClicked === this.galleryTabs[2].btnIndex) {
        void this.getLikes(page, currentCollection.label);
      }
    } else if (device === 'mobile') {
      this.loadMoreCounter = 0;
      this.loadMoreCounterOnSale = 0;
      this.loadMoreCounterLike = 0;
      this.noMoreImages = false;
      this.galleryTabs[0].noData = false;
      this.galleryTabs[1].noData = false;
      this.galleryTabs[2].noData = false;
      this.btnLoadMoreMsg = 'Load More';
      if (this.currentBtnClicked === this.galleryTabs[0].btnIndex) {
        void this.loadMore(currentCollection.label, true);
      } else if (this.currentBtnClicked === this.galleryTabs[1].btnIndex) {
        void this.loadMoreOnSale(currentCollection.label, true);
      } else if (this.currentBtnClicked === this.galleryTabs[2].btnIndex) {
        void this.loadMoreLike(currentCollection.label, true);
      }
    }
  }

  async getGalleryArts(page:number = 1, collection:string = this.currentCollection.label, watcher:boolean = false) {
    this.galleryTabs[0].loadingData = true;
    this.galleryTabs[0].currentPage = page;
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
      this.galleryTabs[0].data = response.data as [];
      this.galleryTabs[0].cont = response.count;
      this.galleryTabs[0].contLabel = ` (${response.count})`;
      this.galleryTabs[0].maxPages = response.pages;
      this.galleryTabs[0].noData = (this.galleryTabs[0].data.length === 0);
      this.galleryTabs[0].loadingButtons = false;
      this.galleryTabs[0].loadingData = false;
    });
  }

  async getOnSalePublic(page:number = 1, collection:string = this.currentCollection.label, watcher:boolean = false) {
    this.galleryTabs[1].loadingData = true;
    this.galleryTabs[1].currentPage = page;
    if (!watcher) {
      this.currentBtnClicked = 2;
    }
    await this.$store.dispatch({
      type: 'collections/getUserOnSalePublic',
      account: this.$route.params.account,
      page: page,
      perPage: '9',
      collectionName: collection,
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const response = this.$store.getters['collections/GET_USER_ON_SALE_PUBLIC'] as IAxiosPaginated;
      this.galleryTabs[1].data = response.data;
      this.galleryTabs[1].cont = response.count;
      this.galleryTabs[1].contLabel = ` (${response.count})`;
      this.galleryTabs[1].maxPages = response.pages;
      this.galleryTabs[1].noData = (this.galleryTabs[1].data.length === 0);
      this.galleryTabs[1].loadingData = false;
    });
  }

  async getLikes(page:number = 1, collection:string = this.currentCollection.label, watcher:boolean = false) {
    this.galleryTabs[2].loadingData = true;
    if (!watcher) {
      this.currentBtnClicked = 3;
    }
    this.galleryTabs[2].currentPage = page;
    await this.$store.dispatch({
      type: 'user/getUserLikes',
      account: this.$route.params.account,
      page: page,
      perPage: '9',
      collectionName: collection,
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const response = this.$store.getters['user/GET_USER_LIKES'] as IAxiosPaginated;

      this.galleryTabs[2].data = response.data as [];
      this.galleryTabs[2].cont = response.count;
      this.galleryTabs[2].contLabel = ` (${response.count})`;
      this.galleryTabs[2].maxPages = response.pages;
      this.galleryTabs[2].noData = (this.galleryTabs[2].data.length === 0);
      this.galleryTabs[2].loadingData = false;
    });
  }

  async loadMore(collection:string = this.currentCollection.label, filter: boolean = false) {
    if (filter) {
      this.galleryTabs[0].loadingData = true;
      this.galleryTabs[0].data = [];
    }
    this.loadMoreCounter++;

    this.loadMoreBtn = true;
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
      this.galleryTabs[0].cont = response.count;
      this.galleryTabs[0].contLabel = ` (${response.count})`;
      if (tempGalleryArts.length === 0) {
        this.noMoreImages = true;
        this.btnLoadMoreMsg = 'Nothing else to show';
        this.galleryTabs[0].noData = (this.galleryTabs[0].data.length === 0);
      } else {
        tempGalleryArts.forEach((item) => {
          this.galleryTabs[0].data.push(item);
        });
      }
      this.loadMoreBtn = false;
      this.galleryTabs[0].loadingData = false;
    });
  }

  async loadMoreOnSale(collection:string = this.currentCollection.label, filter: boolean = false) {
    if (filter) {
      this.galleryTabs[1].loadingData = true;
      this.galleryTabs[1].data = [];
    }
    this.loadMoreCounterOnSale++;
    this.loadMoreBtn = true;
    await this.$store.dispatch({
      type: 'collections/getUserOnSale',
      account: this.$route.params.account,
      page: this.loadMoreCounterOnSale,
      perPage: '9',
      collectionName: collection,
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const response = this.$store.getters['collections/GET_USER_ON_SALE'] as IAxiosPaginated;
      const onSaleMobile = response.data;
      this.galleryTabs[1].cont = response.count;
      this.galleryTabs[1].contLabel = ` (${response.count})`;
      if (onSaleMobile.length === 0) {
        this.btnLoadMoreMsg = 'Nothing else to show';
        this.noMoreImages = true;
        this.galleryTabs[1].noData = (this.galleryTabs[1].data.length === 0);
      } else {
        onSaleMobile.forEach((i) => {
          this.galleryTabs[1].data.push(i);
        });
      }
      this.loadMoreBtn = false;
      this.galleryTabs[1].loadingData = false;
    });
  }

  async loadMoreLike(collection:string = this.currentCollection.label, filter: boolean = false) {
    if (filter) {
      this.galleryTabs[2].loadingData = true;
      this.galleryTabs[2].data = [];
    }
    this.loadMoreCounterLike++;
    this.loadMoreBtn = true;
    await this.$store.dispatch({
      type: 'user/getUserLikes',
      account: this.$route.params.account,
      page: this.loadMoreCounterLike,
      perPage: '9',
      collectionName: collection,
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const response = this.$store.getters['user/GET_USER_LIKES'] as IAxiosPaginated;
      const likeMobile = response.data as [];
      this.galleryTabs[2].cont = response.count;
      this.galleryTabs[2].contLabel = ` (${response.count})`;
      if (likeMobile.length === 0) {
        this.noMoreImages = true;
        this.btnLoadMoreMsg = 'Nothing else to show';
        this.galleryTabs[2].noData = (this.galleryTabs[2].data.length === 0);
      } else {
        likeMobile.forEach((i) => {
          this.galleryTabs[2].data.push(i);
        });
      }
      this.loadMoreBtn = false;
      this.galleryTabs[2].loadingData = false;
    });
  }

  favoriteClicked() {
    this.$emit('favoriteClicked');
  }
}
</script>

<style lang="scss">
.btn-container {
  width: 100%;
  height: 80px;
  @media (max-width: $breakpoint-xs-max) {
    height: 50%;
  }
}
.algo-button {
  @media (max-width: $breakpoint-xs-max) {
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

.latest-bids {
  @media (max-width: $breakpoint-xs-max) {
    margin-left: 25px;
    margin-right: 25px;
  }
  margin-left: 16px;
}
</style>
