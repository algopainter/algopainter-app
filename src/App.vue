<template>
  <router-view v-if="!loading" />
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { mapActions } from 'vuex';

@Options({
  methods: {
    ...mapActions('user', ['connectToWallet']),
  },
})
export default class App extends Vue {
  connectToWallet!: (address: string) => Promise<void>;

  loading: boolean = false;

  created() {
    void this.loadUserProfile();
  }

  async loadUserProfile() {
    try {
      this.loading = true;

      if (localStorage.isConnected) {
        await this.connectToWallet(localStorage.wallet);
      }

      this.loading = false;
    } catch {
      this.loading = false;
    }
  }
}
</script>
