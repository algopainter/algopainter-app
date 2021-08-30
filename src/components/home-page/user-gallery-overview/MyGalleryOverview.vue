/* eslint-disable no-new-wrappers */
<template>
  <div v-if="loadingGalleryArts === true">
    <div class="btn-container q-mx-auto flex justify-center items-center">
      <algo-button
        :label="$t('dashboard.homePage.gallery')"
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
    </div>
  </div>
  <div
    v-else
    class="btn-container q-mx-auto flex justify-center items-center"
  >
    <algo-button
      :label="$t('dashboard.homePage.gallery') + '(' + contImg + ')' "
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
  </div>
  <div
    class="row"
  >
    <div
      v-if="loadingGalleryArtsButtons === false && currentBtnClicked === 1"
      class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md"
    >
      <div>
        <div
          v-if="nullGalleryArts === false"
          class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md"
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
          class="col-12 col-md-9 col-lg-9 q-mt-lg"
        >
          <div class="text-h6 text-primary text-center q-pb-md q-mr-xl">
            {{ $t('dashboard.homePage.personalNoItems') }}
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
          :color="currentPage === index + 1 ? 'primary' : 'grey-4'"
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
      v-else
      class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md"
    >
      <p class="q-mt-lg text-primary text-bold text-h5 q-mx-auto">
        {{ $t('dashboard.auctions.coming') }}
      </p>
    </div>
    <div class="col-12 col-md-3 col-lg-3 column items-center border q-pt-md latest-bids">
      <div class="text-h5 text-bold text-primary q-pb-md">
        {{ $t('dashboard.homePage.latestBids') }}
      </div>
      <div>
        <p class="q-mt-md text-primary text-bold text-h5">
          {{ $t('dashboard.auctions.coming') }}
        </p>
      </div>
      <!--
      <div v-if="loadingLatestBidsItem === false">
        <div
          v-for="(bid, i) in galleryBidShow"
          :key="i"
          class="column q-col-gutter-md"
        >
          <div v-if="bid != undefined">
            <LatestBidsItem
              :bid="bid"
            />
          </div>
        </div>
        <div v-if="nullGalleryBidShow === true">
          <div class="flex q-mb-md">
            {{ $t('dashboard.homePage.personalNoBids') }}
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
import { Watch } from 'vue-property-decorator';
import AlgoButton from 'components/common/Button.vue';
import { IMyGallery } from 'src/models/IMyGallery';
import GalleryItem from './GalleryItem.vue';
import LatestBidsItem from './LatestBidsItem.vue';
import { api } from 'src/boot/axios';
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
export default class MyGalleryOverview extends Vue {
  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  galleryBid = [];
  loadingGalleryBid: boolean = true;
  galleryBidClosed = [];
  galleryBidShow = [];
  nullGalleryBidShow: boolean = false;
  loadingBtn: boolean = false;
  loadingLatestBidsItem: boolean = true;
  loadingGalleryArtsButtons: boolean = true;

  btnBidsClicked: boolean = false;

  galleryArts:IMyGallery[] = [];
  loadingGalleryArts: boolean = true;
  nullGalleryArts: boolean = false;

  maxPage: number = 1;
  showingPages: number = 1;
  currentPage: number = 1;

  btnLoadMoreMsg: string = 'Load More';
  loadMoreCounter: number = 1;
  noMoreImages: boolean = false;

  imgData: IMyGallery[] = [];
  contImg: number = 0;

  // Buttons
  currentBtnClicked: number = 1;

  Allbids() {
    this.btnBidsClicked = !this.btnBidsClicked;
    if (this.btnBidsClicked === false) {
      this.galleryBidShow = this.galleryBidClosed;
    } else {
      this.galleryBidShow = this.galleryBid;
    }
  }

  @Watch('accountAddress')
  onPropertyChanged() {
    void this.getGalleryBidders();
    void this.getGalleryArts();
  }

  mounted() {
    // void this.getGalleryBidders();
    void this.getGalleryArts();
  }

  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/isConnected'] as boolean;
  }

  get accountAddress() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/account'] as string;
  }

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

  async getGalleryArts(page:number = 1) {
    this.loadingGalleryArts = true;
    this.currentBtnClicked = 1;
    try {
      this.currentPage = page;
      const response = await api.get(`users/${this.accountAddress}/images?page=${page}&perPage=9`);
      const imgGet = await api.get(`users/${this.accountAddress}/images`); // this.accountAddress
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.maxPage = response.data.pages as number;
      if (this.maxPage <= 15) {
        this.showingPages = this.maxPage;
      } else {
        this.showingPages = 15;
      }
      if (this.isConnected) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.galleryArts = response.data.data as [];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.contImg = imgGet.headers['x-total-items'] as number;
        if (this.galleryArts.length === 0) {
          this.nullGalleryArts = true;
        } else {
          this.nullGalleryArts = false;
        }
      }
    } catch (error) {
      console.log('error in galleryArts');
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

  async loadMore() {
    try {
      this.loadMoreCounter++;
      this.loadingBtn = true;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const response = await api.get(`users/${this.accountAddress}/images?page=${this.loadMoreCounter}&perPage=9`);
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
}

</style>
