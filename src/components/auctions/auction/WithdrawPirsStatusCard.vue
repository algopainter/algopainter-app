<template>
  <q-card>
    <q-card-section class="header">
      {{ $t('dashboard.auctionPage.claimBidbackStatuses.claimBidback') }}
    </q-card-section>
    <q-card-section>
      <div class="steps row q-col-gutter-md">
        <div class="col-12 step">
          <div class="avatar">
            <q-avatar
              v-if="withdrawPirsStatus === WithdrawPirsStatus.CheckingContractApproved"
              size="60px"
              color="primary"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="withdrawPirsStatus === WithdrawPirsStatus.ContractApprovedAwaitingInput"
              size="60px"
              color="warning"
              text-color="white"
            >
              <q-icon name="mdi-alert" />
            </q-avatar>
            <q-avatar
              v-else-if="withdrawPirsStatus === WithdrawPirsStatus.ContractApprovedAwaitingConfirmation"
              size="60px"
              color="primary"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="withdrawPirsStatus === WithdrawPirsStatus.ContractApprovedError"
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
              {{ $t('dashboard.auctionPage.claimBidbackStatuses.contractApprove') }}
            </div>
            <div>
              {{ firstStepLabel }}
            </div>
          </div>
        </div>
        <div class="col-12 step">
          <div class="avatar">
            <q-avatar
              v-if="withdrawPirsStatus < WithdrawPirsStatus.WithdrawPirsAwaitingInput"
              size="60px"
              color="grey"
              text-color="white"
            >
              <q-icon name="mdi-cancel" />
            </q-avatar>
            <q-avatar
              v-else-if="withdrawPirsStatus === WithdrawPirsStatus.WithdrawPirsAwaitingInput"
              size="60px"
              color="warning"
              text-color="white"
            >
              <q-icon name="mdi-alert" />
            </q-avatar>
            <q-avatar
              v-else-if="withdrawPirsStatus === WithdrawPirsStatus.WithdrawPirsAwaitingConfirmation"
              size="60px"
              color="primary"
              text-color="white"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="withdrawPirsStatus === WithdrawPirsStatus.WithdrawPirsError"
              size="60px"
              color="negative"
              text-color="white"
            >
              <q-icon name="mdi-alert-circle" />
            </q-avatar>
            <q-avatar
              v-else-if="withdrawPirsStatus === WithdrawPirsStatus.PirsWithdrawn"
              size="60px"
              color="positive"
              text-color="white"
            >
              <q-icon name="mdi-check" />
            </q-avatar>
          </div>
          <div class="label">
            <div class="title">
              {{ $t('dashboard.auctionPage.claimPirs') }}
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

import AlgoButton from 'components/common/Button.vue';

enum WithdrawPirsStatus {
  CheckingContractApproved,
  ContractApprovedAwaitingInput,
  ContractApprovedAwaitingConfirmation,
  ContractApprovedError,
  WithdrawPirsAwaitingInput,
  WithdrawPirsAwaitingConfirmation,
  WithdrawPirsError,
  PirsWithdrawn,
}

@Options({
  components: {
    AlgoButton,
  },
})
export default class WithdrawPirsStatusCard extends Vue {
  @Prop({ required: true }) withdrawPirsStatus!: WithdrawPirsStatus;

  WithdrawPirsStatus = WithdrawPirsStatus;

  get firstStepLabel() {
    switch (this.withdrawPirsStatus) {
      case WithdrawPirsStatus.CheckingContractApproved:
        return this.$t('dashboard.auctionPage.claimPirsStatuses.checkingContractApproved');
      case WithdrawPirsStatus.ContractApprovedAwaitingInput:
        return this.$t('dashboard.auctionPage.claimPirsStatuses.approveContractInput');
      case WithdrawPirsStatus.ContractApprovedAwaitingConfirmation:
        return this.$t('dashboard.auctionPage.claimPirsStatuses.approveContractConfirmation');
      case WithdrawPirsStatus.ContractApprovedError:
        return this.$t('dashboard.auctionPage.claimPirsStatuses.approveContractError');
      default:
        return this.$t('dashboard.auctionPage.claimPirsStatuses.approveContractAvailable');
    }
  }

  get secondStepLabel() {
    switch (this.withdrawPirsStatus) {
      case WithdrawPirsStatus.WithdrawPirsAwaitingInput:
        return this.$t('dashboard.auctionPage.claimPirsStatuses.createAuctionInput');
      case WithdrawPirsStatus.WithdrawPirsAwaitingConfirmation:
        return this.$t('dashboard.auctionPage.claimPirsStatuses.claimPirsConfirmation');
      case WithdrawPirsStatus.WithdrawPirsError:
        return this.$t('dashboard.auctionPage.claimPirsStatuses.claimPirsError');
      case WithdrawPirsStatus.PirsWithdrawn:
        return this.$t('dashboard.auctionPage.claimPirsStatuses.claimedPirsSuccessfully');
      default:
        return '';
    }
  }

  get okBtnDisabled() {
    return this.withdrawPirsStatus !== WithdrawPirsStatus.PirsWithdrawn &&
      this.withdrawPirsStatus !== WithdrawPirsStatus.ContractApprovedError &&
      this.withdrawPirsStatus !== WithdrawPirsStatus.WithdrawPirsError;
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
