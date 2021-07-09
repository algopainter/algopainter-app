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
}

@Options({
  components: {
    UploadBox,
  },
})
export default class CreateUpload extends Vue.with(PropsTypes) {
  imageData: string | null = null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  previewImage(e: Event) {
    const newLocal = (<HTMLInputElement>e.target).files;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newLocala = newLocal!;
    const file = newLocala[0];
    if (file) {
      this.imageData = URL.createObjectURL(file);
    } else {
      this.imageData = null;
    }
    this.$emit('preview-evento', this.imageData);
  }

  close() {
    this.imageData = null;
    this.$emit('close', this.imageData);
  }

  formData: FormData = {
    title: '',
    description: '',
    putOnSale: false,
  };
}
</script>

<template>
  <div class="row">
    <div class="col ">
      <div class="q-upload-wrapper">
        <div class="q-upload-label">
          {{ $t('createCollectible.create.fields.uploadLabel') }}
        </div>
        <div class="col q-upload-box">
          <p
            v-if="imageData === null"
            class="text-bold text-center align-center"
          >
            {{ $t('createCollectible.create.descriFile') }}
          </p>
          <div
            v-else
            class="row items-center justify-center q-mb-md"
          >
            <img
              :src="imageData"
              class="img "
            >
            <q-btn
              icon="highlight_off"
              class="btn"
              @click="close"
            />
          </div>

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
              @change="previewImage"
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

.q-upload-box {
  padding: 25px 50px 25px 50px;
  border: 2px dashed #f4538d;
  box-sizing: border-box;
  border-radius: 10px;
  height: auto;
}
.file {
  width: 200px;
  background: #f4538d;
}

.q-upload-label {
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
}

input[type='file'] {
  display: none;
}
.labelFile {
  padding: 10px 5px;
  width: 50%;
  background: #f4538d;
  display: block;
  border-radius: 10px;
  align-items: center;
  text-align: center;
  font-size: 15px;
  cursor: pointer;
  color: aliceblue;
}
.img{
  width:50%;
  height:50%;
}
.btn{
  border:none;
  position: absolute;
  top: 30px;
  right: 8px;
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
