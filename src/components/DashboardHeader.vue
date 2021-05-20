<template>
  <q-toolbar class="q-pa-none">
    <q-toolbar-title class="header text-bold text-black">
      {{ $route.meta.title }}
    </q-toolbar-title>
    <nav class="nav-bar text-primary">
      <div class="item">{{ $t('dashboard.myCollection' )}}</div>
      <div class="item">{{ $t('dashboard.auction' )}}</div>
      <div class="item">{{ $t('dashboard.create' )}}</div>
    </nav>
  </q-toolbar>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class DashboardHeader extends Vue {
}
</script>

<style lang="scss" scoped>
.header {
  font-size: 1.8rem;
}

.nav-bar {
  display: flex;

  .item {
    padding: 0 24px;
  }
}
</style>
