<!--
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
<template>
  <div
    class="row q-gutter-md"
    v-on="getLastBid()"
  >
    <q-img
      class="img"
      :src="bidsAuctions.item.previewImage"
    />
    <div class="text-title">
      <p class="text-bold">
        {{ bidsAuctions.item.title }}
      </p>
      <p>
        {{ bidsAuctions.item.description }}
      </p>
      <div class="row q-gutter-sm">
        <div
          v-for="(user, i) in bidsAuctions.users"
          :key="i"
          class="row"
        >
          <router-link :to="{name: 'customUrl', params: { customUrl: user.customProfile || user.account } }">
            <q-avatar
              size="lg"
              round
            >
              <img
                :src="user.avatar || '/placeholder-images/do-utilizador.png'"
              >
              <q-tooltip
                class="bg-primary"
              >
                {{ user.role }}{{ $t('dashboard.homePage.colon') }} {{ user.name }}
              </q-tooltip>
            </q-avatar>
          </router-link>
        </div>
      </div>
      <div class="row q-mt-xl q-gutter-sm text-center">
        <div class="col">
          <div class="text-bold">
            {{ $t('dashboard.bid.winBid') }}
          </div>
          <div class="text-bold row">
            <div>
              {{ lastBidAuctions[0].tokenSymbol }}
            </div>
            <div
              class="text-amount"
            >
              {{ bidCorreting(lastBidAuctions[0].amount) }}
              <q-tooltip
                class="bg-primary"
              >
                {{ lastBidAuctions[0].tokenSymbol }} {{ bidCorreting(lastBidAuctions[0].amount) }}
              </q-tooltip>
            </div>
          </div>
        </div>

        <q-separator
          vertical
          inset
        />

        <div class="col">
          <div>
            <div class="text-bold">
              {{ $t('dashboard.bid.auctionEnd') }}
            </div>
            <div
              class="text-bold"
            >
              {{ dataMoment(bidsAuctions.expirationDt, 'MMM DD') }}
            </div>
            <div>
              {{ dataMoment(bidsAuctions.expirationDt, 'YYYY') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
import { takeLast } from 'ramda';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { PropType } from 'vue';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { IAuctionItem } from 'src/models/IAuctionItem';
import { IBid } from 'src/models/IBid';
import moment from 'moment';

class Props {
  bidsAuctions = prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  })

  accountAdress= prop({
    type: String,
    required: true,
  })
}
export default class BidsInfor extends Vue.with(Props) {
  lastBidAuctions!: IBid[];

  dataMoment(index: string, format: string) {
    return moment(index).format(format);
  }

  getLastBid(): void {
    this.lastBidAuctions = takeLast(1, this.bidsAuctions.bids);
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
}
</script>
-->
