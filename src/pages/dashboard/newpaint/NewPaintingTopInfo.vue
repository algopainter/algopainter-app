<template>
  <div
    id="new-painting-top-info"
    class="row q-pb-lg"
  >
    <div class="batch-price">
      <p class="title">{{ $t('dashboard.newPainting.batchPrice', { coin: coinDetails.label }).toUpperCase() }}</p>
      <p v-if="!loading" class="amount">{{ currentAmount }}</p>
      <q-spinner v-else size="80px" color="primary" />
    </div>
    <div class="remaining">
      <p class="title">{{ $t('dashboard.newPainting.remaining').toUpperCase() }}</p>
      <p v-if="!loading" class="amount">{{ remainingImages }}</p>
      <q-spinner v-else size="80px" color="primary" />
    </div>
    <div class="minted">
      <p class="title">{{ $t('dashboard.newPainting.minted').toUpperCase() }}</p>
      <p v-if="!loading" class="amount">{{ mintedImages }}</p>
      <q-spinner v-else size="80px" color="primary" />
    </div>
    <div v-if="collection === 'gwei'" class="tokens-to-burn">
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
import AlgoPainterGweiProxy from 'src/eth/AlgoPainterGweiProxy';
import { mapGetters } from 'vuex';
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
        'networkInfo',
        'account',
        'isConnected',
      ]),
  }
})
export default class NewPaintingTopInfo extends Vue.with(Props) {
  gweiSystem!: AlgoPainterGweiProxy;
  collectionSystem!: AlgoPainterGweiProxy | AlgoPainterExpressionsProxy;

  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  account!: string;

  currentAmount?: string;
  mintedImages!: number; 
  remainingImages!: number; 
  collectionToken?: string;
  tokensToBurn: number = 0;

  loading: boolean = true;

  created() {
    this.collectionToken = (this.collection === 'gwei') ? 'ALGOP' : 'BNB'; 
    if (this.isConnected) {
      this.collectionSystem = (this.collection === 'gwei') 
        ? new AlgoPainterGweiProxy(this.networkInfo)
        : new AlgoPainterExpressionsProxy(this.networkInfo);
    }
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.collectionSystem = (this.collection === 'gwei') 
        ? new AlgoPainterGweiProxy(this.networkInfo)
        : new AlgoPainterExpressionsProxy(this.networkInfo);
    }
  }

  mounted() {
    this.getTotalSupply().catch(console.error);
  }

  async getTotalSupply() {
    this.loading = true;
    this.mintedImages = await this.collectionSystem.totalSupply();
    this.remainingImages = (this.isGwei(this.collectionSystem)) ? 1000 - this.mintedImages : 750 - this.mintedImages;
    this.getCurrentAmount().catch(console.error);
  }

  async getCurrentAmount() {
    let currentAmount = await this.collectionSystem.getCurrentAmount(this.mintedImages);

    currentAmount = blockchainToCurrency(
      currentAmount,
      this.coinDetails.decimalPlaces,
    );

    this.currentAmount = this.$n(currentAmount, 'decimal', {
      maximumFractionDigits: this.coinDetails.decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    if (this.isGwei(this.collectionSystem)) {
      this.loading = false;
    } else {
      this.getTokensToBurn().catch(console.error);
    }
  }

  isGwei(instance: any) : instance is AlgoPainterGweiProxy {
    return instance instanceof AlgoPainterGweiProxy;
  }

  async getTokensToBurn() {
    try {
      this.tokensToBurn = await this.gweiSystem.getAmountToBurn();
    } catch (e) {
      console.log('Error - NewPaintingTopInfo - getTokensToBurn')
    } finally {
      this.loading = false;
    }
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
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='15' ry='15' stroke='DeepPink' stroke-width='5' stroke-dasharray='6%2c 14' stroke-dashoffset='21' stroke-linecap='round'/%3e%3c/svg%3e");
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
      font-size: 60px;
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
      font-size: 40px;
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
        font-size: 35px;
      }
    }
  }
}

@media(max-width: 320px) {
  #new-painting-top-info {
    justify-content: center;
    > div {
      .amount {
        font-size: 30px;
      }
    }
    .remaining {
      margin-top: 5px;
    }
  }
}
</style>