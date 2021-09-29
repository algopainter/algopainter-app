<template>
  <div v-if="loading === false">
    <div v-if="auctionsBid.length > 0">
      <div
        v-for="(bid, index) in auctionsBid"
        :key="index"
      >
        <!-- v-on="compareReturn(index)" -->
        <div v-if="bid.ended === false">
          <q-card
            class="row justify-between container-bids"
            bordered
          >
            <div
              class="col-xs-12 col-sm-12 col-md-7"
            >
              <BidsInfor
                :bids-auctions="bid"
                :index="index"
              />
            </div>
            <q-separator
              vertical
              inset
            />
            <div
              class="col-xs-12 col-sm-12 col-md-4 row items-center justify-center box"
            >
              <bids-status
                :bids-auctions="bid"
              />
            </div>
          </q-card>
        </div>
      </div>
    </div>
    <div v-else>
      <div
        class="text-h5 q-mt-lg text-primary text-center"
      >
        {{ $t('dashboard.bid.noBids') }}
      </div>
      <div class="text-bold text-h5 text-center">
        {{ $t('dashboard.bid.goingOnce' ) }}
      </div>
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
  loading: boolean = true;
  dias: number = 0;
  // accountReturn!: boolean;
  // haveInfo!: boolean;

  get auctionBidsFiltered() {
    return this.auctionsBid.filter((auction: IAuctionItem) => {
      return !auction.ended;
    });
  }

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

  // haveInfoBid() {
  //   for (let i = 0; i < this.auctionsBid.length; i++) {
  //     this.haveInfo = this.auctionsBid[i].ended;
  //   }
  //   console.log('haveInfo', this.haveInfo);
  //   return this.haveInfo;
  // }

  // find user account in api auctionsBid.returns
  // compareReturn(index: number) {
  //   if (this.auctionsBid) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //     const auctionsReturn = this.auctionsBid[index].returns;

  //     for (let i = 0; i < auctionsReturn.length; i++) {
  //       const auctionsReturnAccount = this.auctionsBid[index].returns[i].account;

  //       if (auctionsReturnAccount === this.accountAdress) {
  //         this.accountReturn = true;
  //       } else {
  //         this.accountReturn = false;
  //       }
  //     }
  //     console.log('accountReturn', this.accountReturn);

  //     // console.log('auctionsReturn', auctionsReturn);
  //   }
  // }

  // endAuction(index: number) {
  //   this.auctionEnd = this.auctionsBid[index].ended;
  //   if (this.auctionsBid === undefined) {
  //     return null;
  //   }
  //   console.log('auctionEnd', this.auctionEnd);
  //   this.loading = false;
  //   return this.auctionEnd;
  // }
}
// }
</script>
<style lang="scss">
.container-bids{
  padding: 20px;
  margin: 10px;
}
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
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  width: 50px;
}

.box{
  width: 100%;
}

</style>
