<template>
  <div
    v-if="loading === false"
  >
    <div v-if="bidStatus === false">
      <div
        v-for="(bid, index) in auctionsBid"
        :key="index"
      >
        <Bids-page
          :bid="bid"
          :account-adress="accountAdress"
          :index="index"
        />
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

@Options({
  components: {
    BidsPage,
  },
})

export default class Bids extends Vue {
  auctionsBid: IAuctionItem[] = [];
  loading: boolean = true;
  dias: number = 0;

  reloadInterval: number = 0;

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

    this.reloadInterval = setInterval(() => {
      void this.getBids();
    }, 5000) as unknown as number;
  }

  unmounted() {
    clearInterval(this.reloadInterval);
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

  get bidStatus() {
    for (let index = 0; index < this.auctionsBid.length; index++) {
      if (this.auctionsBid[index].ended === false) {
        return false;
      }
    }
    return true;
  }
}
</script>
<style lang="scss">

</style>
