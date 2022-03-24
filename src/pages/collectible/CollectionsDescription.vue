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
  <div v-if="collection.namelc !== 'gwei' && collection.namelc !== 'expressions'">
    <div
      class="text-bold"
    >
      <div
        class="text-bold row  justify-center text-end"
      >
        {{ $t('createCollectible.create.collections.endCollection') }}
      </div>
      <div
        class="row justify-center time q-gutter-sm "
      >
        <div>
          <div class="text-bold">
            <!-- {{ days }}  -->{{ countDays }}
          </div>
          <span> {{ $t('dashboard.bid.days') }} </span>
        </div>

        <div>
          <div class="text-bold">
            <!-- {{ hours }}--> {{ countHours }}
          </div>
          <span>{{ $t('dashboard.bid.hours') }}</span>
        </div>
        <div>
          <div class="text-bold">
            <!-- {{ minutes }} -->{{ countMinutes }}
          </div>
          <span>{{ $t('dashboard.bid.minis') }}</span>
        </div>
        <div>
          <div class="text-bold">
            <!-- {{ seconds }} --> {{ countSeconds }}
          </div>
          <span>{{ $t('dashboard.bid.seconds') }}</span>
        </div>
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
import moment from 'moment';
import { now } from 'src/helpers/timer';

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
  countDays: number = 0;
  countYear: number = 0;
  countHours: number = 0;
  countMinutes: number = 0;
  countSeconds: number = 0;
  stopCount: boolean = false;
  lastCountDays: number = 0;
  lastCountHours: number = 0;
  lastCountMinutes: number = 0;
  lastCountSeconds: number = 0;
  monthExpirations: string = ''
  dayExpirations: string = ''
  yearExpirations: string = ''
  hoursExpirations!: string ;

  goApp(name: string) {
    this.$router.push(`/create-collectible/new-painting/${name}`).catch(console.error);
  }

  getTime() {
    if (this.collection.metrics) {
      const newEnded = moment(this.collection.metrics.endDT);
      const timeLeft = moment.duration(newEnded.diff(moment()));
      this.countYear = timeLeft.years() || 0;
      this.countDays = timeLeft.days() || 0;
      this.countHours = timeLeft.hours() || 0;
      this.countMinutes = timeLeft.minutes() || 0;
      this.countSeconds = timeLeft.seconds() || 0;
    }
  }

  get now() {
    return now.value;
  }

   @Watch('now')
  onPropertyChanged() {
    if (!this.stopCount) {
      if (this.countDays <= 0 && this.countHours <= 0 && this.countMinutes <= 0 && this.countSeconds <= 0) {
        if (this.lastCountDays === 0 && this.lastCountHours === 0 && this.lastCountMinutes === 0 && this.lastCountSeconds === 1) {
          this.formatTime();
        }
        this.stopCount = true;
      } else {
        this.getTime();
      }
    }
    this.lastCountDays = this.countDays;
    this.lastCountHours = this.countHours;
    this.lastCountMinutes = this.countMinutes;
    this.lastCountSeconds = this.countSeconds;
  }

   formatTime(): void {
     this.monthExpirations = moment(this.collection.metrics.endDT).format('MMM');
     this.dayExpirations = moment(this.collection.metrics.endDT).format('DD');
     this.yearExpirations = moment(this.collection.metrics.endDT).format('YYYY');
     this.hoursExpirations = moment(this.collection.metrics.endDT).format('LT');
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
    void this.getTime()
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
    if (this.collection.metrics && this.collection.namelc === 'gwei') {
      this.tokem = 'ALGOP'
    } else if (this.collection.metrics && this.collection.namelc === 'expressions') {
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
        console.log('current', this.currentAmount)
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

      console.log('batchPrice', this.batchPrice)

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