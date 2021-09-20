<template>
  <div v-if="loading === false">
    <div v-if="auctionsBid.length === 0">
      <div
        class="text-h5 q-mt-lg text-primary text-center"
      >
        {{ $t('dashboard.bid.noBids') }}
      </div>
      <div class="text-bold text-h5 text-center">
        {{ $t('dashboard.bid.goingOnce') }}
      </div>
    </div>

    <div v-else>
      <q-card
        v-for="(bid, index) in auctionsBid"
        :key="index"
        class="row justify-center container-bids"
        bordered
      >
        <div class="col-xs-12 col-sm-12 col-md-7">
          <BidsInfor
            :bids-auctions="bid"
            :index="index"
          />
        </div>
        <q-separator
          vertical
          inset
        />
        <BidsStatus
          :bids-auctions="bid"
        />
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { IAuctionItem } from 'src/models/IAuctionItem';
import AlgoButton from 'components/common/Button.vue';
// import moment from 'moment'
import BidsStatus from './BidsStatus.vue';
import BidsInfor from './BidsInfor.vue';

@Options({
  components: {
    AlgoButton,
    BidsStatus,
    BidsInfor,
  },
})

export default class Bids extends Vue {
auctionsBid: IAuctionItem[] = [];
lastBidLength?: number;
loading: boolean = true;
dias: number = 0

@Watch('accountAdress')
onPropertyChanged() {
  void this.getBids();
}

mounted() {
  void this.getBids();
}

get accountAdress() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return this.$store.getters['user/account'] as string;
}

getBids() {
  void this.$store.dispatch({
    type: 'auctions/getBids',
    account: this.accountAdress,
  }).then(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.auctionsBid = this.$store.getters['auctions/getBids'] as IAuctionItem[];
    this.loading = false;
  });
}

getLastBid(index: number) {
  const lastBidAuctions = this.auctionsBid[index].bids;
  this.lastBidLength = lastBidAuctions.length - 1;
}
}

</script>
<style lang="scss">

.img{
  width: 250px;
  @media (max-width: $breakpoint-xs-max) {
    width: 100%;
  }
}

.text-title{
  width: 250px;
  @media (max-width: $breakpoint-xs-max) {
    width: 100%;
  }
}

.text-amount{
  margin-left: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  width: 50px;
}

</style>
