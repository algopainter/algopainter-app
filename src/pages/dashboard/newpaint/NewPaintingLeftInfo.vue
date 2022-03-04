<template>
  <form-generator
    :form-params="formParams"
    :default-values="defaultValues"
    :clear-form="clearForm"
    @generate-preview="GeneratePreview"
  />
  <q-dialog
    v-model="isMintDialogOpen"
    persistent
  >
    <mint-dialog
      :mint-status="mintStatus"
      :collection-name="collectionData.title"
      @request-close="onCloseStatusDialog"
    />
  </q-dialog>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { mapGetters } from 'vuex';
import FormGenerator from 'src/pages/create-collection/FormGenerator.vue';
import { IFormParams } from 'src/models/ICreatorCollection';
import ICollection from 'src/models/ICollection';
import { NetworkInfo } from 'src/store/user/types';
import { ICollectionInfo, IArtBasicInfo, MintStatus, IGenericPayload } from 'src/models/IMint';
import { Ref, Watch } from 'vue-property-decorator';
import { QDialog } from 'quasar';
import PinningServiceHelper from 'src/helpers/PinningServiceHelper';
import AlgoPainterArtistCollection from 'src/eth/AlgoPainterArtistCollectionProxy';
import { PropType } from 'vue';
import AlgoPainterTokenProxy from 'src/eth/AlgoPainterTokenProxy';
import { getArtistCollectionItemAddress } from 'src/eth/Config';
import MintDialog from 'pages/dashboard/newpaint/MintDialog.vue';

class Props {
  formParams = prop({
    type: Object as PropType<IFormParams[]>,
    required: true,
  });

  defaultValues = prop({
    type: Object as PropType<number | string | boolean | {label: string, value: string | number}[]>,
    required: true,
  });
}

@Options({
  components: {
    FormGenerator,
    MintDialog
  },
  computed: {
    ...mapGetters(
      'user', [
        'networkInfo',
        'account',
        'isConnected'
      ]),
    ...mapGetters(
      'mint', {
        collectionData: 'GET_COLLECTION_DATA',
        collectionInfo: 'GET_COLLECTION_INFO',
        artBasicInfo: 'GET_BASIC_INFO',
        userConfirmations: 'GET_USER_CONFIRMATIONS',
        isMinting: 'GET_IS_MINTING'
      }),
  }
})
export default class NewPaintingLeftInfo extends Vue.with(Props) {
  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  account!: string;
  algoPainterArtistCollection!: AlgoPainterArtistCollection;
  algoPainterTokenProxy!: AlgoPainterTokenProxy;
  isPinningPreviewUrl: boolean = false;

  collectionInfo!: ICollectionInfo;
  artBasicInfo!: IArtBasicInfo;
  userConfirmations!: boolean;
  isMinting!: boolean;

  mintStatus: MintStatus | null = null;
  isMintDialogOpen: boolean = false;
  @Ref() dialogRef!: QDialog;

  collectionData!: ICollection;
  params: IFormParams[] = [];
  parsedGeneratedParams!: string[];
  descriptorIPFSHash!: string;

  isErr: boolean = false;
  errMsg: string = '';
  isConfigured: boolean = false;
  clearForm: boolean = false;

  created() {
    if (this.isConnected) {
      this.algoPainterArtistCollection = new AlgoPainterArtistCollection(this.networkInfo);
      this.algoPainterTokenProxy = new AlgoPainterTokenProxy(this.networkInfo);
    }
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.algoPainterArtistCollection = new AlgoPainterArtistCollection(this.networkInfo);
      this.algoPainterTokenProxy = new AlgoPainterTokenProxy(this.networkInfo);
    }
  }

  mounted() {
    this.checkIfConfigured();
  }

  checkIfConfigured() {
    if (!this.isConfigured) {
      this.setFormInitialState().catch(console.error);
    }
  }

  async setFormInitialState() {
    this.isConfigured = true;
    this.isErr = false;
    this.isPinningPreviewUrl = false;
    this.errMsg = '';

    this.clearForm = true;

    await this.$store
      .dispatch({
        type: 'mint/artBasicInfo',
        artBasicInfo: undefined
      })

    await this.$store
      .dispatch({
        type: 'mint/IPFSUrl',
        IPFSUrl: undefined
      })
  }

  GeneratePreview(parsedGeneratedParams: string[]) {
    this.isErr = false;
    this.errMsg = '';
    this.clearForm = false;
    this.parsedGeneratedParams = parsedGeneratedParams;

    this.setPreviewUrl(this.previewUrl(parsedGeneratedParams)).catch(console.error);
  }

  previewUrl(parsedGeneratedParams: (number | string | boolean)[], noSize = false) {
    let previewUrl = `${this.collectionData.api.collectionInfo.api}?`;

    if (!this.collectionData.api.collectionInfo.isSpecialParamsChecked && !noSize) {
      if (this.collectionData.api.collectionInfo.isSizeInUrlChecked) {
        previewUrl += `size=${this.collectionData.api.collectionInfo.width}x${this.collectionData.api.collectionInfo.height}&`;
      } else {
        previewUrl += `width=${this.collectionData.api.collectionInfo.width}&height=${this.collectionData.api.collectionInfo.height}&`;
      }
    }

    this.collectionData.api.fixedParams.forEach((param) => {
      previewUrl += `${param.name}=${param.value.toString()}&`
    })

    this.collectionData.api.parameters.forEach((param, i) => {
      previewUrl += `${param.name}=${parsedGeneratedParams[i].toString()}`

      if ((i + 1) !== this.collectionData.api.parameters.length) {
        previewUrl += '&'
      }
    })
    const searchRegExp = /\s/g;

    return previewUrl.replace(searchRegExp, '%20');
  }

  async setPreviewUrl(previewUrl: string) {
    await this.$store
      .dispatch({
        type: 'mint/previewUrl',
        previewUrl: previewUrl
      })
  }

  @Watch('isMinting')
  onIsMintingChanged() {
    if (this.isMinting) {
      this.mint().catch(console.error);
    }
  }

  get artistCollectionItemContractAddress() {
    return getArtistCollectionItemAddress(this.networkInfo.id);
  }

  async mint() {
    try {
      this.restoreDefault().catch(console.error);

      this.isPinningPreviewUrl = true;

      // Substituir expressions - preview dentro do pinning service helper
      const previewPiningResult = await PinningServiceHelper.pinFile('Expressions - Preview', 1, this.previewUrl(this.parsedGeneratedParams, false));
      const previewIPFSHash = previewPiningResult.ipfsHash;

      this.mintStatus = MintStatus.GeneratingPreviewFile;

      if (!previewIPFSHash) {
        this.restoreDefault().catch(console.error);
        this.isErr = true;
        this.errMsg = this.$t('dashboard.newPainting.mintErrors.generating', { type: 'preview' });
        return;
      }

      const allowance = await this.algoPainterTokenProxy.allowance(this.account, this.artistCollectionItemContractAddress, Number(this.collectionInfo.batchPriceBlockchain));

      if (!allowance) {
        await this.algoPainterTokenProxy.approve(this.artistCollectionItemContractAddress, this.collectionInfo.batchPriceBlockchain.toString(), this.account)
      }

      this.isMintDialogOpen = true;
      this.mintStatus = MintStatus.GeneratingRawFile;

      const rawPiningResult = await PinningServiceHelper.pinFile('Expressions - Preview', 1, this.previewUrl(this.parsedGeneratedParams, true));
      const rawIPFSHash = rawPiningResult.ipfsHash;

      if (!rawIPFSHash) {
        this.restoreDefault().catch(console.error);
        this.mintStatus = MintStatus.GeneratingRawFileError;
        this.isErr = true;
        this.errMsg = this.$t('dashboard.newPainting.mintErrors.generating', { type: 'raw' });
        return;
      }

      this.mintStatus = MintStatus.GeneratingDescriptorFile;

      const payload: IGenericPayload = {
        name: this.artBasicInfo.name,
        collectionId: this.collectionData.blockchainId.toString(),
        params: this.parsedGeneratedParams,
        tokenURI: rawIPFSHash,
        expectedValue: this.collectionInfo.batchPriceBlockchain.toString()
      };

      const descriptorPinningResult = await PinningServiceHelper.pinJSON(payload);
      this.descriptorIPFSHash = (descriptorPinningResult.ipfsHash) ? descriptorPinningResult.ipfsHash : '';

      if (!this.descriptorIPFSHash) {
        this.restoreDefault().catch(console.error);
        this.isErr = true;
        this.errMsg = this.$t('dashboard.newPainting.mintErrors.generating', { type: 'descriptor' });
        return;
      }

      this.setIPFSUrl(`https://ipfs.io/ipfs/${rawIPFSHash}`).catch(console.error);

      this.mintStatus = MintStatus.CollectingUserConfirmations;

      // await this.algoPainterArtistCollection.mintCall(
      //   this.artBasicInfo.name,
      //   this.collectionData.blockchainId.toString(),
      //   this.parsedGeneratedParams,
      //   previewIPFSHash || '',
      //   this.collectionInfo.batchPriceBlockchain.toString()
      // );
    } catch (e: any) {
      this.restoreDefault().catch(console.error);

      this.isErr = true;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (e.message && e.message.indexOf('ALREADY_REGISTERED') >= 0) {
        this.errMsg = this.$t('dashboard.newPainting.mintErrors.alreadyMinted');
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (e.message && e.message.indexOf('PRICE_HAS_CHANGED') >= 0) {
        this.errMsg = this.$t('dashboard.newPainting.mintErrors.priceChanged');
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (e.message && e.message.indexOf('INVALID_AMOUNT') >= 0) {
        this.errMsg = this.$t('dashboard.newPainting.mintErrors.invalidAmount');
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (e.message && e.message.indexOf('NAME_NOT_UNIQUE') >= 0) {
        this.errMsg = this.$t('dashboard.newPainting.mintErrors.nameNotUnique');
        return;
      }

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      this.errMsg = this.$t('dashboard.newPainting.mintErrors.unexpected', { errorMsg: e.message });
      // return;
    }
  }

  @Watch('errMsg')
  async onErrMsgChanged() {
    await this.$store
      .dispatch({
        type: 'mint/errorMessage',
        errorMessage: this.errMsg
      })
  }

  @Watch('isPinningPreviewUrl')
  async onIsPinningPreviewUrlChanged() {
    await this.$store
      .dispatch({
        type: 'mint/isPinningPreviewUrl',
        isPinningPreviewUrl: this.isPinningPreviewUrl
      })
  }

  async setIPFSUrl(IPFSUrl: string) {
    await this.$store
      .dispatch({
        type: 'mint/IPFSUrl',
        IPFSUrl: IPFSUrl
      })
  }

  @Watch('userConfirmations')
  onUserConfirmationsChanged() {
    if (this.userConfirmations) {
      this.finishMinting();
    }
  }

  finishMinting() {
    try {
      this.isConfigured = false;
      this.mintStatus = MintStatus.MintAwaitingInput;

      const result = this.algoPainterArtistCollection.mint(
        this.artBasicInfo.name,
        this.collectionData.blockchainId.toString(),
        this.parsedGeneratedParams,
        this.descriptorIPFSHash,
        this.collectionInfo.batchPriceBlockchain.toString(),
        this.account
      );

      result.on('error', (error: any) => {
        this.restoreDefault().catch(console.error);
        this.mintStatus = MintStatus.MintError;
        this.isErr = true;
        this.errMsg = this.$t('dashboard.newPainting.mintErrors.unexpected', { errorMsg: error });
      }).catch(console.error);

      result.on('transactionHash', () => {
        this.mintStatus = MintStatus.MintAwaitingConfirmation;
      }).catch(console.error);

      result.on('confirmation', () => {
        if (!this.isConfigured) {
          this.mintStatus = MintStatus.ItemMinted;
          this.updateTopInfo().catch(console.error);
          this.setFormInitialState().catch(console.error);
        };
      }).catch(console.error);
    } catch (e: any) {
      this.mintStatus = MintStatus.MintError;
      this.restoreDefault().catch(console.error);
      this.isErr = true;

      if (e.code === 4001) {
        this.isErr = false;
      } else {
        this.errMsg = this.$t('dashboard.newPainting.mintErrors.unexpected', { errorMsg: e.message });
      }
    }
  }

  async updateTopInfo() {
    await this.$store
      .dispatch({
        type: 'mint/updateTopInfo'
      })
  }

  onCloseStatusDialog() {
    this.isMintDialogOpen = false;

    if (this.mintStatus === MintStatus.ItemMinted) {
      this.dialogRef.hide();
    }
  }

  async restoreDefault() {
    this.mintStatus = MintStatus.GeneratingPreviewFile;
    this.isErr = false;
    this.descriptorIPFSHash = '';
    this.isPinningPreviewUrl = false;

    await this.$store
      .dispatch({
        type: 'mint/mintingStatus',
        isMinting: false
      })
    await this.$store
      .dispatch({
        type: 'mint/userConfirmations',
        userConfirmations: false
      })
  }
}
</script>