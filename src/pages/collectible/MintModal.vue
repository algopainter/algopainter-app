<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    @hide="onDialogHide"
  >
    <q-card class="row q-pa-md">
      <div class="col">
        <q-circular-progress
          indeterminate
          size="50px"
          color="primary"
          class="row justify-center align-center margin"
        />
        <p class="text-center text-bold q-mt-md text-h6">
          {{ $t('createCollectible.mintModal.title') }}
        </p>
        <p>
          {{ $t('createCollectible.mintModal.description') }}
        </p>
        <div class="row justify-center">
          <algo-button
            type="submit"
            color="primary"
            class="margin"
            :label="$t('createCollectible.mintModal.btnCancel')"
            @click="hide"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import { QDialog } from 'quasar';
class Props {
  OpenModal = prop({
    type: Boolean,
    required: true,
  })
}
@Options({
  components: {
    AlgoButton,
  },
})
export default class MyPaint extends Vue.with(Props) {
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
.margin{
  margin: 0px auto;
}
</style>
