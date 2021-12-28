<!--
<template>
  <new-painting-top-info :collection="'gwei'"></new-painting-top-info>
  <div
    id="new-painting-gwei"
    class="row q-pb-lg"
  >
    <div 
      class="col-12 col-sm-6 q-py-lg flex flex-center img-container"
    >
      <q-img
        src="../../../assets/images/hashly-gwei.svg"
        class="img"
      />
    </div>
    <div class="col-12 col-sm-6 column justify-center">
      <div>
        <div class="q-col-gutter-md">
          <div>
            <q-input
              v-model="painting.text"
              :label="$t('dashboard.newPainting.gwei.typeAText')"
              maxlength="64"
              counter
            />
          </div>
          <div>
            <label>{{ $t('dashboard.newPainting.gwei.randomColors') }}</label>
            <div class="row q-col-gutter-md">
              <q-radio
                v-model="painting.applyRandomColors"
                :val="true"
                :label="$t('dashboard.newPainting.gwei.yesLabel')"
              />
              <q-radio
                v-model="painting.applyRandomColors"
                :val="false"
                :label="$t('dashboard.newPainting.gwei.noLabel')"
              />
            </div>
          </div>
          <div v-show="painting.applyRandomColors">
            <label>
              {{ $t('dashboard.newPainting.gwei.colorInversionProbability') }}
            </label>
            <q-slider
              v-model="painting.inversionProbability"
              color="primary"
              :min="0"
              :max="50"
            />
          </div>
          <div>
            <q-select
              v-model="painting.inspiration"
              :label="$t('dashboard.newPainting.gwei.inspirations')"
              :options="inspirationValue"
            />
          </div>
          <div>
            <q-select
              v-model="painting.exhibition"
              :label="$t('dashboard.newPainting.gwei.exhibition')"
              :options="exhibitionValue"
            />
          </div>
          <div>
            <q-select
              v-model="painting.technique"
              :label="$t('dashboard.newPainting.gwei.technique')"
              :options="techniqueValue"
            />
          </div>
          <div class="info">
            <p class="cursor-pointer">{{ $t('dashboard.newPainting.gwei.creatorRoyalties') }}</p>
            <p class="cursor-pointer">{{ $t('dashboard.newPainting.gwei.infoBtn') }}</p>
          </div>
          <div class="row justify-center btn-container">
            <algo-button
              class="btn justify-center q-py-md"
              type="submit"
              color="primary"
              :label="$t('dashboard.newPainting.gwei.generatePainting')"
              @click="isModalOpen = true"
            />
          </div>
          <my-paint v-model="isModalOpen" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import MyPaint from './MyPaint.vue';
import NewPaintingTopInfo from './NewPaintingTopInfo.vue';
import { mapGetters } from 'vuex';
import { IGweiFields, IGweiParameters } from 'src/models/INewPaintingGwei';
import AlgoPainterGweiProxy from 'src/eth/AlgoPainterGweiItemProxy';
import AlgoPainterTokenProxy from 'src/eth/AlgoPainterTokenProxy';
import { NetworkInfo } from 'src/store/user/types';
import { Watch } from 'vue-property-decorator';
import { getGweiItemContractByNetworkId } from 'src/eth/Config';

@Options({
  components: {
    AlgoButton, 
    MyPaint,
    NewPaintingTopInfo,
  },
  computed: {
    ...mapGetters(
      'user', [
        'networkInfo',
        'account',
        'isConnected',
      ]),
  }
})
export default class NewPaintingGwei extends Vue {
  gweiSystem!: AlgoPainterGweiProxy;
  algoPainterTokenProxy!: AlgoPainterTokenProxy;
  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  account!: string;

  isModalOpen: boolean = false;

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

  hasAllowance: boolean = false;
  mintedImagesAmount!: number;
  minAmount: number = 0;
  totalSupply: number = 0;
  tokensToBurn: number = 0;

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
    this.mintedImagesAmount = await this.gweiSystem.totalSupply();
    this.minAmount = await this.gweiSystem.getCurrentAmount(this.mintedImagesAmount);
    this.tokensToBurn = await this.gweiSystem.getAmountToBurn();
  }

  painting: IGweiFields = {
    text: '',
    paintOnWall: false,
    applyRandomColors: false,
    inversionProbability: 50,
    inspiration: '',
    exhibition: '',
    technique: '',
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
#new-painting-gwei {
  padding: 40px;
  color: $primary;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='15' ry='15' stroke='DeepPink' stroke-width='5' stroke-dasharray='6%2c 14' stroke-dashoffset='21' stroke-linecap='round'/%3e%3c/svg%3e");
  border-radius: 15px;
  .img-container {
    .img {
      padding: 40px;
      height: 429px;
      width: 230px;
      border: none;
    }
  }
  .span-label {
    display: flex;
    align-items: center;
  }
  .btn-container {
    .btn {
      width: 100%;
      padding: 10px;
    }
  }
  .info > p {
    margin-bottom: 0px;
  }
}
@media(max-width: 768px) {
  #new-painting-gwei {
    padding: 16px;
  }
}
</style>
-->
