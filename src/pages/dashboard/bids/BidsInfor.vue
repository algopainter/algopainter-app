<template>
  <div
    class="row q-gutter-md"
    v-on="getLastBid()"
  >
    <q-img
      class="img"
      :src="bidsAuctions.item.previewImage"
    />
    <div class="text-title">
      <p class="text-bold">
        {{ bidsAuctions.item.title }}
      </p>
      <p>
        {{ bidsAuctions.item.description }}
      </p>
      <div class="row q-gutter-sm">
        <div
          v-for="(user, i) in bidsAuctions.users"
          :key="i"
          class="row"
        >
          <router-link :to="{name: 'customUrl', params: { customUrl: user.customProfile || user.account } }">
            <q-avatar
              size="lg"
              round
            >
              <img
                :src="user.avatar || '/placeholder-images/do-utilizador.png'"
              >
              <q-tooltip
                class="bg-primary"
              >
                {{ user.role }}{{ $t('dashboard.homePage.colon') }} {{ user.name }}
              </q-tooltip>
            </q-avatar>
          </router-link>
        </div>
      </div>
      <div class="row q-mt-xl q-gutter-sm text-center">
        <div class="col">
          <div class="text-bold">
            {{ $t('dashboard.bid.winBid') }}
          </div>
          <div class="text-bold row">
            <div>
              {{ bidsAuctions.highestBid.tokenSymbol }}
            </div>
            <div
              class="text-amount"
            >
              {{ bidCorreting(bidsAuctions.highestBid.amount) }}
              <q-tooltip
                class="bg-primary"
              >
                {{ bidsAuctions.highestBid.tokenSymbol }} {{ bidCorreting(bidsAuctions.highestBid.amount) }}
              </q-tooltip>
            </div>
          </div>
        </div>

        <q-separator
          vertical
          inset
        />

        <div class="col">
          <div>
            <div
              v-if="isEnded"
              class="text-bold"
            >
              {{ $t('dashboard.bid.auctionEnd') }}

              <div
                class="text-bold"
              >
                {{ monthExpirations }}  <span class="text-h6 text-bold"> {{ dayExpirations }} </span>
              </div>
              <p> {{ yearExpirations }} </p>
            </div>
            <div
              v-else
              class="text-bold text-end"
            >
              {{ $t('dashboard.bid.auctionTime') }}
              <div
                class="text-bold"
              >
                <!-- {{ dias }} {{ horas }} {{ minuReal }} {{ minutos }} {{ segundos }} -->
                <!-- {{ monthExpirations }}  <span class="text-h6 text-bold"> {{ dayExpirations }}
                  {{ $t('dashboard.bid.at') }} {{ hoursExpirations }} </span>
              </div>
              <p> {{ yearExpirations }} </p> -->
                <div

                  class="row  justify-start time q-gutter-sm"
                >
                  <div>
                    <p class="text-bold">
                      {{ days }}
                    </p>
                    <span> {{ $t('dashboard.bid.days') }} </span>
                  </div>

                  <div>
                    <p class="text-bold">
                      {{ hours }}
                    </p>
                    <span>{{ $t('dashboard.bid.hours') }}</span>
                  </div>
                  <div>
                    <p class="text-bold">
                      {{ minutes }}
                    </p>
                    <span>{{ $t('dashboard.bid.minis') }}</span>
                  </div>
                  <div>
                    <p class="text-bold">
                      {{ seconds }}
                    </p>
                    <span>{{ $t('dashboard.bid.seconds') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import { takeLast } from 'ramda';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { now } from 'src/helpers/timer';
import { PropType } from 'vue';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { IAuctionItem } from 'src/models/IAuctionItem';
import { IBid } from 'src/models/IBid';
// eslint-disable-next-line import/named
import moment from 'moment';
import { Watch } from 'vue-property-decorator';
import 'moment-duration-format';

class Props {
  bidsAuctions = prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  })

  accountAdress= prop({
    type: String,
    required: true,
  })
}
@Options({
  watch: {
    accountAddress: ['now'],
  },
})

export default class BidsInfor extends Vue.with(Props) {
lastBidAuctions: IBid[] = [];
days: number = 0;
hours: number = 0;
minutes: number = 0;
minuReal: number = 0;
seconds: number = 0;
time!: number ;
monthExpirations: string = ''
dayExpirations: string = ''
yearExpirations: string = ''
hoursExpirations!: string ;

 @Watch('now')
onPropertyChanged() {
  // void this.getTime();
}

 mounted() {
   // void this.getTime();
   void this.formatTime();
   void this.countdown();
 }

 formatTime() {
   this.monthExpirations = moment(this.bidsAuctions.expirationDt).format('MMM');
   this.dayExpirations = moment(this.bidsAuctions.expirationDt).format('DD');
   this.yearExpirations = moment(this.bidsAuctions.expirationDt).format('YYYY');
   this.hoursExpirations = moment(this.bidsAuctions.expirationDt).format('h:mm:ss');
 }

 countdown() {
   const date = this.bidsAuctions.expirationDt;
   const lack = (new Date(date).getTime() - new Date().getTime()) / 1000;
   this.seconds = Math.round(lack % 60);
   this.minutes = Math.round(lack / 60 % 60);
   this.hours = Math.round(lack / 60 / 60 % 24);
   this.days = Math.round(lack / 60 / 60 / 24);
   setInterval(() => {
     if (this.seconds === 0) {
       this.seconds = 60;
       this.minutes--;
     }
     if (this.minutes === 0) {
       this.minutes = 60;
       this.hours--;
     }
     if (this.hours === 0) {
       this.hours = 24;
       this.days--;
     }
     this.seconds--;
   }, 1000);
 }

 dataMoment(index: string, format: string) {
   return moment(index).format(format);
 }

 getLastBid(): void {
   this.lastBidAuctions = takeLast(1, this.bidsAuctions.bids);
 }

 get now() {
   return now.value;
 }

 get isEnded() {
   return moment().isAfter(this.bidsAuctions.expirationDt);
 }

 //  getTime() {
 //    const newEnded = moment(this.bidsAuctions.expirationDt);
 //    const timeLeft = moment(newEnded.diff(moment()));
 //    this.time = timeLeft as unknown as number;
 //  }

 //  get Dias() {
 //    if (this.time) {
 //      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
 //      return this.time.days();
 //    }
 //    return 0;
 //  }

 //  get Horas() {
 //    if (this.time) {
 //      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
 //      return this.time.hours();
 //    }
 //    return 0;
 //  }

 //  get Minutos() {
 //    if (this.time) {
 //      return this.time.minutes();
 //    }
 //    return 0;
 //  }

 //  get Segundos() {
 //    if (this.time) {
 //      return this.time.seconds();
 //    }
 //    return 0;
 //  }

 get coinDetails() {
   const coin = auctionCoins.find((coin) => {
     return coin.tokenAddress.toLowerCase() === this.bidsAuctions.minimumBid.tokenPriceAddress;
   });

   if (!coin) {
     throw new Error('COIN_NOT_FOUND');
   }

   return coin;
 }

 bidCorreting(bids: number) {
   const amount = blockchainToCurrency(
     bids,
     this.coinDetails.decimalPlaces,
   );
   return this.$n(amount, 'decimal', {
     maximumFractionDigits: this.coinDetails.decimalPlaces,
   } as any);// eslint-disable-line @typescript-eslint/no-explicit-any
 }
}
</script>
<style lang="scss">
.time{
  width: 200px;
  margin-right: 5px;
}
@media (max-width: 450px ) {
  .time{
    justify-content:center;
    width: 130px;
  }
}
.text-end{
  width:130px;
}
</style>
