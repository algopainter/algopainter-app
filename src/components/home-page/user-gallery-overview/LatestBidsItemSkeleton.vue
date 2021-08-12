<template>
  <div class="col-12 col-md-3 col-lg-3 q-pt-md column items-center">
    <div>
      <div class="q-pb-md">
        <q-skeleton
          type="text"
          width="200px"
        />
      </div>
    </div>
    <div class="latest-bids-item q-mb-md">
      <div class="img row q-gutter-md">
        <q-skeleton
          width="100px"
          height="100px"
        />
        <div class="details">
          <q-skeleton
            type="text"
            width="100px"
          />
          <div class="bid-back">
            <q-skeleton
              type="text"
              width="100px"
            />
          </div>
          <div class="price">
            <q-skeleton
              type="text"
              width="100px"
            />
          </div>
        </div>
        <div>
          <q-skeleton
            width="150px"
            type="QBtn"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class LatestBidsItemSkeleton extends Vue {
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
  .name {
    font-weight: bold;
    font-size: 1.2rem;
    line-height: 1.4rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    align-items: left;
    text-align: left;
    width: 160px;
  }
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
</style>
