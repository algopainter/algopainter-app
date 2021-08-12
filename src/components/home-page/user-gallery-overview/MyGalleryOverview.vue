<template>
  <div
    class="row q-col-gutter-lg"
  >
    <div
      v-if="loadingGalleryArts === false"
      class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md"
    >
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
      <div v-else>
        <div class="text-h6 text-primary text-center q-pb-md">
          {{ $t('dashboard.homePage.personalNoItems') }}
        </div>
      </div>
    </div>
    <div v-else>
      <MyGallerySkeleton />
    </div>
    <div class="col-12 col-md-3 col-lg-3 q-pt-md column items-center">
      <div class="text-h5 text-bold text-primary q-pb-md">
        {{ $t('dashboard.homePage.latestBids') }}
      </div>
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

  galleryArts:IMyGallery[] = [];
  galleryBid = [];
  loadingGalleryBid: boolean = true;
  loadingGalleryArts: boolean = true;
  btnBidsClicked: boolean = false;
  galleryBidClosed = [];
  galleryBidShow = [];
  nullGalleryBidShow: boolean = false;
  nullGalleryArts: boolean = false;
  loadingLatestBidsItem: boolean = true;
  loadingMyGallery: boolean = false;

  Allbids() {
    this.btnBidsClicked = !this.btnBidsClicked;
    if (this.btnBidsClicked === false) {
      this.galleryBidShow = this.galleryBidClosed;
    } else {
      this.galleryBidShow = this.galleryBid;
    }
  }

  @Watch('accountAddress')
  onPropertyChanged(value: string, oldValue: string) {
    void this.getGalleryBidders();
    void this.getGalleryArts();
  }

  mounted() {
    void this.getGalleryBidders();
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
    console.log(this.loadingLatestBidsItem);
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
        } else {
          this.nullGalleryBidShow = true;
        }
        this.galleryBidShow = this.galleryBidClosed;
        this.loadingGalleryBid = false;
        this.loadingLatestBidsItem = false;
        this.loadingMyGallery = false;

        console.log(this.loadingLatestBidsItem);
      }
    } catch (e) {
      console.log('error', e);
    }
  }

  async getGalleryArts() {
    try {
      const response = await api.get(`users/${this.accountAddress}/images`); // id com galleryite:0xddbc5f514f729d47a51030f049a956c5086b20af
      if (this.isConnected) {
        this.galleryArts = response.data as [];
        if (this.galleryArts.length === 0) {
          this.nullGalleryArts = true;
        }
        this.loadingGalleryArts = false;
      }
    } catch (error) {
      console.log('erro in galleryArts');
    }
  }
}
</script>
