<template>
  <q-dialog
    ref="dialog"
    persistent
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin q-pa-md">
      <q-card-section class="row q-col-gutter-xl">
        <div class="text-h6">
          {{ $t('dashboard.connectToYourWallet') }}
        </div>
      </q-card-section>
      <q-card-section class="row q-col-gutter-xl q-pa-lg items-center">
        <div class="flex justify-center col-6">
          <q-img
            class="wallet"
            src="/images/metamask.png"
            @click="connectToMetaMask"
          />
          <div>{{ $t('dashboard.metaMask') }}</div>
        </div>
        <div class="flex justify-center col-6">
          <q-img
            class="wallet"
            src="/images/walletconnect.png"
            @click="connectToMetaMask"
          />
          <div>{{ $t('dashboard.walletConnect') }}</div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { QDialog } from 'quasar';
import { Options, Vue } from 'vue-class-component';

@Options({
  emits: ['hide', 'connected'],
})
export default class ConnectYourWallet extends Vue {
  declare $refs: {
    dialog: QDialog;
  };

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

  connectToMetaMask() {
    this.$store.dispatch('user/connectToWallet', 'metamask').then(
      (value) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (this.$store.getters['user/isConnected']) {
          console.log('conectado');
          this.$emit('connected');
        } else {
          console.log('fail when connectToWallet');
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }
}
</script>
<style scoped>
.wallet {
  cursor: pointer;
}
</style>
