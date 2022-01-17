<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    persistent
    @hide="onDialogHide"
  >
    <q-card class="row full-width ">
      <q-card-section class="header">
        {{ $t('createCollectible.mintModal.title') }}
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
                {{ $t('createCollectible.mintModal.approveStatus.approveIfpsTitle') }}
              </div>
              <div>
                {{ firstStepLabel }}
              </div>
            </div>
          </div>
          <div class="col-12 step">
            <div class="avatar">
              <q-avatar
                v-if="painterPersonalItemStatus < PainterPersonalItemStatus.PersonalItemAwaitingInput"
                size="60px"
                color="grey"
                text-color="white"
              >
                <q-icon name="mdi-cancel" />
              </q-avatar>
              <q-avatar
                v-else-if="painterPersonalItemStatus === PainterPersonalItemStatus.PersonalItemAwaitingInput"
                size="60px"
                color="warning"
                text-color="white"
              >
                <q-icon name="mdi-alert" />
              </q-avatar>
              <q-avatar
                v-else-if="painterPersonalItemStatus === PainterPersonalItemStatus.PersonalItemAwaitingConfirmation"
                size="60px"
                color="primary"
                text-color="white"
              >
                <q-spinner color="white" />
              </q-avatar>
              <q-avatar
                v-else-if="painterPersonalItemStatus === PainterPersonalItemStatus.PersonalItemError"
                size="60px"
                color="negative"
                text-color="white"
              >
                <q-icon name="mdi-alert-circle" />
              </q-avatar>
              <q-avatar
                v-else-if="painterPersonalItemStatus === PainterPersonalItemStatus.PersonalItemCreated"
                size="60px"
                color="positive"
                text-color="white"
              >
                <q-icon name="mdi-check" />
              </q-avatar>
            </div>
            <div class="label">
              <div class="title">
                {{ $t('createCollectible.mintModal.approveStatus.mintImageTitle') }}
              </div>
              <div>
                {{ thirdStepLabel }}
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="flex justify-end">
        <algo-button
          v-close-popup
          :label="$t('dashboard.auctionPage.okButton')"
          color="primary"
          :disable="okBtnDisabled"
          @click="$emit('requestClose')"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import AlgoButton from 'components/common/Button.vue';
import { QDialog } from 'quasar';

enum PainterPersonalItemStatus {
  None,
  CheckingAllowance,
  IncreateAllowanceAwaitingInput,
  IncreateAllowanceAwaitingConfirmation,
  IncreateAllowanceError,
  IncreateAllowanceCompleted,
  PersonalItemAwaitingInput,
  PersonalItemAwaitingConfirmation,
  PersonalItemError,
  PersonalItemCreated,
}

class Props {
  OpenModal = prop({
    type: Boolean,
    required: true,
  })

  okBtnDisabled = prop({
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
  @Prop({ required: true }) painterPersonalItemStatus!: PainterPersonalItemStatus;
  modal: boolean = false;
  PainterPersonalItemStatus = PainterPersonalItemStatus;

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
          'createCollectible.mintModal.approveStatus.approveIfpsAproved',
        );
      case 'confirme':
        return this.$t('createCollectible.mintModal.approveStatus.approveIfpsComplet');
      case 'error':
        return this.$t(
          'createCollectible.mintModal.approveStatus.approveIfpsError',
        );
      default:
        return this.$t(
          'dashboard.sellYourArt.statuses.approveContractAvailable',
        );
    }
  }

  get thirdStepLabel() {
    switch (this.painterPersonalItemStatus) {
      case PainterPersonalItemStatus.PersonalItemAwaitingInput:
        return this.$t('createCollectible.mintModal.approveStatus.mintImageInput',
        );
      case PainterPersonalItemStatus.PersonalItemAwaitingConfirmation:
        return this.$t('createCollectible.mintModal.approveStatus.mintImageConfirmation',
        );
      case PainterPersonalItemStatus.PersonalItemError:
        return this.$t('createCollectible.mintModal.approveStatus.mintImageError',
        );
      case PainterPersonalItemStatus.PersonalItemCreated:
        return this.$t('createCollectible.mintModal.approveStatus.approveContractAvailable'
        );
      default:
        return this.$t('createCollectible.mintModal.approveStatus.mintImageInput',
        );
    }
  }
}
</script>
<style lang="scss" scoped>

.header {
  background: $primary;
  font-size: 1.4rem;
  color: #fff;
  width: 100%;
}
.steps {
  .step {
    flex-wrap: nowrap;
    display: flex;
    align-items: center;
  }

  .label {
    margin-left: 12px;

    .title {
      font-weight: bold;
      font-size: 1.2rem;
    }
  }
}
.margin{
  margin: 0px auto;
}
</style>
