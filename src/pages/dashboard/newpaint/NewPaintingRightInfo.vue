<template>
  <div class="img-container">
    <img
      v-if="!previewUrlGeneric && collectionAvatar"
      :src="collectionAvatar"
      class="img"
    >
    <q-img
      v-else-if="!previewUrlGwei && !previewUrlExpressions && collectionName === 'expressions'"
      :src="collectionImagePlaceholder"
      class="img"
    />
    <icon
      v-else-if="!previewUrlGwei && !previewUrlExpressions && collectionName === 'gwei'"
      :collection-name="'gwei'"
      :width="gweiPlaceholder.width"
      :heigth="gweiPlaceholder.heigth"
      :view-box="gweiPlaceholder.viewBox"
    />
    <q-spinner
      v-else-if="!isImgLoaded && previewUrl"
      size="50px"
      color="primary"
    />
    <img
      v-show="isImgLoaded"
      ref="previewImg"
      :src="previewUrl"
      class="img"
    />
  </div>
  <div class="content">
    <q-input
      v-model="artBasicInfo.name"
      :label="$t('dashboard.newPainting.artName')"
      :readonly="collectionName === 'gwei'"
      :disable="collectionName === 'gwei'"
      maxlength="64"
      counter
    />
    <q-input
      v-model="artBasicInfo.description"
      :label="$t('dashboard.newPainting.artDescription')"
      maxlength="64"
      counter
    />
    <div class="flex justify-center">
      <q-checkbox
        v-if="isCollectionInfoSet"
        v-model="isAwareOfFee"
        :label="checkboxFeeLabel"
        class="full-width q-pt-lg"
      />
      <q-spinner v-else size="20px" color="primary" />
    </div>
    <algo-button
      :label="$t('dashboard.newPainting.rightInfoBtnName')"
      :disable="!isAwareOfFee || !artBasicInfo.name || !artBasicInfo.description || !isPreviewUrlSet || isError"
      class="full-width q-mt-lg"
      color="primary"
      @click="mint"
    />
    <div v-if="isError" class="error row q-mt-lg">
      <div class="col-2 flex">
        <q-avatar
          size="60px"
          color="negative"
          class="icon self-center"
          text-color="white"
        >
          <q-icon name="mdi-alert-circle" />
        </q-avatar>
      </div>
      <div class="col-10 self-center message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import { ICollectionInfo, IArtBasicInfo } from 'src/models/IMint';
import { mapGetters } from 'vuex';
import { Watch } from 'vue-property-decorator';
import AlgoPainterExpressionsProxy from 'src/eth/AlgoPainterExpressionsItemProxy';
import { NetworkInfo } from 'src/store/user/types';
import { IGweiParsedItemParameters } from 'src/models/INewPaintingGwei';
import Icon from './icon.vue';
import ICollection from 'src/models/ICollection';
import AlgoPainterArtistCollection from 'src/eth/AlgoPainterArtistCollectionProxy';

class Props {
  collectionName = prop({

    type: String,
    required: true,
  });

  collectionAvatar = prop({
    type: String,
    required: false
  });
}

@Options({
  components: {
    AlgoButton,
    Icon
  },
  computed: {
    ...mapGetters(
      'user', [
        'networkInfo',
        'account',
        'isConnected',
      ]),
    ...mapGetters('mint', {
      collectionInfoGwei: 'GET_GWEI_COLLECTION_INFO',
      collectionInfoExpressions: 'GET_EXPRESSIONS_COLLECTION_INFO',
      collectionInfoGeneric: 'GET_COLLECTION_INFO',
      itemParametersGwei: 'GET_GWEI_ITEM_PARAMETERS',
      itemParametersExpressions: 'GET_EXPRESSIONS_ITEM_PARAMETERS',
      previewUrlGwei: 'GET_GWEI_PREVIEW_URL',
      previewUrlExpressions: 'GET_EXPRESSIONS_PREVIEW_URL',
      previewUrlGeneric: 'GET_PREVIEW_URL',
      errorMessageGwei: 'GET_GWEI_ERROR_MESSAGE',
      errorMessageExpressions: 'GET_EXPRESSIONS_ERROR_MESSAGE',
      collectionData: 'GET_COLLECTION_DATA',
    }),
  }
})
export default class NewPaintingRightInfo extends Vue.with(Props) {
  expressionsSystem!: AlgoPainterExpressionsProxy;
  algoPainterArtistCollection!: AlgoPainterArtistCollection;
  collectionSystem!: AlgoPainterExpressionsProxy | AlgoPainterArtistCollection;

  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  account!: string;

  collectionInfoGwei!: ICollectionInfo;
  collectionInfoExpressions!: ICollectionInfo;
  collectionInfoGeneric!: ICollectionInfo;
  checkboxFeeLabel!: string;
  isCollectionInfoSet: boolean = false;

  itemParametersGwei!: IGweiParsedItemParameters;

  errorMessageGwei!: string;
  errorMessageExpressions!: string;
  isError: boolean = false;
  errorMessage!: string;

  collectionData!: ICollection;
  collectionImagePlaceholder!: string;

  isAwareOfFee: boolean = false;
  expressionsFeePercentage!: number;

  previewUrl?: string;
  previewUrlGwei?: string;
  previewUrlExpressions?: string;
  previewUrlGeneric?: string;
  isPreviewUrlSet: boolean = false;
  isImgLoaded: boolean = false;

  artBasicInfo: IArtBasicInfo = {
    name: '',
    description: '',
  }

  gweiPlaceholder = {
    width: '264',
    heigth: '420',
    viewBox: '0 0 323 514'
  }

  created() {
    this.collectionSystem = (this.collectionName === 'expressions')
      ? new AlgoPainterExpressionsProxy(this.networkInfo)
      : new AlgoPainterArtistCollection(this.networkInfo);
  }

  mounted() {
    this.collectionName === 'expressions'
      ? this.collectionImagePlaceholder = 'src/assets/images/manwithnoname.jpeg'
      : this.setGweiSvgProperties();
  }

  @Watch('collectionInfoGwei')
  onCollectionInfoGweiChanged() {
    this.checkboxFeeLabel = this.$t('dashboard.newPainting.gwei.artMintingFee', {
      feeAmount: this.collectionInfoGwei.batchPriceCurrency,
      collectionCurrency: this.collectionInfoGwei.collectionToken,
    })

    this.isCollectionInfoSet = true;
  }

  @Watch('collectionInfoExpressions')
  async onCollectionInfoExpressionsChanged() {
    if (this.isExpressions(this.collectionSystem)) {
      this.checkboxFeeLabel = this.$t('dashboard.newPainting.expressions.artMintingFee', {
        feeAmount: this.collectionInfoExpressions.batchPriceCurrency,
        collectionCurrency: this.collectionInfoExpressions.collectionToken,
        feePercentage: await this.collectionSystem.getServiceFee() / 100
      })

      this.isCollectionInfoSet = true;
    }
  }

  @Watch('collectionInfoGeneric')
  async onCollectionInfoGenericChanged() {
    if (!this.isExpressions(this.collectionSystem)) {
      this.checkboxFeeLabel = this.$t('dashboard.newPainting.expressions.artMintingFee', {
        feeAmount: this.collectionInfoGeneric.batchPriceCurrency,
        collectionCurrency: this.collectionInfoGeneric.collectionToken,
        feePercentage: await this.collectionSystem.getMintFee() / 100
      })

      this.isCollectionInfoSet = true;
    }
  }

  @Watch('itemParametersGwei')
  onItemParametersGweiChanged() {
    this.artBasicInfo.name = (this.itemParametersGwei) ? this.itemParametersGwei.parsedText : '';
  }

  @Watch('errorMessageGwei')
  onErrorMessageGweiChanged() {
    this.errorMessage = this.errorMessageGwei;
    this.isError = (this.errorMessageGwei !== '');
  }

  @Watch('errorMessageExpressions')
  onErrorMessageExpressionsChanged() {
    this.errorMessage = this.errorMessageExpressions;
    this.isError = (this.errorMessageExpressions !== '');
  }

  async mint() {
    await this.$store
      .dispatch({
        type: 'mint/artBasicInfo',
        artBasicInfo: this.artBasicInfo,
        collectionName: this.collectionName,
      })
    await this.$store
      .dispatch({
        type: 'mint/mintingStatus',
        isMinting: true,
        collectionName: this.collectionName,
      })
  }

  declare $refs: {
    previewImg: any;
  };

  @Watch('previewUrlGwei')
  onPreviewUrlGweiChanged() {
    this.isPreviewUrlSet = true;
    this.previewUrl = this.previewUrlGwei;

    this.checkIfImgIsLoaded();
  }

  @Watch('previewUrlExpressions')
  onPreviewUrlExpressionChanged() {
    this.isPreviewUrlSet = true;
    this.previewUrl = this.previewUrlExpressions;

    this.checkIfImgIsLoaded();
  }

  @Watch('previewUrlGeneric')
  onPreviewUrlGenericChanged() {
    console.log('previewUrlGeneric', this.previewUrlGeneric);
    this.isPreviewUrlSet = true;
    this.previewUrl = this.previewUrlGeneric;

    this.checkIfImgIsLoaded();
  }

  checkIfImgIsLoaded() {
    if (this.previewUrlGwei || this.previewUrlExpressions || this.previewUrlGeneric) {
      const interval = setInterval(() => {
        this.isImgLoaded = this.$refs.previewImg.complete;

        if (this.isImgLoaded) {
          clearInterval(interval);
        }
      }, 1000);
    } else {
      this.isImgLoaded = false;
    }
  }

  isExpressions(instance: any) : instance is AlgoPainterExpressionsProxy {
    return instance instanceof AlgoPainterExpressionsProxy;
  }

  setGweiSvgProperties() {
    if (window.innerWidth <= 280) {
      this.gweiPlaceholder.width = '150';
      this.gweiPlaceholder.heigth = '220';
      this.gweiPlaceholder.viewBox = '0 0 323 514';
    } else if (window.innerWidth <= 414) {
      this.gweiPlaceholder.width = '200';
      this.gweiPlaceholder.heigth = '300';
      this.gweiPlaceholder.viewBox = '0 0 323 514';
    } else if (window.innerWidth <= 540) {
      this.gweiPlaceholder.width = '200';
      this.gweiPlaceholder.heigth = '320';
      this.gweiPlaceholder.viewBox = '0 0 323 514';
    } else if (window.innerWidth <= 820) {
      this.gweiPlaceholder.width = '380';
      this.gweiPlaceholder.heigth = '500';
      this.gweiPlaceholder.viewBox = '0 0 323 514';
    } else if (window.innerWidth <= 912) {
      this.gweiPlaceholder.width = '480';
      this.gweiPlaceholder.heigth = '600';
      this.gweiPlaceholder.viewBox = '0 0 323 514';
    } else if (window.innerWidth <= 1024) {
      this.gweiPlaceholder.width = '200';
      this.gweiPlaceholder.heigth = '320';
      this.gweiPlaceholder.viewBox = '0 0 323 514';
    } else {
      this.gweiPlaceholder.width = '264';
      this.gweiPlaceholder.heigth = '420';
      this.gweiPlaceholder.viewBox = '0 0 323 514';
    }
  }
}
</script>

<style lang="scss" scoped>
  .error {
    padding: 10px;
    border: $primary solid 1px;
    border-radius: 5px;
    font-weight: bold;
  }

  @media (max-width: 1024px) {
    .error {
      .icon {
        font-size: 45px !important;
      }
      .message {
        font-size: 12px;
      }
    }
  }

  @media (max-width: 360px) {
    .error {
      .icon {
        font-size: 40px !important;
      }
    }
  }

  @media (max-width: 280px) {
    .error {
      .icon {
        font-size: 28px !important;
      }
      .message {
        font-size: 10px;
      }
    }
  }

  .img-container {
    display: flex;
    justify-content: center;
    padding: 40px;
    min-height: 420px;
    max-height: 420px;
    align-items: center;
      .img {
        width: 80%;
        height: 80%;
      }
  }

  @media (max-width: 1024px) {
    .img-container {
      padding: 0px;
      min-height: 200px;
      max-height: 200px;
      margin-top: 50px;
    }
    .content {
      margin-top: 50px;
    }
  }

  @media (max-width: 912px) {
    .img-container {
      margin-top: 215px;
    }
    .content {
      margin-top: 225px;
    }
  }

  @media (max-width: 820px) {
    .img-container {
      margin-top: 135px;
    }
    .content {
      margin-top: 145px;
    }
  }

  @media (max-width: 768px) {
    .img-container {
      margin-top: 185px;
    }
    .content {
      margin-top: 195px;
    }
  }

  @media (max-width: 540px) {
    .img-container {
      margin-top: 90px;
    }
    .content {
      margin-top: 100px;
    }
  }

  @media (max-width: 414px) {
    .img-container {
      margin-top: 40px;
    }
    .content {
      margin-top: 50px;
    }
  }

  @media (max-width: 280px) {
    .img-container {
      margin-top: 0px;
    }
    .content {
      margin-top: 10px;
    }
  }
</style>

<style lang="scss">
  .q-img {
    padding-bottom: 0px;
  }
</style>