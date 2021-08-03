<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <div class="header row">
      <div class="left col-xs-12 col-sm-12 col-md-6 col-lg-8 col-xl-7">
        <div class="btn-collection">
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
      v-if="collectionSelected === 'Gwei'"
      class="flex q-col-gutter-md"
    >
      <gallery-item
        v-for="galleryItem in currentCollectionGallery"
        :key="galleryItem.id"
        :gallery-item="galleryItem"
        @favoriteClicked="favoriteClicked"
      />
    </div>
    <div
      v-if="collectionSelected === 'Expressions'"
      class="flex q-col-gutter-md"
    >
      <gallery-item
        v-for="galleryItem in currentCollectionGallery"
        :key="galleryItem.id"
        :gallery-item="galleryItem"
        @favoriteClicked="favoriteClicked"
      />
    </div>
    <div
      v-if="collectionSelected === 'Monero'"
      class="flex q-col-gutter-md"
    >
      <gallery-item
        v-for="galleryItem in currentCollectionGallery"
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
import { GalleryItem } from 'components/gallery';
import AlgoButton from 'components/common/Button.vue';
import { ICollection } from 'src/models/ICollection';
import CollectionController from 'src/controllers/collection/CollectionController';
import { Person } from 'src/models/IArt';
import { IImage } from 'src/models/IImage';

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
  currentCollection!: ICollection;
  collections: ICollection[] = [];
  currentCollectionGallery: IGallery[] = [];
  collectionSelected: string = 'Gwei';

  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  collectionClicked(collection: ICollection) {
    this.currentCollection = collection;
    this.collectionSelected = collection.title;
    this.currentCollectionGallery = collection.images.map((image) =>
      this.mapImageToGalleryItem(image),
    );
  }

  mounted() {
    void this.getCollections();
  }

  async getCollections() {
    const collections = await new CollectionController().getCollections();
    if (collections) {
      this.collections = collections; // Simulation of three items received from api, only
      this.currentCollection = collections[0];
      this.currentCollectionGallery = collections[0].images.map((image) =>
        this.mapImageToGalleryItem(image),
      );
    }
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
