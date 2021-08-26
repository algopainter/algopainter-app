<template>
  <div
    class="row"
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
      <div
        v-else
        class="col-12 col-md-9 col-lg-9"
      >
        <div class="text-h6 text-primary text-center q-pb-md q-mr-xl text-gallery">
          {{ $t('dashboard.homePage.personalNoItems') }}
        </div>
      </div>
    </div>
    <div v-else>
      <MyGallerySkeleton />
    </div>
    <div class="col-12 col-md-3 col-lg-3 column items-center border q-pt-md latestBids">
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

  async getGalleryArts() {
    this.loadingGalleryArts = true;
    try {
      const response = await api.get(`users/${this.accountAddress}/images?order.nft.index=-1`); // id com galleryite:0xddbc5f514f729d47a51030f049a956c5086b20af
      if (this.isConnected) {
        this.galleryArts = response.data as [];
        if (this.galleryArts.length === 0) {
          this.nullGalleryArts = true;
        } else {
          this.nullGalleryArts = false;
        }
      }
    } catch (error) {
      console.log('error in galleryArts');
    } finally {
      this.loadingGalleryArts = false;
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

body.screen--md, .screen--lg, .screen--xl {
  .latestBids{
    margin: 8px;
  }
}

body.screen--sm, .screen--xs {
  .text-gallery{
    margin-top: -15px;
    margin-right: -20px;
  }
}

</style>
