<template>
  <div class="row justify-center">
    <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'column items-center q-pb-sm q-gutter-md' : 'row justify-between q-gutter-xl']">
      <div class="info-collections  separator q-px-md">
        <p>
          {{ $t('createCollectible.create.collections.batchPrice', {coin: collectionToken}) }}
        </p>
        <p class="text-center">
          {{ batchPrice }}
        </p>
      </div>
      <div class="info-collections  separator q-px-md">
        <p>
          {{ $t('createCollectible.create.collections.remaining') }}
        </p>
        <p class="text-center">
          {{ remainingImages }}
        </p>
      </div>
      <div class="info-collections q-px-md">
        <p>
          {{ $t('createCollectible.create.collections.minted') }}
        </p>
        <p class="text-center">
          {{ mintedImagesAmount }}
        </p>
      </div>
      <div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import { mapGetters } from 'vuex';
import AlgoButton from 'components/common/Button.vue';
import AlgoPainterExpressionsProxy from 'src/eth/AlgoPainterExpressionsItemProxy';
import AlgoPainterGweiItemProxy from 'src/eth/AlgoPainterGweiItemProxy';
import { NetworkInfo } from 'src/store/user/types';
import { Watch } from 'vue-property-decorator';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { auctionCoins } from 'src/helpers/auctionCoins';

class Props {
  collection = prop({
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
        'isConnected',
        'networkInfo',
      ]),
  }
})
export default class CollectionsDescription extends Vue.with(Props) {
  img: string= '/images/gwei.png'

  goApp(name: string) {
    this.$router.push(`/create-collectible/new-painting/${name}`).catch(console.error);
  }

  gweiSystem!: AlgoPainterGweiItemProxy;
  collectionSystem!: AlgoPainterGweiItemProxy | AlgoPainterExpressionsProxy;

  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  account!: string;

  batchPrice: string = '';
  mintedImagesAmount: number = 0;
  remainingImages!: number;
  tokensToBurn!: string;
  collectionToken?: string;

  currentAmount!: number;
  loading: boolean = true;
  esse: number = 0;

  created() {
    if (this.isConnected) {
      this.gweiSystem = new AlgoPainterGweiItemProxy(this.networkInfo)
      this.collectionSystem = (this.collection === 'gwei')
        ? new AlgoPainterGweiItemProxy(this.networkInfo)
        : new AlgoPainterExpressionsProxy(this.networkInfo);
    }
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.gweiSystem = new AlgoPainterGweiItemProxy(this.networkInfo)
      this.collectionSystem = (this.collection === 'gwei')
        ? new AlgoPainterGweiItemProxy(this.networkInfo)
        : new AlgoPainterExpressionsProxy(this.networkInfo);
    }
  }

  mounted() {
    this.collectionToken = (this.collection === 'gwei') ? 'ALGOP' : 'BNB';
    this.getTotal().catch(console.error);
  }

  async getTotal() {
    this.loading = true;
    this.mintedImagesAmount = await this.collectionSystem.totalSupply();
    this.remainingImages = (this.collection === 'gwei') ? 1000 - this.mintedImagesAmount : 750 - this.mintedImagesAmount;
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
  }

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return coin.label === this.collectionToken;
    });
    if (!coin) {
      if (this.collectionToken === 'BNB') {
        return {
          value: '2',
          label: 'BNB',
          tokenAddress: '',
          decimalPlaces: 18,
          img: '/images/BNB.svg',
        }
      } else {
        throw new Error('COIN_NOT_FOUND');
      }
    }
    return coin;
  }
}
</script>

<style scoped>
.container-avatar{
    width: 200px;
     display: block;
    justify-content: center;
}
.img{
    display: flex;
    justify-content: center;
}
.description{
    width: 500px;

}
.btn{
    margin-top: 130px;
}
.info-collections{
    border: 1px solid #f4538d;
    display: block;
    border-radius: 5px;
    justify-content: center;
}
</style>