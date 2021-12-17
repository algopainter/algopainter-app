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
import { Form as VForm, Field as VField } from 'vee-validate';
import { nanoid } from 'nanoid';
import Web3Helper from 'src/helpers/web3Helper';
import { api } from 'src/boot/axios';
import { mapGetters } from 'vuex';
import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterPersonalItemProxy from 'src/eth/AlgoPainterPersonalItemProxy';
import { getPersonalItemContractByNetworkId } from 'src/eth/Config';
import ERC20TokenProxy from 'src/eth/ERC20TokenProxy';
import { numberToString } from 'src/helpers/format/numberToString';
import { IMint } from 'src/models/IMint';

class PropsTypes {
  uploadLabel: string | undefined;
  titleLabel: string | undefined;
  titleMaxlength: number | undefined;
  descriptionLabel: string | undefined;
  descriptionMaxlength: number | undefined;
}

enum PainterPersonalItemStatus {
  CheckingAllowance,
  IncreateAllowanceAwaitingInput,
  IncreateAllowanceAwaitingConfirmation,
  IncreateAllowanceError,
  IncreateAllowanceCompleted,
  PersonalItemAwaitingInput,
  PersonalItemAwaitingConfirmation,
  PersonalItemError,
  PersonalItemCreated,
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
  imageData: string | null = null;
  OpenModal: boolean = false;
  isDisabled: boolean = true;
  statusData : string = '';
  creatorRoyaltyValue: number = 0;
  isresponsibility: boolean = false;
  isAgreeValue: boolean = false;
  currentAmount: number = 0;
  personalItem!: AlgoPainterPersonalItemProxy;
  mintPersonalItem!: AlgoPainterPersonalItemProxy;
  painterPersonalItemStatus!: PainterPersonalItemStatus;
  auctionCoinTokenProxy!: ERC20TokenProxy;
  networkInfo!: NetworkInfo;
  mintValue: number = 100;
  account!: string;
  dataMint: string = ''
  responseMint!: IMint;
  creatorRoyaltytest!: number;

  created() {
    this.personalItem = new AlgoPainterPersonalItemProxy(this.networkInfo);
    this.mintPersonalItem = new AlgoPainterPersonalItemProxy(this.networkInfo);
  }

  mounted() {
    // void this.getCurrent();
  }

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

  get auctionRewardsContractAddress() {
    return getPersonalItemContractByNetworkId(this.networkInfo.id);
  }

  async approveContractTransfer(amount: number) {
    this.painterPersonalItemStatus = PainterPersonalItemStatus.CheckingAllowance;

    const allowance = await this.auctionCoinTokenProxy.allowance(
      this.account,
      this.auctionRewardsContractAddress,
    );

    if (allowance < amount) {
      this.painterPersonalItemStatus =
        PainterPersonalItemStatus.IncreateAllowanceAwaitingInput;

      await this.auctionCoinTokenProxy
        .approve(
          this.auctionRewardsContractAddress,
          numberToString(amount),
          this.account,
        )
        .on('error', () => {
          this.painterPersonalItemStatus =
            PainterPersonalItemStatus.IncreateAllowanceError;
        })
        .on('transactionHash', () => {
          this.painterPersonalItemStatus =
            PainterPersonalItemStatus.IncreateAllowanceAwaitingConfirmation;
        });
    }
  }

  async getCurrent() {
    try {
      this.currentAmount = await this.personalItem.getCurrentAmount(2, 0);
      console.log(this.currentAmount);
    } catch (error) {
      console.log('Error - getCurrentAmount - create Upload ', error);
      console.log(this.currentAmount);
    }
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
      this.responseMint = await api.post('images/mint', request);
      // const dado = this.responseMint.data.name as unknown as IApiResponse<string>;
      // const dado = this.responseMint.tokenURI as unknown as IApiResponse<string>;
      // const datas = this.responseMint.data.rawImageHash as unknown as IApiResponse<string>;
      // this.dataMint = dado as unknown as string;
      console.log('foiii', this.responseMint.data.tokenURI);
      this.statusData = 'confirme';
      await this.mint();
    } catch (e) {
      this.$q.notify({
        type: 'negative',
        message: 'error',
      });
      this.statusData = 'error';
    }
  }

  async mint() {
    const name = this.responseMint.data.data.name;
    this.creatorRoyaltytest = this.responseMint.data.data.creatorRoyalty;
    const rawImageHash = this.responseMint.data.data.rawImageHash;
    const tokenURI = this.responseMint.data.tokenURI;
    try {
      this.painterPersonalItemStatus = PainterPersonalItemStatus.PersonalItemAwaitingInput;
      await this.mintPersonalItem.mint(
        name,
        rawImageHash,
        this.creatorRoyaltytest,
        tokenURI,
        this.account,
      ).on('transactionHash', () => {
        this.painterPersonalItemStatus = PainterPersonalItemStatus.PersonalItemAwaitingConfirmation;
      }).on('error', () => {
        this.painterPersonalItemStatus = PainterPersonalItemStatus.IncreateAllowanceError;
      });
      this.painterPersonalItemStatus = PainterPersonalItemStatus.PersonalItemCreated;
      await this.approveContractTransfer(this.mintValue);
    } catch (e) {
      console.log('error mint');
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
