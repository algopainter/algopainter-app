<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    @hide="onDialogHide"
  >
    <q-card class="row q-pa-md">
      <q-card-section class="header">
        <p class="text-center text-bold q-mt-md text-h6">
          {{ $t('createCollectible.mintModal.title') }}
        </p>
      </q-card-section>
      <q-card-section>
        <div class="steps row q-col-gutter-md">
          <div class="col-12 step">
            <div class="avatar">
              <q-avatar
                v-if="statusData === 'aproved'"
                size="60px"
                color="primary"
              >
                <q-spinner color="white" />
              </q-avatar>
              <q-avatar
                v-else-if="statusData === 'error'"
                size="60px"
                color="negative"
                text-color="white"
              >
                <q-icon name="mdi-alert-circle" />
              </q-avatar>
              <q-avatar
                v-else
                size="60px"
                color="positive"
                text-color="white"
              >
                <q-icon name="mdi-check" />
              </q-avatar>
            </div>
            <div class="label">
              <div class="title">
                {{ $t('dashboard.sellYourArt.statuses.contractApprove') }}
              </div>
              <div>
                {{ firstStepLabel }}
              </div>
            </div>
          </div>
          <div class="col-12 step">
            <div class="avatar">
              <q-avatar

                size="60px"
                color="grey"
                text-color="white"
              >
                <q-icon name="mdi-cancel" />
              </q-avatar>
              <q-avatar

                size="60px"
                color="warning"
                text-color="white"
              >
                <q-icon name="mdi-alert" />
              </q-avatar>
              <q-avatar

                size="60px"
                color="primary"
                text-color="white"
              >
                <q-spinner color="white" />
              </q-avatar>
              <q-avatar

                size="60px"
                color="negative"
                text-color="white"
              >
                <q-icon name="mdi-alert-circle" />
              </q-avatar>
              <q-avatar

                size="60px"
                color="positive"
                text-color="white"
              >
                <q-icon name="mdi-check" />
              </q-avatar>
            </div>
            <div class="label">
              <div class="title">
                {{ $t('dashboard.sellYourArt.createAuction') }}
              </div>
            <!-- <div>
              {{ secondStepLabel }}
            </div> -->
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="flex justify-end">
        <algo-button
          :label="$t('dashboard.auctionPage.okButton')"
          color="primary"
          @click="$emit('requestClose')"
        />
      </q-card-section>
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

  statusData = prop({
    type: String,
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

  get firstStepLabel() {
    switch (this.statusData) {
      case 'aproved':
        return this.$t(
          'dashboard.sellYourArt.statuses.checkingContractApproved',
        );
      case 'confirme':
        return this.$t('dashboard.sellYourArt.statuses.approveContractInput');
      case 'error':
        return this.$t(
          'dashboard.sellYourArt.statuses.approveContractConfirmation',
        );
      default:
        return this.$t(
          'dashboard.sellYourArt.statuses.approveContractAvailable',
        );
    }
  }
}
</script>
<style scoped>
.margin{
  margin: 0px auto;
}
</style>
