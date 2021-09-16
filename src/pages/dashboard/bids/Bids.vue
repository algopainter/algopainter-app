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
          <div class="row q-gutter-md">
            <q-img
              class="img"
              :src="bid.item.previewImage"
            />
            <div class="text-title">
              <p class="text-bold">
                {{ bid.item.title }}
              </p>
              <p>
                {{ bid.item.description }}
              </p>
              <div class="row q-gutter-sm">
                <div
                  v-for="(user, i) in bid.users"
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
                      {{ getLastBid(index) }}{{ bid.bids[lastBidLength].tokenSymbol }}
                    </div>
                    <div class="text-amount">
                      {{ bidValue(bid.bids[lastBidLength].amount) }}
                      <q-tooltip
                        class="bg-primary"
                      >
                        {{ bid.bids[lastBidLength].tokenSymbol }} {{ bidValue(bid.bids[lastBidLength].amount) }}
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
                    <div class="text-bold">
                      {{ $t('dashboard.bid.auctionEnd') }}
                    </div>
                    <div class="text-bold">
                      {{ dataMoment(index) }}{{ expirationDayMounth }}
                    </div>
                    <div>
                      {{ expirationYear }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <q-separator
          vertical
          inset
        />
        <div class="col-xs-12 col-sm-12 col-md-4 col column justify-center ">
          <div class="text-bold text-h5 row justify-center">
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
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { IAuctionItem } from 'src/models/IAuctionItem';
import AlgoButton from 'components/common/Button.vue';
import Moment from 'moment';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';

@Options({
  components: {
    AlgoButton,
  },
})

export default class Bids extends Vue {
auctionsBid: IAuctionItem[] = [];
lastBid: IAuctionItem[] = [];
lastBidLength: number = 0;
expirationDayMounth: string | unknown = '';
expirationYear: string | unknown = '';
loading: boolean = true;

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const lastBidAuctions = this.auctionsBid[index].bids;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  this.lastBidLength = lastBidAuctions.length - 1;
  // eslint-disable-next-line no-undef, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
}

dataMoment(index: number) {
  const dayMounth = this.auctionsBid[index].expirationDt;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
  this.expirationDayMounth = Moment(dayMounth).format('DD MMM');
  this.expirationYear = Moment(dayMounth).format('YYYY');
}

bidValue(bids: number) {
  const amount = blockchainToCurrency(
    bids,
    18,
  );
  console.log('bids', bids);

  return amount;
}
}
</script>
<style lang="scss">
.container-bids{
  max-width: 100%;
  max-height: 100%;
  border-radius: 20px;
  padding: 20px;
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
