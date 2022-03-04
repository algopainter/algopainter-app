<template>
  <div class="row justify-center">
    <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'column items-center q-pb-sm q-gutter-md' : 'row justify-evenly q-gutter-sm']">
      <div class="info-collections   q-pt-sm">
        <p class="text">
          {{ $t('createCollectible.create.collections.batchPrice',{ coin: tokem }) }}
        </p>
        <p v-if="!loading" class="text-center amount">
          {{ batchPrice }}
        </p>
        <p v-else class="row justify-center">
          <q-spinner size="40px" color="primary" />
        </p>
      </div>
      <div class="info-collections   q-pt-sm ">
        <p class="text">
          {{ $t('createCollectible.create.collections.remaining') }}
        </p>
        <p v-if="!loading" class="text-center amount">
          {{ remainingImages }}
        </p>
        <p v-else class="row justify-center">
          <q-spinner size="40px" color="primary" />
        </p>
      </div>
      <div class="info-collections q-pt-sm">
        <p class="text">
          {{ $t('createCollectible.create.collections.minted') }}
        </p>
        <p v-if="!loading" class="text-center amount">
          {{ mintedImagesAmount }}
        </p>
        <p v-else class="row justify-center">
          <q-spinner size="40px" color="primary" />
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
import { PropType } from 'vue';
import ICollection from 'src/models/ICollection';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { auctionCoins } from 'src/helpers/auctionCoins';
import AlgoPainterArtistCollection from 'src/eth/AlgoPainterArtistCollectionProxy';

class Props {
  collectionName = prop({
    type: String,
    required: true,
  });

  collectionId = prop({
    type: String,
    required: true,
  });

  collection = prop({
    type: Object as PropType<ICollection>,
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
        'isConnected',
        'networkInfo',
        'account',
      ]),
  }
})
export default class CollectionsDescription extends Vue.with(Props) {
  img: string= '/images/gwei.png';

  goApp(name: string) {
    this.$router.push(`/create-collectible/new-painting/${name}`).catch(console.error);
  }

  gweiSystem!: AlgoPainterGweiItemProxy;
  collectionSystem!: AlgoPainterGweiItemProxy | AlgoPainterExpressionsProxy | AlgoPainterArtistCollection;
  algoPainterArtistCollection!: AlgoPainterArtistCollection;
  collectionSystemExpressions!: AlgoPainterExpressionsProxy;

  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  account!: string;

  batchPrice: string = '';
  mintedImagesAmount: number = 0;
  remainingImages!: number;
  tokensToBurn!: string;

  currentAmount!: number;
  loading: boolean = true;
  esse: number = 0;
  tokem: string | undefined | null= '';

  created() {
    if (this.isConnected) {
      this.setProxy();
    }
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      void this.Tokens()
      this.setProxy();
    }
  }

  setProxy() {
    switch (this.collectionName) {
      case 'gwei':
        this.gweiSystem = new AlgoPainterGweiItemProxy(this.networkInfo);
        break;
      case 'expressions':
        this.collectionSystemExpressions = new AlgoPainterExpressionsProxy(this.networkInfo);
        break;
      default:
        this.collectionSystem = new AlgoPainterArtistCollection(this.networkInfo);
    }
  }

  async mounted() {
    void this.Tokens()
    if (this.isArtistCollection(this.collectionSystem)) {
      await this.getRemainingImages();
    } else if (this.collectionName === 'gwei' && this.isGwei(this.gweiSystem)) {
      await this.getRemainingImages();
    } else if (this.collectionName === 'expressions' && this.isExpressions(this.collectionSystemExpressions)) {
      await this.getRemainingImages();
    }
  }

  Tokens() {
    if (!this.collection.metrics && this.collection.namelc === 'gwei') {
      this.tokem = 'ALGOP'
    } else if (!this.collection.metrics && this.collection.namelc === 'expressions') {
      this.tokem = 'BNB'
    } else if (this.collection.metrics) {
      this.tokem = this.collection.metrics.tokenPriceSymbol
    }
  }

    @Watch('collectionId')
  async onCollectionIdChanged() {
    void this.Tokens()
    if (this.isArtistCollection(this.collectionSystem)) {
      await this.getRemainingImages();
    }
  }

    async getRemainingImages() {
      this.loading = true;
      if (this.collectionId !== undefined) {
        this.remainingImages = (this.isArtistCollection(this.collectionSystem))
          ? Number(await this.collectionSystem.getRemainingTokens(this.collectionId))
          : -1;
        this.mintedImagesAmount = this.collection.metrics.nfts - this.remainingImages
      } else if (this.collectionName === 'gwei') {
        this.mintedImagesAmount = await this.gweiSystem.totalSupply();
        this.remainingImages = 1000 - this.mintedImagesAmount
      } else if (this.collectionName === 'expressions') {
        this.mintedImagesAmount = await this.collectionSystemExpressions.totalSupply();
        this.remainingImages = 750 - this.mintedImagesAmount
      } else {
        this.mintedImagesAmount = this.collection.metrics.nfts - this.remainingImages
      }

      this.getBatchPrice().catch(console.error);
    }

    async getBatchPrice() {
      if (this.collectionId !== undefined) {
        this.currentAmount = (this.isArtistCollection(this.collectionSystem))
          ? Number(await this.collectionSystem.getMintValue(this.collectionId))
          : -1
      } else if (this.collectionName === 'gwei') {
        this.currentAmount = await this.gweiSystem.getCurrentAmount(this.mintedImagesAmount)
      } else if (this.collectionName === 'expressions') {
        this.currentAmount = await this.collectionSystemExpressions.getCurrentAmount(this.mintedImagesAmount);
      }
      // this.batchPrice = String(this.currentAmount);
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
        return coin.label === this.tokem;
      });
      if (!coin) {
        if (this.tokem === 'BNB') {
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

    isGwei(instance: any) : instance is AlgoPainterGweiItemProxy {
      return instance instanceof AlgoPainterGweiItemProxy;
    }

    isExpressions(instance: any) : instance is AlgoPainterExpressionsProxy {
      return instance instanceof AlgoPainterExpressionsProxy;
    }

    isArtistCollection(instance: any) : instance is AlgoPainterArtistCollection {
      return instance instanceof AlgoPainterArtistCollection;
    }
}
</script>

<style scoped lang="scss">
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
    width: 160px;
    justify-content: center;
    /* padding:8px 8px; */

}
.text{
  /* font-size: 12px; */
  text-align: center;
  color: #A5A5A5;
}
.amount{
  color: $secondary;
  font-weight: bold;
}
</style>