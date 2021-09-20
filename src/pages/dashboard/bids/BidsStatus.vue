<template>
  <div v-on="getEndedAuction()">
    <div
      v-if="auctionEnded === true && isMyBid === true"
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
    <!-- 2 -->
    <div
      v-else-if="auctionEnded === false && isMyBid === true"
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
    <!-- 3 -->
    <div
      v-else-if="auctionEnded === false && isMyBid === false"
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
    <!-- 4 -->
    <div
      v-else-if="auctionEnded === true && isMyBid === false"
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
  bidsAuctions= prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  })
}

export default class BidsStatus extends Vue.with(Props) {
  auctionEnded: boolean = false;
  isMyBid: boolean = false;

  get accountAdress() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/account'] as string;
  }

  getEndedAuction() {
    this.auctionEnded = this.bidsAuctions.ended;
    this.getHighBid();
  }

  getHighBid() {
    const highBid = this.bidsAuctions.highestBid.account;

    if (highBid === this.accountAdress) {
      this.isMyBid = true;
    } else {
      this.isMyBid = false;
    }
  }
}
</script>
<style scoped>

</style>
