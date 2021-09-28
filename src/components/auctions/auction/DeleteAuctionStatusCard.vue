<template>
  <q-card>
    <q-card-section class="header">
      {{ $t('dashboard.sellYourArt.deletingAuction') }}
    </q-card-section>
    <q-card-section>
      <div class="steps row q-col-gutter-md">
        <div class="col-12 step">
          <div class="avatar">
            <q-avatar
              v-if="createAuctionStatus === CreatingAuctionStatus.CheckingContractApproved"
              size="60px"
              color="primary"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="createAuctionStatus === CreatingAuctionStatus.ContractApprovedAwaitingInput"
              size="60px"
              color="warning"
              text-color="white"
            >
              <q-icon name="mdi-alert" />
            </q-avatar>
            <q-avatar
              v-else-if="createAuctionStatus === CreatingAuctionStatus.ContractApprovedAwaitingConfirmation"
              size="60px"
              color="primary"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="createAuctionStatus === CreatingAuctionStatus.ContractApprovedError"
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
              v-if="createAuctionStatus < CreatingAuctionStatus.CreateAuctionAwaitingInput"
              size="60px"
              color="grey"
              text-color="white"
            >
              <q-icon name="mdi-cancel" />
            </q-avatar>
            <q-avatar
              v-else-if="createAuctionStatus === CreatingAuctionStatus.CreateAuctionAwaitingInput"
              size="60px"
              color="warning"
              text-color="white"
            >
              <q-icon name="mdi-alert" />
            </q-avatar>
            <q-avatar
              v-else-if="createAuctionStatus === CreatingAuctionStatus.CreateAuctionAwaitingConfirmation"
              size="60px"
              color="primary"
              text-color="white"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="createAuctionStatus === CreatingAuctionStatus.CreateAuctionError"
              size="60px"
              color="negative"
              text-color="white"
            >
              <q-icon name="mdi-alert-circle" />
            </q-avatar>
            <q-avatar
              v-else-if="createAuctionStatus === CreatingAuctionStatus.AuctionCreated"
              size="60px"
              color="positive"
              text-color="white"
            >
              <q-icon name="mdi-check" />
            </q-avatar>
          </div>
          <div class="label">
            <div class="title">
              {{ $t('dashboard.sellYourArt.deleteAuction') }}
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

enum CreatingAuctionStatus {
  CheckingContractApproved,
  ContractApprovedAwaitingInput,
  ContractApprovedAwaitingConfirmation,
  ContractApprovedError,
  CreateAuctionAwaitingInput,
  CreateAuctionAwaitingConfirmation,
  CreateAuctionError,
  AuctionCreated,
}

@Options({
  components: {
    AlgoButton,
  },
})
export default class CreateAuctionStatusCard extends Vue {
  @Prop({ required: true }) createAuctionStatus!: CreatingAuctionStatus;

  CreatingAuctionStatus = CreatingAuctionStatus;

  get firstStepLabel() {
    switch (this.createAuctionStatus) {
      case CreatingAuctionStatus.CheckingContractApproved:
        return this.$t('dashboard.sellYourArt.statuses.checkingContractApproved');
      case CreatingAuctionStatus.ContractApprovedAwaitingInput:
        return this.$t('dashboard.sellYourArt.statuses.approveContractInput');
      case CreatingAuctionStatus.ContractApprovedAwaitingConfirmation:
        return this.$t('dashboard.sellYourArt.statuses.approveContractConfirmation');
      case CreatingAuctionStatus.ContractApprovedError:
        return this.$t('dashboard.sellYourArt.statuses.approveContractError');
      default:
        return this.$t('dashboard.sellYourArt.statuses.approveContractAvailable');
    }
  }

  get secondStepLabel() {
    switch (this.createAuctionStatus) {
      case CreatingAuctionStatus.CreateAuctionAwaitingInput:
        return this.$t('dashboard.sellYourArt.statuses.createAuctionInput');
      case CreatingAuctionStatus.CreateAuctionAwaitingConfirmation:
        return this.$t('dashboard.sellYourArt.statuses.createAuctionConfirmation');
      case CreatingAuctionStatus.CreateAuctionError:
        return this.$t('dashboard.sellYourArt.statuses.createAuctionError');
      case CreatingAuctionStatus.AuctionCreated:
        return this.$t('dashboard.sellYourArt.statuses.createAuctionCreated');
      default:
        return '';
    }
  }

  get okBtnDisabled() {
    return this.createAuctionStatus !== CreatingAuctionStatus.AuctionCreated &&
      this.createAuctionStatus !== CreatingAuctionStatus.ContractApprovedError &&
      this.createAuctionStatus !== CreatingAuctionStatus.CreateAuctionError;
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
