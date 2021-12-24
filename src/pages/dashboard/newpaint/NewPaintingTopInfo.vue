<template>
  <div
    id="new-painting-top-info"
    class="row q-pb-lg"
  >
    <div class="batch-price">
      <p class="title">{{ $t('dashboard.newPainting.batchPrice', { coin: coinDetails.label }).toUpperCase() }}</p>
      <p v-if="!loading" class="amount">{{ batchPrice }}</p>
      <q-spinner v-else size="80px" color="primary" />
    </div>
    <div class="remaining">
      <p class="title">{{ $t('dashboard.newPainting.remaining').toUpperCase() }}</p>
      <p v-if="!loading" class="amount">{{ remainingImages }}</p>
      <q-spinner v-else size="80px" color="primary" />
    </div>
    <div class="minted">
      <p class="title">{{ $t('dashboard.newPainting.minted').toUpperCase() }}</p>
      <p v-if="!loading" class="amount">{{ mintedImagesAmount }}</p>
      <q-spinner v-else size="80px" color="primary" />
    </div>
    <div v-if="collectionName === 'gwei'" class="tokens-to-burn">
      <p class="title">{{ $t('dashboard.newPainting.tokensToBurn', { coin: coinDetails.label }).toUpperCase() }}</p>
      <p v-if="!loading" class="amount">{{ tokensToBurn }}</p>
      <q-spinner v-else size="80px" color="primary" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import AlgoPainterExpressionsProxy from 'src/eth/AlgoPainterExpressionsProxy';
import AlgoPainterGweiItemProxy from 'src/eth/AlgoPainterGweiItemProxy';
import { mapGetters } from 'vuex';
import { NetworkInfo } from 'src/store/user/types';
import { Watch } from 'vue-property-decorator';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { auctionCoins } from 'src/helpers/auctionCoins';

class Props {
  collectionName = prop({
    type: String,
    required: true,
  });

  collectionToken = prop({
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
  }
})
export default class NewPaintingTopInfo extends Vue.with(Props) {
  gweiSystem!: AlgoPainterGweiItemProxy;
  collectionSystem!: AlgoPainterGweiItemProxy | AlgoPainterExpressionsProxy;

  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  account!: string;

  batchPrice?: string;
  mintedImagesAmount!: number; 
  remainingImages!: number; 
  tokensToBurn!: string;

  currentAmount?: number;

  loading: boolean = true;

  created() {
    if (this.isConnected) {
      this.gweiSystem = new AlgoPainterGweiItemProxy(this.networkInfo)
      this.collectionSystem = (this.collectionName === 'gwei') 
        ? new AlgoPainterGweiItemProxy(this.networkInfo)
        : new AlgoPainterExpressionsProxy(this.networkInfo);
    }
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.gweiSystem = new AlgoPainterGweiItemProxy(this.networkInfo)
      this.collectionSystem = (this.collectionName === 'gwei') 
        ? new AlgoPainterGweiItemProxy(this.networkInfo)
        : new AlgoPainterExpressionsProxy(this.networkInfo);
    }
  }

  mounted() {
    this.getTotalSupply().catch(console.error);
  }

  async getTotalSupply() {
    this.loading = true;
    this.mintedImagesAmount = await this.collectionSystem.totalSupply();
    this.remainingImages = (this.isGwei(this.collectionSystem)) ? 1000 - this.mintedImagesAmount : 750 - this.mintedImagesAmount;
    this.getCurrentAmount().catch(console.error);
  }

  async getCurrentAmount() {
    this.currentAmount = await this.collectionSystem.getCurrentAmount(this.mintedImagesAmount);

    const batchPrice = blockchainToCurrency(
      this.currentAmount,
      this.coinDetails.decimalPlaces,
    );

    this.batchPrice = this.$n(batchPrice, 'decimal', {
      maximumFractionDigits: this.coinDetails.decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    if (this.isGwei(this.collectionSystem)) {
      this.getTokensToBurn().catch(console.error);
    } else {
      this.setCollectionInfo().catch(console.error);
    }
  }

  isGwei(instance: any) : instance is AlgoPainterGweiItemProxy {
    return instance instanceof AlgoPainterGweiItemProxy;
  }

  async getTokensToBurn() {
    const tokensToBurn = await this.gweiSystem.getAmountToBurn();
    this.tokensToBurn = tokensToBurn.toFixed(2);
    this.setCollectionInfo(tokensToBurn).catch(console.error);
  }

  async setCollectionInfo(tokensToBurn: number | undefined = undefined) {
    const collectionInfo = {
      collectionName: this.collectionName,
      batchPriceBlockchain: this.currentAmount,
      batchPriceCurrency: this.batchPrice,
      collectionToken: this.collectionToken,
      remaining: this.remainingImages,
      minted: this.mintedImagesAmount,
      tokensToBurn: tokensToBurn,
    }

    await this.$store
      .dispatch({
        type: 'mint/collectionInfo',
        collectionInfo: collectionInfo,
        collectionName: this.collectionName,
      })
      .then(() => {
        this.loading = false;
      });
  }

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return coin.label === this.collectionToken;
    });
    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }
    return coin;
  }
}
</script>

<style lang="scss" scoped>
#new-painting-top-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  p{
    margin: 0px;
  }
  > div {
    border: 1px solid $primary;
    border-radius: 5px;
    padding: 12px 24px;
    min-width: 300px;
    text-align: center;
    font-weight: bold;
    .title {
      font-size: 16px;
      color: #A5A5A5;
    }
    .amount {
      color: $secondary;
      font-size: 45px;
    }
  }
  .batch-price,
  .remaining,
  .minted {
    margin-right: min(15px);
  }
}

@media(max-width: 1385px) {
  #new-painting-top-info {
    > div {
      min-width: 220px;
    }
  }
}

@media(max-width: 1024px) {
  #new-painting-top-info {
    > div {
      min-width: 160px;
    }
  }
}

@media(max-width: 768px) {
  #new-painting-top-info {
  > div {
    min-width: 150px;
    .title {
      font-size: 10px;
    }
    .amount {
      font-size: 30px;
    }
  }
    .batch-price,
    .remaining,
    .minted {
      margin-right: min(10px);
    }
  }
}

@media(max-width: 541px) {
  #new-painting-top-info {
    > div {
      padding: 8px 8px 0px 8px;
      min-width: 90px !important;
    }
    .batch-price,
    .minted,
    .remaining {
      margin-right: min(0px);
    }
    .tokens-to-burn,
    .minted {
      margin-top: 5px;
    }
  }
}

@media(max-width: 480px) {
  #new-painting-top-info {
    > div {
      padding: 8px 16px 0px 16px;
      width: 187px;
    }
  }
}

@media(max-width: 375px) {
  #new-painting-top-info {
    > div {
      width: 168px;
    }
  }
}

@media(max-width: 360px) {
  #new-painting-top-info {
    > div {
      width: 160px;
      .amount {
        font-size: 27px;
      }
    }
  }
}

@media(max-width: 320px) {
  #new-painting-top-info {
    justify-content: center;
    > div {
      .amount {
        font-size: 23px;
      }
    }
    .remaining {
      margin-top: 5px;
    }
  }
}
</style>