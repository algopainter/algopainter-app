<template>
  <div
    class="row justify-center col-12"
    v-on="getEndedAuction()"
  >
    <!-- v-if="auctionEnded === true && isMyBid === true" -->
    <div
      class="text-bold text-center q-my-md"
    >
      <div>
        {{ $t('dashboard.bid.youNow') }}
      </div>
      <div class="box">
        {{ $t('dashboard.bid.congratulations') }}
      </div>
    </div>
    <algo-button
      size="lg"
      color="primary"
      :label=" $t('dashboard.bid.clain')"
    />
    <!-- 2 -->
    <!-- v-else-if="auctionEnded === false && isMyBid === true" -->
    <div
      class=""
    >
      <div
        class="text-bold text-positive flex justify-center"
      >
        <div class="q-mr-sm">
          {{ $t('dashboard.bid.win') }}
        </div>
        <div>
          <q-icon
            size="xs"
            name="mdi-check-circle"
          />
        </div>
      </div>
      <div class="text-h6 text-bold text-center justify-center q-my-md">
        <div>
          {{ $t('dashboard.bid.yourBid') }}
        </div>
        <div class="row justify-center ">
          <div>
            {{ bidsAuctions.highestBid.tokenSymbol }}
          </div>
          <div class="q-ml-sm">
            {{ bidCorreting(bidsAuctions.highestBid.amount) }}
          </div>
        </div>
      </div>
      <div>
        <algo-button
          size="lg"
          color="primary"
          :label="$t('dashboard.bid.viewArt')"
        />
      </div>
    </div>
    <!-- 3 -->
    <!-- v-else-if="auctionEnded === false && isMyBid === false" -->
    <div>
      <div
        class="text-negative flex justify-center"
      >
        <div class="text-bold q-mr-sm">
          {{ $t('dashboard.bid.outbid') }}
        </div>
        <q-icon
          size="xs"
          name="mdi-alpha-x-circle"
        />
      </div>
      <div class="text-h6 text-bold text-center justify-center q-my-md">
        <div class="q-my-md">
          {{ $t('dashboard.bid.yourBid') }}
          <div class="row justify-center">
            <div>
              {{ bidsAuctions.highestBid.tokenSymbol }}
            </div>
            <div class="q-ml-sm">
              {{ bidCorreting(MyHighBid) }}
            </div>
          </div>
        </div>
        <div>
          <algo-button
            size="lg"
            color="primary"
            :label="$t('dashboard.bid.bidAgain')"
          />
        </div>
      </div>
    </div>
    <!-- 4 -->
    <!-- v-else-if="auctionEnded === true && isMyBid === false" -->
    <div>
      <div class="row justify-center q-my-md text-bold">
        <div>
          {{ bidsAuctions.highestBid.tokenSymbol }}
        </div>
        <div class="q-ml-sm ">
          {{ bidCorreting(MyHighBid) }}
        </div>
      </div>
      <div>
        <algo-button
          size="lg"
          color="primary"
          :label="$t('dashboard.bid.removeBid')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import { IAuctionItem } from 'src/models/IAuctionItem';
import AlgoButton from 'components/common/Button.vue';
import { PropType } from 'vue';
import { last } from 'ramda';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';

class Props {
  bidsAuctions= prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  })
}

@Options({
  components: {
    AlgoButton,
  },
})
export default class BidsStatus extends Vue.with(Props) {
  auctionEnded: boolean = false;
  isMyBid: boolean = false;
  coinLastBid?: string;

  get accountAdress() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/account'] as string;
  }

  getEndedAuction() {
    this.auctionEnded = this.bidsAuctions.ended;
    this.getHighBid();
  }

  getHighBid() {
    const highBid = this.bidsAuctions.highestBid.account;
    if (highBid === this.accountAdress) {
      this.isMyBid = true;
    } else {
      this.isMyBid = false;
    }
    // console.log(this.bidsAuctions);
  }

  get MyHighBid() {
    // buscar os bids
    const getBids = this.bidsAuctions.bids;
    // console.log('getBids', getBids);
    const account = this.accountAdress;
    // filtrar os bids comparando com a account do usuario
    const myBidsFilter = getBids.filter(function(item) {
      return account === item.account;
    });
    // selecionar o ultimo lançe do usuario.
    const lastBid = last(myBidsFilter)?.amount;
    return lastBid as number;
  }

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return coin.tokenAddress.toLowerCase() === this.bidsAuctions.minimumBid.tokenPriceAddress;
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  bidCorreting(bids: number) {
    const amount = blockchainToCurrency(
      bids,
      this.coinDetails.decimalPlaces,
    );
    return this.$n(amount, 'decimal', {
      maximumFractionDigits: this.coinDetails.decimalPlaces,
    } as any);// eslint-disable-line @typescript-eslint/no-explicit-any
  }

  timeEndAuction() {
    // pegar a data final do leilão
    // pegar a data de hoje
    // verificar se a data de hoje é menor ou igual a data do final do leilão
    // retonar true or false
  }
}
</script>
<style scoped>
  .box{
    width: 250px;
  }
</style>
