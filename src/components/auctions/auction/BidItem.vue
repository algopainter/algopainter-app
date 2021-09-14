<template>
  <div class="bid-item row">
    <div class="col-auto q-pr-md row items-center">
      <q-avatar
        size="44px"
        round
      >
        <img :src="bid.bidder.avatar">
      </q-avatar>
    </div>
    <div class="col row items-center">
      <div class="col-12 amount">
        {{ $n(bid.amount, 'decimal') }} {{ bid.tokenSymbol }}
      </div>
      <div class="col-12 user-name">
        {{ bid.bidder.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';

import { IBid } from 'src/models/IBid';

export default class BidItem extends Vue {
  @Prop({ required: true }) bid!: IBid;
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
