<template>
  <div>
    <div
      v-if="loading"
      class="flex flex-center"
    >
      <q-spinner
        size="80px"
        color="primary"
      />
    </div>
    <div
      v-else
      class="row q-col-gutter-md"
    >
      <div
        v-for="bid in bids"
        :key="bid.id"
        class="col-12"
      >
        <bid-item
          :bid="bid"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { IAuctionItem } from 'src/models/IAuctionItem';
import { IBid } from 'src/models/IBid';
import { getBids } from 'src/api/auctions';
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
  bids: IBid[] = [];

  created() {
    void this.loadBids();
  }

  async loadBids() {
    try {
      this.loading = true;

      this.bids = [
        {
          amount: 100,
          bidder: {
            name: 'João',
            avatar: '/img/ALGOP.svg',
          },
          tokenSymbol: 'ALGOP',
        },
        {
          amount: 50,
          bidder: {
            name: 'Paulo',
            avatar: '/img/ALGOP.svg',
          },
          tokenSymbol: 'ALGOP',
        },
      ] as IBid[];

      this.loading = false;
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.bids = await getBids(this.auction._id);
      this.loading = false;
    }
  }
}
</script>
