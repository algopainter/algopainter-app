<template>
  <gallery
    @favoriteClicked="favoriteClicked"
    @OpenModalArtist="OpenModalArtist"
  />
  <NewPaintingModal v-model="openModal" />
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import {
  Gallery,
} from '../../components/gallery/';
// eslint-disable-next-line import/no-absolute-path
import NewPaintingModal from '/src/components/modal/NewPaintingModal.vue';

@Options({
  components: {
    Gallery,
    NewPaintingModal,
  },
})
export default class CollectiblesGallery extends Vue {
  openModal: boolean = false;

  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  OpenModalArtist() {
    this.openModal = true;
    console.log('CollectiblesGallery');
  }
}
</script>
