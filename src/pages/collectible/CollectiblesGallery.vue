<template>
  <gallery />
</template>

<script>
import { Vue, Options } from 'vue-class-component';
import {
  Gallery,
} from '../../components/gallery/';

@Options({
  components: {
    Gallery,
  },
})
export default class CollectiblesGallery extends Vue {

}
</script>
