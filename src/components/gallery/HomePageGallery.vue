<template>
  <div v-if="loading === false">
    <q-page class="q-gutter-lg q-pb-lg">
      <div class="header q-gutter-xs">
        <algo-button
          v-for="collection in collections"
          :key="collection._id"
          :label="collection.title"
          class="q-mr-xs"
          :class="[
            currentCollection._id == collection._id
              ? 'btn-selected'
              : 'btn-unselected',
          ]"
          @click="collectionClicked(collection)"
        />
      </div>
      <div class="flex q-col-gutter-md">
        <gallery-item
          v-for="galleryItem in currentCollectionGallery"
          :key="galleryItem.id"
          :gallery-item="galleryItem"
          @favoriteClicked="favoriteClicked"
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
  </div>
  <div
    v-else
  >
    <HomePageGallerySkeleton />
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import { IGallery } from 'src/models/IGallery';
import { GalleryItem } from 'components/gallery';
import AlgoButton from 'components/common/Button.vue';
import { ICollection } from 'src/models/ICollection';
import CollectionController from 'src/controllers/collection/CollectionController';
import { Person } from 'src/models/IArt';
import { IImage } from 'src/models/IImage';
import HomePageGallerySkeleton from 'components/gallery/galleryItem/HomePageGallerySkeleton.vue';

@Options({
  components: {
    GalleryItem,
    AlgoButton,
    HomePageGallerySkeleton,
  },
})
export default class HomePageGallery extends Vue {
  currentCollection!: ICollection;
  collections: ICollection[] = [];
  currentCollectionGallery: IGallery[] = [];
  loading: boolean = true;

  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  collectionClicked(collection: ICollection) {
    this.currentCollection = collection;
    this.currentCollectionGallery = collection.images.map((image) => 
      this.mapImageToGalleryItem(image)
    );
  }

  mounted() {
    void this.getCollections();
  }

  async getCollections() {
    const collections = await new CollectionController().getCollections();
    if (collections) {
      this.collections = collections.slice(0, 3); // Simulation of three items received from api, only
      this.currentCollection = collections[0];
      this.currentCollectionGallery = collections[0].images.map((image) =>
        this.mapImageToGalleryItem(image)
      );
    }
    this.loading = false;
  }

  mapImageToGalleryItem(image: IImage) {
    return {
      id: image._id,
      description: image.description,
      art: {
        id: image._id,
        name: image.title,
        source: image.nft.previewImage,
        importantPeople: image.users.map((user) => ({
          ...user,
          accountable: user.role,
          picture: user.avatar,
        })) as Person[],
        likes: image.likes,
        likers: image.likers,
      },
    } as IGallery;
  }
}
</script>

<style lang="scss" scoped>
.category {
  font-weight: bold;
}

.footer {
  display: flex;
}

.btn-unselected {
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

body.screen--xs {
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.custom-skeleton-border {
  border-radius: 10px;
}
</style>
