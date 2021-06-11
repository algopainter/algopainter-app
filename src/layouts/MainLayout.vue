<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal >
      <dashboard-header />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="120"
    >
      <side-bar />
    </q-drawer>
    <q-page-container class="q-px-lg">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import DashboardHeader from 'components/DashboardHeader.vue';
import SideBar from 'components/SideBar.vue';

@Options({
  components: {
    DashboardHeader,
    SideBar,
  },
})
export default class MainLayout extends Vue {
  leftDrawerOpen = true;
}
</script>

<style scoped>

</style>