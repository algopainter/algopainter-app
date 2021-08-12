<template>
  <div
    v-if="loadingGalleryBid === false && loadingGalleryArts === false"
    class="row q-col-gutter-lg"
  >
    <div class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md">
      <div v-if="nullGalleryArts === false">
        <div
          v-for="(item, index) in galleryArts"
          :key="index"
        >
          <gallery-item
            :art="item"
            @favoriteClicked="favoriteClicked"
          />
        </div>
      </div>
      <div v-else>
        <div class="text-h6 text-primary text-center q-pb-md">
          {{ $t('dashboard.homePage.personalNoItems') }}
        </div>
      </div>
    </div>
    <div class="col-12 col-md-3 col-lg-3 q-pt-md column items-center">
      <div class="text-h5 text-bold text-primary q-pb-md">
        {{ $t('dashboard.homePage.latestBids') }}
      </div>
      <div
        v-for="(bid, i) in galleryBidShow"
        :key="i"
        class="column q-col-gutter-md"
      >
        <div v-if="bid != undefined">
          <LatestBidsItem :bid="bid" />
        </div>
        <div v-if="nullGalleryBidShow === true">
          <div class="flex q-mb-md">
            {{ $t('dashboard.homePage.publicNoBids') }}
          </div>
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

@Options({
  components: {
    AlgoButton,
    GalleryItem,
    LatestBidsItem,
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
      }
    } catch (e) {
      console.log('error', e);
    }
  }

  async getGalleryArts() {
    try {
      const response = await api.get(`users/${this.accountAddress}/images`); // id com galleryitem: 0x7A8476832Eb89189F0aDbC183A1B70C447Bb311a
      if (this.isConnected) {
        this.galleryArts = response.data as [];
        if (this.galleryArts.length === 0) {
          this.nullGalleryArts = true;
        }
        this.loadingGalleryArts = false;
      }
    } catch (error) {
      console.log('erro no galleryArts');
    }
  }
}
</script>
