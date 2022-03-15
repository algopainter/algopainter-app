<template>
  <form-generator
    :form-params="formParams"
    :default-values="defaultValues"
    :clear-form="clearForm"
    :collection-title="collectionTitle"
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
import { ICollectionInfo, IArtBasicInfo, MintStatus, IArtistCollectionTokenURI } from 'src/models/IMint';
import { Ref, Watch } from 'vue-property-decorator';
import { QDialog } from 'quasar';
// import PinningServiceHelper from 'src/helpers/PinningServiceHelper';
import AlgoPainterArtistCollection from 'src/eth/AlgoPainterArtistCollectionProxy';
import { PropType } from 'vue';
import AlgoPainterTokenProxy from 'src/eth/AlgoPainterTokenProxy';
import { getArtistCollectionItemAddress } from 'src/eth/Config';
import MintDialog from 'pages/dashboard/newpaint/MintDialog.vue';
import { api } from 'src/boot/axios';
import { randomHex } from 'web3-utils';
import { auctionCoins } from 'src/helpers/auctionCoins';

class Props {
  formParams = prop({
    type: Object as PropType<IFormParams[]>,
    required: true
  });

  defaultValues = prop({
    type: Object as PropType<number | string | boolean | {label: string, value: string | number}[]>,
    required: true
  });

  collectionTitle = prop({
    type: String,
    required: true
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
  previewHash: string = '';
  rawHash: string = '';
  descriptorIPFSHash: string = '';
  srcImage: string = '';

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

    this.setPreviewUrl(this.previewUrl(parsedGeneratedParams, true)).catch(console.error);
  }

  previewUrl(parsedGeneratedParams: (number | string | boolean)[], setSize = false) {
    let previewUrl = `${this.collectionData.api.collectionInfo.api}?`;

    if (!this.collectionData.api.collectionInfo.isSpecialParamsChecked && setSize) {
      if (this.collectionData.api.collectionInfo.isSizeInUrlChecked) {
        previewUrl += 'size=400x400&';
      } else {
        previewUrl += 'width=400&height=400&';
      }
    } else if ((!this.collectionData.api.collectionInfo.isSpecialParamsChecked && !setSize)) {
      if (this.collectionData.api.collectionInfo.isSizeInUrlChecked) {
        previewUrl += 'size=2000x2000&';
      } else {
        previewUrl += 'width=2000&height=2000&';
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

  async toDataUrl(url: string) : Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.timeout = 999999;
        xhr.onload = () => {
          const reader = new FileReader();
          reader.onloadend = function() {
            if (reader.result) {
              resolve(reader.result.toString());
            } else {
              resolve('');
            }
          }
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
      } catch (e) {
        reject(e);
      }
    });
  }

  async mint() {
    this.restoreDefault().catch(console.error);
    this.mintStatus = MintStatus.GeneratingPreviewFile;
    this.isMintDialogOpen = true;
    this.isPinningPreviewUrl = true;

    const previewPayload = {
      name: this.artBasicInfo.name,
      description: this.artBasicInfo.description,
      mintedBy: this.account,
      image: await this.toDataUrl(this.previewUrl(this.parsedGeneratedParams)),
      fileName: randomHex(32) + '.png'
    }

    try {
      const previewPiningResult = await api.post('images/pintoipfs/FILE?resize=1', previewPayload);
      this.previewHash = previewPiningResult.data.ipfsHash;
    } catch (e) {
      this.mintStatus = MintStatus.GeneratingPreviewFileError;
      this.restoreDefault().catch(console.error);
      this.isErr = true;
      this.errMsg = this.$t('dashboard.newPainting.mintErrors.generating', { type: 'preview' });
      return;
    }

    this.mintStatus = MintStatus.GeneratingRawFile;

    const rawPayload = {
      name: this.artBasicInfo.name,
      description: this.artBasicInfo.description,
      mintedBy: this.account,
      image: await this.toDataUrl(this.previewUrl(this.parsedGeneratedParams)),
      fileName: randomHex(32) + '.png'
    }

    try {
      const rawPiningResult = await api.post('images/pintoipfs/FILE', rawPayload);
      this.rawHash = rawPiningResult.data.ipfsHash;
    } catch (e) {
      this.mintStatus = MintStatus.GeneratingRawFileError;
      this.isErr = true;
      this.restoreDefault().catch(console.error);
      this.errMsg = this.$t('dashboard.newPainting.mintErrors.generating', { type: 'raw' });
      return;
    }

    this.mintStatus = MintStatus.GeneratingDescriptorFile;

    console.log('this.collectionInfo', this.collectionInfo);
    console.log('auctionCoins', auctionCoins);

    const token = auctionCoins.find(coin => {
      return (coin.label === this.collectionInfo.collectionToken) ? coin.tokenAddress : '';
    });

    const payload: IArtistCollectionTokenURI = {
      collectionId: this.collectionData.blockchainId.toString(),
      name: this.artBasicInfo.name,
      description: this.artBasicInfo.description,
      creatorRoyalty: this.collectionData.metrics.creatorPercentage,
      params: this.parsedGeneratedParams,
      amount: this.collectionInfo.batchPriceCurrency,
      amountToken: token?.tokenAddress ? token?.tokenAddress.toString() : '',
      amountTokenSymbol: this.collectionInfo.collectionToken,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      image: `https://ipfs.io/ipfs/${this.rawHash}`,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      previewImage: `https://ipfs.io/ipfs/${this.previewHash}`,
      mintedBy: this.account
    };

    console.log('payload', payload);

    try {
      const descriptorPinningResult = await api.post('images/pintoipfs/JSON', payload);
      this.descriptorIPFSHash = descriptorPinningResult.data.ipfsHash;

      this.setIPFSUrl(`https://ipfs.io/ipfs/${this.rawHash}`).catch(console.error);
    } catch (e) {
      this.mintStatus = MintStatus.GeneratingDescriptorFileError;
      this.restoreDefault().catch(console.error);
      this.isErr = true;
      this.errMsg = this.$t('dashboard.newPainting.mintErrors.generating', { type: 'descriptor' });
      return;
    }

    try {
      await this.algoPainterArtistCollection.mintCall(
        this.artBasicInfo.name,
        this.collectionData.blockchainId.toString(),
        this.parsedGeneratedParams,
        this.descriptorIPFSHash,
        this.collectionInfo.batchPriceBlockchain.toString()
      );

      this.mintStatus = MintStatus.CollectingUserConfirmations;
    } catch (e: any) {
      if (e.message) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (e.message.indexOf('COLLECTION_RETIRED') >= 0) {
          this.errMsg = this.$t('dashboard.newPainting.mintErrors.collectionRetired');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        } else if (e.message.indexOf('NAME_NOT_UNIQUE') >= 0) {
          this.errMsg = this.$t('dashboard.newPainting.mintErrors.nameNotUnique');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        } else if (e.message.indexOf('CANNOT_MINT') >= 0) {
          this.errMsg = this.$t('dashboard.newPainting.mintErrors.cannotMint');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        } else if (e.message.indexOf('NOT_UNIQUE') >= 0) {
          this.errMsg = this.$t('dashboard.newPainting.mintErrors.alreadyMinted');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        } else if (e.message.indexOf('PRICE_HAS_CHANGED') >= 0) {
          this.errMsg = this.$t('dashboard.newPainting.mintErrors.priceChanged');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        } else if (e.message.indexOf('MINIMUM_ALLOWANCE_REQUIRED') >= 0) {
          this.mintStatus = MintStatus.CollectingUserConfirmations;
        } else {
          this.errMsg = this.$t('dashboard.newPainting.mintErrors.unexpected', { errorMsg: e.message });
        }

        if (this.mintStatus !== MintStatus.CollectingUserConfirmations) {
          this.restoreDefault().catch(console.error);
          this.isMintDialogOpen = false;
          this.isErr = true;
        }
      }
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
      this.finishMinting().catch(console.error);
    }
  }

  async finishMinting() {
    try {
      this.isConfigured = false;

      this.mintStatus = MintStatus.MintAwaitingInput;
      await this.algoPainterTokenProxy.approve(this.artistCollectionItemContractAddress, this.collectionInfo.batchPriceBlockchain.toString(), this.account);

      await this.algoPainterArtistCollection.mint(
        this.artBasicInfo.name,
        this.collectionData.blockchainId.toString(),
        this.parsedGeneratedParams,
        this.descriptorIPFSHash,
        this.collectionInfo.batchPriceBlockchain.toString(),
        this.account
      )
        .on('error', (error: any) => {
          this.restoreDefault().catch(console.error);
          this.mintStatus = MintStatus.MintError;
          this.isErr = true;
          this.errMsg = this.$t('dashboard.newPainting.mintErrors.unexpected', { errorMsg: error });
        })
        .on('transactionHash', () => {
          this.mintStatus = MintStatus.MintAwaitingConfirmation;
        })
        .on('confirmation', () => {
          if (!this.isConfigured) {
            this.mintStatus = MintStatus.ItemMinted;
            this.updateTopInfo().catch(console.error);
            this.setFormInitialState().catch(console.error);
          };
        })
    } catch (e: any) {
      this.restoreDefault().catch(console.error);
      this.mintStatus = MintStatus.MintError;
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