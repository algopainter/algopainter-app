<template>
  <q-form @submit="saveMintData">
    <div class="row">
      <div :hidden="$q.screen.lt.md" class="preview">
        <preview
          :image-preview="formData.image"
          @close="close"
          @preview-evento="previewImage"
        />
        <div class="btn-mint">
          <algo-button
            type="submit"
            color="primary"
            :disabled="isDisabled"
            :label="$t('createCollectible.create.btnCreate')"
          />
          <mint-modal
            v-model="OpenModal"
            :open-modal="OpenModal"
            :status="statusData"
          />
        </div>
      </div>

      <div class="col">
        <div class="q-upload-wrapper">
          <div class="q-upload-label">
            {{ $t('createCollectible.create.fields.uploadLabel') }}
          </div>
          <div class="col q-upload-box">
            <p
              v-if="formData.image === '' "
              class="text-bold text-center align-center"
            >
              {{ $t('createCollectible.create.descriFile') }}
            </p>
            <div
              v-else
              class="row items-center justify-center q-mb-md"
            >
              <img
                :src="formData.image"
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
          v-model="formData.name"
          bottom-slots
          :label="$t('createCollectible.create.fields.titleLabel')"
          counter
          :maxlength="$props.titleMaxlength"
          :rules="[(val) =>
            val !== '' ||
            $t('createCollectible.create.requiredField')]"
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
          :rules="[(val) =>
            val !== '' ||
            $t('createCollectible.create.requiredField')]"
        />
      </div>
    </div>
    <div class="row justify-between">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <q-input
          v-model="creatorRoyaltyValue"
          bottom-slots
          mask="#"
          fill-mask="0"
          reverse-fill-mask
          :label="$t('createCollectible.create.fields.createRoyalty')"
          :rules="[
            (val) => val >= 1 || $t('dashboard.sellYourArt.minimumBidBackRate'),
            (val) => val <= 30 || $t('dashboard.sellYourArt.maximumBidBackRate'),
          ]"
        />
      </div>
    </div>
    <div class="preview-mobile">
      <div class="btn-mint">
        <algo-button
          type="submit"
          color="primary"
          :disabled="isDisabled"
          :label="$t('createCollectible.create.btnCreate')"
        />
        <mint-modal
          v-model="OpenModal"
          :open-modal="OpenModal"
          :status="statusData"
        />
      </div>
    </div>
  </q-form>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import UploadBox from '../../components/common/UploadBox.vue';
import Preview from './Preview.vue';
import AlgoButton from 'components/common/Button.vue';
import MintModal from './MintModal.vue';
import { isError, resizeImage } from 'src/helpers/utils';
import { nanoid } from 'nanoid';
import Web3Helper from 'src/helpers/web3Helper';
import { api } from 'src/boot/axios';

class PropsTypes {
  uploadLabel: string | undefined;
  titleLabel: string | undefined;
  titleMaxlength: number | undefined;
  descriptionLabel: string | undefined;
  descriptionMaxlength: number | undefined;
}

interface FormData {
  name: string;
  description: string;
  creatorRoyalty: number;
  mintedBy: string;
  image: string;
  salt: string;
  fileName: string;
}

@Options({
  components: {
    UploadBox,
    Preview,
    AlgoButton,
    MintModal,
  },
})
export default class CreateUpload extends Vue.with(PropsTypes) {
  imageData: string | null = null;
  OpenModal: boolean = false;
  isDisabled: boolean = true;
  statusData : string = '';
  creatorRoyaltyValue: number = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async previewImage(e: Event) {
    const newLocal = (<HTMLInputElement>e.target).files;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newLocala = newLocal!;
    const file = newLocala[0];
    this.formData.fileName = file.name;
    const toBase64 = (file: Blob) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result || '').toString());
      reader.onerror = error => reject(error);
    });
    const base64 = await toBase64(file);
    const resized = await resizeImage(base64, 500, 500) as string;
    if (file) {
      if (file.size < 31457280) {
        this.formData.image = resized;
        this.isDisabled = false;
      } else {
        this.$q.notify({
          type: 'negative',
          message: this.$t('create-collectible.create.errorFile'),
        });
        this.formData.image = '';
        this.isDisabled = true;
      }
    } else {
      this.formData.image = '';
      this.isDisabled = true;
    }
    this.$emit('preview-evento', this.imageData);
  }

  close() {
    this.formData.image = '';
    this.$emit('close', this.imageData);
  }

  formData: FormData = {
    name: '',
    description: '',
    image: '',
    mintedBy: '',
    salt: '',
    creatorRoyalty: 0,
    fileName: '',
  };

  async saveMintData() {
    this.statusData = 'aproved';
    try {
      this.OpenModal = true;
      this.formData.creatorRoyalty = this.creatorRoyaltyValue * 100;
      this.formData.mintedBy = this.$store.getters['user/account'] as string;
      const data = {
        ...this.formData,
        salt: nanoid(),
      };
      const web3helper = new Web3Helper();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const userAccount = this.$store.getters['user/account'] as string;
      const signatureOrError = await web3helper.hashMessageAndAskForSignature(data, userAccount);
      if (isError(signatureOrError as Error)) {
        return;
      }

      const request = {
        data,
        signature: signatureOrError,
        account: userAccount,
        salt: data.salt,
      };

      await api.post('images/mint', request);
      this.$q.notify({
        type: 'positive',
        message: 'ok!',
      });
      console.log('request.data', request);
      this.statusData = 'confirme';
    } catch (e) {
      this.$q.notify({
        type: 'negative',
        message: 'error',
      });
      this.statusData = 'error';
    }
  }
}
</script>
<style lang="scss" scoped>
.q-upload-wrapper {
  position: relative;
}
.preview{
  position: absolute;
}
.btn-mint{
  margin-top: 300px;
}

.preview-mobile{
    margin: 0;
  }

@media (min-width: 1024px){
  .preview{
    position: fixed;
    left: 75%;
    bottom: 10px;
}
  .preview-mobile{
    display: none;
  }
}
@media (max-width: 640px){
  .preview{
    left: 20%;
    margin-top: 100%;
    position: absolute;
}
.btn-mint{
  margin-top: 2px;
  margin-bottom: 10px;
  align-items: center;
  display: flex;
  justify-content: center;

}

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
