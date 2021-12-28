<template>
  <q-card>
    <q-card-section class="header">
      {{ $t('dashboard.newPainting.dialog.title') }}
    </q-card-section>
    <q-card-section>
      <div class="steps row q-col-gutter-md">
        <div class="col-12 step">
          <div class="avatar">
            <q-avatar
              v-if="mintStatus === MintStatus.GeneratingPreviewFile"
              size="60px"
              color="primary"
            >
              <q-spinner color="white" />
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
              {{ $t('dashboard.newPainting.dialog.steps.previewFile') }}
            </div>
            <div>
              {{ firstStepLabel }}
            </div>
          </div>
        </div>
        <div class="col-12 step">
          <div class="avatar">
            <q-avatar
              v-if="mintStatus < MintStatus.GeneratingRawFile"
              size="60px"
              color="grey"
              text-color="white"
            >
              <q-icon name="mdi-cancel" />
            </q-avatar>
            <q-avatar
              v-else-if="mintStatus === MintStatus.GeneratingRawFile"
              size="60px"
              color="primary"
              text-color="white"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="mintStatus === MintStatus.GeneratingRawFileError"
              size="60px"
              color="negative"
              text-color="white"
            >
              <q-icon name="mdi-alert-circle" />
            </q-avatar>
            <q-avatar
              v-else-if="mintStatus > MintStatus.GeneratingRawFile"
              size="60px"
              color="positive"
              text-color="white"
            >
              <q-icon name="mdi-check" />
            </q-avatar>
          </div>
          <div
            class="label"
          >
            <div class="title">
              {{ $t('dashboard.newPainting.dialog.steps.rawFile') }}
            </div>
            <div>
              {{ secondStepLabel }}
            </div>
          </div>
        </div>
        <div 
          v-if="collectionName !== 'gwei'"
          class="col-12 step"
        >
          <div class="avatar">
            <q-avatar
              v-if="mintStatus < MintStatus.GeneratingDescriptorFile"
              size="60px"
              color="grey"
              text-color="white"
            >
              <q-icon name="mdi-cancel" />
            </q-avatar>
            <q-avatar
              v-else-if="mintStatus === MintStatus.GeneratingDescriptorFile"
              size="60px"
              color="primary"
              text-color="white"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="mintStatus > MintStatus.GeneratingDescriptorFile"
              size="60px"
              color="positive"
              text-color="white"
            >
              <q-icon name="mdi-check" />
            </q-avatar>
          </div>
          <div
            class="label"
          >
            <div class="title">
              {{ $t('dashboard.newPainting.dialog.steps.descriptorFile') }}
            </div>
            <div>
              {{ thirdStepLabel }}
            </div>
          </div>
        </div>
        <div class="col-12 step">
          <div class="avatar">
            <q-avatar
              v-if="mintStatus < MintStatus.CollectingUserConfirmations"
              size="60px"
              color="grey"
              text-color="white"
            >
              <q-icon name="mdi-cancel" />
            </q-avatar>
            <q-avatar
              v-else-if="mintStatus === MintStatus.CollectingUserConfirmations"
              size="60px"
              color="warning"
              text-color="white"
            >
              <q-icon name="mdi-alert" />
            </q-avatar>
            <q-avatar
              v-else-if="mintStatus > MintStatus.CollectingUserConfirmations"
              size="60px"
              color="positive"
              text-color="white"
            >
              <q-icon name="mdi-check" />
            </q-avatar>
          </div>
          <div
            class="label"
          >
            <div class="title">
              {{ $t('dashboard.newPainting.dialog.steps.confirmations') }}
            </div>
            <div>
              {{ fourthStepLabel }}
            </div>
          </div>
        </div>
        <div 
          v-if="mintStatus === MintStatus.CollectingUserConfirmations && isIpfsUrlSet"
          class="col-12 step column"
        >
          <a target="_blank" :href="[collectionName === 'gwei' ? ipfsUrlGwei : ipfsUrlExpressions]">{{ $t('dashboard.newPainting.mintConfirmations.rawFileLink') }}</a>
          <q-checkbox
            v-model="hasCheckedRawFile"
            :label="$t('dashboard.newPainting.mintConfirmations.rawFile')"
            class="full-width"
            :val="true"
          />
          <q-checkbox
            v-model="hasDownloadedRawFile"
            :label="$t('dashboard.newPainting.mintConfirmations.download')"
            class="full-width"
            :val="true"
          />
        </div>
        <div class="col-12 step">
          <div class="avatar">
            <q-avatar
              v-if="mintStatus < MintStatus.WaitingForWalletApproval"
              size="60px"
              color="grey"
              text-color="white"
            >
              <q-icon name="mdi-cancel" />
            </q-avatar>
            <q-avatar
              v-else-if="mintStatus === MintStatus.WaitingForWalletApproval"
              size="60px"
              color="primary"
              text-color="white"
            >
              <q-spinner color="white" />
            </q-avatar>
            <q-avatar
              v-else-if="mintStatus === MintStatus.MintError"
              size="60px"
              color="negative"
              text-color="white"
            >
              <q-icon name="mdi-alert-circle" />
            </q-avatar>
            <q-avatar
              v-else-if="mintStatus > MintStatus.WaitingForWalletApproval"
              size="60px"
              color="positive"
              text-color="white"
            >
              <q-icon name="mdi-check" />
            </q-avatar>
          </div>
          <div
            class="label"
          >
            <div class="title">
              {{ $t('dashboard.newPainting.dialog.steps.walletApproval') }}
            </div>
            <div>
              {{ fifthStepLabel }}
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="flex justify-end">
      <algo-button
        v-if="mintStatus === MintStatus.CollectingUserConfirmations"
        :label="$t('dashboard.newPainting.dialog.btnName.finish')"
        color="primary"
        :disable="!hasCheckedRawFile || !hasDownloadedRawFile"
        @click="setUserConfirmations()"
      />
      <algo-button
        v-else
        :label="[mintStatus === MintStatus.MintError ? $t('dashboard.newPainting.dialog.btnName.tryAgain') : $t('dashboard.newPainting.dialog.btnName.ok')]"
        color="primary"
        :disable="okBtnDisabled"
        @click="updateMintingStatus(), $emit('requestClose')"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { Vue, Options, Prop, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import AlgoButton from 'components/common/Button.vue';

enum MintStatus{
  GeneratingPreviewFile,
  GeneratingRawFile,
  GeneratingRawFileError,
  GeneratingDescriptorFile,
  CollectingUserConfirmations,
  WaitingForWalletApproval,
  MintError,
  ImageMinted,
}

@Options({
  components: {
    AlgoButton,
  },
  computed: {
    ...mapGetters(
      'user', [
        'networkInfo',
        'account',
        'isConnected',
      ]),
    ...mapGetters('mint', {
      ipfsUrlGwei: 'GET_GWEI_IPFS_URL',
      ipfsUrlExpressions: 'GET_EXPRESSIONS_IPFS_URL',
    }),
  }
})
export default class MintDialog extends Vue {
  @Prop({ required: true }) mintStatus!: MintStatus;
  @Prop({ required: true }) collectionName!: string;

  MintStatus = MintStatus;

  ipfsUrlGwei!: string;
  ipfsUrlExpressions!: string;
  isIpfsUrlSet: boolean = false;

  isAwareOfFee: boolean = false;
  hasCheckedRawFile: boolean = false;
  hasDownloadedRawFile: boolean = false;

  @Watch('ipfsUrlGwei')
  onIpfsUrlGweiChanged() {
    this.isIpfsUrlSet = true;
  }

  @Watch('ipfsUrlExpressions')
  onIpfsUrlExpressionsChanged() {
    this.isIpfsUrlSet = true;
  }

  async updateMintingStatus() {
    await this.$store
      .dispatch({
        type: 'mint/mintingStatus',
        isMinting: false,
        collectionName: this.collectionName,
      })
  }

  async setUserConfirmations() {
    await this.$store
      .dispatch({
        type: 'mint/userConfirmations',
        userConfirmations: true,
        collectionName: this.collectionName,
      })
  }

  get firstStepLabel() {
    switch (this.mintStatus) {
      case MintStatus.GeneratingPreviewFile:
        return this.$t('dashboard.newPainting.dialog.statuses.generatingPreviewFile');
      default:
        return this.$t('dashboard.newPainting.dialog.statuses.previewFileGenerated');
    }
  }

  get secondStepLabel() {
    switch (this.mintStatus) {
      case MintStatus.GeneratingRawFile:
        return this.$t('dashboard.newPainting.dialog.statuses.generatingRawFile');
      case MintStatus.GeneratingRawFileError:
        return this.$t('dashboard.newPainting.dialog.statuses.generatingRawFileError');
      case MintStatus.GeneratingDescriptorFile || MintStatus.CollectingUserConfirmations || MintStatus.WaitingForWalletApproval || MintStatus.MintError || MintStatus.ImageMinted:
        return this.$t('');
      default:
        return this.$t('dashboard.newPainting.dialog.statuses.rawFileGenerated');
    }
  }

  get thirdStepLabel() {
    switch (this.mintStatus) {
      case MintStatus.GeneratingDescriptorFile:
        return this.$t('dashboard.newPainting.dialog.statuses.generatingDescriptorFile');
      case MintStatus.CollectingUserConfirmations || MintStatus.WaitingForWalletApproval || MintStatus.MintError || MintStatus.ImageMinted:
        return this.$t('');
      default:
        return this.$t('dashboard.newPainting.dialog.statuses.descriptorFileGenerated');
    }
  }

  get fourthStepLabel() {
    switch (this.mintStatus) {
      case MintStatus.CollectingUserConfirmations:
        return this.$t('dashboard.newPainting.dialog.statuses.collectingUserConfirmations');
      case MintStatus.WaitingForWalletApproval:
        return this.$t('dashboard.newPainting.dialog.statuses.userConfirmationsCollected');
      case MintStatus.MintError:
        return this.$t('dashboard.newPainting.dialog.statuses.userConfirmationsCollected');
      case MintStatus.ImageMinted:
        return this.$t('dashboard.newPainting.dialog.statuses.userConfirmationsCollected');
      default:
        return this.$t('');
    }
  }

  get fifthStepLabel() {
    switch (this.mintStatus) {
      case MintStatus.WaitingForWalletApproval:
        return this.$t('dashboard.newPainting.dialog.statuses.waitingForWalletApproval');
      case MintStatus.ImageMinted:
        return this.$t('dashboard.newPainting.dialog.statuses.walletApproved');
      case MintStatus.MintError:
        return this.$t('dashboard.newPainting.dialog.statuses.mintError');
      default:
        return this.$t('');
    }
  }

  get okBtnDisabled() {
    return this.mintStatus !== MintStatus.ImageMinted &&
      this.mintStatus !== MintStatus.MintError &&
      this.mintStatus !== MintStatus.GeneratingRawFileError
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
