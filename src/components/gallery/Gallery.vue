<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <div class="header">
      <div class="left">
        <algo-button
          :label="$t('dashboard.gallery.gwei')"
          class="q-mr-xs"
          :class="[currentCollection == 1 ? 'btn-selected' : 'btn-unselected']"
          @click="currentCollection = 1"
        />
        <algo-button
          :label="$t('dashboard.gallery.expressions')"
          class="q-mr-xs"
          :class="[currentCollection == 2 ? 'btn-selected' : 'btn-unselected']"
          @click="currentCollection = 2"
        />
        <algo-button
          :label="$t('dashboard.gallery.monero')"
          class="q-mr-xs"
          :class="[currentCollection == 3 ? 'btn-selected' : 'btn-unselected']"
          @click="currentCollection = 3"
        />
      </div>
      <div class="right">
        <algo-button
          :label="$t('dashboard.gallery.myPainting')"
          class="q-ml-xs btn-size btn-grey"
          outline
        />
        <algo-button
          :label="$t('dashboard.gallery.newPainting')"
          class="q-ml-xs btn-size"
          color="primary"
          to="/new-painting"
        />
      </div>
    </div>
    <div
      v-if="currentCollection === 1"
      class="flex q-col-gutter-md">
      <gallery-item
        v-for="galleryItem in gallery"
        :key="galleryItem.id"
        :gallery-item="galleryItem"
      />
    </div>
    <div
      v-if="currentCollection === 2"
      class="flex q-col-gutter-md">
      <gallery-item
        v-for="galleryItem in gallery"
        :key="galleryItem.id"
        :gallery-item="galleryItem"
      />
    </div>
    <div
      v-if="currentCollection === 3"
      class="flex q-col-gutter-md">
      <gallery-item
        v-for="galleryItem in gallery"
        :key="galleryItem.id"
        :gallery-item="galleryItem"
      />
    </div>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="currentPage"
        :max="5"
        direction-links
        outline
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { ref } from 'vue';

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
export default class Gallery extends Vue {
  setup() {
    return {
      current: ref(3),
    };
  }

  currentPage: number = 1;
  currentCollection: number = 1;

  gallery: IGallery[] = [
    {
      id: '1',
      description: 'Dreaming with your eyes open',
      art: {
        id: '1',
        name: '#25 Virtual Reality',
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
          },
          {
            id: '2',
            name: 'Beverley Weaver',
            picture: 'https://randomuser.me/api/portraits/women/31.jpg',
          },
          {
            id: '3',
            name: 'Leonard Ryan',
            picture: 'https://randomuser.me/api/portraits/men/11.jpg',
          },
        ],
      },
    },
    {
      id: '2',
      description: 'Dreaming with your eyes open',
      art: {
        id: '1',
        name: '#25 Virtual Reality',
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
          },
          {
            id: '2',
            name: 'Beverley Weaver',
            picture: 'https://randomuser.me/api/portraits/women/31.jpg',
          },
          {
            id: '3',
            name: 'Leonard Ryan',
            picture: 'https://randomuser.me/api/portraits/men/11.jpg',
          },
        ],
      },
    },
    {
      id: '3',
      description: 'Dreaming with your eyes open',
      art: {
        id: '1',
        name: '#25 Virtual Reality',
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
          },
          {
            id: '2',
            name: 'Beverley Weaver',
            picture: 'https://randomuser.me/api/portraits/women/31.jpg',
          },
          {
            id: '3',
            name: 'Leonard Ryan',
            picture: 'https://randomuser.me/api/portraits/men/11.jpg',
          },
        ],
      },
    },
    {
      id: '4',
      description: 'Dreaming with your eyes open',
      art: {
        id: '1',
        name: '#25 Virtual Reality',
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
          },
          {
            id: '2',
            name: 'Beverley Weaver',
            picture: 'https://randomuser.me/api/portraits/women/31.jpg',
          },
          {
            id: '3',
            name: 'Leonard Ryan',
            picture: 'https://randomuser.me/api/portraits/men/11.jpg',
          },
        ],
      },
    },
    {
      id: '5',
      description: 'Dreaming with your eyes open',
      art: {
        id: '1',
        name: '#25 Virtual Reality',
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
          },
          {
            id: '2',
            name: 'Beverley Weaver',
            picture: 'https://randomuser.me/api/portraits/women/31.jpg',
          },
          {
            id: '3',
            name: 'Leonard Ryan',
            picture: 'https://randomuser.me/api/portraits/men/11.jpg',
          },
        ],
      },
    },
    {
      id: '6',
      description: 'Dreaming with your eyes open',
      art: {
        id: '1',
        name: '#25 Virtual Reality',
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
          },
          {
            id: '2',
            name: 'Beverley Weaver',
            picture: 'https://randomuser.me/api/portraits/women/31.jpg',
          },
          {
            id: '3',
            name: 'Leonard Ryan',
            picture: 'https://randomuser.me/api/portraits/men/11.jpg',
          },
        ],
      },
    },
    {
      id: '7',
      description: 'Dreaming with your eyes open',
      art: {
        id: '1',
        name: '#25 Virtual Reality',
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
          },
          {
            id: '2',
            name: 'Beverley Weaver',
            picture: 'https://randomuser.me/api/portraits/women/31.jpg',
          },
          {
            id: '3',
            name: 'Leonard Ryan',
            picture: 'https://randomuser.me/api/portraits/men/11.jpg',
          },
        ],
      },
    },
    {
      id: '8',
      description: 'Dreaming with your eyes open',
      art: {
        id: '1',
        name: '#25 Virtual Reality',
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
          },
          {
            id: '2',
            name: 'Beverley Weaver',
            picture: 'https://randomuser.me/api/portraits/women/31.jpg',
          },
          {
            id: '3',
            name: 'Leonard Ryan',
            picture: 'https://randomuser.me/api/portraits/men/11.jpg',
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

.footer {
  display: flex;
}

.header {
  display: flex;
  justify-content: space-between;
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

.btn-size {
  width: 100px;
  height: 44px;
}

.btn-grey {
  color: rgb(185, 185, 185);
  border: 1px solid rgb(185, 185, 185);
}

</style>
