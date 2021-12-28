<template>
  <div class="title">
    {{ $t('dashboard.newPainting.parameters') }}
  </div>
  <q-select
    v-model="NewArtFields.fieldA"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelA })"
    :options="fieldAOptions"
    class="full-width"
  />
  <q-select
    v-model="NewArtFields.fieldB"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelB })"
    :options="fieldBOptions"
  />
  <q-select
    v-model="NewArtFields.fieldC"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelC })"
    :options="fieldCOptions"
  />
  <q-select
    v-model="NewArtFields.fieldD"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelD })"
    :options="fieldDOptions"
  />
  <q-radio
    v-model="NewArtFields.fieldE"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelE })"
    class="full-width q-pt-sm"
    :val="true"
  />
  <div class="algo-slider">
    <p class="label">{{ $t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelF }) }}</p>
    <q-slider
      v-model="NewArtFields.fieldF"
      :min="0"
      :max="50"
    />
  </div>
  <q-radio
    v-model="NewArtFields.fieldG"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelG })"
    class="full-width q-pt-sm"
    :val="true"
  />
  <q-select
    v-model="NewArtFields.fieldH"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelH })"
    :options="fieldHOptions"
  />
  <div class="algo-slider">
    <p class="label">{{ $t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelI }) }}</p>
    <q-slider
      v-model="NewArtFields.fieldI"
      :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelI })"
      :min="0"
      :max="50"
    />
  </div>
  <q-select
    v-model="NewArtFields.fieldJ"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelJ })"
    :options="fieldIOptions"
  />
  <div class="algo-slider">
    <p class="label">{{ $t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelK }) }}</p>
    <q-slider
      v-model="NewArtFields.fieldK"
      :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelK })"
      :min="0"
      :max="50"
    />
  </div>
  <q-radio
    v-model="NewArtFields.fieldL"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelL })"
    class="full-width q-pt-sm"
    :val="false"
  />
  <q-radio
    v-model="NewArtFields.fieldM"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelM })"
    class="full-width q-pt-sm"
    :val="false"
  />
  <algo-button
    :label="$t('dashboard.newPainting.leftInfoBtnName')"
    :class="[$q.screen.lt.sm || $q.screen.lt.md ? 'full-width q-mt-lg q-mb-lg' : 'full-width q-mt-lg']"
    color="primary"
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
import { Ref } from 'vue-property-decorator';
import { QDialog } from 'quasar';
import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterExpressionsProxy from 'src/eth/AlgoPainterExpressionsItemProxy';
import AlgoPainterTokenProxy from 'src/eth/AlgoPainterTokenProxy';
// import { getExpressionItemContractByNetworkId } from 'src/eth/Config';
// import { IExpressionsCollection } from 'src/models/INewPaintingExpressions';
import { ICollectionInfo, IArtBasicInfo } from 'src/models/IMint';
// import IPFSHelper from "src/helpers/IPFSHelper";
import MintDialog from 'pages/dashboard/newpaint/MintDialog.vue';
import AlgoButton from 'components/common/Button.vue';
import { mapGetters } from 'vuex';
import { paint } from 'src/workers/painting.worker';
import CollectionController from 'src/controllers/collection/CollectionController';

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
        collectionInfo: 'GET_EXPRESSIONS_COLLECTION_INFO',
        artBasicInfo: 'GET_EXPRESSIONS_COLLECTION_INFO',
        userConfirmations: 'GET_EXPRESSIONS_COLLECTION_INFO',
        isMinting: 'GET_EXPRESSIONS_COLLECTION_INFO',
      }),
  }
})
export default class NewPaintingLeftInfoExpressions extends Vue.with(Props) {
  @Ref() dialogRef!: QDialog;

  expressionsSystem!: AlgoPainterExpressionsProxy;
  algoPainterTokenProxy!: AlgoPainterTokenProxy;
  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  account!: string;
  collectionInfo!: ICollectionInfo;
  artBasicInfo!: IArtBasicInfo;
  userConfirmations!: boolean;
  isMinting!: boolean;

  mintStatus: MintStatus | null = null;
  isMintDialogOpen: boolean = false;

  collection!: any; 

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

  NewArtFields = {
    fieldA: 'Bitcoin',
    fieldB: 'Female',
    fieldC: 'Angry',
    fieldD: 'SpaceCode',
    fieldE: true,
    fieldF: 0,
    fieldG: true,
    fieldH: 'Add',
    fieldI: 0,
    fieldJ: 'Fractal Perception',
    fieldK: 0,
    fieldL: false,
    fieldM: false,
  }

  created() {
    if (this.isConnected) {
      this.algoPainterTokenProxy = new AlgoPainterTokenProxy(this.networkInfo)
      this.expressionsSystem = new AlgoPainterExpressionsProxy(this.networkInfo)
    }
  }

  mounted() {
    this.loadData();
  }

  isConfigured: boolean = false;

  loadData() {
    const collectionController = new CollectionController();

    this.collection = collectionController.getCollectionById(1);

    if (!this.isConfigured) {
      this.setFormInitialState();
    }
  }

  isError: boolean = false;
  errorMessage: string = "";
  encodedImage: string = "";
  paintingInfo: any = {};

  setFormInitialState() {
    this.isError = false;
    this.errorMessage = "";
    this.isConfigured = true;
    this.encodedImage = this.collection.artist.avatar;
    const parsedPaintingInfo: any = {};

    for (const parameter of this.collection.parameters) {
      parsedPaintingInfo[parameter.name] = parameter.defaultValue;
    }

    this.paintingInfo = Object.assign({}, parsedPaintingInfo);

    console.log(this.paintingInfo);
  }

  isLoading: boolean = false;
  loaded: boolean = false;

  async generatePreview() {
    this.expressionsSystem = new AlgoPainterExpressionsProxy(this.networkInfo)

    this.isError = false;
    this.isLoading = true;
    this.encodedImage = await paint(this.collection, this.paintingInfo, false);
    this.isLoading = false;
    this.loaded = true;
  }

  /*
    const getBase64FromUrl = async (url: string) => {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = () => {
          const base64data = reader.result;   
          resolve(base64data);
        }
      });
    }

    const base64 = await getBase64FromUrl(url)

    console.log('base64', base64);
    console.log('base64.data', base64);

    const payload = {
      ...this.artBasicInfo,
      mintedBy: this.account,
      base64,
    }
  */

  onCloseStatusDialog() {
    this.isMintDialogOpen = false;

    if (this.mintStatus === MintStatus.ImageMinted) {
      this.dialogRef.hide();
    }
  }

  fieldAOptions = [
    {
      value: '0',
      label: 'Bitcoin',
    },
    {
      value: '1',
      label: 'Block Saturation',
    },
    {
      value: '2',
      label: 'Inner Circuit',
    },
    {
      value: '3',
      label: 'High Voltage',
    },
    {
      value: '4',
      label: 'Mars',
    },
  ]

  fieldBOptions = [
    {
      value: '0',
      label: 'Female',
    },
    {
      value: '1',
      label: 'Male',
    },
  ]

  fieldCOptions = [
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

  fieldDOptions = [
    {
      value: '0',
      label: 'Space Code',
    },
    {
      value: '1',
      label: 'Deep Tracking',
    },
    {
      value: '2',
      label: 'Nebula Metrics',
    },
    {
      value: '3',
      label: 'Plasma',
    },
    {
      value: '4',
      label: 'Galaxy Node',
    },
  ]

  fieldHOptions = [
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
      value: '6',
      label: 'Multiply',
    },
  ]

  fieldIOptions = [
    {
      value: '0',
      label: 'Fractal Perception',
    },
    {
      value: '1',
      label: 'Soul Link',
    },
    {
      value: '2',
      label: 'Magnetic Fields',
    },
    {
      value: '3',
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