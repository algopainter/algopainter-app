<template>
  <div class="row q-col-gutter-md">
    <div class="col-12">
      <auction-user-card
        :user="auctionOwner"
        :title="$t('dashboard.auctionPage.owner')"
      />
    </div>
    <div class="col-12">
      <auction-user-card
        :user="auctionCreator"
        :title="$t('dashboard.auctionPage.creator')"
      />
    </div>
    <div class="col-12">
      <q-separator />
    </div>
    <div class="col-12">
      <auction-user-card
        :user="collection"
        :title="$t('dashboard.auctionPage.collection')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { IAuctionItem } from 'src/models/IAuctionItem';
import AuctionUserCard from 'components/auctions/auction/AuctionUserCard.vue';

@Options({
  components: {
    AuctionUserCard,
  },
})
export default class AuctionInfo extends Vue {
  @Prop({ required: true }) auction!: IAuctionItem;

  get auctionOwner() {
    return this.auction.users.find((user) => {
      return user.role === 'owner';
    });
  }

  get auctionCreator() {
    return this.auction.users.find((user) => {
      return user.role === 'creator';
    });
  }

  get collection() {
    return {
      name: this.auction.item.collectionName,
      avatar: this.auction.item.collectionName === 'Gwei'
        ? '/images/gwei.png'
        : '/images/manwithnoname.png',
    };
  }
}
</script>
