<template>
  <div class="text-h6">
    {{ $t('createCollectible.create.preview') }}
  </div>
  <div class="row text-h6 ap-preview-box justify-center items-center">
    <div class="col">
      <p
        v-if="imagePreview === null"
        class="text-center"
      >
        {{ $t('createCollectible.create.previewText') }}
      </p>
      <div v-else>
        <q-img
          :src="imagePreview"
          class="img"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
class Props {
 imagePreview = prop({
   type: String,
   required: true,
 })
}

export default class Preview extends Vue.with(Props) {

}
</script>

<style lang="scss" scoped>
.ap-preview-box {
  max-width: 400px;
  padding: 25px 50px 25px 50px;
  border: 2px dashed #f4538d;
  box-sizing: border-box;
  height: 100%;
  width: 400px;
  border-radius: 10px;
}
.img{
  width: 100%;
  height: 20%;
}
</style>
