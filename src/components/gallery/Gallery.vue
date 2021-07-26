<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <div class="header row">
      <div class="left col-xs-12 col-sm-12 col-md-6 col-lg-8 col-xl-7">
        <div class="btn-collection">
          <algo-button
            :label="$t('dashboard.gallery.gwei')"
            class="q-mr-xs btn"
            :class="[currentCollection == 1 ? 'btn-selected' : 'btn-unselected']"
            @click="currentCollection = 1"
          />
          <algo-button
            :label="$t('dashboard.gallery.expressions')"
            class="q-mr-xs btn"
            :class="[currentCollection == 2 ? 'btn-selected' : 'btn-unselected']"
            @click="currentCollection = 2"
          />
          <algo-button
            :label="$t('dashboard.gallery.monero')"
            class="q-mr-xs btn"
            :class="[currentCollection == 3 ? 'btn-selected' : 'btn-unselected']"
            @click="currentCollection = 3"
          />
        </div>
      </div>
      <div class="right col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
        <algo-button
          :label="$t('dashboard.gallery.myPainting')"
          class="q-ml-xs btn-size btn btn-grey"
          outline
        />
        <algo-button
          :label="$t('dashboard.gallery.newPainting')"
          class="q-ml-xs btn btn-size"
          color="primary"
          to="/new-painting"
        />
      </div>
    </div>
    <div
      v-if="currentCollection === 1"
      class="flex q-col-gutter-md"
    >
      <gallery-item
        v-for="galleryItem in gallery"
        :key="galleryItem.id"
        :gallery-item="galleryItem"
        @favoriteClicked="favoriteClicked"
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
        @favoriteClicked="favoriteClicked"
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
        @favoriteClicked="favoriteClicked"
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

  favoriteClicked() {
    this.$emit('favoriteClicked');
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
      id: '3',
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
      id: '4',
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
      id: '5',
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
      id: '6',
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
      id: '7',
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
      id: '8',
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

.btn {
  width: 100px;
  height: 44px;
  min-width: 150px;
}

.btn-grey {
  color: rgb(185, 185, 185);
  border: 1px solid rgb(185, 185, 185);
}
@media (max-width: 420px) {
  .btn-size {
    min-width: 150px;
    float: left;
  }
  .header{
    display: flex;
    flex-direction: column-reverse;
  }
  .left{
    float: bottom;
  }
  .right{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  .btn-collection{
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

</style>
