<template>
  <div class="header size q-mx-auto q-mb-lg">
    <q-select
      v-model="currentFilter"
      :options="filterOptions"
      color="primary"
      :loading="loading"
      rounded
      outlined
      bottom-slots
      @update:model-value="filterCollection(currentFilter.label)"
    >
      <template #before>
        <q-icon
          name="filter_list"
          color="primary"
        />
      </template>
    </q-select>
  </div>
  <div class="space" />
  <div v-if="!loading">
    <q-page class="q-gutter-lg q-pb-lg">
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
          :disable="btnLoadMoreMsg !== 'Load More'"
          :loading="loadingBtn"
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
  currentCollectionGallery: IGallery[] = [];
  loading: boolean = true;
  loadingBtn: boolean = false;
  loadMoreCounter: number = 1;
  btnLoadMoreMsg: string = 'Load More';
  imgIdArray: string[] = [];

  // Filter
  currentFilter: string = '';
  filterOptions: any[] = [];
  currentCollectionId: string = '';

  filterCollection(currentCollection: string = '') {
    this.currentFilter = currentCollection;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    this.currentCollectionId = this.filterOptions.find(x => x.label === currentCollection).id;
    this.loadMoreCounter = 0;
    this.btnLoadMoreMsg = 'Load More';
    void this.collectionClicked();
  }

  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  async loadMore() {
    this.loadMoreCounter++;
    this.loadingBtn = true;
    const images = await new CollectionController().getCollectionsImages(this.currentCollectionId, this.loadMoreCounter);
    if (images.length === 0) {
      this.btnLoadMoreMsg = 'Nothing else to show';
    } else {
      const tempCollectionGallery = images.map((image) =>
        this.mapImageToGalleryItem(image),
      );
      const tempImgIdArray: string[] = [];

      tempCollectionGallery.forEach((item) => {
        tempImgIdArray.push(item.id);
      });

      tempCollectionGallery.forEach((item) => {
        if (this.imgIdArray.includes(item.id) === false) {
          this.currentCollectionGallery.push(item);
          this.imgIdArray.push(item.id);
        }
      });
    }
    this.loadingBtn = false;
  }

  async collectionClicked() {
    this.loading = true;
    this.imgIdArray = [];
    this.loadMoreCounter = 1;
    this.btnLoadMoreMsg = 'Load More';
    const images = await new CollectionController().getCollectionsImages(this.currentCollectionId);
    this.currentCollectionGallery = images.map((image) =>
      this.mapImageToGalleryItem(image),
    );
    this.currentCollectionGallery.forEach((item) => {
      this.imgIdArray.push(item.id);
    });
    this.loading = false;
  }

  mounted() {
    void this.getCollections();
  }

  async getCollections() {
    const collections = await new CollectionController().getCollections();
    if (collections) {
      collections.forEach((item: ICollection) => {
        this.filterOptions.push({ label: item.title, id: item._id });
      });
    }
    if (collections) {
      const images = await new CollectionController().getCollectionsImages(collections[0]._id);
      this.currentCollectionId = collections[0]._id;
      this.currentFilter = collections[0].title;
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

.size {
  display: block;
  width: 250px;
  height: 50px;
}

.custom-skeleton-border {
  border-radius: 10px;
}

.space {
  height: 1px;
  width: 100%;
}
</style>
