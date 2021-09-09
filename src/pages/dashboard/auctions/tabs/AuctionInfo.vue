<template>
  <div class="row q-col-gutter-md">
    <div class="col-12">
      <highest-bid-avatar
        :bid="auction.highestBid"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { IAuctionItem } from 'src/models/IAuctionItem';
import HighestBidAvatar from 'components/auctions/auction/HighestBidAvatar.vue';

@Options({
  components: {
    HighestBidAvatar,
  },
})
export default class AuctionInfo extends Vue {
  @Prop({ required: true }) auction!: IAuctionItem;
}
</script>
