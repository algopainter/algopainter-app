<template>
  <q-card>
    <q-card-section class="header">
      {{ $t('dashboard.auctionPage.claimBid') }}
    </q-card-section>
    <q-card-section>
      <div class="steps row q-col-gutter-md">
        <div class="col-12 step">
          <div class="avatar">
            <q-avatar
              v-if="removeBidStatus === RemoveBidStatus.RemoveBidAwaitingInput"
              size="60px"
              color="warning"
              text-color="white"
            >
              <q-icon name="mdi-alert" />
            </q-avatar>
            <q-avatar
              v-else-if="removeBidStatus === RemoveBidStatus.RemoveBidAwaitingConfirmation"
              size="60px"
              color="primary"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="removeBidStatus === RemoveBidStatus.RemoveBidError"
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
            <div>
              {{ firstStepLabel }}
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
import { Vue, Options, Prop, Watch } from 'vue-property-decorator';

import AlgoButton from 'components/common/Button.vue';
import { RemoveBidStatus } from 'src/eth/AlgoPainterAuctionSystemProxy';

@Options({
  components: {
    AlgoButton,
  },
})
export default class ClaimBid extends Vue {
  @Prop({ required: true }) removeBidStatus!: RemoveBidStatus;

  RemoveBidStatus = RemoveBidStatus;

  @Watch('this.endAuctionStatus')
  onPropertyChanged() {
    void this.firstStepLabel;
  }

  get firstStepLabel() {
    switch (this.removeBidStatus) {
      case RemoveBidStatus.RemoveBidAwaitingInput:
        return this.$t('dashboard.auctionPage.bidClaimStatus.awaitingInput');
      case RemoveBidStatus.RemoveBidError:
        return this.$t('dashboard.auctionPage.bidClaimStatus.error');
      case RemoveBidStatus.RemoveBidAwaitingConfirmation:
        return this.$t('dashboard.auctionPage.bidClaimStatus.awaitingConfirmation');
      default:
        return this.$t('dashboard.auctionPage.bidClaimStatus.bidClaim');
    }
  }

  get okBtnDisabled() {
    return this.removeBidStatus !== RemoveBidStatus.RemoveBid &&
      this.removeBidStatus !== RemoveBidStatus.RemoveBidError;
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
