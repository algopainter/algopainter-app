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
      <div class="flex justify-center">
        <gallery-item
          v-for="galleryItem in currentCollectionGallery"
          :key="galleryItem.id"
          :gallery-item="galleryItem"
          @favoriteClicked="favoriteClicked"
        />
      </div>
      <div class="footer">
        <algo-button
          :label="$t('dashboard.homePage.loadMore', {
            msg: btnLoadMoreMsg
          })"
          color="primary"
          outline
          class="load-more q-px-xl q-mx-auto"
          :disable="noMoreImages"
          @click="loadMore()"
        />
        <!-- to="/gallery" -->
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
import { IUser } from 'src/models/IUser';
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
  loadMoreCounter: number = 1;
  noMoreImages: boolean = false;
  btnLoadMoreMsg: string = 'Load More';
  images: [] = [];
  imgIdArray: string[] = [];

  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  async loadMore() {
    this.loadMoreCounter++;
    const images = await new CollectionController().getCollectionsImages(this.currentCollection._id, this.loadMoreCounter);
    if (images.length === 0) {
      this.noMoreImages = true;
      this.btnLoadMoreMsg = 'Nothing else to show';
    } else {
      const tempCollectionGallery = images.map((image) =>
        this.mapImageToGalleryItem(image),
      );

      const tempImgIdArray: string[] = [];

      tempCollectionGallery.forEach((item) => {
        tempImgIdArray.push(item.id);
      });

      // this.imgIdArray.push('61153e624fb5ed1d60bafc85');
      // this.imgIdArray.push('61153e464fb5ed1d60bafc82');
      // this.imgIdArray.push('61153e374fb5ed1d60bafc7f');

      tempCollectionGallery.forEach((item) => {
        if (this.imgIdArray.includes(item.id) === false) {
          this.currentCollectionGallery.push(item);
          this.imgIdArray.push(item.id);
        }
      });
    }
  }

  async collectionClicked(collection: ICollection) {
    this.imgIdArray = [];
    this.loadMoreCounter = 1;
    this.btnLoadMoreMsg = 'Load More';
    this.noMoreImages = false;
    this.currentCollection = collection;
    const images = await new CollectionController().getCollectionsImages(collection._id);
    this.currentCollectionGallery = images.map((image) =>
      this.mapImageToGalleryItem(image),
    );
    this.currentCollectionGallery.forEach((item) => {
      this.imgIdArray.push(item.id);
    });
  }

  mounted() {
    void this.getCollections();
  }

  async getCollections() {
    const collections = await new CollectionController().getCollections();
    if (collections) {
      this.collections = collections.slice(0, 3); // Simulation of three items received from api, only
      this.currentCollection = collections[0];
      const images = await new CollectionController().getCollectionsImages(collections[0]._id);
      this.currentCollectionGallery = images.map((image) =>
        this.mapImageToGalleryItem(image),
      );
    }
    this.currentCollectionGallery.forEach((item) => {
      this.imgIdArray.push(item.id);
    });
    this.loading = false;
  }

  mapImageToGalleryItem(image: IImage) {
    return {
      id: image._id,
      description: image.description,
      index: image.nft.index,
      art: {
        id: image._id,
        name: image.title,
        source: image.nft.previewImage,
        importantPeople: (image.users as unknown as IUser[]).map((user) => ({
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
