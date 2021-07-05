<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import UploadBox from '../../components/common/UploadBox.vue';

class PropsTypes {
  uploadLabel: string | undefined;
  titleLabel: string | undefined;
  titleMaxlength: number | undefined;
  descriptionLabel: string | undefined;
  descriptionMaxlength: number | undefined;
}

interface FormData {
  title: string;
  description: string;
  putOnSale: boolean;
  img: string;
}

@Options({
  components: {
    UploadBox,
  },
})
export default class CreateUpload extends Vue.with(PropsTypes) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  imgPreview(img: string) {
    this.$emit('preview-img', this.formData.img);
  }

  formData: FormData = {
    title: '',
    description: '',
    putOnSale: false,
    img: '',
  };
}
</script>

<template>
  <div class="row">
    <div class="col">
      <div class="q-upload-wrapper">
        <div class="q-upload-label">
          {{ $t('createCollectible.create.fields.uploadLabel') }}
        </div>
        <div class="col q-upload-box">
          <p class="text-bold text-center align-center">
            {{ $t('createCollectible.create.descriFile') }}
          </p>
          <div class="row justify-center">
            <label
              for="imagem"
              class="labelFile"
            >
              {{ $t('createCollectible.create.import') }}</label>
            <input
              id="imagem"
              type="file"
              name="imagem"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <q-input
        v-model="formData.title"
        bottom-slots
        :label="$t('createCollectible.create.fields.titleLabel')"
        counter
        :maxlength="$props.titleMaxlength"
      />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <q-input
        v-model="formData.description"
        bottom-slots
        :label="$t('createCollectible.create.fields.descriptionLabel')"
        counter
        :maxlength="$props.descriptionMaxlength"
      />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <q-toggle
        v-model="formData.putOnSale"
        :label="$t('createCollectible.create.fields.putOnSaleLabel')"
        left-label
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.q-upload-wrapper {
  position: relative;
}

.q-uploader-component-size {
  position: relative;
  width: auto;
  height: 15rem;
}

.q-upload-box{
  padding: 25px 50px 25px 50px;
  border: 2px dashed #f4538d;
  box-sizing: border-box;
  border-radius: 10px;
  height: auto;
}
.file{
  width: 200px;
  background:#f4538d;
}

.q-upload-label {
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
}

input[type="file"] {
 display: none;
}
.labelFile{
  padding: 10px 5px;
  width: 250px;
  background:#f4538d;
  display:block;
  border-radius: 10px;
  align-items: center;
  text-align: center;
  font-size: 20px;
  cursor: pointer;
  color:aliceblue;
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
