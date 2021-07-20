<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="q-py-lg bg-white">
      <dashboard-header
        :leftDrawerOpen="leftDrawerOpen"
        @connectYourWalletClicked="refreshModal"
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
      <router-view
        @favoriteClicked="refreshModal"
      />
      <connect-your-wallet
        v-if="showModal"
        @connected="refreshModal"
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
