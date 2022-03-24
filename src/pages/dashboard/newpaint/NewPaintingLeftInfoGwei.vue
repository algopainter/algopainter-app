<template>
  <h4 class="q-mb-sm">{{ $t('dashboard.homePage.gwei') }}</h4>
  <div class="title">
    {{ $t('dashboard.newPainting.parameters') }}
  </div>
  <q-input
    v-model="item.text"
    :label="$t('dashboard.newPainting.gwei.inspirationalText')"
    maxlength="64"
    counter
  />
  <div class="algo-radio">
    <p class="label">{{ $t('dashboard.newPainting.gwei.randomColors') }}</p>
    <div class="row q-col-gutter-md">
      <q-radio
        v-model="item.useRandom"
        :label="$t('dashboard.newPainting.gwei.yesLabel')"
        class="option"
        :val="'true'"
      />
      <q-radio
        v-model="item.useRandom"
        :label="$t('dashboard.newPainting.gwei.noLabel')"
        class="option"
        :val="'false'"
      />
    </div>
  </div>
  <div v-if="item.useRandom === 'true'" class="algo-slider">
    <p class="label">
      {{ $t('dashboard.newPainting.gwei.colorInversionProbability') }}
    </p>
    <q-slider
      v-model="item.probability"
      color="primary"
      :min="0"
      :max="10"
    />
  </div>
  <q-select
    v-model="item.inspiration"
    :label="$t('dashboard.newPainting.gwei.inspirations')"
    :options="inspirationValue"
  />
  <q-select
    v-model="item.wallType"
    :label="$t('dashboard.newPainting.gwei.exhibition')"
    :options="exhibitionValue"
  />
  <q-select
    v-model="item.overlay"
    :label="$t('dashboard.newPainting.gwei.technique')"
    :options="techniqueValue"
  />
  <algo-button
    :label="$t('dashboard.newPainting.leftInfoBtnName')"
    :class="[$q.screen.lt.sm || $q.screen.lt.md ? 'full-width q-mt-lg q-mb-lg' : 'full-width q-mt-lg']"
    color="primary"
    :disable="isPreviewing"
    @click="generatePreview"
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
import AlgoButton from 'components/common/Button.vue';
import MintDialog from 'pages/dashboard/newpaint/MintDialog.vue';
import { IGweiItemParameters, IGweiParsedItemParameters, INewMintGwei } from 'src/models/INewPaintingGwei';
import { NetworkInfo } from 'src/store/user/types';
import { mapGetters } from 'vuex';
import AlgoPainterGweiProxy from 'src/eth/AlgoPainterGweiItemProxy';
import AlgoPainterTokenProxy from 'src/eth/AlgoPainterTokenProxy';
import { getGweiItemContractByNetworkId } from 'src/eth/Config';
import { ICollectionInfo, IArtBasicInfo, MintStatus } from 'src/models/IMint';
import { PaintGwei } from 'src/services/painting.js';
import { randomHex } from 'web3-utils';
import { api } from 'src/boot/axios';

class Props {
  collectionName = prop({
    type: String,
    required: true,
  });
}

@Options({
  components: {
    AlgoButton,
    MintDialog,
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
        collectionInfo: 'GET_GWEI_COLLECTION_INFO',
        artBasicInfo: 'GET_GWEI_BASIC_INFO',
        userConfirmations: 'GET_GWEI_USER_CONFIRMATIONS',
        isMinting: 'GET_GWEI_IS_MINTING',
      }),
  }
})
export default class NewPaintingLeftInfoGwei extends Vue.with(Props) {
  @Ref() dialogRef!: QDialog;

  gweiSystem!: AlgoPainterGweiProxy;
  algoPainterTokenProxy!: AlgoPainterTokenProxy;
  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  account!: string;
  collectionInfo!: ICollectionInfo;
  artBasicInfo!: IArtBasicInfo;
  userConfirmations!: boolean;
  isMinting!: boolean;

  itemParameters!: IGweiItemParameters;
  hasAllowance: boolean = false;
  ticks = Date.now();
  tokenURI!: string;
  baseUrl!: string | undefined;

  isError: boolean = false;
  errorMessage: string = '';
  isConfigured: boolean = false;
  isPreviewing: boolean = false;
  img!: string;
  gwei: any;
  previewIPFSHash!: string | undefined;
  rawIPFSHash!: string | undefined;
  descriptorIPFSHash!: string;

  receipt!: any;

  parsedItem!: IGweiParsedItemParameters;

  mintStatus: MintStatus | null = null;
  isMintDialogOpen: boolean = false;

  item: IGweiItemParameters = {
    text: 'My Amazing Painting',
    useRandom: 'false',
    inspiration: {
      value: '1',
      label: 'Calm',
    },
    probability: 5,
    overlay: {
      value: '0',
      label: 'Regular',
    },
    overlayOpacity: '10',
    wallType: {
      value: '1',
      label: 'Wall',
    },
  }

  created() {
    if (this.isConnected) {
      this.algoPainterTokenProxy = new AlgoPainterTokenProxy(this.networkInfo);
      this.gweiSystem = new AlgoPainterGweiProxy(this.networkInfo);
      this.gwei = new PaintGwei();
    }
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.algoPainterTokenProxy = new AlgoPainterTokenProxy(this.networkInfo);
      this.gweiSystem = new AlgoPainterGweiProxy(this.networkInfo);
      this.gwei = new PaintGwei();
    }
  }

  get gweiContractAddress() {
    return getGweiItemContractByNetworkId(this.networkInfo.id);
  }

  mounted() {
    this.baseUrl = process.env.VUE_APP_GWEI_ENDPOINT;
    this.checkIfConfigured();
    this.checkAllowance().catch(console.error);
  }

  checkIfConfigured() {
    if (!this.isConfigured) {
      this.setFormInitialState().catch(console.error);
    }
  }

  async checkAllowance() {
    this.hasAllowance = await this.algoPainterTokenProxy.allowance(this.account, this.gweiContractAddress);
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
      parsedInspiration: this.item.inspiration.value,
      parsedText: this.item.text,
      parsedUseRandom: this.item.useRandom,
      parsedProbability: parseFloat((this.item.probability / 10).toFixed(1)),
      parsedWallType: this.item.wallType.value,
      parsedOverlay: parseInt(this.item.overlay.value),
      parsedOverlayOpacity: parseFloat((Number(this.item.overlayOpacity) / 10).toFixed(1)),
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.gwei.generate({
      finalWidth: 400,
      finalHeight: 400,
      inspiration: this.parsedItem.parsedInspiration,
      text: this.parsedItem.parsedText,
      useRandom: this.parsedItem.parsedUseRandom,
      probability: this.parsedItem.parsedProbability,
      useRandomOpacity: false,
      wallType: this.parsedItem.parsedWallType,
      overlay: this.parsedItem.parsedOverlay,
      overlayOpacity: this.parsedItem.parsedOverlayOpacity
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

  async setItemParameters(parsedItem: IGweiParsedItemParameters) {
    await this.$store
      .dispatch({
        type: 'mint/itemParameters',
        parsedItem: parsedItem,
        collectionName: this.collectionName
      })
  }

  async setPreviewUrl(previewUrl: string) {
    await this.$store
      .dispatch({
        type: 'mint/previewUrl',
        previewUrl: previewUrl,
        collectionName: this.collectionName
      })
  }

  @Watch('isMinting')
  async onIsMintingChanged() {
    if (this.isMinting) {
      await this.mint();
    }
  }

  srcIPFS() {
    return (this.baseUrl) ? `${this.baseUrl}?text=${encodeURIComponent(this.parsedItem.parsedText)}&inspiration=${this.parsedItem.parsedInspiration}&useRandom=${this.parsedItem.parsedUseRandom}&probability=${this.parsedItem.parsedProbability}&wallType=${this.parsedItem.parsedWallType}&overlay=${this.parsedItem.parsedOverlay}&overlayOpacity=${this.parsedItem.parsedOverlayOpacity}` : '';
  }

  async setIPFSUrl(IPFSUrl: string) {
    await this.$store
      .dispatch({
        type: 'mint/IPFSUrl',
        IPFSUrl: IPFSUrl,
        collectionName: this.collectionName,
      })
  }

  async mint() {
    const available = await this.gweiSystem.checkIfAvailable(Number(this.parsedItem.parsedInspiration), this.parsedItem.parsedText, this.parsedItem.parsedUseRandom === 'true', this.parsedItem.parsedProbability * 10);

    if (!available) {
      this.isError = true;
      this.errorMessage = this.$t('dashboard.newPainting.mintErrors.alreadyMinted');

      await this.$store
        .dispatch({
          type: 'mint/mintingStatus',
          isMinting: false,
          collectionName: this.collectionName,
        })

      await this.$store
        .dispatch({
          type: 'mint/artBasicInfo',
          artBasicInfo: undefined,
          collectionName: this.collectionName,
        })

      return;
    }

    await this.setModalInitialState();
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
    const rawImg = await this.gwei.generate({
      finalWidth: 2422,
      finalHeight: 2422,
      inspiration: this.parsedItem.parsedInspiration,
      text: this.parsedItem.parsedText,
      useRandom: this.parsedItem.parsedUseRandom,
      probability: this.parsedItem.parsedProbability,
      useRandomOpacity: false,
      wallType: this.parsedItem.parsedWallType,
      overlay: this.parsedItem.parsedOverlay,
      overlayOpacity: this.parsedItem.parsedOverlayOpacity
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

    const descriptorPayload = {
      name: this.artBasicInfo.name,
      description: this.artBasicInfo.description,
      amount: this.collectionInfo.batchPriceBlockchain,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      image: `https://ipfs.io/ipfs/${this.rawIPFSHash}`,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      previewImage: `https://ipfs.io/ipfs/${this.previewIPFSHash}`,
      collection: {
        id: 0,
        name: 'Gwei',
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

  @Watch('userConfirmations')
  async onUserConfirmationsChanged() {
    if (this.userConfirmations) {
      await this.finishMinting();
    }
  }

  async finishMinting() {
    this.isConfigured = false;
    this.mintStatus = MintStatus.MintAwaitingInput;

    const newMint: INewMintGwei = {
      inspiration: Number(this.parsedItem.parsedInspiration),
      text: this.parsedItem.parsedText,
      useRandom: this.parsedItem.parsedUseRandom === 'true',
      probability: this.parsedItem.parsedProbability * 10,
      place: Number(this.parsedItem.parsedWallType),
      tokenURI: 'https://ipfs.io/ipfs/' + this.descriptorIPFSHash,
      amount: this.collectionInfo.batchPriceBlockchain,
    };

    try {
      this.mintStatus = MintStatus.CollectingUserConfirmations;
      await this.gweiSystem.checkAllowance(newMint.amount, this.account);
      this.mintStatus = MintStatus.MintAwaitingConfirmation;
      await this.gweiSystem.mint(newMint, this.account);
      if (!this.isConfigured) {
        this.mintStatus = MintStatus.ItemMinted;
        this.updateTopInfo().catch(console.error);
        await this.setFormInitialState();
      }
    } catch (e: any) {
      this.isError = true;
      this.receipt = null;
      this.mintStatus = MintStatus.MintError;
      await this.setModalInitialState();

      switch (e.code) {
        case 'INVALID_MINIMUM_AMOUNT':
          this.$t('dashboard.newPainting.mintErrors.invalidAmount');
          break;
        case 'PAINTING_ALREADY_REGISTERED':
          this.errorMessage = this.$t('dashboard.newPainting.mintErrors.alreadyMinted');
          break;
        case 4001:
          this.errorMessage = this.$t('dashboard.newPainting.mintErrors.deniedSignature');
          break;
        default:
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          this.errorMessage = this.$t('dashboard.newPainting.mintErrors.unexpected', { errorMsg: e.code });
      }
    }
  }

  async updateTopInfo() {
    await this.$store
      .dispatch({
        type: 'mint/updateTopInfo'
      })
  }

  async setFormInitialState() {
    this.isConfigured = true;
    this.isError = false;
    this.errorMessage = '';

    this.item.text = 'My Amazing Painting';
    this.item.useRandom = 'false';

    this.item.inspiration = {
      value: '1',
      label: 'Calm',
    };

    this.item.probability = 5;
    this.item.overlay = {
      value: '0',
      label: 'Regular',
    };

    this.item.overlayOpacity = '10';

    this.item.wallType = {
      value: '1',
      label: 'Wall',
    };

    await this.$store
      .dispatch({
        type: 'mint/artBasicInfo',
        artBasicInfo: undefined,
        collectionName: this.collectionName,
      })

    await this.$store
      .dispatch({
        type: 'mint/previewUrl',
        previewUrl: undefined,
        collectionName: this.collectionName,
      })

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

  onCloseStatusDialog() {
    this.isMintDialogOpen = false;

    if (this.mintStatus === MintStatus.ItemMinted) {
      this.dialogRef.hide();
    }
  }

  inspirationValue = [
    {
      value: '0',
      label: 'Random',
    },
    {
      value: '1',
      label: 'Calm',
    },
    {
      value: '2',
      label: 'Colorful blocks',
    },
    {
      value: '3',
      label: 'Colorful paths',
    },
    {
      value: '4',
      label: 'Hot flows',
    },
    {
      value: '5',
      label: 'Galaxy',
    },
    {
      value: '6',
      label: 'Madness',
    },
  ]

  exhibitionValue = [
    {
      value: '0',
      label: 'None',
    },
    {
      value: '1',
      label: 'Wall',
    },
    {
      value: '2',
      label: 'Big Wall',
    },
    {
      value: '3',
      label: 'Bedroom',
    },
    {
      value: '4',
      label: 'High-Tech Gallery',
    },
    {
      value: '5',
      label: 'Open Gallery',
    },
    {
      value: '6',
      label: 'Room',
    },
    {
      value: '7',
      label: 'PsyVerse',
    },
  ]

  techniqueValue = [
    {
      value: '0',
      label: 'Regular',
    },
    {
      value: '1',
      label: 'Splatters and Drips',
    },
    {
      value: '2',
      label: 'Dripping Paint',
    },
    {
      value: '3',
      label: 'Acrylic',
    },
    {
      value: '4',
      label: 'Freedom',
    },
    {
      value: '5',
      label: 'Heavy Brush',
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
      font-size: 16px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
  .algo-radio {
    .label {
      margin: 0px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
</style>

<style lang="scss">
  .option {
    .q-radio__label {
      color: rgba(0, 0, 0, 0.6) !important;
    }
  }
</style>