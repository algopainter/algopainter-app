
<template>
  <div
    class="row q-gutter-md"
    v-on="getLastBid()"
  >
    <q-img
      class="img"
      :src="bidsAuctions.item.previewImage"
    />
    <div>
      <p class="text-bold title">
        {{ bidsAuctions.item.title }}
      </p>
      <p class="title">
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
      <div class="row container-info q-mt-xl q-gutter-sm text-center">
        <div class="col q-mb-md ">
          <div class="row justify-center text-bold text-winbid">
            {{ $t('dashboard.bid.winBid') }}
          </div>
          <div class=" row justify-center text-bold">
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
            <div>
              {{ bidsAuctions.highestBid.tokenSymbol }}
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
              v-if="isEnded || isfinish"
              class="text-bold text-end"
            >
              {{ $t('dashboard.bid.auctionEnd') }}

              <div
                class="text-bold"
              >
                {{ monthExpirations }} <span class="text-bold"> {{ dayExpirations }} {{ $t('dashboard.bid.of') }}</span>
                {{ yearExpirations }}
              </div>
              <p> {{ hoursExpirations }} </p>
            </div>
            <div
              v-else
            >
              <div
                class="text-bold row  justify-center text-end"
              >
                {{ $t('dashboard.bid.auctionTime') }}
              </div>

              <div
                class="text-bold"
              >
                <div

                  class="row justify-start time q-gutter-sm "
                >
                  <div>
                    <div class="text-bold">
                      <!-- {{ days }}  -->{{ countDays }}
                    </div>
                    <span> {{ $t('dashboard.bid.days') }} </span>
                  </div>

                  <div>
                    <div class="text-bold">
                      <!-- {{ hours }}--> {{ countHours }}
                    </div>
                    <span>{{ $t('dashboard.bid.hours') }}</span>
                  </div>
                  <div>
                    <div class="text-bold">
                      <!-- {{ minutes }} -->{{ countMinutes }}
                    </div>
                    <span>{{ $t('dashboard.bid.minis') }}</span>
                  </div>
                  <div>
                    <div class="text-bold">
                      <!-- {{ seconds }} --> {{ countSeconds }}
                    </div>
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
import { Watch } from 'vue-property-decorator';
import moment from 'moment';
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
    now: ['getTime'],
  },
})

export default class BidsInfor extends Vue.with(Props) {
lastBidAuctions: IBid[] = [];
days: number = 0;
hours: number = 0;
minutes: number = 0;
minuReal: number = 0;
seconds: number = 0;
monthExpirations: string = ''
dayExpirations: string = ''
yearExpirations: string = ''
hoursExpirations!: string ;
countDays: number = 0;
countHours: number = 0;
countMinutes: number = 0;
countSeconds: number = 0;
stopCount: boolean = false;
isfinish: boolean = false;

mounted(): void {
  void this.getTime();
  void this.formatTime();
}

 @Watch('now')
onPropertyChanged() {
  if (!this.stopCount) {
    if (this.countDays <= 0 && this.countHours <= 0 && this.countMinutes <= 0 && this.countSeconds <= 0) {
      if (this.lastCountDays === 0 && this.lastCountHours === 0 && this.lastCountMinutes === 0 && this.lastCountSeconds === 1) {
        this.formatTime();
        // this.isfinish = true;
        window.location.reload(true);
      }
      this.stopCount = true;
      console.log('format');
    } else {
      this.getTime();
      console.log('getTime');
    }
  }
  this.lastCountDays = this.countDays;
  this.lastCountHours = this.countHours;
  this.lastCountMinutes = this.countMinutes;
  this.lastCountSeconds = this.countSeconds;
}

lastCountDays: number = 0;
lastCountHours: number = 0;
lastCountMinutes: number = 0;
lastCountSeconds: number = 0;

formatTime(): void {
  this.monthExpirations = moment(this.bidsAuctions.expirationDt).format('MMM');
  this.dayExpirations = moment(this.bidsAuctions.expirationDt).format('DD');
  this.yearExpirations = moment(this.bidsAuctions.expirationDt).format('YYYY');
  this.hoursExpirations = moment(this.bidsAuctions.expirationDt).format('LT');
}

getTime() {
  const newEnded = moment(this.bidsAuctions.expirationDt);
  const timeLeft = moment.duration(newEnded.diff(moment()));
  this.countDays = timeLeft.days() || 0;
  this.countHours = timeLeft.hours() || 0;
  this.countMinutes = timeLeft.minutes() || 0;
  this.countSeconds = timeLeft.seconds() || 0;
}

get now() {
  return now.value;
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
    if (this.days < 0) {
      this.days = 0;
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

get isEnded() {
  return moment().isAfter(this.bidsAuctions.expirationDt);
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
  width: 180px;
  margin-right: 5px;
}
.text-time{
  font-size: 1.1rem;
  margin-left: -30px;
}
.text-end{
  width: 170px;
  font-size: 16px;
}
.text-winbid{
  font-size: 16px;
}
.title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  width: 400px;
  }

@media (max-width: 450px ) {
  .time{
     width: 100%;
    justify-content:center ;
    margin: 0;
  }
  .container-info {
    display: block;
    justify-content: center;
    align-items: center;
  }
  .text-end{
    width: 100%;
    justify-content: center;
    font-size: 16px;
  }
  .text-time{
    margin-left: 0;
  }

  .title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  width: 250px;
  }
}
</style>
