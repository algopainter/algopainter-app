<template>
  <q-dialog
    ref="dialog"
    persistent
    @hide="onDialogHide, openAuctionModal"
  >
    <q-card class="q-dialog-plugin q-pa-md">
      <q-card-section class="row q-col-gutter-xl">
        <div class="text-h6">
          {{ $t('dashboard.connectToYourWallet') }}
        </div>
      </q-card-section>
      <q-card-section class="row q-col-gutter-xl q-pa-lg items-center">
        <div
          v-if="isTrustWallet"
          class="flex justify-center col-12"
          @click="connectToBlockchain('metamask')"
        >
          <q-img
            class="wallet"
            src="/images/trustwallet-logo.png"
          />
        </div>
        <template v-else>
          <div
            class="flex justify-center col-6"
            @click="connectToBlockchain('metamask')"
          >
            <q-img
              class="wallet"
              src="/images/metamask.png"
            />
            <div>{{ $t('dashboard.metaMask') }}</div>
          </div>
          <div
            class="flex justify-center col-6"
            @click="connectToBlockchain('walletConnect')"
          >
            <q-img
              class="wallet"
              src="/images/walletconnect.png"
            />
            <div>{{ $t('dashboard.walletConnect') }}</div>
          </div>
        </template>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { QDialog } from 'quasar';
import { Options, Vue, prop } from 'vue-class-component';

class Props {
  pageToGoAfterConnected = prop({
    required: false,
    default: '',
  })
}

@Options({
  emits: ['hide', 'connected'],
})
export default class ConnectYourWallet extends Vue.with(Props) {
  declare $refs: {
    dialog: QDialog;
  };

  get isTrustWallet(): boolean {
    return window.ethereum && window.ethereum.isTrust === true;
  }

  mounted() {
    this.show();
  }

  show() {
    this.$refs.dialog.show();
  }

  hide() {
    this.$refs.dialog.hide();
  }

  onDialogHide() {
    this.$emit('hide');
  }

  async connectToBlockchain(provider: string) {
    try {
      await this.$store.dispatch('user/connectToWallet', provider);
      if (this.pageToGoAfterConnected) {
        void this.$router.push(this.pageToGoAfterConnected);
      }

      this.$emit('connected');
    } catch (error) {
      console.log('error - Connect Your Wallet', error);
    }
  }
}
</script>
<style scoped>
.wallet {
  cursor: pointer;
}
</style>
