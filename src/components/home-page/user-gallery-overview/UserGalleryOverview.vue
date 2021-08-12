/* eslint-disable @typescript-eslint/restrict-template-expressions */
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

    <div class="col-12 col-md-3 col-lg-3 q-pt-md column items-center">
      <div class="text-h5 text-bold text-primary q-pb-md">
        {{ $t('dashboard.homePage.latestBids') }}
      </div>
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

@Options({
  components: {
    AlgoButton,
    GalleryItem,
    LatestBidsItem,
    LatestBidsItemSkeleton,
  },
})
export default class UserGalleryOverview extends Vue {
  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  galleryBid = [];
  loadingGalleryBid: boolean = true;
  galleryBidClosed = [];
  galleryBidShow = [];
  nullGalleryBidShow: boolean = false;

  btnBidsClicked: boolean = false;

  galleryArts:IMyGallery[] = [];
  loadingGalleryArts: boolean = true;
  nullGalleryArts: boolean = false;

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
      const response = await api.get(`bids?bidder=${this.$route.query.customProfile}`);
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

  async getGalleryArts() {
    try {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const response = await api.get(`users/${this.$route.query.customProfile}/images`); // 0xddbc5f514f729d47a51030f049a956c5086b20af
      this.galleryArts = response.data as [];
      if (this.galleryArts.length === 0) {
        this.nullGalleryArts = true;
      }
      this.loadingGalleryArts = false;
    } catch (error) {
      console.log('erro no galleryArts');
    }
  }
}
</script>
