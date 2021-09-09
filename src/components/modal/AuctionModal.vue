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
          target="_blank"
        >
          <q-avatar
            size="250px"
            class="avatar"
          >
            <img
              width="150px"
              class="img"
              src="/images/gwei.png"
            >
          </q-avatar>
        </q-btn>
        <algoButton
          class="q-my-md action full-width"
          color="primary"
          :label="$t('dashboard.homePage.sell')"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import { QDialog } from 'quasar';
import AlgoButton from 'src/components/common/Button.vue';

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
export default class AuctionModal extends Vue.with(Props) {
  modal: boolean = false;
  testMessage: string = 'Stack Algop';

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
.avatar {
  width: 250px;
}

@media (max-width: 450px) {
  .avatar{
    width: 140px;
    height: 140px;
  }
}
</style>
