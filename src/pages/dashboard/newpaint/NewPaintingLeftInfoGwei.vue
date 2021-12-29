<template>
  <div v-if="hasAllowance">
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
    <div class="algo-slider" v-if="item.useRandom === 'true'">
      <p class="label">
        {{ $t('dashboard.newPainting.gwei.colorInversionProbability') }}
      </p>
      <q-slider
        v-model="item.probability"
        color="primary"
        min="0"
        max="10"
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
      @click="generatePreview"
    />
  </div>

  <div v-if="!hasAllowance">
    <p>test</p>
  </div>
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
import { IGweiItemParameters, IGweiParsedItemParameters, IGweiPayload, INewMintGwei } from 'src/models/INewPaintingGwei';
import { NetworkInfo } from 'src/store/user/types';
import { mapGetters } from 'vuex';
import AlgoPainterGweiProxy from 'src/eth/AlgoPainterGweiItemProxy';
import AlgoPainterTokenProxy from 'src/eth/AlgoPainterTokenProxy';
import { getGweiItemContractByNetworkId } from 'src/eth/Config';
import { ICollectionInfo, IArtBasicInfo, MintStatus } from 'src/models/IMint';
import IPFSHelper from "src/helpers/IPFSHelper";

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

  errorMsg: string = '';
  transactionHash!: any;
  isWaitingTransaction: boolean = false;
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
      this.algoPainterTokenProxy = new AlgoPainterTokenProxy(this.networkInfo)
      this.gweiSystem = new AlgoPainterGweiProxy(this.networkInfo)
    }
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.algoPainterTokenProxy = new AlgoPainterTokenProxy(this.networkInfo)
      this.gweiSystem = new AlgoPainterGweiProxy(this.networkInfo)
    }
  }

  get gweiContractAddress() {
    return getGweiItemContractByNetworkId(this.networkInfo.id);
  }

  mounted() {
    this.checkAllowance().catch(console.error);
  }

  async checkAllowance() {
    this.hasAllowance = await this.algoPainterTokenProxy.allowance(this.account, this.gweiContractAddress);
  }
  
  generatePreview() {
    this.parsedItem = {
      parsedText: this.item.text,
      parsedUseRandom: this.item.useRandom,
      parsedInspiration: this.item.inspiration.value,
      parsedProbability: parseFloat((this.item.probability / 10).toFixed(1)),
      parsedOverlay: parseInt(this.item.overlay.value),
      parsedOverlayOpacity: parseFloat((Number(this.item.overlayOpacity) / 10).toFixed(1)),
      parsedWallType: this.item.wallType.value,
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const previewUrl = `${process.env.VUE_APP_GWEI_ENDPOINT}?width=300&height=300&ticks=${this.ticks}&text=${this.parsedItem.parsedText}&inspiration=${this.parsedItem.parsedInspiration}&useRandom=${this.parsedItem.parsedUseRandom}&probability=${this.parsedItem.parsedProbability}&wallType=${this.parsedItem.parsedWallType}&overlay=${this.parsedItem.parsedOverlay}&overlayOpacity=${this.parsedItem.parsedOverlayOpacity}`;

    this.setItemParameters(this.parsedItem).catch(console.error);
    this.setPreviewUrl(previewUrl).catch(console.error);
  }

  async setItemParameters(parsedItem: IGweiParsedItemParameters) {
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

  srcIPFS() {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${process.env.VUE_APP_GWEI_ENDPOINT}?text=${encodeURIComponent(this.parsedItem.parsedText)}&inspiration=${this.parsedItem.parsedInspiration}&useRandom=${this.parsedItem.parsedUseRandom}&probability=${this.parsedItem.parsedProbability}&wallType=${this.parsedItem.parsedWallType}&overlay=${this.parsedItem.parsedOverlay}&overlayOpacity=${this.parsedItem.parsedOverlayOpacity}`;
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
    this.isMintDialogOpen = true;
    this.mintStatus = MintStatus.GeneratingPreviewFile;

    const payload: IGweiPayload = {
      image: this.srcIPFS(),
      text: this.parsedItem.parsedText,
      inspiration: this.parsedItem.parsedInspiration,
      useRandom: this.parsedItem.parsedUseRandom,
      probability: this.parsedItem.parsedProbability,
      place: this.parsedItem.parsedWallType,
      description: this.artBasicInfo.description,
      amount: this.collectionInfo.batchPriceBlockchain,
      overlay: this.parsedItem.parsedOverlay,
      overlayOpacity: this.parsedItem.parsedOverlayOpacity,
      mintedBy: this.account,
    }

    this.mintStatus = MintStatus.GeneratingRawFile;

    try {
      const ipfsData: {path: string} = await IPFSHelper.addGwei(payload);
      const ipfsPath = ipfsData.path;
      this.tokenURI = 'https://ipfs.io/ipfs/' + ipfsPath;
      this.setIPFSUrl(this.srcIPFS()).catch(console.error);
      this.mintStatus = MintStatus.CollectingUserConfirmations;
    } catch (e) {
      this.mintStatus = MintStatus.GeneratingRawFileError;
    }
  }

  @Watch('userConfirmations')
  onUserConfirmationsChanged() {
    if (this.userConfirmations) {
      this.finishMinting().catch(console.error);
    }
  }

  async finishMinting() {
    const newMint: INewMintGwei = {
      inspiration: Number(this.parsedItem.parsedInspiration),
      text: this.parsedItem.parsedText,
      useRandom: this.parsedItem.parsedUseRandom === 'true',
      probability: this.parsedItem.parsedProbability * 10,
      place: Number(this.parsedItem.parsedWallType),
      tokenURI: this.tokenURI,
      amount: Number(this.collectionInfo.batchPriceBlockchain),
    };

    this.mintStatus = MintStatus.MintAwaitingConfirmation;

    try {
      this.transactionHash = await this.gweiSystem.mint(newMint, this.account, (receipt: any) => {
        this.isWaitingTransaction = false;
        this.receipt = receipt;
        this.mintStatus = MintStatus.ItemMinted;
      });
    } catch (error: any) {
      this.mintStatus = MintStatus.MintError;
      switch (error.code) {
        case 'INVALID_MINIMUM_AMOUNT':
          this.errorMsg =
            'Your payment must be greater than or equal to the minimum amount';
          break;
        case 'PAINTING_ALREADY_REGISTERED':
          this.errorMsg = 'This painting was already generated for another costumer';
          break;
        case 4001:
          this.errorMsg =
            'MetaMask Tx Signature: User denied transaction signature.';
          break;
        default:
          this.errorMsg = 'Unexpected error';
      }
    }

    this.isWaitingTransaction = true;
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
      label: 'Room',
    },
    {
      value: '4',
      label: 'Bedroom',
    },
    {
      value: '5',
      label: 'Open Gallery',
    },
    {
      value: '6',
      label: 'High-Tech Gallery',
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