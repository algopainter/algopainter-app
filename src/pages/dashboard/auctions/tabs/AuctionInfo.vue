<template>
  <div class="row q-col-gutter-md">
    <div class="col-12">
      <highest-bid-card
        :bid="auction.highestBid"
      />
    </div>
    <div class="col-12">
      <auction-user-card
        :user="auctionOwner"
        title="Owner"
      />
    </div>
    <div class="col-12">
      <auction-user-card
        :user="auctionCreator"
        title="Creator"
      />
    </div>
    <div class="col-12">
      <q-separator />
    </div>
    <div class="col-12">
      <auction-user-card
        :user="collection"
        title="Collection"
      />
    </div>
    <div class="col-12">
      <algo-button
        class="full-width q-py-sm"
        color="primary"
        outline
        label="Place a Bid"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { IAuctionItem } from 'src/models/IAuctionItem';
import HighestBidCard from 'components/auctions/auction/HighestBidCard.vue';
import AuctionUserCard from 'components/auctions/auction/AuctionUserCard.vue';
import AlgoButton from 'components/common/Button.vue';

@Options({
  components: {
    AlgoButton,
    HighestBidCard,
    AuctionUserCard,
  },
})
export default class AuctionInfo extends Vue {
  @Prop({ required: true }) auction!: IAuctionItem;

  get auctionOwner() {
    return {
      name: 'João',
      avatar: 'http://localhost:8080/img/ALGOP.svg',
    };
  }

  get auctionCreator() {
    return {
      name: 'Paulo',
      avatar: 'http://localhost:8080/img/ALGOP.svg',
    };
  }

  get collection() {
    return {
      name: 'Gwei',
      avatar: 'http://localhost:8080/img/ALGOP.svg',
    };
  }
}
</script>
