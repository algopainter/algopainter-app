<template>
  <q-card>
    <q-card-section class="header">
      {{ $t('dashboard.auctionPage.placingBid') }}
    </q-card-section>
    <q-card-section>
      <div class="steps row q-col-gutter-md">
        <div class="col-12 step">
          <div class="avatar">
            <q-avatar
              v-if="bidStatus === PlacingBidStatus.CheckingAllowance"
              size="60px"
              color="primary"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="bidStatus === PlacingBidStatus.IncreateAllowanceAwaitingInput"
              size="60px"
              color="warning"
              text-color="white"
            >
              <q-icon name="mdi-alert" />
            </q-avatar>
            <q-avatar
              v-else-if="bidStatus === PlacingBidStatus.IncreateAllowanceAwaitingConfirmation"
              size="60px"
              color="primary"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="bidStatus === PlacingBidStatus.IncreateAllowanceError"
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
              {{ $t('dashboard.auctionPage.statuses.allowance') }}
            </div>
            <div>
              {{ firstStepLabel }}
            </div>
          </div>
        </div>
        <div class="col-12 step">
          <div class="avatar">
            <q-avatar
              v-if="bidStatus < PlacingBidStatus.PlaceBidAwaitingInput"
              size="60px"
              color="grey"
              text-color="white"
            >
              <q-icon name="mdi-cancel" />
            </q-avatar>
            <q-avatar
              v-else-if="bidStatus === PlacingBidStatus.PlaceBidAwaitingInput"
              size="60px"
              color="warning"
              text-color="white"
            >
              <q-icon name="mdi-alert" />
            </q-avatar>
            <q-avatar
              v-else-if="bidStatus === PlacingBidStatus.PlaceBidAwaitingConfirmation"
              size="60px"
              color="primary"
              text-color="white"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="bidStatus === PlacingBidStatus.PlaceBidError"
              size="60px"
              color="negative"
              text-color="white"
            >
              <q-icon name="mdi-alert-circle" />
            </q-avatar>
            <q-avatar
              v-else-if="bidStatus === PlacingBidStatus.BidCreated"
              size="60px"
              color="positive"
              text-color="white"
            >
              <q-icon name="mdi-check" />
            </q-avatar>
          </div>
          <div class="label">
            <div class="title">
              {{ $t('dashboard.auctionPage.statuses.placeBid') }}
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

enum PlacingBidStatus {
  CheckingAllowance,
  IncreateAllowanceAwaitingInput,
  IncreateAllowanceAwaitingConfirmation,
  IncreateAllowanceError,
  PlaceBidAwaitingInput,
  PlaceBidAwaitingConfirmation,
  PlaceBidError,
  BidCreated,
}

@Options({
  components: {
    AlgoButton,
  },
})
export default class NewBidDialog extends Vue {
  @Prop({ required: true }) bidStatus!: PlacingBidStatus;

  PlacingBidStatus = PlacingBidStatus;

  get firstStepLabel() {
    switch (this.bidStatus) {
      case PlacingBidStatus.CheckingAllowance:
        return this.$t('dashboard.auctionPage.statuses.checkingAllowance');
      case PlacingBidStatus.IncreateAllowanceAwaitingInput:
        return this.$t('dashboard.auctionPage.statuses.allowanceInput');
      case PlacingBidStatus.IncreateAllowanceAwaitingConfirmation:
        return this.$t('dashboard.auctionPage.statuses.allowanceConfirmation');
      case PlacingBidStatus.IncreateAllowanceError:
        return this.$t('dashboard.auctionPage.statuses.allowanceError');
      default:
        return this.$t('dashboard.auctionPage.statuses.allowanceAvailable');
    }
  }

  get secondStepLabel() {
    switch (this.bidStatus) {
      case PlacingBidStatus.PlaceBidAwaitingInput:
        return this.$t('dashboard.auctionPage.statuses.placeBidInput');
      case PlacingBidStatus.PlaceBidAwaitingConfirmation:
        return this.$t('dashboard.auctionPage.statuses.placeBidConfirmation');
      case PlacingBidStatus.PlaceBidError:
        return this.$t('dashboard.auctionPage.statuses.placeBidError');
      case PlacingBidStatus.BidCreated:
        return this.$t('dashboard.auctionPage.statuses.placeBidAvailable');
      default:
        return '';
    }
  }

  get okBtnDisabled() {
    return this.bidStatus !== PlacingBidStatus.BidCreated &&
      this.bidStatus !== PlacingBidStatus.IncreateAllowanceError &&
      this.bidStatus !== PlacingBidStatus.PlaceBidError;
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
