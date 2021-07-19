<template>
  <q-toolbar class="q-pa-none header">
    <q-img
      src="../assets/icons/ALGOP.svg"
      class="btn-drawer q-ml-lg"
      :class="[leftDrawerOpen ? 'hide' : 'show']"
      @click="moveDrawer"
    />
    <q-toolbar-title class="title">
      {{ $route.meta.title }}
    </q-toolbar-title>
    <nav class="q-pr-lg nav-bar text-primary">
      <algo-button
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

class Props {
  leftDrawerOpen = prop({
    type: Boolean,
  });
}

@Options({
  emits: ['connectYourWalletClicked', 'openDrawer'],
  components: {
    AlgoButton,
  },
  /* watch: {
    leftDrawerOpen = 
  }, */
})
export default class DashboardHeader extends Vue.with(Props) {
  windowSize = window.innerWidth;

  connectYourWalletClicked() {
    this.$emit('connectYourWalletClicked');
  }

  moveDrawer() {
    console.log(this.leftDrawerOpen);
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

@media(max-width: 450px) {
  .header {
    display: flex;
    justify-content: space-between;
    .btn-drawer {
      margin-left: 20px;
    }
    .title {
      display: none;
    }
    .nav {

    }
  }
}
</style>
