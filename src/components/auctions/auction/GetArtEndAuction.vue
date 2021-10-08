<template>
  <q-card>
    <q-card-section class="header">
      {{ $t('dashboard.auctionPage.youWin') }}
    </q-card-section>
    <q-card-section>
      <div class="steps row q-col-gutter-md">
        <div class="col-12 step">
          <div class="avatar">
            <q-avatar
              v-if="endAuctionStatus === EndAuctionStatus.EndAuctionAwaitingInput"
              size="60px"
              color="warning"
              text-color="white"
            >
              <q-icon name="mdi-alert" />
            </q-avatar>
            <q-avatar
              v-else-if="endAuctionStatus === EndAuctionStatus.EndAuctionAwaitingConfirmation"
              size="60px"
              color="primary"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="endAuctionStatus === EndAuctionStatus.EndAuctionError"
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
import { EndAuctionStatus } from 'src/eth/AlgoPainterAuctionSystemProxy';

@Options({
  components: {
    AlgoButton,
  },
})
export default class EndAuctionStatusCard extends Vue {
  @Prop({ required: true }) endAuctionStatus!: EndAuctionStatus;

  EndAuctionStatus = EndAuctionStatus;

  @Watch('this.endAuctionStatus')
  onPropertyChanged() {
    void this.firstStepLabel;
  }

  get firstStepLabel() {
    switch (this.endAuctionStatus) {
      case EndAuctionStatus.EndAuctionAwaitingInput:
        return this.$t('dashboard.auctionPage.endAuctionStatuses.awaitingInput');
      case EndAuctionStatus.EndAuctionError:
        return this.$t('dashboard.auctionPage.endAuctionStatuses.error');
      case EndAuctionStatus.EndAuctionAwaitingConfirmation:
        return this.$t('dashboard.auctionPage.endAuctionStatuses.awaitingConfirmation');
      default:
        return this.$t('dashboard.auctionPage.endAuctionStatuses.auctionEnded');
    }
  }

  get okBtnDisabled() {
    return this.endAuctionStatus !== EndAuctionStatus.AuctionEnded &&
      this.endAuctionStatus !== EndAuctionStatus.EndAuctionError;
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
