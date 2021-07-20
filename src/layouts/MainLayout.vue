<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="q-py-lg bg-white">
      <dashboard-header
        @connectYourWalletClicked="showModal = true"
      />
    </q-header>
    <q-drawer v-model="leftDrawerOpen" :width="120">
      <side-bar />
    </q-drawer>
    <q-page-container class="q-px-lg">
      <router-view />
      <connect-your-wallet
        v-if="showModal"
      />
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
  watch: {
    isConnected: ['refreshModal'],
  },
  computed: {
    isConnected: false,
  },
})
export default class MainLayout extends Vue {
  leftDrawerOpen = true;

  showModal: boolean = false;

  get isConnected() {
    return this.$store.state.user.isConnected;
  }

  refreshModal() {
    this.showModal = !this.isConnected;
  }
}
</script>
