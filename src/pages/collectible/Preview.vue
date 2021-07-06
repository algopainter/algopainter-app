<template>
  <div class="text-h6">
    {{ $t('createCollectible.create.preview') }}
  </div>
  <div class="row text-h6 ap-preview-box justify-center items-center">
    <p class="text-center">
      {{ $t('createCollectible.create.previewText') }}
    </p>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class Preview extends Vue {}
</script>

<style lang="scss" scoped>
.ap-preview-box {
  max-width: 400px;
  padding: 25px 50px 25px 50px;
  border: 2px dashed #f4538d;
  box-sizing: border-box;
  height: 350px;
  width: 400px;
  border-radius: 10px;
}
</style>
