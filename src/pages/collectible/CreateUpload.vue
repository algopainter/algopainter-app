<template>
  <q-form @submit="saveMintData">
    <div class="row justify-center">
      <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'row justify-center' : 'col']">
        <div class="q-upload-wrapper">
          <div class="q-upload-label">
            {{ $t('createCollectible.create.fields.uploadLabel') }}
          </div>
          <div class="row justify-beetewen">
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
            <!-- <div :hidden="$q.screen.lt.md" class="preview">
              <preview
                :image-preview="formData.image"
                @close="close"
                @preview-evento="previewImage"
              />
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-center">
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
    <div class="row justify-center q-pb-md">
      <q-field
        ref="toggle"
        :value="isresponsibility"
        :rules="[
          (val) => isresponsibility === true || $t('createCollectible.create.requiredField'),
        ]"
        borderless
        dense
        hide-bottom-space
      >
        <template #control>
          <q-checkbox
            v-model="isresponsibility"
            color="green"
            :label="
              $t('createCollectible.create.fields.responsibility')"
          />
        </template>
      </q-field>
    </div>
    <div class="row justify-start q-pb-md">
      <q-field
        ref="toggle"
        :value="isAgreeValue"
        :rules="[
          (val) => isAgreeValue === true || $t('createCollectible.create.requiredField'),
        ]"
        borderless
        dense
        hide-bottom-space
      >
        <template #control>
          <q-checkbox
            v-model="isAgreeValue"
            color="green"
            :label="
              $t('createCollectible.create.fields.agreeValue')"
          />
        </template>
      </q-field>
    </div>
    <div class="preview-mobile">
      <div class="btn-mint">
        <algo-button
          type="submit"
          color="primary"
          :disabled="isDisabled"
          :label="$t('createCollectible.create.btnCreate',{
            CurrentAmount: mintValue,
          })"
        />
        <mint-modal
          v-model="OpenModal"
          :open-modal="OpenModal"
          :status-data="statusData"
          :painter-personal-item-status="painterPersonalItemStatus"
          :ok-btn-disabled="okBtnDisabled"
          @request-close="onCloseMyGallery"
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
import { isError } from 'src/helpers/utils';
import { Form as VForm, Field as VField } from 'vee-validate';
import { nanoid } from 'nanoid';
import Web3Helper from 'src/helpers/web3Helper';
import { api } from 'src/boot/axios';
import { mapGetters } from 'vuex';
import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterPersonalItemProxy, { PainterPersonalItemStatus } from 'src/eth/AlgoPainterPersonalItemProxy';
import getAlgoPainterContractByNetworkId, { getPersonalItemContractByNetworkId } from 'src/eth/Config';
import ERC20TokenProxy from 'src/eth/ERC20TokenProxy';
import { numberToString } from 'src/helpers/format/numberToString';
import { IMintData } from 'src/models/IMint';

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
    VForm,
    VField,
  },
  computed: {
    ...mapGetters('user', {
      networkInfo: 'networkInfo',
      account: 'account',
    }),
  },
})
export default class CreateUpload extends Vue.with(PropsTypes) {
  static FILE_SIZE_LIMIT = 31457280;

  imageData: string | null = null;
  OpenModal: boolean = false;
  isDisabled: boolean = true;
  statusData : string = '';
  creatorRoyaltyValue: number = 0;
  isresponsibility: boolean = false;
  isAgreeValue: boolean = false;
  personalItemContract = <AlgoPainterPersonalItemProxy>{};
  painterPersonalItemStatus: PainterPersonalItemStatus = PainterPersonalItemStatus.None;
  algopTokenContract!: ERC20TokenProxy;
  networkInfo!: NetworkInfo;
  mintValue: number = 0;
  account!: string;
  dataMint: string = ''
  responseMint?: IMintData;
  okBtnDisabled: boolean = true;

  formData: FormData = {
    name: '',
    description: '',
    image: '',
    mintedBy: '',
    salt: '',
    creatorRoyalty: 0,
    fileName: '',
  };

  created() {
    this.personalItemContract = new AlgoPainterPersonalItemProxy(this.networkInfo);
    this.algopTokenContract = new ERC20TokenProxy(getAlgoPainterContractByNetworkId(this.networkInfo.id));
  }

  mounted() {
    this.personalItemContract.getMintPrice().then(_mintValue => this.mintValue = _mintValue).catch(console.error);
  }

  async previewImage(e: Event) {
    const newLocal = (<HTMLInputElement>e.target).files;
    if (newLocal) {
      const file = newLocal[0];
      this.formData.fileName = file.name;

      if (file) {
        if (file.size < CreateUpload.FILE_SIZE_LIMIT) {
          const toBase64 = (file: Blob) => new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result || '').toString());
            reader.onerror = error => reject(error);
          });
          const base64 = await toBase64(file);
          this.formData.image = base64;
          this.isDisabled = false;
        } else {
          this.$q.notify({
            type: 'negative',
            message: this.$t('createCollectible.create.errorFile'),
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
  }

  close() {
    this.formData = {
      name: '',
      description: '',
      image: '',
      mintedBy: '',
      salt: '',
      creatorRoyalty: 0,
      fileName: '',
    };
    this.$emit('close', this.imageData);
  }

  get personalItemContractAddress() {
    return getPersonalItemContractByNetworkId(this.networkInfo.id);
  }

  async approveContractTransfer(amount: number) {
    this.painterPersonalItemStatus = PainterPersonalItemStatus.CheckingAllowance;

    const allowance = await this.algopTokenContract.allowance(this.account, this.personalItemContractAddress);

    if (allowance < amount) {
      this.painterPersonalItemStatus = PainterPersonalItemStatus.IncreateAllowanceAwaitingInput;

      await this.algopTokenContract
        .approve(
          this.personalItemContractAddress,
          numberToString(amount),
          this.account,
        ).on('error', () => {
          this.painterPersonalItemStatus =
            PainterPersonalItemStatus.IncreateAllowanceError;
        }).on('transactionHash', () => {
          this.painterPersonalItemStatus =
            PainterPersonalItemStatus.IncreateAllowanceAwaitingConfirmation;
        });
    }
  }

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
      const ipfsUploadResult = await api.post('images/mint', request);
      if (ipfsUploadResult.status === 200) {
        this.responseMint = ipfsUploadResult.data as IMintData;
      } else {
        throw new Error('An error occured when uploading to IPFS ' + ipfsUploadResult.statusText);
      }
      this.statusData = 'confirme';
      await this.mint();
    } catch (e) {
      this.$q.notify({
        type: 'negative',
        message: 'error mint image',
      });
      this.statusData = 'error';
    }
  }

  async mint() {
    try {
      if (this.responseMint) {
        await this.approveContractTransfer(this.mintValue);
        this.painterPersonalItemStatus = PainterPersonalItemStatus.PersonalItemAwaitingInput;
        await this.personalItemContract.mint(
          this.responseMint.data.name,
          this.responseMint.data.rawImageHash,
          this.responseMint.data.creatorRoyalty,
          this.responseMint.tokenURI,
          this.account,
        ).on('transactionHash', () => {
          this.painterPersonalItemStatus = PainterPersonalItemStatus.PersonalItemAwaitingConfirmation;
        }).on('error', () => {
          this.painterPersonalItemStatus = PainterPersonalItemStatus.PersonalItemError;
          setTimeout(() => {
            this.okBtnDisabled = false;
          }, 1000);
        }).catch(e => {
          console.error(e);
        });
        this.painterPersonalItemStatus = PainterPersonalItemStatus.PersonalItemCreated;
        setTimeout(() => {
          this.okBtnDisabled = false;
        }, 1000);
      } else {
        throw new Error('NFT Mint information is missing.');
      }
    } catch (e) {
      console.log('error mint', e);
    }
  }

  onCloseMyGallery() {
    void this.$router.push('/my-gallery');
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
  padding-bottom: 10px;
  align-items: center;
  display: flex;
  justify-content: center;
}

.preview-mobile{
    margin: 0;
  }

@media (min-width: 1024px){
  .preview{
    position: fixed;
    left: 70%;
    bottom: -30rem;
}
}
@media (min-width: 1024px){
  .preview{
    position: fixed;
    left: 70%;
    bottom: -30rem;
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
