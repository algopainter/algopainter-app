<template>
  <div class="title">
    {{ $t('dashboard.newPainting.parameters') }}
  </div>
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
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import AlgoSlider from 'components/common/AlgoSlider.vue';
import AlgoButton from 'components/common/Button.vue';
import { IGweiItemParameters, IGweiParameters, IGweiParsedItemParameters, IGweiPayload } from 'src/models/INewPaintingGwei';
import { NetworkInfo } from 'src/store/user/types';
import { mapGetters } from 'vuex';
import AlgoPainterGweiProxy from 'src/eth/AlgoPainterGweiItemProxy';
import AlgoPainterTokenProxy from 'src/eth/AlgoPainterTokenProxy';
import { Watch } from 'vue-property-decorator';
import { getGweiItemContractByNetworkId } from 'src/eth/Config';
import { ICollectionInfo, IArtBasicInfo, INewMint } from 'src/models/IMint';
import IPFSHelper from "src/helpers/IPFSHelper";

class Props {
  collectionName = prop({
    type: String,
    required: true,
  });
}

@Options({
  components: {
    AlgoSlider,
    AlgoButton, 
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
      }),
  }
})
export default class NewPaintingLeftInfo extends Vue.with(Props) {
  gweiSystem!: AlgoPainterGweiProxy;
  algoPainterTokenProxy!: AlgoPainterTokenProxy;
  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  account!: string;

  collectionInfo!: ICollectionInfo;
  itemParameters!: IGweiItemParameters;
  artBasicInfo!: IArtBasicInfo;

  hasAllowance: boolean = false;

  isError: boolean = false;
  isLoading: boolean = false;
  encodedImage: string = '';
  loaded: boolean = false;
  isUploadingToIPFS: boolean = false;
  creating: boolean = false;

  parameters: IGweiParameters = {
    isUploadingToIPFS: false,
    creating: false,
    dialog: false,
    showUpdate: false,
    parsedText: '',
    parsedInspiration: '-1',
    parsedUseRandom: 'false',
    parsedOverlay: 0,
    parsedProbability: 1,
    parsedWallType: '1',
  }

  item: IGweiItemParameters = {
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
      label: 'Wall',
      value: '1',
    },
  }

  parsedItem!: IGweiParsedItemParameters;

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
    this.clearParameters();
    this.updateInfo().catch(console.error);
  }

  clearParameters() {
    this.parameters.isUploadingToIPFS = false;
    this.parameters.creating = false;
    this.parameters.dialog = false;
    this.parameters.showUpdate = false;
    this.parameters.parsedText = '';
    this.parameters.parsedInspiration = '-1';
    this.parameters.parsedUseRandom = 'false';
    this.parameters.parsedOverlay = 0;
    this.parameters.parsedProbability = 1;
    this.parameters.parsedWallType = '1';  
  }

  async updateInfo() {
    this.hasAllowance = await this.algoPainterTokenProxy.allowance(this.account, this.gweiContractAddress);
  }
  
  generatePreview() {
    this.isError = false;
    this.isLoading = true;

    this.algoPainterTokenProxy = new AlgoPainterTokenProxy(this.networkInfo);

    console.log('this.item.probability', this.item.probability);
    console.log('(this.item.probability / 10)', (this.item.probability / 10));
    console.log('parseFloat((this.item.probability / 10).toFixed(1))', parseFloat((this.item.probability / 10).toFixed(1)));

    this.parsedItem = {
      parsedUseRandom: this.item.useRandom,
      parsedInspiration: this.item.inspiration.value,
      parsedProbability: parseFloat((this.item.probability / 10).toFixed(1)),
      parsedOverlay: parseInt(this.item.overlay.value),
      parsedOverlayOpacity: parseFloat((Number(this.item.overlayOpacity) / 10).toFixed(1)),
      parsedWallType: this.item.wallType.value,
    }

    console.log('this.parsedItem', this.parsedItem);

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const previewUrl = `${process.env.VUE_APP_GWEI_ENDPOINT}?text=mint%20test&inspiration=${this.parsedItem.parsedInspiration}&useRandom=${this.parsedItem.parsedUseRandom}&probability=${this.parsedItem.parsedProbability}&wallType=${this.parsedItem.parsedWallType}&overlay=${this.parsedItem.parsedOverlay}&overlayOpacity=${this.parsedItem.parsedOverlayOpacity}`;
    
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
      .then(() => {
        this.isLoading = false;
        this.loaded = true;
      });
  }

  async setPreviewUrl(previewUrl: string) {
    await this.$store
      .dispatch({
        type: 'mint/previewUrl',
        previewUrl: previewUrl,
        collectionName: this.collectionName,
      })
  }

  @Watch('artBasicInfo')
  onArtBasicInfoChanged() {
    this.mint().catch(console.error);
  }

  srcIPFS() {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${process.env.VUE_APP_GWEI_ENDPOINT}?text=${encodeURIComponent(this.artBasicInfo.name)}&inspiration=${this.parsedItem.parsedInspiration}&useRandom=${this.parsedItem.parsedUseRandom}&probability=${this.parsedItem.parsedProbability}&wallType=${this.parsedItem.parsedWallType}&overlay=${this.parsedItem.parsedOverlay}&overlayOpacity=${this.parsedItem.parsedOverlayOpacity}`;
  }

  isMinted: boolean = false;
  isMinting: boolean = false;
  errorMsg: string = '';

  async mint() {
    this.isMinted = false;
    this.isMinting = true;
    this.errorMsg = "";
    // this.rules();

    const payload: IGweiPayload = {
      image: this.srcIPFS(),
      text: this.artBasicInfo.name,
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

    console.log('payload', payload);

    this.isUploadingToIPFS = true;

    const ipfsData: {path: string} = await IPFSHelper.add(payload);
    
    const ipfsPath = ipfsData.path;

    const tokenURI = 'https://ipfs.io/ipfs/' + ipfsPath;

    console.log('ipfsData', ipfsData);
    console.log('tokenURI', tokenURI);
  
    this.isUploadingToIPFS = false;

    const newMint: INewMint = {
      inspiration: Number(this.parsedItem.parsedInspiration),
      text: this.artBasicInfo.name,
      useRandom: this.parsedItem.parsedUseRandom === 'true',
      probability: this.parsedItem.parsedProbability * 10,
      place: Number(this.parsedItem.parsedWallType),
      tokenURI,
      amount: Number(this.collectionInfo.batchPriceBlockchain),
    };

    console.log({ newMint });

    this.creating = true;

    this.transactionHash = await this.gweiSystem.mint(newMint, this.account, (receipt: any) => {
      this.isWaitingTransaction = false;
      this.receipt = receipt;
      this.isMinting = false;
      this.isMinted = true;
    });

    this.isWaitingTransaction = true;
  }

  transactionHash!: any;
  isWaitingTransaction: boolean = false;
  receipt!: any;

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

  get inspirationOptions() {
    return [
      {
        label: this.$t('dashboard.newPainting.gwei.inspirations.random'),
        value: 'random',
      },
      {
        label: this.$t('dashboard.newPainting.gwei.inspirations.calm'),
        value: 'calm',
      },
      {
        label: this.$t('dashboard.newPainting.gwei.inspirations.colorful'),
        value: 'colorful-blocks',
      },
      {
        label: this.$t('dashboard.newPainting.gwei.inspirations.paths'),
        value: 'colorful-paths',
      },
      {
        label: this.$t('dashboard.newPainting.gwei.inspirations.flows'),
        value: 'hot-flows',
      },
      {
        label: this.$t('dashboard.newPainting.gwei.inspirations.galaxy'),
        value: 'galaxy',
      },
      {
        label: this.$t('dashboard.newPainting.gwei.inspirations.days'),
        value: '5000-Days',
      },
    ];
  }
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