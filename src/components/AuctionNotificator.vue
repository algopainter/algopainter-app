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
      @click="goToPirsTab"
    />
    <q-btn
      class="bidback-btn"
      :label="
        $t('dashboard.header.auctionNotificator.bidBackBtn', {
          bidBackCounter: bidBackCounter,
        })
      "
      color="primary"
      @click="goToBidBackTab"
    />
  </div>
</template>

<script lang="ts">
import AlgoButton from 'components/common/Button.vue';
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
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
  reloadInterval: ReturnType<typeof setInterval> | number = 0;
  page: number = 1;

  async goToPirsTab() {
    if (this.$route.name !== 'myGallery') {
      await this.$router.push({ name: 'myGallery', params: { btn: 'Pirs' } });
    }

    await this.$store
      .dispatch({
        type: 'user/setStatusPirsTab',
        status: true
      })
  }

  async goToBidBackTab() {
    if (this.$route.name !== 'myGallery') {
      await this.$router.push({ name: 'myGallery', params: { btn: 'BidBack' } });
    }

    await this.$store
      .dispatch({
        type: 'user/setStatusBidBackTab',
        status: true
      })
  }

  mounted() {
    this.getPirsCounter();
    this.getBidBackCounter();
    this.setReloadInterval();
  }

  setReloadInterval() {
    if (this.isConnected) {
      this.reloadInterval = setInterval(() => {
        this.getPirsCounter();
        this.getBidBackCounter();
      }, 5000);
    } else {
      this.pirsCounter = 0;
      this.bidBackCounter = 0;
    }
  }

  @Watch('userAccount')
  onUserAccountChanged() {
    clearInterval(this.reloadInterval as number);
    this.getPirsCounter();
    this.getBidBackCounter();
    this.setReloadInterval();
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
  align-items: center;
  .pirs-btn,
  .bidback-btn {
    border-radius: 34px;
    min-width: 120px;
    margin-right: 5px;
    max-height: 36px;
    font-weight: bold;
  }
  .pirs-btn {
    background-color: #9E0039 !important;
  }
  .bidback-btn {
    background-color: #00B412 !important;
  }
}
@media (max-width: 550px) {
  .auction-notificator-container {
    .pirs-btn,
    .bidback-btn {
      font-size: 9px;
      min-width: 90px !important;
      max-height: 25px !important;
    }
  }
}
@media (max-width: 495px) {
  .auction-notificator-container {
    flex-direction: column;
    .bidback-btn {
      margin-top: 5px;
    }
  }
}
</style>
