<template>
  <div class="img-container">
    <q-img
      v-if="!previewUrlGwei && !previewUrlExpressions"
      :src="[collectionName === 'gwei' ? 'img/hashly-gwei.svg' : 'img/manwithnoname.jpeg']"
      class="img"
    />
    <q-spinner 
      v-else-if="isImgLoading && previewUrlGwei || previewUrlExpressions "
      size="50px"
      color="primary"
    />
    <q-img
      v-show="isImgLoaded"
      :src="[collectionName === 'gwei' ? previewUrlGwei : previewUrlExpressions]"
      class="img"
    />
  </div>
  <div class="content">
    <q-input
      v-model="artBasicInfo.name"
      :label="$t('dashboard.newPainting.artName')"
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
      <q-radio
        v-if="isCollectionInfoSet && collectionName === 'gwei' || isCollectionInfoSet && isExpressionsFeePercentageSet"
        v-model="isAwareOfFee"
        :label="[collectionName === 'gwei' 
          ? $t('dashboard.newPainting.gwei.artMintingFee', {
            feeAmount: collectionInfo.batchPriceCurrency,
            collectionCurrency: collectionInfo.collectionToken,
          })
          : $t('dashboard.newPainting.expressions.artMintingFee', {
            feeAmount: collectionInfo.batchPriceCurrency,
            collectionCurrency: collectionInfo.collectionToken,
            feePercentage: expressionsFeePercentage
          })
        ]"
        class="full-width q-pt-lg"
        :val="true"
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
import AlgoPainterExpressionsProxy from 'src/eth/AlgoPainterExpressionsProxy';
import { NetworkInfo } from 'src/store/user/types';

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
      previewUrlGwei: 'GET_GWEI_PREVIEW_URL',
      previewUrlExpressions: 'GET_EXPRESSIONS_PREVIEW_URL',
      collectionInfoGwei: 'GET_GWEI_COLLECTION_INFO',
      collectionInfoExpressions: 'GET_EXPRESSIONS_COLLECTION_INFO',
    }),
  }
})
export default class NewPaintingRightInfo extends Vue.with(Props) {
  expressionsSystem!: AlgoPainterExpressionsProxy;

  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  account!: string;

  isAwareOfFee = false;
  expressionsFeePercentage!: number;
  isExpressionsFeePercentageSet = false;

  collectionInfo!: ICollectionInfo;
  collectionInfoGwei!: ICollectionInfo;
  collectionInfoExpressions!: ICollectionInfo;
  isCollectionInfoSet: boolean = false;

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

  @Watch('collectionInfoGwei')
  onCollectionInfoGweiChanged() {
    this.collectionInfo = this.collectionInfoGwei;
    this.isCollectionInfoSet = true;
  }

  @Watch('collectionInfoExpressions')
  onCollectionInfoExpressionsChanged() {
    this.collectionInfo = this.collectionInfoExpressions;
    this.isCollectionInfoSet = true;
    this.getServiceFee().catch(console.error);
  }

  async getServiceFee() {
    this.expressionsFeePercentage = await this.expressionsSystem.getServiceFee() / 100;
    this.isExpressionsFeePercentageSet = true;
  }

  async mint() {
    await this.$store
      .dispatch({
        type: 'mint/artBasicInfo',
        artBasicInfo: this.artBasicInfo,
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
    this.isImgLoaded = false;
    this.isImgLoading = true;
    setTimeout(() => { this.imgLoadingEnded() }, 10000);
  }

  @Watch('previewUrlExpression')
  onPreviewUrlExpressionChanged() {
    this.isPreviewUrlSet = true;
    this.isImgLoaded = false;
    this.isImgLoading = true;
    setTimeout(() => { this.imgLoadingEnded() }, 10000);
  }
}
</script>

<style lang="scss" scoped>
  .img-container {
    display: flex;
    justify-content: center;
    padding: 40px;
    align-items: center;
      .img {
        width: 80%;
        height: 80%;
      }
  }
</style>