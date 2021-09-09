<template>
  <div class="highest-bid row q-pa-sm">
    <div class="col-auto q-pr-sm">
      <q-avatar
        size="58px"
        round
      >
        <img :src="bid.bidder.avatar">
      </q-avatar>
    </div>
    <div class="col row items-center">
      <div class="title col-12 text-white text-bold">
        <i18n-t keypath="dashboard.auctionPage.highestBidBy">
          <template #highestBidBy>
            <span class="username">
              {{ bid.bidder.name }}
            </span>
          </template>
        </i18n-t>
      </div>
      <div class="col-12 price text-bold">
        {{ $n(bid.amount, 'currency') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { IBid } from 'src/models/IBid';
import AvatarSection from 'src/components/AvatarSection.vue';

@Options({
  components: {
    AvatarSection,
  },
})
export default class HighestBidAvatar extends Vue {
  @Prop({ required: true }) bid!: IBid;
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
