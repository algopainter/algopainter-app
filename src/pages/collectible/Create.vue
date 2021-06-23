<template>
  <div class="text-subtitle2">
    {{ $t('createCollectible.title.sub') }}
  </div>
  <div class="row">
    <div class="col" />
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import ImageButton from '../../components/common/ImageButton.vue';

@Options({
  components: {
    ImageButton,
  },
})
export default class Create extends Vue {
}
</script>

<style lang="scss" scoped>

</style>
