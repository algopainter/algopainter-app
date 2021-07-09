<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="q-py-lg bg-white">
      <dashboard-header @connectYourWalletClicked="refreshModal" />
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      :width="120"
    >
      <side-bar />
    </q-drawer>
    <q-page-container class="q-px-lg">
      <router-view />
      <connect-your-wallet v-if="showModal" @connected="refreshModal" />
    </q-page-container>
  </q-layout>
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
})
export default class MainLayout extends Vue {
  leftDrawerOpen = true;

  showModal: boolean = false;

  isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (this.$store.getters['user/isConnected']) {
      return true;
    }
    return false;
  }

  refreshModal() {
    this.showModal = !this.isConnected();
    console.log('user state : ', this.$store.state.user);
  }
}
</script>
