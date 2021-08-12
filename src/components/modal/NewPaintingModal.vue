<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    @hide="onDialogHide"
  >
    <q-card class="q-pa-md">
      <p class="row justify-center text-h5">
        {{ $t('dashboard.selectAlgoP') }}
      </p>
      <div class="row">
        <q-btn
          round
          type="a"
          href="https://app.algopainter.art/paintings/new"
        >
          <q-avatar size="250px">
            <img
              width="150px"
              src="/images/gwei.png"
            >
          </q-avatar>
        </q-btn>
        <q-btn
          round
          type="a"
          href="https://app.algopainter.art/collections/1/new"
        >
          <q-avatar size="250px">
            <img
              src="/images/manwithnoname.png"
            >
          </q-avatar>
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import { QDialog } from 'quasar';
class Props {
  OpenModal = prop({
    type: Boolean,
    required: true,
  })
}
@Options({
  components: {
  },
})
export default class NewPaintingModal extends Vue.with(Props) {
  modal: boolean = false;

  show() {
    this.$refs.dialog.show();
  }

  hide() {
    this.$refs.dialog.hide();
  }

  onDialogHide() {
    this.$emit('hide');
  }

  closeModal() {
    this.modal = false;
  }

  declare $refs: {
    dialog: QDialog;
  };
}
</script>
<style scoped>

</style>
