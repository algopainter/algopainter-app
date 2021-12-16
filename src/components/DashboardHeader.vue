<template>
  <q-toolbar class="container q-pa-none header">
    <q-img
      src="../assets/icons/ALGOP.svg"
      class="btn-drawer q-ml-lg"
      :class="[leftDrawerOpen ? 'hide' : 'show']"
      @click="moveDrawer"
    />
    <q-toolbar-title class="title">
      {{ $route.meta.title }}
    </q-toolbar-title>
    <nav class=" nav-bar text-primary q-pr-lg">
      <auction-notificator />
      <profile-dropdown-button v-if="isConnected" />
      <algo-button
        v-else
        :label="$t('dashboard.connectToYourWallet')"
        color="primary"
        outline
        @click="connectYourWalletClicked"
      />
    </nav>
  </q-toolbar>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import ProfileDropdownButton from 'components/common/ProfileDropdownButton.vue';
import AuctionNotificator from './AuctionNotificator.vue';

class Props {
  leftDrawerOpen = prop({
    type: Boolean,
  });
}

@Options({
  emits: ['connectYourWalletClicked', 'openDrawer'],
  components: {
    AlgoButton,
    ProfileDropdownButton,
    AuctionNotificator
  },
  computed: {
    isConnected: false,
  },
  /* watch: {
    leftDrawerOpen =
  }, */
})
export default class DashboardHeader extends Vue.with(Props) {
  windowSize = window.innerWidth;

  connectYourWalletClicked() {
    void this.$store.dispatch('user/openConnectYourWalletModal');
  }

  get isConnected() {
    return this.$store.state.user.isConnected;
  }

  moveDrawer() {
    this.$emit('openDrawer');
  }
}
</script>

<style lang="scss" scoped>
.header {
  .btn-drawer {
    width: 57.6px;
  }
  .hide {
    display: none;
  }
  .show {
    display: inline-block;
  }
}
.nav-bar {
  display: flex;

  .item {
    padding: 0 24px;
    cursor: pointer;
  }
}

.container{
  max-width: 1350px;
}

@media (max-width: 450px) {
  .header {
    display: flex;
    justify-content: space-between;
    .btn-drawer {
      margin-left: 20px;
    }
    .title {
      display: none;
    }
    .nav-bar{
      width: 48%;
    }
  }
}
</style>
