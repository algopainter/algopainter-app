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
                {{ $t('createCollectible.collectionModal.approveSignature') }}
              </div>
              <div>
                {{ firstStepLabel }}
              </div>
            </div>
          </div>
          <div class="col-12 step">
            <div class="avatar">
              <q-avatar
                v-if="statusblock === 'aproved'"
                size="60px"
                color="primary"
                text-color="white"
              >
                <q-spinner color="white" />
              </q-avatar>
              <q-avatar
                v-else-if="statusblock === 'error'"
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
                {{ $t('createCollectible.createCollection.title') }}
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
          :label="$t('dashboard.auctionPage.okButton')"
          color="primary"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';

class Props {
statusData = prop({
  type: String,
  required: true,
})

statusblock = prop({
  type: String,
  required: true,
})
}

@Options({
  components: {
    AlgoButton,
  },
})
export default class CollectionModal extends Vue.with(Props) {
  get firstStepLabel() {
    switch (this.statusData) {
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

  get scondStepLabel() {
    switch (this.statusblock) {
      case 'aproved':
        return this.$t(
          'createCollectible.createCollection.approveContractInput',
        );
      case 'confirme':
        return this.$t('createCollectible.createCollection.approveContractConfirmation');
      case 'error':
        return this.$t(
          'createCollectible.createCollection.approveContractError',
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