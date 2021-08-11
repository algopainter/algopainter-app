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
        console.log('terminou de conectar');
        if (this.pageToGoAfterConnected) {
          void this.$router.push(this.pageToGoAfterConnected);
        }
        this.$emit('connected');
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
