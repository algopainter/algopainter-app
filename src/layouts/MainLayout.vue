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

@Options({
  components: {
    DashboardHeader,
    SideBar,
    ConnectYourWallet,
    WrongChainDialog,
    NewPaintingModal,
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
  page: string = '';
  artistModal: boolean = false;

  beforeMount() {
    this.headerMenu();
  }

  headerMenu() {
    if (window.innerWidth <= 768) {
      this.leftDrawerOpen = false;
    } else {
      this.leftDrawerOpen = true;
    }
  }

  @Watch('isConnected')
  onPropertyChanged() {
    localStorage.isConnected = this.isConnected;
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
