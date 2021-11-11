<template>
  <q-card>
    <q-card-section class="header">
      {{ $t('dashboard.auctionPage.claimBidBackStatuses.claimBidBack') }}
    </q-card-section>
    <q-card-section>
      <div class="steps row q-col-gutter-md">
        <div class="col-12 step">
          <div class="col-12 step">
            <div class="avatar">
              <q-avatar
                v-if="withdrawBidBackStatus < WithdrawBidBackStatus.WithdrawBidBackAwaitingInput"
                size="60px"
                color="grey"
                text-color="white"
              >
                <q-icon name="mdi-cancel" />
              </q-avatar>
              <q-avatar
                v-else-if="withdrawBidBackStatus === WithdrawBidBackStatus.WithdrawBidBackAwaitingInput"
                size="60px"
                color="warning"
                text-color="white"
              >
                <q-icon name="mdi-alert" />
              </q-avatar>
              <q-avatar
                v-else-if="withdrawBidBackStatus === WithdrawBidBackStatus.WithdrawBidBackAwaitingConfirmation"
                size="60px"
                color="primary"
                text-color="white"
              >
                <q-spinner color="white" />
              </q-avatar>
              <q-avatar
                v-else-if="withdrawBidBackStatus === WithdrawBidBackStatus.WithdrawBidBackError"
                size="60px"
                color="negative"
                text-color="white"
              >
                <q-icon name="mdi-alert-circle" />
              </q-avatar>
              <q-avatar
                v-else-if="withdrawBidBackStatus === WithdrawBidBackStatus.BidBackWithdrawn"
                size="60px"
                color="positive"
                text-color="white"
              >
                <q-icon name="mdi-check" />
              </q-avatar>
            </div>
            <div class="label">
              <div class="title">
                {{ $t('dashboard.auctionPage.claimBidBack') }}
              </div>
              <div>
                {{ secondStepLabel }}
              </div>
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

enum WithdrawBidBackStatus {
  CheckingContractApproved,
  ContractApprovedAwaitingInput,
  ContractApprovedAwaitingConfirmation,
  ContractApprovedError,
  WithdrawBidBackAwaitingInput,
  WithdrawBidBackAwaitingConfirmation,
  WithdrawBidBackError,
  BidBackWithdrawn,
}

@Options({
  components: {
    AlgoButton,
  },
})
export default class WithdrawBidBackStatusCard extends Vue {
  @Prop({ required: true }) withdrawBidBackStatus!: WithdrawBidBackStatus;

  WithdrawBidBackStatus = WithdrawBidBackStatus;

  get firstStepLabel() {
    switch (this.withdrawBidBackStatus) {
      case WithdrawBidBackStatus.CheckingContractApproved:
        return this.$t('dashboard.auctionPage.claimBidBackStatuses.checkingContractApproved');
      case WithdrawBidBackStatus.ContractApprovedAwaitingInput:
        return this.$t('dashboard.auctionPage.claimBidBackStatuses.approveContractInput');
      case WithdrawBidBackStatus.ContractApprovedAwaitingConfirmation:
        return this.$t('dashboard.auctionPage.claimBidBackStatuses.approveContractConfirmation');
      case WithdrawBidBackStatus.ContractApprovedError:
        return this.$t('dashboard.auctionPage.claimBidBackStatuses.approveContractError');
      default:
        return this.$t('dashboard.auctionPage.claimBidBackStatuses.approveContractAvailable');
    }
  }

  get secondStepLabel() {
    switch (this.withdrawBidBackStatus) {
      case WithdrawBidBackStatus.WithdrawBidBackAwaitingInput:
        return this.$t('dashboard.auctionPage.claimBidBackStatuses.createAuctionInput');
      case WithdrawBidBackStatus.WithdrawBidBackAwaitingConfirmation:
        return this.$t('dashboard.auctionPage.claimBidBackStatuses.claimBidBackConfirmation');
      case WithdrawBidBackStatus.WithdrawBidBackError:
        return this.$t('dashboard.auctionPage.claimBidBackStatuses.claimBidBackError');
      case WithdrawBidBackStatus.BidBackWithdrawn:
        return this.$t('dashboard.auctionPage.claimBidBackStatuses.claimedBidBackSuccessfully');
      default:
        return '';
    }
  }

  get okBtnDisabled() {
    return (
      this.withdrawBidBackStatus !== WithdrawBidBackStatus.BidBackWithdrawn &&
      this.withdrawBidBackStatus !== WithdrawBidBackStatus.ContractApprovedError &&
      this.withdrawBidBackStatus !== WithdrawBidBackStatus.WithdrawBidBackError
    );
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
