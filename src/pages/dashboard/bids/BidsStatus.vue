<template>
  <div>
    {{ index }} {{ isMyBid }} {{ statusAuction }}
    <div
      v-if="statusAuction === false && isMyBid === true"
      class="col-xs-12 col-sm-12 col-md-4 col column justify-center "
    >
      <div
        class="text-bold text-h5 row justify-center"
      >
        {{ $t('dashboard.bid.youNow') }}
      </div>
      <div class="text-bold row text-center">
        {{ $t('dashboard.bid.congratulations') }}
      </div>
      <div class="row justify-center q-mt-md">
        <algo-button
          size="lg"
          color="primary"
          :label="$t('dashboard.bid.clain')"
        />
      </div>
    </div>
    <!-- segunda parte -->
    <div
      v-else
      class="col-xs-12 col-sm-12 col-md-4 col column justify-center "
    >
      <div
        class="text-bold text-h5 row justify-center"
      />
      <div
        class="text-bold row text-center"
      >
        {{ $t('dashboard.bid.congratulations') }}
      </div>
      <div class="row justify-center q-mt-md">
        <algo-button
          size="lg"
          color="primary"
          :label="$t('dashboard.bid.clain')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
import { IAuctionItem } from 'src/models/IAuctionItem';
import { PropType } from 'vue';

class Props {
  index= prop({
    type: Number,
    required: true,
  });

  auctionsBid= prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  })

  accountAdress= prop({
    type: String,
    required: true,
  })
}

export default class BidsStatus extends Vue.with(Props) {
  statusAuction: boolean = false;
  isMyBid: boolean = false;
  // teste(index: number) {
  //   console.log(this.auctionsBid[index]);
  // }

  // getEndedAuction(index: number) {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  //   this.statusAuction = this.auctionsBid[index].ended;
  // }

  // getHighBid(index: number) {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   const highBid = this.auctionsBid[index].highestBid.account;

  //   if (highBid === this.accountAdress) {
  //     this.isMyBid = true;
  //   } else {
  //     this.isMyBid = false;
  //   }
  //   console.log(this.isMyBid);
  // }
}
</script>
<style scoped>

</style>
