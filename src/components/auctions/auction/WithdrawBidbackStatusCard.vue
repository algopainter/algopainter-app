<template>
  <q-card>
    <q-card-section class="header">
      {{ $t('dashboard.auctionPage.claimBidbackStatuses.claimBidback') }}
    </q-card-section>
    <q-card-section>
      <div class="steps row q-col-gutter-md">
        <div class="col-12 step">
          <div class="col-12 step">
            <div class="avatar">
              <q-avatar
                v-if="withdrawBidbackStatus < WithdrawBidbackStatus.WithdrawBidbackAwaitingInput"
                size="60px"
                color="grey"
                text-color="white"
              >
                <q-icon name="mdi-cancel" />
              </q-avatar>
              <q-avatar
                v-else-if="withdrawBidbackStatus === WithdrawBidbackStatus.WithdrawBidbackAwaitingInput"
                size="60px"
                color="warning"
                text-color="white"
              >
                <q-icon name="mdi-alert" />
              </q-avatar>
              <q-avatar
                v-else-if="withdrawBidbackStatus === WithdrawBidbackStatus.WithdrawBidbackAwaitingConfirmation"
                size="60px"
                color="primary"
                text-color="white"
              >
                <q-spinner color="white" />
              </q-avatar>
              <q-avatar
                v-else-if="withdrawBidbackStatus === WithdrawBidbackStatus.WithdrawBidbackError"
                size="60px"
                color="negative"
                text-color="white"
              >
                <q-icon name="mdi-alert-circle" />
              </q-avatar>
              <q-avatar
                v-else-if="withdrawBidbackStatus === WithdrawBidbackStatus.BidbackWithdrawn"
                size="60px"
                color="positive"
                text-color="white"
              >
                <q-icon name="mdi-check" />
              </q-avatar>
            </div>
            <div class="label">
              <div class="title">
                {{ $t('dashboard.auctionPage.claimBidback') }}
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

enum WithdrawBidbackStatus {
  CheckingContractApproved,
  ContractApprovedAwaitingInput,
  ContractApprovedAwaitingConfirmation,
  ContractApprovedError,
  WithdrawBidbackAwaitingInput,
  WithdrawBidbackAwaitingConfirmation,
  WithdrawBidbackError,
  BidbackWithdrawn,
}

@Options({
  components: {
    AlgoButton,
  },
})
export default class WithdrawBidbackStatusCard extends Vue {
  @Prop({ required: true }) withdrawBidbackStatus!: WithdrawBidbackStatus;

  WithdrawBidbackStatus = WithdrawBidbackStatus;

  get firstStepLabel() {
    switch (this.withdrawBidbackStatus) {
      case WithdrawBidbackStatus.CheckingContractApproved:
        return this.$t('dashboard.auctionPage.claimBidbackStatuses.checkingContractApproved');
      case WithdrawBidbackStatus.ContractApprovedAwaitingInput:
        return this.$t('dashboard.auctionPage.claimBidbackStatuses.approveContractInput');
      case WithdrawBidbackStatus.ContractApprovedAwaitingConfirmation:
        return this.$t('dashboard.auctionPage.claimBidbackStatuses.approveContractConfirmation');
      case WithdrawBidbackStatus.ContractApprovedError:
        return this.$t('dashboard.auctionPage.claimBidbackStatuses.approveContractError');
      default:
        return this.$t('dashboard.auctionPage.claimBidbackStatuses.approveContractAvailable');
    }
  }

  get secondStepLabel() {
    switch (this.withdrawBidbackStatus) {
      case WithdrawBidbackStatus.WithdrawBidbackAwaitingInput:
        return this.$t('dashboard.auctionPage.claimBidbackStatuses.createAuctionInput');
      case WithdrawBidbackStatus.WithdrawBidbackAwaitingConfirmation:
        return this.$t('dashboard.auctionPage.claimBidbackStatuses.claimBidbackConfirmation');
      case WithdrawBidbackStatus.WithdrawBidbackError:
        return this.$t('dashboard.auctionPage.claimBidbackStatuses.claimBidbackError');
      case WithdrawBidbackStatus.BidbackWithdrawn:
        return this.$t('dashboard.auctionPage.claimBidbackStatuses.claimedBidbackSuccessfully');
      default:
        return '';
    }
  }

  get okBtnDisabled() {
    return this.withdrawBidbackStatus !== WithdrawBidbackStatus.BidbackWithdrawn &&
      this.withdrawBidbackStatus !== WithdrawBidbackStatus.ContractApprovedError &&
      this.withdrawBidbackStatus !== WithdrawBidbackStatus.WithdrawBidbackError;
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
