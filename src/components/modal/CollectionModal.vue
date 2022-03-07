<template>
  <q-dialog
    ref="dialog"
    persistent
  >
    <q-card class="row full-width ">
      <q-card-section class="header">
        {{ $t('createCollectible.collectionModal.title') }}
      </q-card-section>
      <q-card-section>
        <div class="steps row q-col-gutter-md">
          <div class="col-12 step">
            <div class="avatar">
              <q-avatar
                v-if="artistCollectionStatus === ArtistCollectionStatus.ArtistCollectionAwaitingInput"
                size="60px"
                color="warning"
                text-color="white"
              >
                <q-icon name="mdi-alert" />
              </q-avatar>
              <q-avatar
                v-else-if="artistCollectionStatus === ArtistCollectionStatus.ArtistCollectionAwaitingConfirmation"
                size="60px"
                color="primary"
                text-color="white"
              >
                <q-spinner color="white" />
              </q-avatar>
              <q-avatar
                v-else-if="artistCollectionStatus === ArtistCollectionStatus.ArtistCollectionError"
                size="60px"
                color="negative"
                text-color="white"
              >
                <q-icon name="mdi-alert-circle" />
              </q-avatar>
              <q-avatar
                v-else-if="artistCollectionStatus === ArtistCollectionStatus.ArtistCollectionCreated"
                size="60px"
                color="positive"
                text-color="white"
              >
                <q-icon name="mdi-check" />
              </q-avatar>
            </div>
            <div class="label">
              <div class="title">
                {{ $t('createCollectible.createCollection.title') }}
              </div>
              <div>
                {{ firstStepLabel }}
              </div>
            </div>
          </div>
          <div class="col-12 step">
            <div class="avatar">
              <q-avatar
                v-if="statusData === 'Awaiting'"
                size="60px"
                color="warning"
                text-color="white"
              >
                <q-icon name="mdi-alert" />
              </q-avatar>
              <q-avatar
                v-else-if="statusData === 'aproved'"
                size="60px"
                color="primary"
                text-color="white"
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
                {{ $t('createCollectible.collectionModal.approveSignature') }}
              </div>
              <div>
                {{ scondStepLabel }}
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="btn-container">
        <algo-button
          v-close-popup
          class="btn"
          :disabled="okBtnDisabled"
          :label="$t('dashboard.auctionPage.okButton')"
          color="primary"
          @click="showMsgAndLeave"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import { Prop } from 'vue-property-decorator';

export enum ArtistCollectionStatus {
  CheckingAllowance,
  IncreateAllowanceAwaitingInput,
  IncreateAllowanceAwaitingConfirmation,
  IncreateAllowanceError,
  IncreateAllowanceCompleted,
  ArtistCollectionAwaitingInput,
  ArtistCollectionAwaitingConfirmation,
  ArtistCollectionError,
  ArtistCollectionCreated,
}
class Props {
statusData = prop({
  type: String,
  required: true,
})

statusblock = prop({
  type: String,
  required: true,
})

okBtnDisabled = prop({
  type: Boolean,
  required: true,
})
}

@Options({
  components: {
    AlgoButton,
  },
})
export default class CollectionModal extends Vue.with(Props) {
  @Prop({ required: true }) artistCollectionStatus!: ArtistCollectionStatus
  ArtistCollectionStatus = ArtistCollectionStatus;

  showMsgAndLeave() {
    this.$q.notify({
      type: 'positive',
      message: 'The collection was successfully registered. Now you must wait until our team approves the registration.',
    });
    setTimeout(() => {
      void this.$router.push('/');
    }, 3000);
  }

  get firstStepLabel() {
    switch (this.artistCollectionStatus) {
      case ArtistCollectionStatus.ArtistCollectionAwaitingInput:
        return this.$t(
          'createCollectible.createCollection.approveContractInput',
        );
      case ArtistCollectionStatus.ArtistCollectionAwaitingConfirmation:
        return this.$t('createCollectible.createCollection.approveContractConfirmation');
      case ArtistCollectionStatus.ArtistCollectionError:
        return this.$t(
          'createCollectible.createCollection.approveContractError',
        );
      default:
        return this.$t(
          'dashboard.sellYourArt.statuses.approveContractAvailable',
        );
    }
  }

  get scondStepLabel() {
    switch (this.statusData) {
      case 'Awaiting':
        return this.$t(
          'createCollectible.collectionModal.Awaiting',
        );
      case 'aproved':
        return this.$t(
          'createCollectible.collectionModal.approveSignature',
        );
      case 'confirme':
        return this.$t('createCollectible.collectionModal.confirmeSignature');
      case 'error':
        return this.$t(
          'createCollectible.collectionModal.errorSignature',
        );
      default:
        return this.$t(
          'dashboard.sellYourArt.statuses.approveContractAvailable',
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
.btn-container{
  display: flex;
  justify-content:flex-end;
  width: 560px;
}
.btn{
  margin-left: 100%
}
</style>