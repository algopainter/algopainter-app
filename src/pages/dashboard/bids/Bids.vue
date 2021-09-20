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

  // dataMoment(index: number, format: string) {
  //   return moment(index).format(format);
  // }

  // contagemRegression() {
  //   const data = this.auctionsBid.expirationDt;
  //   console.log('data', data )
  //   const falta = (new Date(data).getTime() - new Date().getTime()) / 1000;
  //   const segundos = Math.round(falta % 60);
  //   const minutos = Math.round(falta / 60 % 60);
  //   const horas = Math.round(falta / 60 / 60 % 24);
  //   this.dias = Math.round(falta / 60 / 60 / 24);
  //   console.log('data que falta', this.dias, horas, minutos, segundos);

  //   const hoje = new Date();
  //   // var futuro = new Date(YY,MM-1,DD,HH,MI,SS);

  //   // const futuro =

  //  const hourMoment = moment(this.auctionsBid[0].expirationDt).format('h');
  //  const HourFuture = parseInt(hourMoment);

  //  const minunteMoment = moment(this.auctionsBid[0].expirationDt).format('mm');
  //  const minunteFuture = parseInt(minunteMoment);

  //   const secondMoment = moment(this.auctionsBid[0].expirationDt).format('ss');
  //   const secondFuture = parseInt(secondMoment);
  //   const futuroYear = new Date(this.auctionsBid[0].expirationDt).getFullYear();
  //   const futuroMouth = new Date(this.auctionsBid[0].expirationDt).getUTCMonth() + 1;
  //   const futuroDay = new Date(this.auctionsBid[0].expirationDt).getUTCDate();

  //   const dateFuture = `${futuroYear} ${futuroMouth} ${futuroDay} ${hourMoment} ${minunteMoment} ${secondMoment}`;
  //   console.log('dateFuture', dateFuture);

  //   // const year = new Date().getFullYear();
  //   // const month = new Date().getUTCMonth() + 1;
  //   // const day = new Date().getUTCDate();
  //   // const hour = new Date(). ;
  //   // const min = new Date()

  //   const minuts = parseInt(minunteFuture / 60, 10)
  //   const seconds = parseInt(secondFuture % 60, 10);
  //   const minutus = minuts < 10 ? "0" + minuts : minuts;
  //   const secondus = seconds < 10 ? "0" + seconds : seconds;
  //   const timers = minutus + ":" + secondus;
  //   console.log('timers', timers)
  // }
}
// }
</script>
<style lang="scss">
.container-bids{
  max-width: 100%;
  max-height: 100%;
  border-radius: 20px;
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
  margin-left: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  width: 50px;
}

</style>
