<template>
  <div class="auction-notificator-container">
    <q-btn
      class="pirs-btn"
      :label="
        $t('dashboard.header.auctionNotificator.pirsBtn', {
          pirsCounter: pirsCounter,
        })
      "
      color="primary"
      :to="'/my-gallery'"
    />
    <q-btn
      class="bidback-btn"
      :label="
        $t('dashboard.header.auctionNotificator.bidBackBtn', {
          bidBackCounter: bidBackCounter,
        })
      "
      color="primary"
      :to="'/my-gallery'"
    />
  </div>
</template>

<script lang="ts">
import AlgoButton from 'components/common/Button.vue';
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';
import { IAxiosPaginated } from 'src/models/IAxios';

@Options({
  components: {
    AlgoButton,
  },
  computed: {
    ...mapGetters('user', {
      isConnected: 'isConnected',
      userAccount: 'account',
    }),
    ...mapGetters('collections', {
      pirsTabData: 'pirsTabImages',
    }),
    ...mapGetters('auctions', {
      bidBackTabData: 'getBidBack',
    }),
  },
})
export default class AuctionNotificator extends Vue {
  isConnected?: boolean;
  pirsCounter: number = 0;
  bidBackCounter: number = 0;
  userAccount?: string;
  pirsTabData!: IAxiosPaginated;
  bidBackTabData!: IAxiosPaginated;
  page: number = 1;

  mounted() {
    if (this.isConnected) {
      this.getPirsCounter();
      this.getBidBackCounter();
    } else {
      this.pirsCounter = 0;
      this.bidBackCounter = 0;
    }
  }

  getPirsCounter() {
    this.$store
      .dispatch({
        type: 'collections/getUserPirsTabImages',
        account: this.userAccount,
        page: this.page,
        perPage: '9',
      })
      .then(() => {
        this.pirsCounter = (this.pirsTabData.count) ? this.pirsTabData.count : 0;
      })
      .catch(console.error);
  }

  getBidBackCounter() {
    this.$store
      .dispatch({
        type: 'auctions/getBidBack',
        account: this.userAccount,
        page: this.page,
        perPage: '9',
      })
      .then(() => {
        this.bidBackCounter = (this.bidBackTabData.count) ? this.bidBackTabData.count : 0;
      })
      .catch(console.error);
  }
}
</script>
<style lang="scss" scoped>
.auction-notificator-container {
  display: flex;
  .pirs-btn,
  .bidback-btn {
    border-radius: 34px;
    min-width: 120px;
    margin-right: 5px;
    max-height: 36px;
  }
  .pirs-btn {
    background-color: #9E0039 !important;
  }
  .bidback-btn {
    background-color: #00B412 !important;
  }
}
</style>
