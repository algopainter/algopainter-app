<template>
  <div class="container">
    <q-layout view="lHh Lpr lFf ">
      <q-header class="q-py-lg bg-white row justify-center">
        <dashboard-header
          :left-drawer-open="leftDrawerOpen"
          @connectYourWalletClicked="showModal = true"
          @openDrawer="openDrawer"
        />
      </q-header>
      <q-drawer
        v-model="leftDrawerOpen"
        :width="120"
        :breakpoint="768"
      >
        <side-bar
          @galleryClicked="refreshModal"
          @pageOptionClicked="pageOptionClicked"
          @openModalArtist="openModalArtist"
        />
      </q-drawer>
      <q-page-container class="q-px-lg">
        <router-view
          @favoriteClicked="refreshModal"
        />
        <connect-your-wallet
          v-if="showModal"
          :page-to-go-after-connected="page"
        />
        <wrong-chain-dialog v-if="showWrongChainDialog" />
        <NewPaintingModal v-model="openModal" />
        <AuctionModal v-model="isAuctionModalOpen" />
        <BidBackModal v-model="isBidBackModalOpen" />
        <PirsModal v-model="isPirsModalOpen" />
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
import NewPaintingModal from 'src/components/modal/NewPaintingModal.vue';
import AuctionModal from 'src/components/modal/AuctionModal.vue';
import BidBackModal from 'src/components/home-page/user-gallery-overview/BidBackModal.vue';
import PirsModal from 'src/components/home-page/user-gallery-overview/PirsModal.vue';

@Options({
  components: {
    DashboardHeader,
    SideBar,
    ConnectYourWallet,
    WrongChainDialog,
    NewPaintingModal,
    AuctionModal,
    BidBackModal,
    PirsModal,

  },
  watch: {
    isConnected: ['refreshModal'],
    networkInfo: ['refreshWrongChainDialog'],
  },
  computed: {
    isConnected: false,
    networkInfo: false,
  },
})
export default class MainLayout extends Vue {
  leftDrawerOpen: boolean = false;
  openModal: boolean = false;
  showModal: boolean = false;
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
    this.leftDrawerOpen = (window.innerWidth > 768);
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    localStorage.isConnected = this.isConnected;
  }

  @Watch('openAuctionModal')
  onOpenAuctionModalChanged() {
    this.isAuctionModalOpen = this.openAuctionModal;
  }

  @Watch('openBidBackModal')
  onOpenBidBackModalChanged() {
    this.isBidBackModalOpen = this.openBidBackModal;
  }

  @Watch('openPirsModal')
  onOpenPirsModalChanged() {
    this.isPirsModalOpen = this.openPirsModal;
  }

  @Watch('openConnectYourWalletModal')
  onOpenConnectYourWalletModalChanged() {
    this.showModal = this.openConnectYourWalletModal;
  }

  get openAuctionModal() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['auctions/openAuctionModal'] as boolean;
  }

  get openBidBackModal() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['auctions/openBidBackModal'] as boolean;
  }

  get openPirsModal() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['auctions/openPirsModal'] as boolean;
  }

  get openConnectYourWalletModal() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/GET_OPEN_CONNECT_YOUR_WALLET_MODAL'] as boolean;
  }

  openDrawer() {
    this.leftDrawerOpen = true;
  }

  openModalArtist() {
    this.openModal = true;
  }

  get isConnected() {
    return this.$store.state.user.isConnected;
  }

  get networkInfo() {
    return this.$store.state.user.networkInfo;
  }

  refreshModal() {
    void this.$store.dispatch('user/openConnectYourWalletModal');
    this.showModal = !this.isConnected;
  }

  refreshWrongChainDialog() {
    this.showWrongChainDialog = (this.networkInfo?.id !== 56 && this.networkInfo?.id !== 97);
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
