<template>
  <div class="highest-bid row q-pa-sm">
    <div class="col-auto q-pr-sm">
      <router-link
        :to="{name: 'customUrl', params: { customUrl: bid.customProfile || bid.account} }"
      >
        <q-avatar
          size="58px"
        >
          <img :src="bid.avatar || '/placeholder-images/do-utilizador.png'">
        </q-avatar>
      </router-link>
    </div>
    <div class="col row items-center">
      <div class="title col-12 text-white text-bold">
        <i18n-t keypath="dashboard.auctionPage.highestBidBy">
          <template #highestBidBy>
            <span class="username">
              {{ formatedAccount }}
            </span>
          </template>
        </i18n-t>
      </div>
      <div class="col-12 price text-bold">
        {{ `${bidValue} ${bid.tokenSymbol}` }}
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

export default class HighestBidCard extends Vue {
  @Prop({ required: true }) bid!: IBid;
  @Prop({ required: true }) tokenPriceAddress!: string;

  userBalance: number = 0;

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return coin.tokenAddress.toLowerCase() === this.tokenPriceAddress;
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
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

  get formatedAccount() {
    return UserUtils.formatedAccount(this.bid.account);
  }
}
</script>

<style lang="scss" scoped>
.highest-bid {
  background: $primary;
  border-radius: 6px;
  font-size: 1.2rem;
}

.title {
  .username {
    color: #333333;
  }
}

.price {
  color: #FFCB00;
}
</style>
