<template>
  <h4 class="q-mb-sm">{{ $t('dashboard.homePage.expressions') }}</h4>
  <div class="title">
    {{ $t('dashboard.newPainting.parameters') }}
  </div>
  <q-select
    v-model="item.background"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelA })"
    :options="backgroundOptions"
    class="full-width"
  />
  <q-select
    v-model="item.gender"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelB })"
    :options="genderOptions"
  />
  <q-select
    v-model="item.expressions"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelC })"
    :options="expressionsOptions"
  />
  <q-select
    v-model="item.expressionTemplate"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelD })"
    :options="expressionTemplateOptions"
  />
  <q-checkbox
    v-model="item.useWireframe"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelE })"
    class="full-width q-pt-sm"
  />
  <div class="algo-slider">
    <p class="label">{{ $t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelF }) }}</p>
    <q-slider
      v-model="item.wireframeHue"
      :min="0"
      :max="9"
    />
  </div>
  <q-checkbox
    v-model="item.useWireframeBlend"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelG })"
    class="full-width q-pt-sm"
  />
  <q-select
    v-model="item.wireframeBlendStyle"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelH })"
    :options="wireframeBlendStyleOptions"
  />
  <div class="algo-slider">
    <p class="label">{{ $t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelI }) }}</p>
    <q-slider
      v-model="item.innerColorHue"
      :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelI })"
      :min="0"
      :max="9"
    />
  </div>
  <q-select
    v-model="item.overlay"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelJ })"
    :options="overlayOptions"
  />
  <div class="algo-slider">
    <p class="label">{{ $t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelK }) }}</p>
    <q-slider
      v-model="item.overlayHue"
      :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelK })"
      :min="0"
      :max="9"
    />
  </div>
  <q-checkbox
    v-model="item.useShadow"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelL })"
    class="full-width q-pt-sm"
    :val="false"
  />
  <q-checkbox
    v-model="item.flip"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelM })"
    class="full-width q-pt-sm"
    :val="false"
  />
  <algo-button
    :label="$t('dashboard.newPainting.leftInfoBtnName')"
    :class="[$q.screen.lt.sm || $q.screen.lt.md ? 'full-width q-mt-lg q-mb-lg' : 'full-width q-mt-lg']"
    color="primary"
    :loading="isPreviewing"
    @click="generatePreview()"
  />

  <q-dialog v-model="isMintDialogOpen" persistent>
    <mint-dialog
      :mint-status="mintStatus"
      :collection-name="collectionName"
      @request-close="onCloseStatusDialog"
    />
  </q-dialog>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Ref, Watch } from 'vue-property-decorator';
import { QDialog } from 'quasar';
import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterExpressionsProxy from 'src/eth/AlgoPainterExpressionsItemProxy';
import AlgoPainterTokenProxy from 'src/eth/AlgoPainterTokenProxy';
import { getExpressionItemContractByNetworkId } from 'src/eth/Config';
import { IExpressionsItemParameters, IExpressionsParsedItemParameters, IExpressionsMintParameters, IExpressionsPayload } from 'src/models/INewPaintingExpressions';
import { ICollectionInfo, IArtBasicInfo, MintStatus } from 'src/models/IMint';
import MintDialog from 'pages/dashboard/newpaint/MintDialog.vue';
import AlgoButton from 'components/common/Button.vue';
import { mapGetters } from 'vuex';
import { PaintExpression } from 'src/services/painting.js';
import { randomHex } from 'web3-utils';
import { api } from 'src/boot/axios';
import AlgoPainterBidBackPirsProxy from 'src/eth/AlgoPainterBidBackPirsProxy';

interface INewPainting {
  labelA?: string,
  labelB?: string,
  labelC?: string,
  labelD?: string,
  labelE?: string,
  labelF?: string,
  labelG?: string,
  labelH?: string,
  labelI?: string,
  labelJ?: string,
  labelK?: string,
  labelL?: string,
  labelM?: string,
}

class Props {
  collectionName = prop({
    type: String,
    required: true,
  });
}

@Options({
  components: {
    AlgoButton,
    MintDialog
  },
  computed: {
    ...mapGetters(
      'user', [
        'networkInfo',
        'account',
        'isConnected',
      ]),
    ...mapGetters(
      'mint', {
        collectionInfo: 'GET_EXPRESSIONS_COLLECTION_INFO',
        artBasicInfo: 'GET_EXPRESSIONS_BASIC_INFO',
        userConfirmations: 'GET_EXPRESSIONS_USER_CONFIRMATIONS',
        isMinting: 'GET_EXPRESSIONS_IS_MINTING',
      }),
  }
})
export default class NewPaintingLeftInfoExpressions extends Vue.with(Props) {
  @Ref() dialogRef!: QDialog;

  rewardsRates!: AlgoPainterBidBackPirsProxy;
  expressionsSystem!: AlgoPainterExpressionsProxy;
  algoPainterTokenProxy!: AlgoPainterTokenProxy;
  expression: any;
  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  account!: string;
  collectionInfo!: ICollectionInfo;
  artBasicInfo!: IArtBasicInfo;
  userConfirmations!: boolean;
  isMinting!: boolean;
  intParameters: number[] = [];
  baseUrl!: string | undefined;
  img!: string;

  mintStatus: MintStatus | null = null;
  isMintDialogOpen: boolean = false;

  isError: boolean = false;
  errorMessage: string = '';
  isConfigured: boolean = false;

  isPreviewing: boolean = false;
  previewIPFSHash!: string | undefined;
  rawIPFSHash!: string | undefined;
  descriptorIPFSHash!: string;

  parsedItem!: IExpressionsParsedItemParameters;

  newArtLabels: INewPainting = {
    labelA: 'Background',
    labelB: 'Biological Sex',
    labelC: 'Expression',
    labelD: 'Skin',
    labelE: 'Use Wireframe',
    labelF: 'Wireframe Hue',
    labelG: 'Use Wireframe Blend',
    labelH: 'Wireframe Blend Style',
    labelI: 'Innercolor Hue',
    labelJ: 'Magic',
    labelK: 'Overlay Hue',
    labelL: 'Use Shadow',
    labelM: 'Flip',
  }

  item: IExpressionsItemParameters = {
    background: {
      value: 1,
      label: 'Bitcoin',
    },
    gender: {
      value: 0,
      label: 'Female',
    },
    expressions: {
      value: 2,
      label: 'Angry',
    },
    expressionTemplate: {
      value: 1,
      label: 'Space Code',
    },
    useWireframe: true,
    wireframeHue: 0,
    useWireframeBlend: true,
    wireframeBlendStyle: {
      value: 0,
      label: 'Add',
    },
    innerColorHue: 0,
    overlay: {
      value: 1,
      label: 'Fractal Perception',
    },
    overlayHue: 0,
    useShadow: false,
    flip: false,
  }

  created() {
    if (this.isConnected) {
      this.algoPainterTokenProxy = new AlgoPainterTokenProxy(this.networkInfo);
      this.rewardsRates = new AlgoPainterBidBackPirsProxy(this.networkInfo);
      this.expressionsSystem = new AlgoPainterExpressionsProxy(this.networkInfo);
      this.expression = new PaintExpression();
    }
  }

  mounted() {
    this.baseUrl = process.env.VUE_APP_EXPRESSIONS_ENDPOINT;
    this.checkIfConfigured();
  }

  checkIfConfigured() {
    if (!this.isConfigured) {
      this.setFormInitialState().catch(console.error);
    }
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.algoPainterTokenProxy = new AlgoPainterTokenProxy(this.networkInfo);
      this.rewardsRates = new AlgoPainterBidBackPirsProxy(this.networkInfo);
      this.expressionsSystem = new AlgoPainterExpressionsProxy(this.networkInfo);
      this.expression = new PaintExpression();
    }
  }

  get expressionsContractAddress() {
    return getExpressionItemContractByNetworkId(this.networkInfo.id);
  }

  getExpression(value: string) {
    switch (value) {
      case '0':
        return 'serious';
      case '1':
        return 'happy';
      case '2':
        return 'angry';
      case '3':
        return 'disgust';
      default:
        return 'surprise';
    }
  }

  @Watch('isPreviewing')
  async onIsPreviewingChanged() {
    await this.$store
      .dispatch({
        type: 'mint/previewingStatus',
        isPreviewing: this.isPreviewing,
        collectionName: this.collectionName
      })
  }

  async generatePreview() {
    this.isError = false;
    this.errorMessage = '';
    this.isPreviewing = true;

    this.parsedItem = {
      background: Number(this.item.background.value),
      gender: this.item.gender.value.toString() === '0' ? 'F' : 'M',
      expression: this.getExpression(this.item.expressions.value.toString()),
      expressionTemplate: this.item.expressionTemplate.value,
      useWireframe: this.item.useWireframe,
      wireframeHue: this.item.wireframeHue,
      useWireframeBlend: this.item.useWireframeBlend,
      wireframeBlendStyle: `BLEND_${this.item.wireframeBlendStyle.label.toUpperCase()}`,
      innerColorHue: this.item.innerColorHue,
      overlay: this.item.overlay.value,
      overlayHue: this.item.overlayHue,
      useShadow: this.item.useShadow,
      shadowHue: 0,
      flip: this.item.flip,
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.expression.generate({
      ...this.parsedItem
    })
      .then((img: string) => {
        this.img = img;
        this.setItemParameters(this.parsedItem).catch(console.error);
        this.setPreviewUrl(img).catch(console.error);
      })
      .catch((e: any) => {
        this.isError = true;
        this.errorMessage = this.$t('dashboard.newPainting.mintErrors.unexpected', { errorMsg: e.message });
      });

    this.isPreviewing = false;
  }

  async setItemParameters(parsedItem: IExpressionsParsedItemParameters) {
    await this.$store
      .dispatch({
        type: 'mint/itemParameters',
        parsedItem: parsedItem,
        collectionName: this.collectionName,
      })
  }

  async setPreviewUrl(previewUrl: string) {
    await this.$store
      .dispatch({
        type: 'mint/previewUrl',
        previewUrl: previewUrl,
        collectionName: this.collectionName,
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
      this.setModalInitialState().catch(console.error);

      const mintParameters: IExpressionsMintParameters = {
        background: Number(this.item.background.value),
        gender: this.item.gender.value,
        expression: this.item.expressions.value,
        expressionTemplate: this.item.expressionTemplate.value,
        useWireframe: this.item.useWireframe ? 1 : 0,
        wireframeHue: this.item.wireframeHue,
        useWireframeBlend: this.item.useWireframeBlend ? 1 : 0,
        wireframeBlendStyle: this.item.wireframeBlendStyle.value,
        innerColorHue: this.item.innerColorHue,
        overlay: this.item.overlay.value,
        overlayHue: this.item.overlayHue,
        useShadow: this.item.useShadow ? 1 : 0,
        shadowHue: 0,
        flip: this.item.flip ? 1 : 0,
      }

      Object.values(mintParameters).forEach((parameter) => {
        this.intParameters.push(parameter);
      });

      try {
        await this.expressionsSystem.callMint(this.intParameters, this.collectionInfo.batchPriceBlockchain, '', this.account);
      } catch (e: any) {
        this.setModalInitialState().catch(console.error);

        this.isError = true;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (e.message && e.message.indexOf('ALREADY_REGISTERED') >= 0) {
          this.errorMessage = this.$t('dashboard.newPainting.mintErrors.alreadyMinted');
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (e.message && e.message.indexOf('PRICE_HAS_CHANGED') >= 0) {
          this.errorMessage = this.$t('dashboard.newPainting.mintErrors.priceChanged');
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (e.message && e.message.indexOf('INVALID_AMOUNT') >= 0) {
          this.errorMessage = this.$t('dashboard.newPainting.mintErrors.invalidAmount');
          return;
        }

        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        this.errorMessage = this.$t('dashboard.newPainting.mintErrors.unexpected', { errorMsg: e.message });
        return;
      }

      this.isMintDialogOpen = true;

      this.mintStatus = MintStatus.GeneratingPreviewFile;

      const previewPayload = {
        name: this.artBasicInfo.name,
        description: this.artBasicInfo.description,
        mintedBy: this.account,
        image: this.img,
        fileName: randomHex(32) + '.png'
      }

      try {
        const previewPiningResult = await api.post('images/pintoipfs/FILE?resize=1', previewPayload);
        this.previewIPFSHash = previewPiningResult.data.ipfsHash;
      } catch (e) {
        this.setModalInitialState().catch(console.error);
        this.mintStatus = MintStatus.GeneratingPreviewFileError;
        this.isError = true;
        this.errorMessage = this.$t('dashboard.newPainting.mintErrors.generating', { type: 'preview' });
        return;
      }

      this.mintStatus = MintStatus.GeneratingRawFile;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const rawImg = await this.expression.generate({
        ...this.parsedItem,
        size: '2000x2000'
      })

      const rawPayload = {
        name: this.artBasicInfo.name,
        description: this.artBasicInfo.description,
        mintedBy: this.account,
        image: rawImg,
        fileName: randomHex(32) + '.png'
      }

      try {
        const rawPiningResult = await api.post('images/pintoipfs/FILE', rawPayload);
        this.rawIPFSHash = rawPiningResult.data.ipfsHash;
      } catch (e) {
        this.setModalInitialState().catch(console.error);
        this.mintStatus = MintStatus.GeneratingRawFileError;
        this.isError = true;
        this.errorMessage = this.$t('dashboard.newPainting.mintErrors.generating', { type: 'raw' });
        return;
      }

      this.mintStatus = MintStatus.GeneratingDescriptorFile;

      const descriptorPayload: IExpressionsPayload = {
        name: this.artBasicInfo.name,
        description: this.artBasicInfo.description,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        image: `https://ipfs.io/ipfs/${this.rawIPFSHash}`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        previewImage: `https://ipfs.io/ipfs/${this.previewIPFSHash}`,
        collection: {
          id: 1,
          name: 'Expressions',
        },
        parameters: this.parsedItem,
        mintedBy: this.account,
      };

      try {
        const descriptorPinningResult = await api.post('images/pintoipfs/JSON', descriptorPayload);
        this.descriptorIPFSHash = descriptorPinningResult.data.ipfsHash;

        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        this.setIPFSUrl(`https://ipfs.io/ipfs/${this.rawIPFSHash}`).catch(console.error);
      } catch (e) {
        this.setModalInitialState().catch(console.error);
        this.mintStatus = MintStatus.GeneratingDescriptorFileError;
        this.isError = true;
        this.errorMessage = this.$t('dashboard.newPainting.mintErrors.generating', { type: 'descriptor' });
        return;
      }

      this.mintStatus = MintStatus.CollectingUserConfirmations;
    } catch (e) {
      this.setModalInitialState().catch(console.error);
    }
  }

  @Watch('errorMessage')
  async onErrorMessageChanged() {
    await this.$store
      .dispatch({
        type: 'mint/errorMessage',
        errorMessage: this.errorMessage,
        collectionName: this.collectionName,
      })
  }

  async setIPFSUrl(IPFSUrl: string) {
    await this.$store
      .dispatch({
        type: 'mint/IPFSUrl',
        IPFSUrl: IPFSUrl,
        collectionName: this.collectionName,
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

      const result = this.expressionsSystem.mint(this.intParameters, this.collectionInfo.batchPriceBlockchain, this.descriptorIPFSHash, this.account);

      result.on('error', (error: any) => {
        this.setModalInitialState().catch(console.error);
        this.mintStatus = MintStatus.MintError;
        this.isError = true;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        this.errorMessage = this.$t('dashboard.newPainting.mintErrors.unexpected', { errorMsg: error });
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
      this.setModalInitialState().catch(console.error);
      this.isError = true;

      if (e.code === 4001) {
        this.isError = false;
      } else {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        this.errorMessage = this.$t('dashboard.newPainting.mintErrors.unexpected', { errorMsg: e.message });
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

  async setFormInitialState() {
    this.isConfigured = true;
    this.isError = false;
    this.errorMessage = '';

    this.item.background = {
      value: 1,
      label: 'Bitcoin',
    };

    this.item.gender = {
      value: 0,
      label: 'Female',
    };

    this.item.expressions = {
      value: 2,
      label: 'Angry',
    };

    this.item.expressionTemplate = {
      value: 1,
      label: 'Space Code',
    };

    this.item.useWireframe = true;
    this.item.wireframeHue = 0;
    this.item.useWireframeBlend = true;

    this.item.wireframeBlendStyle = {
      value: 0,
      label: 'Add',
    };

    this.item.innerColorHue = 0;

    this.item.overlay = {
      value: 1,
      label: 'Fractal Perception',
    };

    this.item.overlayHue = 0;
    this.item.useShadow = false;
    this.item.flip = false;

    await this.$store
      .dispatch({
        type: 'mint/artBasicInfo',
        artBasicInfo: undefined,
        collectionName: this.collectionName,
      })

    /* uncomment this to display the placeholder image after minting an image
    await this.$store
      .dispatch({
        type: 'mint/previewUrl',
        previewUrl: undefined,
        collectionName: this.collectionName,
      })
    */

    await this.$store
      .dispatch({
        type: 'mint/itemParameters',
        parsedItem: undefined,
        collectionName: this.collectionName,
      })

    await this.$store
      .dispatch({
        type: 'mint/IPFSUrl',
        IPFSUrl: undefined,
        collectionName: this.collectionName,
      })
  }

  async setModalInitialState() {
    this.intParameters = [];
    this.mintStatus = MintStatus.GeneratingPreviewFile;
    this.previewIPFSHash = '';
    this.rawIPFSHash = '';
    this.descriptorIPFSHash = '';
    this.isError = false;

    await this.$store
      .dispatch({
        type: 'mint/mintingStatus',
        isMinting: false,
        collectionName: this.collectionName,
      })
    await this.$store
      .dispatch({
        type: 'mint/userConfirmations',
        userConfirmations: false,
        collectionName: this.collectionName,
      })
  }

  backgroundOptions = [
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
  ]

  genderOptions = [
    {
      value: '0',
      label: 'Female',
    },
    {
      value: '1',
      label: 'Male',
    },
  ]

  expressionsOptions = [
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
  ]

  expressionTemplateOptions = [
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
  ]

  wireframeBlendStyleOptions = [
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
  ]

  overlayOptions = [
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
  ]
}
</script>

<style lang="scss" scoped>
  .title {
    font-size: 20px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.6);
  }
  .algo-slider {
    .label {
      position: relative;
      top: 10px;
      margin: 0px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
</style>