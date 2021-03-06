<template>
  <q-card>
    <q-card-section class="header">
      {{ $t('dashboard.auctionPage.deletingAuction') }}
    </q-card-section>
    <q-card-section>
      <div class="steps row q-col-gutter-md">
        <div class="col-12 step">
          <div class="avatar">
            <q-avatar
              v-if="deleteAuctionStatus < DeletingAuctionStatus.DeleteAuctionAwaitingInput"
              size="60px"
              color="grey"
              text-color="white"
            >
              <q-icon name="mdi-cancel" />
            </q-avatar>
            <q-avatar
              v-else-if="deleteAuctionStatus === DeletingAuctionStatus.DeleteAuctionAwaitingInput"
              size="60px"
              color="warning"
              text-color="white"
            >
              <q-icon name="mdi-alert" />
            </q-avatar>
            <q-avatar
              v-else-if="deleteAuctionStatus === DeletingAuctionStatus.DeleteAuctionAwaitingConfirmation"
              size="60px"
              color="primary"
              text-color="white"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="deleteAuctionStatus === DeletingAuctionStatus.DeleteAuctionError"
              size="60px"
              color="negative"
              text-color="white"
            >
              <q-icon name="mdi-alert-circle" />
            </q-avatar>
            <q-avatar
              v-else-if="deleteAuctionStatus === DeletingAuctionStatus.AuctionDeleted"
              size="60px"
              color="positive"
              text-color="white"
            >
              <q-icon name="mdi-check" />
            </q-avatar>
          </div>
          <div class="label">
            <div class="title">
              {{ $t('dashboard.auctionPage.cancelAuctionStatuses.deleteAuction') }}
            </div>
            <div>
              {{ secondStepLabel }}
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="flex justify-end">
      <algo-button
        :label="$t('dashboard.auctionPage.okButton')"
        color="primary"
        :disable="okBtnDisabled"
        @click="$emit('requestClose')"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';
import { DeletingAuctionStatus } from 'src/eth/AlgoPainterAuctionSystemProxy';
import AlgoButton from 'components/common/Button.vue';

@Options({
  components: {
    AlgoButton,
  },
})
export default class DeleteAuctionStatusCard extends Vue {
  @Prop({ required: true }) deleteAuctionStatus!: DeletingAuctionStatus;

  DeletingAuctionStatus = DeletingAuctionStatus;

  get secondStepLabel() {
    switch (this.deleteAuctionStatus) {
      case DeletingAuctionStatus.DeleteAuctionAwaitingInput:
        return this.$t('dashboard.auctionPage.cancelAuctionStatuses.deleteAuctionInput');
      case DeletingAuctionStatus.DeleteAuctionAwaitingConfirmation:
        return this.$t('dashboard.auctionPage.cancelAuctionStatuses.deleteAuctionConfirmation');
      case DeletingAuctionStatus.DeleteAuctionError:
        return this.$t('dashboard.auctionPage.cancelAuctionStatuses.deleteAuctionError');
      case DeletingAuctionStatus.AuctionDeleted:
        return this.$t('dashboard.auctionPage.cancelAuctionStatuses.deleteAuctionDeleted');
      default:
        return '';
    }
  }

  get okBtnDisabled() {
    return this.deleteAuctionStatus !== DeletingAuctionStatus.AuctionDeleted &&
      this.deleteAuctionStatus !== DeletingAuctionStatus.DeleteAuctionError;
  }
}
</script>

<style lang="scss" scoped>
.header {
  background: $primary;
  font-size: 1.4rem;
  color: #FFF;
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
</style>
