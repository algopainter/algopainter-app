<template>
  <div class="bid-item row">
    <div class="col-auto q-pr-md row items-center">
      <q-avatar
        size="44px"
        round
      >
        <img :src="bid.avatar || '/placeholder-images/do-utilizador.png'">
      </q-avatar>
    </div>
    <div class="col row items-center">
      <div class="col-12 amount">
        {{ `${bidValue} ${bid.tokenSymbol}` }}
      </div>
      <div class="col-12 user-name">
        {{ bid.name }}
      </div>
      <div class="col-12">
        {{ bidDateAndHour }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';

import { IBid } from 'src/models/IBid';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { auctionCoins } from 'src/helpers/auctionCoins';
import moment from 'moment';

export default class BidItem extends Vue {
  @Prop({ required: true }) bid!: IBid;
  @Prop({ required: true }) tokenPriceAddress!: string;

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return coin.tokenAddress.toLowerCase() === this.tokenPriceAddress;
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  get bidDateAndHour() {
    return moment(this.bid.createdAt).format('MMMM Do YYYY, h:mm:ss a');
  }

  get bidValue() {
    const amount = blockchainToCurrency(
      this.bid.amount,
      this.coinDetails.decimalPlaces,
    );

    return this.$n(amount, 'decimal', {
      maximumFractionDigits: this.coinDetails.decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}
</script>

<style lang="scss" scoped>
.bid-item {
  font-weight: bold;

  .amount {
    color: $positive;
    font-size: 1.2rem;
  }

  .user-name {
    color: $primary;
    font-size: 1rem;
  }
}
</style>
