<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    class="q-gutter-md"
    @hide="onDialogHide"
  >
    <q-card
      class="q-pa-md"
    >
      <p class="text-bold text-h6">
        {{ $t('dashboard.stackModalAlgop.title') }}
      </p>
      <div>
        <div>
          <div class="row justify-between">
            <div>
              {{ $t('dashboard.stackModalAlgop.stake') }}
            </div>
            <div class="variable-balance">
              {{ $t('dashboard.stackModalAlgop.balance') }}
            </div>
          </div>
          <q-input
            v-model="number"
            type="number"
            rounded
            outlined
            suffix="$ALGOP"
            :rules="[val => !!val || 'No Tokens to stake.']"
            no-error-icon="false"
            :bind="confirm()"
          >
            <template #append>
              <q-btn
                rounded
                color="primary"
              >
                {{ $t('dashboard.stackModalAlgop.max') }}
              </q-btn>
            </template>
          </q-input>
          <div class="flex justify-between">
            <p>{{ $t('dashboard.stackModalAlgop.annual') }}</p>
            <div class="variable-balance">
              <p> {{ $t('dashboard.stackModalAlgop.annualCoin') }} </p>
            </div>
          </div>
          <div class="q-gutter-sm row justify-center">
            <algo-button
              v-close-popup
              type="submit"
              color="primary"
              class=""
              :label="$t('dashboard.stackModalAlgop.cancel')"
            />
            <algo-button
              type="submit"
              color="primary"
              :label="$t('dashboard.stackModalAlgop.confirm')"
              :disabled="isDisabled"
            />
          </div>
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
  algopStack= prop({
    type: Number,
    required: true,
  })
}

@Options({
  components: {
    AlgoButton,
  },
})

export default class MyPaint extends Vue.with(Props) {
  modal: boolean = true;
  isContractApproved: boolean = true;
  isStackConfim: boolean = true;
  isDisabled: boolean = true;
  number: number | null | string = null ;

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

  confirm() {
    if (this.number === '0' || this.number === null || this.number === '') {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

  approveContract() {
    this.isContractApproved = false;
  }
}
</script>
<style scoped>
.margin{
  margin: 0px auto;
}
.inputAl{
 width: 90%;
}
.variable-balance{
  width: 30%;
}
</style>
