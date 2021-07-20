<template>
  <q-toolbar class="q-pa-none">
    <q-toolbar-title class="header">
      {{ $route.meta.title }}
    </q-toolbar-title>
    <nav class="q-pr-lg nav-bar text-primary">
      <profile-info-button v-if="isConnected" />
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
import { Options, Vue } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import ProfileInfoButton from 'components/common/ProfileInfoButton.vue';

@Options({
  emits: ['connectYourWalletClicked'],
  components: {
    AlgoButton,
    ProfileInfoButton,
  },
  computed: {
    isConnected: false,
  },
})
export default class DashboardHeader extends Vue {
  connectYourWalletClicked() {
    this.$emit('connectYourWalletClicked');
  }

  get isConnected() {
    return this.$store.state.user.isConnected;
  }
}
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;

  .item {
    padding: 0 24px;
    cursor: pointer;
  }
}
</style>
