<template>
  <form-generator
    :form-params="params"
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
        // collectionData: 'GET_COLLECTION_DATA',
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
  defaultValues: (number | string | boolean | {label: string, value: string | number})[] = [];
  parsedGeneratedParams!: string[];
  descriptorIPFSHash!: string;

  isErr: boolean = false;
  errMsg: string = '';
  isConfigured: boolean = false;
  clearForm: boolean = false;

  created() {
    if (this.isConnected) {
      this.algoPainterArtistCollection = new AlgoPainterArtistCollection(this.networkInfo);
    }
    this.mockedParams();
    this.mockedCollectionData();
    setTimeout(() => { this.mint().catch(console.error) }, 5000);
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

  GeneratePreview(parsedGeneratedParams: string[]) {
    console.log('parsedGeneratedParams', parsedGeneratedParams);
    this.isErr = false;
    this.errMsg = '';
    this.clearForm = false;
    this.parsedGeneratedParams = parsedGeneratedParams;

    this.setPreviewUrl(this.previewUrl(parsedGeneratedParams)).catch(console.error);
  }

  previewUrl(parsedGeneratedParams: (number | string | boolean)[], noSize = false) {
    let previewUrl: string = this.collectionData.api.collectionInfo.api + '?';

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

    console.log('previewUrl', previewUrl.replace(searchRegExp, '%20'));

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

      // Substituir expressions - preview dentro do pinning service helper
      const previewPiningResult = await PinningServiceHelper.pinFile('Expressions - Preview', 1, this.previewUrl(this.parsedGeneratedParams, false));
      const previewIPFSHash = previewPiningResult.ipfsHash;
      console.log('previewIPFSHash', previewIPFSHash);

      await this.algoPainterArtistCollection.mintCall(
        this.collectionData.title,
        this.collectionData.blockchainId,
        this.parsedGeneratedParams,
        previewIPFSHash || '',
        // Na linha de baixo tem que colocar uma info puxada do newpaintingtopinfo
        this.collectionData.metrics.priceRange[0].amount.toString(),
        // Pra fazer call não precisa do from
        this.account
      );
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
      // return;
    }

    // try {
    //   this.isMintDialogOpen = true;
    //   let previewIPFSHash: string | undefined = '';
    //   let rawIPFSHash: string | undefined = '';

    //   this.mintStatus = MintStatus.GeneratingPreviewFile;

    //   const previewPiningResult = await PinningServiceHelper.pinFile('Generic - Preview', 1, this.previewUrl(this.parsedGeneratedParams, false));

    //   previewIPFSHash = previewPiningResult.ipfsHash;

    //   if (!previewIPFSHash) {
    //     this.restoreDefault().catch(console.error);
    //     this.isErr = true;
    //     this.errMsg = this.$t('dashboard.newPainting.mintErrors.generating', { type: 'preview' });
    //     return;
    //   }

    //   this.mintStatus = MintStatus.GeneratingRawFile;

    //   const rawPiningResult = await PinningServiceHelper.pinFile('Generic - Preview', 1, this.previewUrl(this.parsedGeneratedParams, true));
    //   rawIPFSHash = rawPiningResult.ipfsHash;

    //   if (!rawIPFSHash) {
    //     this.restoreDefault().catch(console.error);
    //     this.mintStatus = MintStatus.GeneratingRawFileError;
    //     this.isErr = true;
    //     this.errMsg = this.$t('dashboard.newPainting.mintErrors.generating', { type: 'raw' });
    //     return;
    //   }

    //   this.mintStatus = MintStatus.GeneratingDescriptorFile;

    //   // const payload: IGenericPayload = {
    //   //   name: this.artBasicInfo.name,
    //   //   description: this.artBasicInfo.description,
    //   //   image: `https://ipfs.io/ipfs/${rawIPFSHash}`,
    //   //   previewImage: `https://ipfs.io/ipfs/${previewIPFSHash}`,
    //   //   collection: {
    //   //     id: this.collectionData.index,
    //   //     name: this.collectionData.title,
    //   //   },
    //   //   parameters: this.parsedGeneratedParams,
    //   //   mintedBy: this.account,
    //   // };

    //   // const descriptorPinningResult = await PinningServiceHelper.pinJSON(payload);
    //   // this.descriptorIPFSHash = (descriptorPinningResult.ipfsHash) ? descriptorPinningResult.ipfsHash : '';

    //   if (!this.descriptorIPFSHash) {
    //     this.restoreDefault().catch(console.error);
    //     this.isErr = true;
    //     this.errMsg = this.$t('dashboard.newPainting.mintErrors.generating', { type: 'descriptor' });
    //     return;
    //   }

    //   this.setIPFSUrl(`https://ipfs.io/ipfs/${rawIPFSHash}`).catch(console.error);

    //   this.mintStatus = MintStatus.CollectingUserConfirmations;
    // } catch (e) {
    //   this.restoreDefault().catch(console.error);
    // }
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
      const result = this.genericSystem.mint(this.parsedGeneratedParams, this.collectionInfo.batchPriceBlockchain, this.descriptorIPFSHash, this.account);

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

  mockedCollectionData() {
    this.collectionData = {
      _id: 'dasdasdasdas',
      blockchainId: '1',
      description: 'Sometimes people call me Kakashi, but I am much better than him!',
      owner: 'Latino',
      title: 'EXPRESShow',
      avatar: 'hash',
      account: '0xA62CE1F85461D67c874ef625F0E488C57Af2335d',
      customURL: 'EXPRESShow',
      show: true,
      namelc: 'expresshow',
      metrics: this.mockedMetrics(),
      api: {
        collectionInfo: this.mockedCollectionInfo(),
        fixedParams: this.mockedFixedParams(),
        parameters: this.mockedParams()
      },
    }
  }

  mockedMetrics() {
    return {
      nfts: 1000,
      startDT: '2022-02-24T13:02:00.000Z',
      endDT: '2022-03-08T13:02:00.000Z',
      priceType: 'fixed',
      tokenPriceAddress: '0x01a9188076f1231df2215f67b6a63231fe5e293e',
      tokenPriceSymbol: 'ALGOP',
      priceRange: [
        {
          from: 1,
          to: 1000,
          amount: '600',
          tokenPriceAddress: '0x01a9188076f1231df2215f67b6a63231fe5e293e',
          tokenPriceSymbol: 'ALGOP'
        }
      ],
      creatorPercentage: 3000,
      walletAddress: '0xA62CE1F85461D67c874ef625F0E488C57Af2335d'
    }
  }

  mockedCollectionInfo() {
    return {
      api: 'https://expressions.algopainter.art/',
      isSpecialParamsChecked: false,
      isSizeInUrlChecked: true,
      width: 400,
      height: 400
    }
  }

  mockedFixedParams() {
    return [
      {
        name: 'shadowHue',
        value: '0'
      }
    ]
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
        defaultValue: '1'
      },
      {
        name: 'gender',
        label: 'Biological Sex',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: 'F',
            label: 'Female',
          },
          {
            value: 'M',
            label: 'Male',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'F'
      },
      {
        name: 'expression',
        label: 'Expressions',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: 'serious',
            label: 'Neutral',
          },
          {
            value: 'happy',
            label: 'Happy',
          },
          {
            value: 'angry',
            label: 'Angry',
          },
          {
            value: 'disgust',
            label: 'Disgusted',
          },
          {
            value: 'surprise',
            label: 'Impressed',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'angry'
      },
      {
        name: 'expressionTemplate',
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
        defaultValue: '1'
      },
      {
        name: 'useWireframe',
        label: 'Use Wireframe',
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
        name: 'wireframeHue',
        label: 'Wireframe Hue',
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
        name: 'useWireframeBlend',
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
        name: 'wireframeBlendStyle',
        label: 'Wireframe Blend Style',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: 'BLEND_ADD',
            label: 'Add',
          },
          {
            value: 'BLEND_DARKEN',
            label: 'Darken',
          },
          {
            value: 'BLEND_DIFFERENCE',
            label: 'Difference',
          },
          {
            value: 'BLEND_EXCLUSION',
            label: 'Exclusion',
          },
          {
            value: 'BLEND_HARDLIGHT',
            label: 'Hardlight',
          },
          {
            value: 'BLEND_LIGHTEN',
            label: 'Lighten',
          },
          {
            value: 'BLEND_MULTIPLY',
            label: 'Multiply',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'BLEND_ADD'
      },
      {
        name: 'innerColorHue',
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
        name: 'overlay',
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
        defaultValue: '1'
      },
      {
        name: 'overlayHue',
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
        name: 'useShadow',
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
    ]

    this.params.forEach((param, i) => {
      if (param.fieldType === 'Select') {
        param.options.forEach((option) => {
          if (option.value === param.defaultValue) {
            this.defaultValues[i] = {
              label: option.label,
              value: param.defaultValue
            }
          }
        })
      } else {
        this.defaultValues[i] = param.defaultValue;
      }
    });

    return this.params;
  }
}

</script>