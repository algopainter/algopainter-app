<script lang="ts">
import { Vue, Options } from 'vue-class-component';

class PropsTypes {
  innerWidth: string | undefined;
  innerHeight: string | undefined;
  cb: ((fileB64: string) => void) | undefined;
}

@Options({})
export default class UploadBox extends Vue.with(PropsTypes) {
}
</script>

<template>
  <div
    class="q-upload-wrapper"
    :style="{ 
      'max-width': $props.innerWidth,
    }"
  >
    <div class="q-upload-label">
      <slot />
    </div>
    <div
      class="row q-upload-box"
      :style="{
        'height': $props.innerHeight,
      }"
    >
      <q-uploader
        max-files="1"
        class="q-uploader-component-size"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .q-upload-wrapper {
    width: 100vh;
  }

  .q-uploader-component-size {
    width: 100vh;
  }

  .q-upload-box {
    padding: 25px 50px 25px 50px;
    border: 2px dashed #f4538d;
    box-sizing: border-box;
    border-radius: 10px;
  }

  .q-upload-label {
    font-family: Poppins;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
  }
</style>

<style>
.q-uploader__file--img {
  height: 430px;
}

.q-uploader {
  max-height: 100vh;
}
</style>
