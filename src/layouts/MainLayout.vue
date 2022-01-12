<template>
  <div class="container">
    <q-layout view="lHh Lpr lFf ">
      <q-header class="q-py-lg bg-white row justify-center">
        <dashboard-header
          :left-drawer-open="leftDrawerOpen"
          @connectYourWalletClicked="showConnectYourWalletModal"
          @openDrawer="openDrawer"
        />
      </q-header>
      <q-drawer v-model="leftDrawerOpen" :width="120" :breakpoint="768">
        <side-bar
          @userIsNotLogged="refreshModal"
          @pageOptionClicked="pageOptionClicked"
        />
      </q-drawer>
      <q-page-container class="q-px-md">
        <router-view @favoriteClicked="refreshModal" />
        <connect-your-wallet
          v-if="showConnectYourWalletModal"
          :page-to-go-after-connected="page"
        />
        <wrong-chain-dialog v-if="showWrongChainDialog" />
        <AuctionModal v-model="openAuctionModal" />
        <BidBackModal v-model="openBidBackModal" />
        <BidBackSimulatorModal v-model="openBidBackSimulatorModal" />
        <PirsModal v-model="openPirsModal" />
        <PirsSimulatorModal v-model="openPirsSimulatorModal" />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import DashboardHeader from 'components/DashboardHeader.vue';
import SideBar from 'components/SideBar.vue';
import ConnectYourWallet from 'components/common/ConnectYourWallet.vue';
import WrongChainDialog from 'components/common/WrongChainDialog.vue';
import { Watch } from 'vue-property-decorator';
import AuctionModal from 'src/components/modal/AuctionModal.vue';
import BidBackModal from 'src/components/home-page/user-gallery-overview/BidBackModal.vue';
import BidBackSimulatorModal from 'src/components/home-page/user-gallery-overview/BidBackSimulatorModal.vue';
import PirsSimulatorModal from 'src/components/home-page/user-gallery-overview/PirsSimulatorModal.vue';
import PirsModal from 'src/components/home-page/user-gallery-overview/PirsModal.vue';
import { mapGetters } from 'vuex';
import { NetworkInfo } from 'src/store/user/types';

@Options({
  components: {
    DashboardHeader,
    SideBar,
    ConnectYourWallet,
    WrongChainDialog,
    AuctionModal,
    BidBackModal,
    PirsModal,
    BidBackSimulatorModal,
    PirsSimulatorModal,
  },
  watch: {
    isConnected: ['refreshModal'],
    networkInfo: ['refreshWrongChainDialog'],
  },
  computed: {
    ...mapGetters('auctions', [
      'openAuctionModal',
      'openBidBackModal',
      'openBidBackSimulatorModal',
      'openPirsModal',
      'openPirsSimulatorModal',
    ]),
    ...mapGetters('user', {
      isConnected: 'isConnected',
      networkInfo: 'networkInfo',
      openConnectYourWalletModal: 'GET_OPEN_CONNECT_YOUR_WALLET_MODAL',
    }),
  },
})
export default class MainLayout extends Vue {
  leftDrawerOpen: boolean = false;
  showConnectYourWalletModal: boolean = false;
  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  openBidBackSimulatorModal!: boolean;
  openPirsSimulatorModal!: boolean;
  openPirsModal!: boolean;
  openBidBackModal!: boolean;
  openAuctionModal!: boolean;
  openConnectYourWalletModal!: boolean;
  showWrongChainDialog: boolean = false;
  isAuctionModalOpen: boolean = false;
  isBidBackModalOpen: boolean = false;
  isPirsModalOpen: boolean = false;
  page: string = '';
  artistModal: boolean = false;

  beforeMount() {
    this.headerMenu();
  }

  headerMenu() {
    this.leftDrawerOpen = window.innerWidth > 768;
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    localStorage.isConnected = this.isConnected;
  }

  @Watch('openConnectYourWalletModal')
  onOpenConnectYourWalletModalChanged() {
    this.showConnectYourWalletModal = this.openConnectYourWalletModal;
  }

  openDrawer() {
    this.leftDrawerOpen = true;
  }

  refreshModal() {
    this.$store
      .dispatch('user/openConnectYourWalletModal')
      .catch(console.error);
    this.showConnectYourWalletModal = !this.isConnected;
  }

  refreshWrongChainDialog() {
    this.showWrongChainDialog =
      this.networkInfo?.id !== 56 && this.networkInfo?.id !== 97;
  }

  pageOptionClicked(page: string) {
    this.page = page;
  }
}
</script>
<style scoped>
.container {
  max-width: 1450px;
  margin: auto;
}
</style>
