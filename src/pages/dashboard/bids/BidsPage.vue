<template>
  <div v-if="bidOff === false">
    <q-card class="row justify-between container-bids" bordered>
      <div class="col-xs-12 col-sm-12 col-md-7">
        <BidsInfor :bids-auctions="bid" :index="index" />
      </div>
      <q-separator vertical inset />
      <div class="col-xs-12 col-sm-12 col-md-4 row items-center justify-center box">
        <BidsStatus :auction-item="bid" />
      </div>
    </q-card>
  </div>
</template>

<script lang="ts">

import moment from 'moment';
import { PropType } from 'vue';
import { Options, Vue, prop } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import BidsStatus from './BidsStatus.vue';
import BidsInfor from './BidsInfor.vue';
import { IAuctionItem } from 'src/models/IAuctionItem';

class Props {
   bid = prop({
     type: Object as PropType<IAuctionItem>,
     required: true,
   })

  accountAdress = prop({
    type: String,
    required: true,
  })

  index= prop({
    type: Number,
    required: true,
  })
}

@Options({
  components: {
    AlgoButton,
    BidsStatus,
    BidsInfor,
  },
})

export default class BidsPage extends Vue.with(Props) {
  returnKey?: string;
  haveReturns: boolean = false;
  bidOff:boolean = false;

  mounted() {
    void this.auctionsReturns();
  }

  auctionsReturns() {
    const dateAuction = !moment().isAfter(this.bid.expirationDt);
    try {
      const auctionReturs = Object.keys(this.bid.returns);
      for (const key of auctionReturs) {
        this.returnKey = key;
      }

      auctionReturs.forEach((key) => {
        if (key === this.accountAdress) {
          this.haveReturns = true;
        } else {
          this.haveReturns = false;
        }
      });

      if (dateAuction && this.haveReturns === false) {
        this.bidOff = false;
        return false;
      } else if (dateAuction && this.haveReturns === true) {
        this.bidOff = false;
        return false;
      } else if (dateAuction === false && this.haveReturns === false) {
        if (this.bid.ended === false) {
          if (this.bid.highestBid.account !== this.accountAdress) {
            this.bidOff = true;
            return true;
          }
          this.bidOff = false;
          return false;
        }
        this.bidOff = true;
        return true;
      } else if (dateAuction === false && this.haveReturns === true) {
        this.bidOff = false;
        return false;
      } else {
        this.bidOff = true;
        return true;
      }
    } catch (error) {
      this.haveReturns = false;
    }
  }
}
</script>

<style lang="scss">
.container-bids{
  padding: 20px;
  margin: 10px;
}

.box{
  width: 100%;
}
</style>
