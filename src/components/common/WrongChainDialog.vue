<template>
  <q-dialog ref="dialog" persistent @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-pa-md">
      <q-card-section class="q-col-gutter-xl">
        <div class="flex justify-center">
          <q-spinner color="primary" size="5em" />
        </div>
      </q-card-section>
      <q-card-section class="q-pa-lg text-center">
        <div class="text-h5 text-bold q-py-sm">{{ "Wrong Network" }}</div>
        <div class="text-bold text-grey">{{ "Migrate to a Binance SmartChain" }}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { QDialog } from 'quasar';
import { Options, Vue } from 'vue-class-component';

@Options({
  emits: ['hide'],
  computed: {
    networkInfo: false,
  },
  watch: {
    networkInfo: ['hide'],
  },
})
export default class WrongChainDialog extends Vue {
  declare $refs: {
    dialog: QDialog;
  };

  get networkInfo() {
    return this.$store.state.user.networkInfo;
  }

  mounted() {
    this.show();
  }

  show() {
    this.$refs.dialog.show();
  }

  hide() {
    if (this.networkInfo?.id === 56) {
      this.$refs.dialog.hide();
    }
  }

  onDialogHide() {
    this.$emit('hide');
  }
}
</script>
<style scoped>
.wallet {
  cursor: pointer;
}
</style>
