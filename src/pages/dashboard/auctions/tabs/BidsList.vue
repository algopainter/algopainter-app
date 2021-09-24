<!--
<template>
  <div>
    <div
      v-if="loading"
      class="flex flex-center q-pa-lg"
    >
      <q-spinner
        size="80px"
        color="primary"
      />
    </div>
    <div v-else>
      <div
        v-if="auction.bids.length === 0"
        class="empty-state"
      >
        {{ $t('dashboard.auctionPage.noBids') }}
      </div>
      <div
        v-else
        class="row q-col-gutter-md"
      >
        <div
          v-for="bid in filteredBids"
          :key="bid._id"
          class="col-12"
        >
          <bid-item
            :bid="bid"
            :token-price-address="auction.minimumBid.tokenPriceAddress"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';
import { reverse, dropLast } from 'ramda';

import { IAuctionItem } from 'src/models/IAuctionItem';
import AuctionUserCard from 'components/auctions/auction/AuctionUserCard.vue';
import BidItem from 'components/auctions/auction/BidItem.vue';

@Options({
  components: {
    AuctionUserCard,
    BidItem,
  },
})
export default class BidsList extends Vue {
  @Prop({ required: true }) auction!: IAuctionItem;

  loading: boolean = false;

  get filteredBids() {
    return reverse(
      dropLast(1, this.auction.bids),
    );
  }
}
</script>

<style lang="scss" scoped>
.empty-state {
  padding: 16px;
  color: $primary;
  text-align: center;
  font-weight: 700;
  font-size: 1.2rem;
}
</style>
-->
