<template>
  <div class="row q-col-gutter-lg">
    <div class="col-12 col-lg-9 flex q-col-gutter-md">
      <div
        v-for="item in galleryItems"
        :key="item.id"
      >
        <gallery-item :art="item" />
      </div>
    </div>
    <div class="col-12 col-lg-3">
      <div class="text-h5 text-bold text-primary q-pb-md">
        {{ $t('dashboard.homePage.latestBids') }}
      </div>
      <div class="column q-col-gutter-md">
        <div
          v-for="bid in bids"
          :key="bid.id"
        >
          <latest-bids-item :bid="bid" />
        </div>
      </div>
      <div class="q-pt-md">
        <algo-button
          color="primary"
        >
          {{ $t('dashboard.homePage.seeAllBids') }}
        </algo-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import moment from 'moment';

import { IArt } from 'src/models/IArt';
import { IBid } from 'src/models/IBid';
import AlgoButton from 'components/common/Button.vue';

import GalleryItem from './GalleryItem.vue';
import LatestBidsItem from './LatestBidsItem.vue';

@Options({
  components: {
    AlgoButton,
    GalleryItem,
    LatestBidsItem,
  },
})
export default class UserGalleryOverview extends Vue {
  galleryItems: IArt[] = [
    {
      id: '1',
      name: 'Art Abstract Name',
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
      importantPeople: [{
        id: '1',
        name: 'Billy Nguyen',
        picture: 'https://randomuser.me/api/portraits/men/5.jpg',
      }, {
        id: '2',
        name: 'Beverley Weaver',
        picture: 'https://randomuser.me/api/portraits/women/31.jpg',
      }, {
        id: '3',
        name: 'Leonard Ryan',
        picture: 'https://randomuser.me/api/portraits/men/11.jpg',
      }],
    },
    {
      id: '2',
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
      importantPeople: [{
        id: '1',
        name: 'Billy Nguyen',
        picture: 'https://randomuser.me/api/portraits/men/5.jpg',
      }, {
        id: '2',
        name: 'Beverley Weaver',
        picture: 'https://randomuser.me/api/portraits/women/31.jpg',
      }, {
        id: '3',
        name: 'Leonard Ryan',
        picture: 'https://randomuser.me/api/portraits/men/11.jpg',
      }],
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
      importantPeople: [{
        id: '1',
        name: 'Billy Nguyen',
        picture: 'https://randomuser.me/api/portraits/men/5.jpg',
      }, {
        id: '2',
        name: 'Beverley Weaver',
        picture: 'https://randomuser.me/api/portraits/women/31.jpg',
      }, {
        id: '3',
        name: 'Leonard Ryan',
        picture: 'https://randomuser.me/api/portraits/men/11.jpg',
      }],
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
      art: this.galleryItems[0],
      price: 200,
      bidAt: moment(),
    },
    {
      id: '3',
      art: this.galleryItems[0],
      price: 200,
      bidAt: moment(),
    },
  ];
}
</script>
