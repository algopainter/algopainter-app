<template>
  <div v-if="loading === false">
    <div v-if="auctionsBid.length > 0">
      <div v-for="(bid, index) in auctionsBid" :key="index">
        <Bids-page :bid="bid" :index="index" />
      </div>
    </div>
    <div v-else>
      <div class="text-h5 q-mt-lg text-primary text-center">
        {{ $t('dashboard.bid.noBids') }}
      </div>
      <div class="text-bold text-h5 text-center">
        {{ $t('dashboard.bid.goingOnce' ) }}
      </div>
    </div>
  </div>
  <q-spinner
    v-else
    class="q-mt-xl"
    size="xl"
    width="100%"
    color="primary"
  />
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { IAuctionItem } from 'src/models/IAuctionItem';
import BidsPage from './BidsPage.vue';
import { MutationPayload } from 'vuex';
import { resolve } from 'dns';

@Options({
  components: {
    BidsPage,
  },
})

export default class Bids extends Vue {
  auctionsBid: IAuctionItem[] = [];
  auctionsBidId: string[] = [];
  loading: boolean = true;
  dias: number = 0;

  reloadInterval?: ReturnType<typeof setInterval> | number;

  @Watch('accountAdress')
  onPropertyChanged() {
    this.getBids();
  }

  mounted() {
    this.$store.subscribe((mutation: MutationPayload) => {
      if (mutation.type === 'auctions/SET_BIDS') {
        this.auctionsBid = mutation.payload as IAuctionItem[];
        this.loading = false;
      }
    });

    this.getBids();
    this.reloadInterval = setInterval(() => {
      this.getBids();
    }, 5000);
  }

  unmounted() {
    clearInterval(this.reloadInterval as number);
  }

  get accountAdress() {
    return this.$store.getters['user/account'] as string;
  }

  getBids() {
    this.$store.dispatch({
      type: 'auctions/getBids',
      account: this.accountAdress,
      forBids: true,
    }).catch(console.error);
  }
}
</script>
<style lang="scss">
</style>
