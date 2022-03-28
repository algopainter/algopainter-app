<template v-if="registerPrice">
  <h5 class="text-bold">{{ $t('dashboard.createCollection.stepFour.summary') }}</h5>
  <div v-if="!isPreviewingForm">
    <div class="flex justify-center align-center">
      <img
        :src="collectionData.aboutTheCollection.avatar"
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
          :model-value="collectionData.aboutTheCollection.nameCollection"
          :label="$t('dashboard.createCollection.aboutTheCollection.nameCollection')"
          class="col-6 q-pl-md"
          readonly
        />
      </div>
      <div class="row">
        <q-input
          :model-value="collectionData.aboutTheCollection.webSite"
          :label="$t('dashboard.createCollection.aboutTheCollection.website')"
          class="col-6 q-pr-md"
          readonly
        />
        <q-input
          :model-value="collectionData.aboutTheCollection.description"
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
          :model-value="collectionData.collectionMetrics.nfts"
          :label="$t('dashboard.createCollection.stepTwo.amount')"
          class="col-6 q-pr-md"
          readonly
        />
        <q-input
          :model-value="collectionData.collectionMetrics.priceType"
          :label="$t('dashboard.createCollection.stepTwo.scheme')"
          class="col-6 q-pl-md"
          readonly
        />
      </div>
      <div>
        <div
          v-if="(collectionData.collectionMetrics.priceType === 'fixed')"
          class="row"
        >
          <q-input
            :model-value="collectionData.collectionMetrics.priceRange[0].amount"
            :label="$t('dashboard.createCollection.stepTwo.price')"
            class="col-6 q-pr-md"
            readonly
          />
          <q-input
            :model-value="collectionData.collectionMetrics.tokenPriceSymbol"
            :label="$t('dashboard.createCollection.stepTwo.token')"
            class="col-6 q-pl-md"
            readonly
          />
        </div>
        <div
          v-for="(range, i) in collectionData.collectionMetrics.priceRange"
          v-else
          :key="range.from"
          class="q-pa-md q-my-md variable-card"
        >
          <p class="label">
            {{ $t('dashboard.createCollection.stepTwo.priceRangeCounter', {num: i + 1}) }}
          </p>
          <div class="row">
            <q-input
              :model-value="collectionData.collectionMetrics.priceRange[i].from"
              :label="$t('dashboard.createCollection.stepTwo.from')"
              class="col-6 q-pr-md"
              readonly
            />
            <q-input
              :model-value="collectionData.collectionMetrics.priceRange[i].to"
              :label="$t('dashboard.createCollection.stepTwo.to')"
              class="col-6 q-pl-md"
              readonly
            />
          </div>
          <q-input
            :model-value="collectionData.collectionMetrics.priceRange[i].amount"
            :label="$t('dashboard.createCollection.stepTwo.price')"
            class="col-6 q-pr-md"
            readonly
          />
        </div>
        <div class="row">
          <q-input
            :model-value="collectionData.collectionMetrics.creatorPercentage / 100"
            :label="$t('dashboard.createCollection.stepTwo.creator')"
            class="col-6 q-pr-md"
            suffix="%"
            readonly
          />
          <q-input
            :model-value="collectionData.collectionMetrics.walletAddress"
            :label="$t('dashboard.createCollection.stepTwo.address')"
            class="col-6 q-pl-md"
            readonly
          />
        </div>
        <div class="row">
          <q-input
            v-if="(collectionData.collectionMetrics.priceType !== 'fixed')"
            :model-value="collectionData.collectionMetrics.priceRange[0].tokenPriceSymbol"
            :label="$t('dashboard.createCollection.stepTwo.token')"
            class="col-6 q-pr-md"
            readonly
          />
          <q-input
            :model-value="generatePreviewUrl"
            :label="$t('dashboard.createCollection.stepThree.url')"
            :class="[(collectionData.collectionMetrics.priceType !== 'fixed') ? 'col-6 q-pl-md' : 'col-6 q-pr-md']"
            readonly
          />
        </div>
      </div>
    </q-form>
  </div>
  <div v-else>
    <form-previewer :params="collectionData.apiParameters.parameters" />
  </div>
  <div class="column q-pt-md">
    <q-checkbox
      v-model="isFormChecked"
      :label="$t('dashboard.createCollection.stepFour.formChecked')"
      color="primary"
    />
    <q-checkbox
      v-model="isFeeChecked"
      :label="$t('dashboard.createCollection.stepFour.feeChecked', {fee: registerPrice, token: 'ALGOP'})"
      color="primary"
    />
  </div>
  <error v-if="(isError && isVerifyingTheForm) || callErrMsg !== ''" :error-msg="errorMsg" />
  <q-page-sticky
    position="bottom-right"
    :offset="[18, 18]"
  >
    <q-btn
      fab
      icon="preview"
      color="primary"
      :label="[isPreviewingForm ? $t('dashboard.createCollection.stepThree.goBack') : $t('dashboard.createCollection.stepThree.previewForm')]"
      @click="isPreviewingForm = !isPreviewingForm"
    />
  </q-page-sticky>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import { IcollectionData } from 'src/models/ICreatorCollection';
import FormPreviewer from './FormPreviewer.vue';
import { Watch } from 'vue-property-decorator';
import Error from './Error.vue';
import { PropType } from 'vue';
import moment from 'moment';
import AlgoPainterArtistCollection from 'src/eth/AlgoPainterArtistCollectionProxy';
import { mapGetters } from 'vuex';
import { NetworkInfo } from 'src/store/user/types';
import UserController from 'src/controllers/user/UserController';
import { IProfile } from 'src/models/IProfile';

class Props {
  checkForm = prop({
    type: String,
    required: true,
  });

  collectionData = prop({
    type: Object as PropType<IcollectionData>,
    required: true,
  });

  callErrMsg = prop({
    type: String,
    required: true,
    default: ''
  });
}

@Options({
  components: {
    FormPreviewer,
    Error
  },
  computed: {
    ...mapGetters(
      'user', [
        'isConnected',
        'networkInfo',
        'account',
      ]),
  }
})

export default class CollectionSummary extends Vue.with(Props) {
  algoPainterArtistCollection!: AlgoPainterArtistCollection;
  networkInfo!: NetworkInfo;
  registerPrice!: string;

  isFeeChecked: boolean = false;
  isFormChecked: boolean = false;
  isError: boolean = false;
  errorMsg: string = '';
  isVerifyingTheForm: boolean = false;
  isPreviewingForm: boolean = false;
  startDT: Date | string = '';
  endDT?: Date | string;
  userProfile: IProfile = {};
  userController: UserController = new UserController();

  created() {
    this.algoPainterArtistCollection = new AlgoPainterArtistCollection(this.networkInfo);
  }

  get accountAddress() {
    return this.$store.state.user.account;
  }

  async mounted() {
    this.startDT = moment(this.collectionData.collectionMetrics.startDT).format('MMMM Do YYYY, h:mm:ss a');
    this.endDT = moment(this.collectionData.collectionMetrics.endDT).format('MMMM Do YYYY, h:mm:ss a');

    this.registerPrice = await this.algoPainterArtistCollection.getCollectionPrice();
    void this.loadUserProfile();
  }

  @Watch('callErrMsg')
  onCallErrMsgChanged() {
    this.errorMsg = this.callErrMsg;
  }

  get generatePreviewUrl() {
    let previewUrl: string = this.collectionData.apiParameters.collectionInfo.api + '?';

    if (!this.collectionData.apiParameters.collectionInfo.isSpecialParamsChecked) {
      if (this.collectionData.apiParameters.collectionInfo.isSizeInUrlChecked) {
        previewUrl += `size=${this.collectionData.apiParameters.collectionInfo.width}x${this.collectionData.apiParameters.collectionInfo.height}&`;
      } else {
        previewUrl += `width=${this.collectionData.apiParameters.collectionInfo.width}&height=${this.collectionData.apiParameters.collectionInfo.height}&`;
      }
    }

    this.collectionData.apiParameters.fixedParams.forEach((param) => {
      previewUrl += `${param.name}=${param.value.toString()}&`
    })

    this.collectionData.apiParameters.parameters.forEach((param, i) => {
      previewUrl += (typeof param.defaultValue === 'object') ? `${param.name}=${param.defaultValue.value.toString()}` : `${param.name}=${param.defaultValue.toString()}`;

      if ((i + 1) !== this.collectionData.apiParameters.parameters.length) {
        previewUrl += '&'
      }
    })
    const searchRegExp = /\s/g;

    return previewUrl.replace(searchRegExp, '%20');
  }

  verifyForm() {
    this.isVerifyingTheForm = true;

    if (!this.isFeeChecked) {
      this.errorMsg = this.$t('dashboard.createCollection.stepFour.feeError');
    } else if (!this.isFormChecked) {
      this.errorMsg = this.$t('dashboard.createCollection.stepFour.formError');
    } else {
      this.isError = false;
      this.isVerifyingTheForm = false;
      return true;
    }

    this.isError = true;
    return false;
  }

  @Watch('checkForm')
  onCheckFormErrorChanged() {
    if (this.checkForm) {
      this.verifyForm() && this.isError === false ? this.$emit('verify', true) : this.$emit('verify', false);
    }
  }

  async loadUserProfile() {
    const result = await this.userController.getUserProfile(
      this.accountAddress as string,
    )
    this.userProfile = result.getValue() as IProfile;
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

</style>
