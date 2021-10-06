<template>
  <div
    v-if="loading === false"
  >
    <div
      v-if="auctionEnd === false"
    >
      <div
        v-for="(bid, index) in auctionsBid"
        :key="index"
        v-on="auctionsReturns(index)"
      >
        <div v-if="haveReturns === true || bid.ended === false ">
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
  haveAuction!: boolean;
  returnKey?: string;
  haveReturns!: boolean;

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

  // eslint-disable-next-line getter-return
  auctionsReturns(i: number) {
    try {
      const auctionReturs = Object.keys(this.auctionsBid[i].returns);
      for (const key of auctionReturs) {
        console.log('passo a passom', this.returnKey);
        this.returnKey = key;
      }
      auctionReturs.forEach((key) => {
        // console.log('comparando keys', this.haveReturns, this.auctionsBid[i].item.title);

        if (key === this.accountAdress) {
          this.haveReturns = true;
        } else {
          this.haveReturns = false;
        }
      });
    } catch (error) {
      console.log('erro auctionsReturns');
    }
  }

  get auctionEnd() {
    for (let i = 0; i < this.auctionsBid.length; i++) {
      this.haveAuction = this.auctionsBid[i].ended;
      if (this.haveAuction === false) {
        return false;
      }
    }
    return true;
  }
}
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
