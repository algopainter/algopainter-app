<template>
  <div v-if="formCollection">
    <div>
      <div class="flex justify-center align-center">
        <img
          :src="formCollection.avatar"
          class="img"
        >
      </div>
      <q-form class="q-pa-sm full-width">
        <div class="row">
          <q-input
            :model-value="userProfile.name"
            :label="$t('dashboard.createCollection.aboutTheCollection.nameArtist')"
            class="col-6 q-pr-md"
            readonly
          />
          <q-input
            :model-value="formCollection.title"
            :label="$t('dashboard.createCollection.aboutTheCollection.nameCollection')"
            class="col-6 q-pl-md"
            readonly
          />
        </div>
        <div class="row">
          <q-input
            :label="$t('dashboard.createCollection.aboutTheCollection.website')"
            class="col-6 q-pr-md"
            readonly
          />
          <q-input
            :model-value="formCollection.description"
            :label="$t('dashboard.createCollection.aboutTheCollection.description')"
            class="col-6 q-pl-md"
            readonly
          />
        </div>
        <div class="row">
          <q-input
            :model-value="startDT"
            :label="$t('dashboard.createCollection.stepTwo.startDT')"
            class="col-6 q-pr-md"
            readonly
          />
          <q-input
            :model-value="endDT"
            :label="$t('dashboard.createCollection.stepTwo.endDT')"
            class="col-6 q-pl-md"
            readonly
          />
        </div>
        <div class="row">
          <q-input
            :model-value="formCollection.metrics.nfts"
            :label="$t('dashboard.createCollection.stepTwo.amount')"
            class="col-6 q-pr-md"
            readonly
          />
          <q-input
            :model-value="typePrice"
            :label="$t('dashboard.createCollection.stepTwo.scheme')"
            class="col-6 q-pl-md"
            readonly
          />
        </div>
        <div>
          <div
            v-if="(formCollection.metrics.priceType === '0')"
            class="row"
          >
            <q-input
              :model-value="formCollection.metrics.priceRange[0].amount"
              :label="$t('dashboard.createCollection.stepTwo.price')"
              class="col-6 q-pr-md"
              readonly
            />
            <q-input
              :model-value="formCollection.metrics.tokenPriceSymbol"
              :label="$t('dashboard.createCollection.stepTwo.token')"
              class="col-6 q-pl-md"
              readonly
            />
          </div>
          <div
            v-for="(range, i) in formCollection.metrics.priceRange"
            v-else
            :key="range.from"
            class="q-pa-md q-my-md variable-card"
          >
            <p class="label">
              {{ $t('dashboard.createCollection.stepTwo.priceRangeCounter', {num: i + 1}) }}
            </p>
            <div class="row">
              <q-input
                :model-value="formCollection.metrics.priceRange[i].from"
                :label="$t('dashboard.createCollection.stepTwo.from')"
                class="col-6 q-pr-md"
                readonly
              />
              <q-input
                :model-value="formCollection.metrics.priceRange[i].to"
                :label="$t('dashboard.createCollection.stepTwo.to')"
                class="col-6 q-pl-md"
                readonly
              />
            </div>
            <q-input
              :model-value="formCollection.metrics.priceRange[i].amount"
              :label="$t('dashboard.createCollection.stepTwo.price')"
              class="col-6 q-pr-md"
              readonly
            />
          </div>
          <div class="row">
            <q-input
              :model-value="formCollection.metrics.creatorPercentage / 100"
              :label="$t('dashboard.createCollection.stepTwo.creator')"
              class="col-6 q-pr-md"
              suffix="%"
              readonly
            />
            <q-input
              :model-value="formCollection.metrics.walletAddress"
              :label="$t('dashboard.createCollection.stepTwo.address')"
              class="col-6 q-pl-md"
              readonly
            />
          </div>
          <div class="row">
            <q-input
              v-if="(formCollection.metrics.priceType !== '0')"
              :model-value="formCollection.metrics.tokenPriceSymbol"
              :label="$t('dashboard.createCollection.stepTwo.token')"
              class="col-6 q-pr-md"
              readonly
            />
            <q-input
              :model-value="formCollection.api.collectionInfo.api"
              :label="$t('dashboard.createCollection.stepThree.url')"
              :class="[(formCollection.metrics.priceType !== '0') ? 'col-6 q-pl-md' : 'col-6 q-pr-md']"
              readonly
            />
          </div>
        </div>
        <div class="row">
          <div class="q-pa-md">
            <algo-button
              color="red"
              label="Disapprove"
              @click="DisapproveCollection"
            />
          </div>
          <div class="q-pa-md">
            <algo-button
              color="green"
              label="Approve"
              @click="ApproveCollection"
            />
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import { IcollectionData } from 'src/models/ICreatorCollection';
import AlgoButton from 'components/common/Button.vue';
import { PropType } from 'vue';
import ICollection from 'src/models/ICollection';
import moment from 'moment';
import { mapGetters } from 'vuex';
import { nanoid } from 'nanoid';
import Web3Helper from 'src/helpers/web3Helper';
import { isError } from 'src/helpers/utils';
import { api } from 'src/boot/axios';
import UserController from 'src/controllers/user/UserController';
import { IProfile } from 'src/models/IProfile';

interface Aproved {
  collectionId: number;
  approvedBy: string;
  salt: string;
}

class Props {
  checkForm = prop({
    type: String,
    required: true,
  });

  id = prop({
    type: String,
    required: true,
  });

  collectionData = prop({
    type: Object as PropType<IcollectionData>,
    required: true,
  });

    collection = prop({
      type: Object as PropType<ICollection>,
      required: true,
    });
}

@Options({
  components: {
    AlgoButton
  },
  computed: {
    ...mapGetters('user', {
      account: 'account',
    })
  }
})

export default class PreviewValidate extends Vue.with(Props) {
   aproved: Aproved = {
     collectionId: 0,
     approvedBy: '',
     salt: '',
   }

  isFeeChecked: boolean = false;
  isFormChecked: boolean = false;
  isError: boolean = false;
  errorMsg: string = '';
  isVerifyingTheForm: boolean = false;
  isPreviewingForm: boolean = false;
  typePrice: string = ''

  formCollection: ICollection | null = null;
  userProfile: IProfile = {};
  startDT: string = ''
  endDT: string = '';
  userController: UserController = new UserController();

  mounted() {
    void this.getCollection()
  }

  formatter() {
    if (this.formCollection && this.formCollection.metrics.priceType === '0') {
      this.typePrice = 'fixed'
    } else {
      this.typePrice = 'variable'
    }
    this.startDT = moment(this.formCollection?.metrics.startDT).format('DD/MM/YYYY hh:mm:ss')
    this.endDT = moment(this.formCollection?.metrics.endDT).format('DD/MM/YYYY hh:mm:ss')
  }

  close() {
    this.$emit('close', false)
  }

  getCollection() {
    void this.$store.dispatch({
      type: 'mint/VerifyPreview',
      collectionId: this.id
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const collection = this.$store.getters['mint/GET_VERIFY_PREVIEW'];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      this.formCollection = collection
      console.log('collele', this.formCollection)
      this.formatter()
      void this.loadUserProfile()
    });
  }

  async loadUserProfile() {
    const result = await this.userController.getUserProfile(
      this.formCollection?.account as string,
    )
    this.userProfile = result.getValue() as IProfile
    console.log('account', this.userProfile.name)
  }

  async ApproveCollection() {
    if (this.formCollection) {
      try {
        const data = {
          collectionId: this.formCollection.blockchainId,
          approvedBy: this.$store.getters['user/account'] as string,
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
        const status = await api.put(`collections/${this.formCollection.blockchainId}/approve`, request);
        if (status.status === 200) {
          this.$q.notify({
            type: 'positive',
            message: 'The collection was successfully approved!',
          });
          setTimeout(() => {
            void this.$router.push('/validate-collection')
          }, 1000)
        } else {
          this.$q.notify({
            type: 'negative',
            message: 'It was not possible to approve the collection :(',
          });
        }
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          message: 'It was not possible to approve the collection :(',
        });
      }
    }
  }

  async DisapproveCollection() {
    if (this.formCollection) {
      try {
        const data = {
          collectionId: this.formCollection.blockchainId,
          approvedBy: this.$store.getters['user/account'] as string,
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
        const status = await api.put(`collections/${this.formCollection.blockchainId}/disapprove`, request);
        if (status.status === 200) {
          this.$q.notify({
            type: 'positive',
            message: 'The collection was successfully disapproved!',
          });
          setTimeout(() => {
            void this.$router.push('/validate-collection')
          }, 1000)
        } else {
          this.$q.notify({
            type: 'negative',
            message: 'It was not possible to disapprove the collection :(',
          });
        }
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          message: 'It was not possible to disapprove the collection :(',
        });
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .variable-card {
    border: 1px $primary solid;
    border-radius: 5px;
  }

  .img{
    width: 210px;
    height: 210px;
    border-radius: 50%;
  }

  .label {
    font-weight: 400;
    margin: 0 0 10px 0;
    color: rgba(0, 0, 0, 0.6);
  }
  .avatar{
      width: 210px;
      height: 210px;
  }

</style>
