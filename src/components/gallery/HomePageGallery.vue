<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <div class="header">
      <algo-button
        :label="$t('dashboard.homePage.gwei')"
        class="q-mr-xs"
        :class="[currentCollection == 1 ? 'btn-selected' : 'btn-unselected']"
        @click="currentCollection = 1"
      />
      <algo-button
        :label="$t('dashboard.homePage.expressions')"
        class="q-mr-xs"
        :class="[currentCollection == 2 ? 'btn-selected' : 'btn-unselected']"
        @click="currentCollection = 2"
      />
      <algo-button
        :label="$t('dashboard.homePage.monero')"
        class="q-mr-xs"
        :class="[currentCollection == 3 ? 'btn-selected' : 'btn-unselected']"
        @click="currentCollection = 3"
      />
    </div>
    <div
      v-if="currentCollection === 1"
      class="flex q-col-gutter-md"
    >
      <gallery-item
        v-for="galleryItem in gallery"
        :key="galleryItem.id"
        :gallery-item="galleryItem"
      />
    </div>
    <div
      v-if="currentCollection === 2"
      class="flex q-col-gutter-md"
    >
      <gallery-item
        v-for="galleryItem in gallery"
        :key="galleryItem.id"
        :gallery-item="galleryItem"
      />
    </div>
    <div
      v-if="currentCollection === 3"
      class="flex q-col-gutter-md"
    >
      <gallery-item
        v-for="galleryItem in gallery"
        :key="galleryItem.id"
        :gallery-item="galleryItem"
      />
    </div>
    <div class="footer">
      <algo-button
        :label="$t('dashboard.homePage.loadMore')"
        color="primary"
        outline
        class="load-more q-px-xl q-mx-auto"
        to="/gallery"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import { IGallery } from 'src/models/IGallery';
import {
  GalleryItem,
} from 'components/gallery';
import AlgoButton from 'components/common/Button.vue';

@Options({
  components: {
    GalleryItem,
    AlgoButton,
  },
})
export default class HomePageGallery extends Vue {
  currentCollection: number = 1;

  gallery: IGallery[] = [
    {
      id: '1',
      description: 'Dreaming with your eyes open',
      art: {
        id: '1',
        name: '#25 Virtual Reality',
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
    },
    {
      id: '2',
      description: 'Dreaming with your eyes open',
      art: {
        id: '2',
        name: '#25 Virtual Reality',
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
    },
    {
      id: '3',
      description: 'Dreaming with your eyes open',
      art: {
        id: '3',
        name: '#25 Virtual Reality',
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
    },
    {
      id: '4',
      description: 'Dreaming with your eyes open',
      art: {
        id: '4',
        name: '#25 Virtual Reality',
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
    },
    {
      id: '5',
      description: 'Dreaming with your eyes open',
      art: {
        id: '5',
        name: '#25 Virtual Reality',
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
    },
    {
      id: '6',
      description: 'Dreaming with your eyes open',
      art: {
        id: '6',
        name: '#25 Virtual Reality',
        source: 'placeholder',
        algopainter: 'Hashley Gwei',
        owner: '0xdE201f115f48A10878d831cC21a2EdD1aAe92121',
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
    },
    {
      id: '7',
      description: 'Dreaming with your eyes open',
      art: {
        id: '7',
        name: '#25 Virtual Reality',
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
    },
    {
      id: '8',
      description: 'Dreaming with your eyes open',
      art: {
        id: '8',
        name: '#25 Virtual Reality',
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
    },
  ];
}
</script>

<style lang="scss" scoped>
.category {
  font-weight: bold;
}

.footer{
  display: flex;
}

.btn-unselected{
  width: 100px;
  height: 44px;
  color: #333;
  font-weight: bold;
  border: 1px solid rgb(185, 185, 185);
}

.btn-selected {
  width: 100px;
  height: 44px;
  color: #333;
  font-weight: bold;
  border: 2px solid #f4538d;
}

</style>
