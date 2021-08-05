<template>
  <div v-if="loadingGalleryBid === false" class="row q-col-gutter-lg">
    <div class="col-12 col-md-9 col-lg-9 flex q-col-gutter-md">
      <div v-for="item in galleryItems" :key="item.id">
        <gallery-item :art="item" @favoriteClicked="favoriteClicked" />
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
        <LatestBidsItem :bid="bid" />
      </div>
      <div class="q-pt-md row justify-center">
        <algo-button v-if="btnBidsClicked" color="primary" @click="Allbids()">
          {{ $t('dashboard.homePage.seeLess') }}
        </algo-button>
        <algo-button v-else color="primary" @click="Allbids()">
          {{ $t('dashboard.homePage.seeAllBids') }}
        </algo-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import moment from 'moment';
import { Watch } from 'vue-property-decorator';
import { IArt } from 'src/models/IArt';
import { IBid } from 'src/models/IBid';
import AlgoButton from 'components/common/Button.vue';

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
export default class UserGalleryOverview extends Vue {
  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  galleryBid = [];
  loadingGalleryBid: boolean = true;
  btnBidsClicked: boolean = false;
  galleryBidClosed = [];
  galleryBidShow = [];

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
  }

  mounted() {
    void this.getGalleryBidders();
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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const response = await api.get(`bids?bidder=${this.accountAddress}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.galleryBid = response.data as [];
      this.galleryBidClosed = [
        this.galleryBid[0],
        this.galleryBid[1],
        this.galleryBid[2],
      ];
      this.galleryBidShow = this.galleryBidClosed;
      if (this.isConnected) {
        this.loadingGalleryBid = false;
      }
      console.log(this.galleryBid);
    } catch (e) {
      console.log('error', e);
    }
  }

  galleryItems: IArt[] = [
    {
      id: '1',
      name: 'aqui',
      algopainter: 'Hashley Gwei',
      owner: '0xdE201f115f48A10878d831cC21a2EdD1aAe92121',
      source: 'placeholder',
      price: 120,
      bidBack: 0.1,
      pirs: {
        creators: 0.08,
        investors: 0.05,
      },
      keywords: '#art',
      importantPeople: [
        {
          id: '1',
          name: 'Billy Nguyen',
          picture: 'https://randomuser.me/api/portraits/men/5.jpg',
          accountable: 'Collection',
        },
        {
          id: '2',
          name: 'Beverley Weaver',
          picture: 'https://randomuser.me/api/portraits/women/31.jpg',
          accountable: 'Owner',
        },
        {
          id: '3',
          name: 'Leonard Ryan',
          picture: 'https://randomuser.me/api/portraits/men/11.jpg',
          accountable: 'Creator',
        },
      ],
    },
    {
      id: '2',
      name: 'oiii',
      algopainter: 'Hashley Gwei',
      owner: '0xdE201f115f48A10878d831cC21a2EdD1aAe92121',
      source: 'placeholder',
      price: 120,
      bidBack: 0.1,
      keywords: '#art',
      pirs: {
        creators: 0.08,
        investors: 0.05,
      },
      importantPeople: [
        {
          id: '1',
          name: 'Billy Nguyen',
          picture: 'https://randomuser.me/api/portraits/men/5.jpg',
          accountable: 'Collection',
        },
        {
          id: '2',
          name: 'Beverley Weaver',
          picture: 'https://randomuser.me/api/portraits/women/31.jpg',
          accountable: 'Owner',
        },
        {
          id: '3',
          name: 'Leonard Ryan',
          picture: 'https://randomuser.me/api/portraits/men/11.jpg',
          accountable: 'Creator',
        },
      ],
    },
    {
      id: '3',
      name: 'Art Abstract Name',
      algopainter: 'Hashley Gwei',
      owner: '0xdE201f115f48A10878d831cC21a2EdD1aAe92121',
      source: 'placeholder',
      price: 120,
      bidBack: 0.1,
      keywords: '#art',
      pirs: {
        creators: 0.08,
        investors: 0.05,
      },
      importantPeople: [
        {
          id: '1',
          name: 'Billy Nguyen',
          picture: 'https://randomuser.me/api/portraits/men/5.jpg',
          accountable: 'Collection',
        },
        {
          id: '2',
          name: 'Beverley Weaver',
          picture: 'https://randomuser.me/api/portraits/women/31.jpg',
          accountable: 'Owner',
        },
        {
          id: '3',
          name: 'Leonard Ryan',
          picture: 'https://randomuser.me/api/portraits/men/11.jpg',
          accountable: 'Creator',
        },
      ],
    },
  ];

  bids: IBid[] = [
    {
      id: '1',
      art: this.galleryItems[0],
      price: 200,
      bidAt: moment(),
    },
    {
      id: '2',
      art: this.galleryItems[1],
      price: 200,
      bidAt: moment(),
    },
    {
      id: '3',
      art: this.galleryItems[2],
      price: 200,
      bidAt: moment(),
    },
  ];
}
</script>
