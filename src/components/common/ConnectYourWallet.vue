<template>
  <q-dialog ref="dialog" persistent @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-actions align="right">
        <q-btn color="primary" label="Metamask" @click="connectToWallet" />
        <q-btn color="primary" label="WalletConnect" @click="connectToWallet" />
      </q-card-actions>
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

  connectToWallet() {
    this.$store.dispatch('user/connectToWallet', 0).then(
      (value) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (this.$store.getters['user/isConnected']) {
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
