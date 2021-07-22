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
        <side-bar />
      </q-drawer>
      <q-page-container class="q-px-lg">
        <router-view />
        <connect-your-wallet v-if="showModal" />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import DashboardHeader from 'components/DashboardHeader.vue';
import SideBar from 'components/SideBar.vue';
import ConnectYourWallet from 'components/common/ConnectYourWallet.vue';

@Options({
  components: {
    DashboardHeader,
    SideBar,
    ConnectYourWallet,
  },
  watch: {
    isConnected: ['refreshModal'],
  },
  computed: {
    isConnected: false,
  },
})
export default class MainLayout extends Vue {
  leftDrawerOpen: boolean = false;

  beforeMount() {
    if (window.innerWidth <= 768) {
      this.leftDrawerOpen = false;
    } else {
      this.leftDrawerOpen = true;
      // enquanto leftDrawerOpen for true, quero o display do button como hidden
    }
  }

  showModal: boolean = false;

  openDrawer() {
    // console.log(this.leftDrawerOpen);
    this.leftDrawerOpen = true;
  }

  get isConnected() {
    return this.$store.state.user.isConnected;
  }

  refreshModal() {
    this.showModal = !this.isConnected;
  }
}
</script>
<style scoped>
.container {
  max-width: 1450px;
  margin: auto;
}
</style>
