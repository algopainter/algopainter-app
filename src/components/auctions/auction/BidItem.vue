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
      <div
        v-if="bid.name.slice(0, 2) === '0x'"
        class="col-12 user-name"
      >
        {{ formatedAccount }}
      </div>
      <div
        v-else
        class="col-12 user-name"
      >
        {{ bid.name }}
      </div>
      <div
        class="text-bold text-end"
      >
        <div
          class="text-bold"
        >
          {{ monthExpirations }} <span class="text-bold"> {{ dayExpirations }} {{ $t('dashboard.bid.of') }}</span>
          {{ yearExpirations }}
        </div>
        {{ hoursExpirations }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';
import UserUtils from 'src/helpers/user';
import { IBid } from 'src/models/IBid';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { auctionCoins } from 'src/helpers/auctionCoins';
import moment from 'moment';

export default class BidItem extends Vue {
  @Prop({ required: true }) bid!: IBid;
  @Prop({ required: true }) tokenPriceAddress!: string;

  monthExpirations!: string;
  dayExpirations!: string;
  yearExpirations!: string;
  hoursExpirations!: string ;

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return coin.tokenAddress.toLowerCase() === this.tokenPriceAddress;
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  beforeMount() {
    void this.formatTime();
  }

  formatTime(): void {
    this.monthExpirations = moment(this.bid.createdAt).format('MMM');
    this.dayExpirations = moment(this.bid.createdAt).format('DD');
    this.yearExpirations = moment(this.bid.createdAt).format('YYYY');
    this.hoursExpirations = moment(this.bid.createdAt).format('LT');
  }

  get bidValue() {
    const amount = blockchainToCurrency(
      this.bid.netAmount,
      this.coinDetails.decimalPlaces,
    );

    return this.$n(amount, 'decimal', {
      maximumFractionDigits: this.coinDetails.decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  get formatedAccount() {
    return UserUtils.formatedAccount(this.bid.account);
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
