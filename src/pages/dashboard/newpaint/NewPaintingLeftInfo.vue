<template>
  <form-generator
    v-if="params"
    :form-params="formParams"
    :default-values="defaultValues"
    :clear-form="clearForm"
    @generate-preview="GeneratePreview"
  />
  <q-dialog
    v-if="collectionData"
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

class Props {
  formParams = prop({
    type: Object as PropType<IFormParams[]>,
    required: true,
  });
}

@Options({
  components: {
    FormGenerator
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

  collectionInfo!: ICollectionInfo;
  artBasicInfo!: IArtBasicInfo;
  userConfirmations!: boolean;
  isMinting!: boolean;

  mintStatus: MintStatus | null = null;
  isMintDialogOpen: boolean = false;
  @Ref() dialogRef!: QDialog;

  collectionData!: ICollection;
  params: IFormParams[] = [];
  defaultValues: (number | string | boolean)[] = [];
  generatedParams!: (number | string | boolean)[];
  descriptorIPFSHash!: string;

  isErr: boolean = false;
  errMsg: string = '';
  isConfigured: boolean = false;
  clearForm: boolean = false;

  created() {
    if (this.isConnected) {
      this.algoPainterArtistCollection = new AlgoPainterArtistCollection(this.networkInfo);
    }
    // this.mockedParams();
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.algoPainterArtistCollection = new AlgoPainterArtistCollection(this.networkInfo);
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

  get paramsDefaultValues() {
    this.params.forEach((param, i) => {
      this.defaultValues[i] = param.defaultValue;
    });

    return this.defaultValues;
  }

  GeneratePreview(generatedParams: (number | string | boolean)[]) {
    console.log('generatedParams', generatedParams);
    this.isErr = false;
    this.errMsg = '';
    this.clearForm = false;
    this.generatedParams = generatedParams;

    this.setPreviewUrl(this.previewUrl(generatedParams)).catch(console.error);
  }

  previewUrl(generatedParams: (number | string | boolean)[], noSize = false) {
    let previewUrl: string = this.collectionData.collectionInfo.api + '?';

    if (!this.collectionData.collectionInfo.isSpecialParamsChecked && !noSize) {
      if (this.collectionData.collectionInfo.isSizeInUrlChecked) {
        previewUrl += `size=${this.collectionData.collectionInfo.width}x${this.collectionData.collectionInfo.height}&`;
      } else {
        previewUrl += `width=${this.collectionData.collectionInfo.width}&height=${this.collectionData.collectionInfo.height}&`;
      }
    }

    this.collectionData.fixedParams.forEach((param) => {
      previewUrl += `${param.name}=${param.value.toString()}&`
    })

    this.collectionData.params.forEach((param, i) => {
      previewUrl += `${param.name}=${generatedParams[i].toString()}`

      if ((i + 1) !== this.collectionData.params.length) {
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

  async mint() {
    try {
      this.restoreDefault().catch(console.error);

      // await this.genericSystem.callMint(this.generatedParams, this.collectionInfo.batchPriceBlockchain, '', this.account);
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

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      this.errMsg = this.$t('dashboard.newPainting.mintErrors.unexpected', { errorMsg: e.message });
      return;
    }

    try {
      this.isMintDialogOpen = true;
      let previewIPFSHash: string | undefined = '';
      let rawIPFSHash: string | undefined = '';

      this.mintStatus = MintStatus.GeneratingPreviewFile;

      const previewPiningResult = await PinningServiceHelper.pinFile('Generic - Preview', 1, this.previewUrl(this.generatedParams, false));

      previewIPFSHash = previewPiningResult.ipfsHash;

      if (!previewIPFSHash) {
        this.restoreDefault().catch(console.error);
        this.isErr = true;
        this.errMsg = this.$t('dashboard.newPainting.mintErrors.generating', { type: 'preview' });
        return;
      }

      this.mintStatus = MintStatus.GeneratingRawFile;

      const rawPiningResult = await PinningServiceHelper.pinFile('Generic - Preview', 1, this.previewUrl(this.generatedParams, true));
      rawIPFSHash = rawPiningResult.ipfsHash;

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
        description: this.artBasicInfo.description,
        image: `https://ipfs.io/ipfs/${rawIPFSHash}`,
        previewImage: `https://ipfs.io/ipfs/${previewIPFSHash}`,
        collection: {
          id: this.collectionData.index,
          name: this.collectionData.title,
        },
        parameters: this.generatedParams,
        mintedBy: this.account,
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
    } catch (e) {
      this.restoreDefault().catch(console.error);
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

      /*
      const result = this.genericSystem.mint(this.generatedParams, this.collectionInfo.batchPriceBlockchain, this.descriptorIPFSHash, this.account);

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
          this.setFormInitialState().catch(console.error);
        };
      }).catch(console.error);
      */
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

  mockedParams() {
    this.params = [
      {
        name: 'background',
        label: 'Background',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: '1',
            label: 'Bitcoin',
          },
          {
            value: '2',
            label: 'Block Saturation',
          },
          {
            value: '3',
            label: 'Inner Circuit',
          },
          {
            value: '4',
            label: 'High Voltage',
          },
          {
            value: '5',
            label: 'Mars',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'Bitcoin'
      },
      {
        name: 'biological sex',
        label: 'Biological Sex',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: '0',
            label: 'Female',
          },
          {
            value: '1',
            label: 'Male',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'Female'
      },
      {
        name: 'Expressions',
        label: 'Expressions',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: '0',
            label: 'Neutral',
          },
          {
            value: '1',
            label: 'Happy',
          },
          {
            value: '2',
            label: 'Angry',
          },
          {
            value: '3',
            label: 'Disgusted',
          },
          {
            value: '4',
            label: 'Impressed',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'Angry'
      },
      {
        name: 'skin',
        label: 'Skin',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: '1',
            label: 'Space Code',
          },
          {
            value: '2',
            label: 'Deep Tracking',
          },
          {
            value: '3',
            label: 'Nebula Metrics',
          },
          {
            value: '4',
            label: 'Plasma',
          },
          {
            value: '5',
            label: 'Galaxy Node',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'Space Code'
      },
      {
        name: 'use wiseframe',
        label: 'Use Wiseframe',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Checkbox',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 10,
        defaultValue: true
      },
      {
        name: 'wiseframe hue',
        label: 'Wiseframe Hue',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Slider',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 9,
        defaultValue: 0
      },
      {
        name: 'Use Wireframe Blend',
        label: 'Use Wireframe Blend',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Checkbox',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 10,
        defaultValue: true
      },
      {
        name: 'Wireframe Blend style',
        label: 'Wireframe Blend Style',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: '0',
            label: 'Add',
          },
          {
            value: '1',
            label: 'Darken',
          },
          {
            value: '2',
            label: 'Difference',
          },
          {
            value: '3',
            label: 'Exclusion',
          },
          {
            value: '4',
            label: 'Hardlight',
          },
          {
            value: '5',
            label: 'Lighten',
          },
          {
            value: '7',
            label: 'Multiply',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'Add'
      },
      {
        name: 'innercolor hue',
        label: 'InnerColor Hue',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Slider',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 9,
        defaultValue: 0
      },
      {
        name: 'magic',
        label: 'Magic',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: '1',
            label: 'Fractal Perception',
          },
          {
            value: '2',
            label: 'Soul Link',
          },
          {
            value: '3',
            label: 'Magnetic Fields',
          },
          {
            value: '4',
            label: 'Z-Mesh',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'Fractal Perception'
      },
      {
        name: 'overlay hue',
        label: 'Overlay Hue',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Slider',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 9,
        defaultValue: 0
      },
      {
        name: 'use shadow',
        label: 'Use Shadow',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Checkbox',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 9,
        defaultValue: false
      },
      {
        name: 'flip',
        label: 'Flip',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Checkbox',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 9,
        defaultValue: false
      },
      {
        name: 'Food',
        label: 'food',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Input Textfield',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 9,
        defaultValue: 'rice'
      },
      /*{
        name: 'Chemist',
        label: 'Chemist name',
        dataType: 'string',
        fieldType: 'Input Textfield',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 10,
        defaultValue: 'Lavoisier'
      },
      {
        name: 'Compound',
        label: 'Chemist name',
        dataType: 'string',
        fieldType: 'Select',
        options: [
          {
            label: 'Acid',
            value: '0'
          },
          {
            label: 'Ionic',
            value: '1'
          },
          {
            label: 'Sodium Chloride',
            value: '2'
          }
        ],
        min: 0,
        max: 10,
        defaultValue: 'Sodium Chloride'
      },
      {
        name: 'Pure',
        label: 'Is the compound pure?',
        dataType: 'string',
        fieldType: 'Checkbox',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 10,
        defaultValue: true
      },
      {
        name: 'Amount',
        label: 'Amount of compound',
        dataType: 'string',
        fieldType: 'Slider',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 1,
        max: 10,
        defaultValue: 5
      },
      */
    ]

    this.params?.forEach((param, i) => {
      this.defaultValues[i] = param.defaultValue;
    });
  }
}

</script>