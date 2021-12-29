<template>
  <div class="img-container">
    <q-img
      v-if="!previewUrlGwei && !previewUrlExpressions"
      :src="collectionImagePlaceholder"
      class="img"
    />
    <q-spinner
      v-else-if="isImgLoading && previewUrl "
      size="50px"
      color="primary"
    />
    <q-img
      v-show="isImgLoaded"
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
      :disable="!isAwareOfFee || !artBasicInfo.name || !artBasicInfo.description || !isPreviewUrlSet"
      class="full-width q-mt-lg"
      color="primary"
      @click="mint"
    />
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

class Props {
  collectionName = prop({
    type: String,
    required: true,
  });
}

@Options({
  components: {
    AlgoButton,
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
      itemParametersGwei: 'GET_GWEI_ITEM_PARAMETERS',
      itemParametersExpressions: 'GET_EXPRESSIONS_ITEM_PARAMETERS',
      previewUrlGwei: 'GET_GWEI_PREVIEW_URL',
      previewUrlExpressions: 'GET_EXPRESSIONS_PREVIEW_URL',
    }),
  }
})
export default class NewPaintingRightInfo extends Vue.with(Props) {
  expressionsSystem!: AlgoPainterExpressionsProxy;

  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  account!: string;

  collectionInfoGwei!: ICollectionInfo;
  collectionInfoExpressions!: ICollectionInfo;
  checkboxFeeLabel!: string;
  isCollectionInfoSet: boolean = false;

  itemParametersGwei!: IGweiParsedItemParameters;

  collectionImagePlaceholder!: string;

  isAwareOfFee: boolean = false;
  expressionsFeePercentage!: number;

  previewUrl!: string | undefined;
  previewUrlGwei!: string | undefined;
  previewUrlExpressions!: string | undefined;
  isPreviewUrlSet: boolean = false;

  isImgLoaded: boolean = false;
  isImgLoading: boolean = true;

  artBasicInfo: IArtBasicInfo = {
    name: '',
    description: '',
  }

  created() {
    this.expressionsSystem = new AlgoPainterExpressionsProxy(this.networkInfo);
  }

  mounted() {
    this.collectionImagePlaceholder = (this.collectionName === 'gwei') ? 'img/hashly-gwei.svg' : 'img/manwithnoname.jpeg';
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
    await this.getServiceFee().catch(console.error);
    this.checkboxFeeLabel = this.$t('dashboard.newPainting.expressions.artMintingFee', {
      feeAmount: this.collectionInfoExpressions.batchPriceCurrency,
      collectionCurrency: this.collectionInfoExpressions.collectionToken,
      feePercentage: this.expressionsFeePercentage
    })
    this.isCollectionInfoSet = true;
  }

  @Watch('itemParametersGwei')
  onItemParametersGweiChanged() {
    this.artBasicInfo.name = this.itemParametersGwei.parsedText;
  }

  async getServiceFee() {
    this.expressionsFeePercentage = await this.expressionsSystem.getServiceFee() / 100;
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

  imgLoadingEnded() {
    this.isImgLoading = false;
    this.isImgLoaded = true;
  }

  @Watch('previewUrlGwei')
  onPreviewUrlGweiChanged() {
    this.isPreviewUrlSet = true;
    this.previewUrl = this.previewUrlGwei;
    this.isImgLoaded = false;
    this.isImgLoading = true;
    setTimeout(() => { this.imgLoadingEnded() }, 10000);
  }

  @Watch('previewUrlExpressions')
  onPreviewUrlExpressionChanged() {
    this.isPreviewUrlSet = true;
    this.previewUrl = this.previewUrlExpressions;
    this.isImgLoading = false;
    this.isImgLoaded = true;
  }
}
</script>

<style lang="scss" scoped>
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
    min-height: 370px;
    max-height: 370px;
  }
}
</style>

<style lang="scss">
  .q-img {
    padding-bottom: 0px;
  }
</style>