<template>
  <q-toolbar class="q-pa-none">
    <q-toolbar-title class="header">
      {{ $route.meta.title }}
    </q-toolbar-title>
    <nav class="q-pr-lg nav-bar text-primary">
      <div class="item">
        {{ $t('dashboard.myCollection') }}
      </div>
      <div class="item">
        {{ $t('dashboard.auction') }}
      </div>
      <div class="item">
        {{ $t('dashboard.create') }}
      </div>
      <div class="item" @click="connectYourWalletClicked">
        {{ $t('dashboard.connectYourWallet').toLowerCase() }}
      </div>
    </nav>
  </q-toolbar>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  emits: ['connectYourWalletClicked'],
})
export default class DashboardHeader extends Vue {
  connectYourWalletClicked() {
    this.$emit('connectYourWalletClicked');
  }
}
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;

  .item {
    padding: 0 24px;
  }
}
</style>
