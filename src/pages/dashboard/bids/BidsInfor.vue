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
                {{ monthExpirations }}  <span class="text-h6 text-bold"> {{ dayExpirations }} </span>
              </div>
              <p> {{ yearExpirations }} </p>
              <!-- <div

                class="row  justify-start time q-gutter-sm"
              >
                <div>
                  <p class="text-bold">
                    {{ Dias }}
                  </p>
                  <span> {{ $t('dashboard.bid.days') }} </span>
                </div>

                <div>
                  <p class="text-bold">
                    {{ Horas }}
                  </p>
                  <span>{{ $t('dashboard.bid.hours') }}</span>
                </div>
                <div>
                  <p class="text-bold">
                    {{ Minutos }}
                  </p>
                  <span>{{ $t('dashboard.bid.minis') }}</span>
                </div>
                <div>
                  <p class="text-bold">
                    {{ Segundos }}
                  </p>
                  <span>{{ $t('dashboard.bid.seconds') }}</span>
                </div>
              </div> -->
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
import moment, { Duration } from 'moment';
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
dias: number = 0;
segundos: number = 0;
time!: Duration ;
monthExpirations: string = ''
dayExpirations: string = ''
yearExpirations: string = ''

 @Watch('now')
onPropertyChanged() {
  void this.getTime();
}

 mounted() {
   void this.getTime();
   void this.formatTime();
 }

 formatTime() {
   this.monthExpirations = moment(this.bidsAuctions.expirationDt).format('MMM');
   this.dayExpirations = moment(this.bidsAuctions.expirationDt).format('DD');
   this.yearExpirations = moment(this.bidsAuctions.expirationDt).format('YYYY');
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

 getTime() {
   const newEnded = moment(this.bidsAuctions.expirationDt);
   const timeLeft = moment.duration(newEnded.diff(moment()));
   this.time = timeLeft as unknown as Duration;
 }

 get Dias() {
   if (this.time) {
     return this.time.days();
   }
   return 0;
 }

 get Horas() {
   if (this.time) {
     return this.time.hours();
   }
   return 0;
 }

 get Minutos() {
   if (this.time) {
     return this.time.minutes();
   }
   return 0;
 }

 get Segundos() {
   if (this.time) {
     return this.time.seconds();
   }
   return 0;
 }

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
