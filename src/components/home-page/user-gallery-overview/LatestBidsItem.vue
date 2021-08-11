<template>
  <div class="latest-bids-item q-mb-md q-gutter-xl">
    <div class="img">
      <q-img
        class="art-image"
        :src="bid.item.previewImageUrl"
      />
    </div>
    <div class="details">
      <div class="name ">
        {{ bid.item.title }}
      </div>
      <div class="bid-back ">
        <div>
          {{ $n(bid.bidBack/100 , 'percent') }} {{ $t('common.bidBack') }}
        </div>
      </div>
      <div class="price">
        <div>
          {{ $n(bid.amount , 'currency') }}
        </div>
      </div>
      <div class="date">
        <div>{{ bid.createdAt }}</div>
        <q-tooltip>
          {{ bid.createdAt }}
        </q-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, prop } from 'vue-class-component';

import { IBidder } from 'src/models/IBidder';
class Props {
  bid = prop({
    type: Object as PropType<IBidder>,
    required: true,
  });
}
export default class LatestBidsItem extends Vue.with(Props) {
}
</script>

<style lang="scss" scoped>
.latest-bids-item {
  display: flex;
}
.art-image {
  height: 100px;
  width: 100px;
}
.details {
  padding: 6px;
  .name {
    font-weight: bold;
    font-size: 1.2rem;
    line-height: 1.4rem;
  }
  .bid-back {
    font-size: 1.1rem;
    line-height: 1.2rem;
    font-weight: bold;
    color: $primary;
  }
  .price {
    font-size: 1.6rem;
    line-height: 1.8rem;
    font-weight: bold;
    color: $positive;
  }
  .date {
    line-height: 1.2rem;
    color: $grey-5;
  }
}
</style>
