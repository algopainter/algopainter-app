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
            <p>{{ $t('dashboard.newPainting.gwei.creatorRoyalties') }}</p>
            <p>{{ $t('dashboard.newPainting.gwei.infoBtn') }}</p>
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

interface IPainting {
  text: string;
  paintOnWall: boolean;
  applyRandomColors: boolean;
  inversionProbability: number;
  inspiration: string;
  exhibition: string;
  technique: string;
}

@Options({
  components: {
    AlgoButton, 
    MyPaint,
    NewPaintingTopInfo,
  },
})
export default class NewPaintingGwei extends Vue {
  isModalOpen: boolean = false;
  painting: IPainting = {
    text: '',
    paintOnWall: false,
    applyRandomColors: false,
    inversionProbability: 50,
    inspiration: '',
    exhibition: '',
    technique: '',
  }

  inspirationValue =[
    {
      value: 'Random',
      label: 'Random',
    },
    {
      value: 'Calm',
      label: 'Calm',
    },
    {
      value: 'Colorful blocks',
      label: 'Colorful blocks',
    },
    {
      value: 'Colorful paths',
      label: 'Colorful paths',
    },
    {
      value: 'Hot flows',
      label: 'Hot flows',
    },
    {
      value: 'Galaxy',
      label: 'Galaxy',
    },
    {
      value: 'Madness',
      label: 'Madness',
    },

  ]

  exhibitionValue = [
    {
      value: 'None',
      label: 'None',
    },
    {
      value: 'Wall',
      label: 'Wall',
    },
    {
      value: 'Big Wall',
      label: 'Big Wall',
    },
    {
      value: 'Room',
      label: 'Room',
    },
    {
      value: 'Bedroom',
      label: 'Bedroom',
    },
    {
      value: 'Open Gallery',
      label: 'Open Gallery',
    },
    {
      value: 'High-Tech Gallery',
      label: 'High-Tech Gallery',
    },
    {
      value: 'PsyVerse',
      label: 'PsyVerse',
    },
  ]

  techniqueValue = [
    {
      value: 'Regular',
      label: 'Regular',
    },
    {
      value: 'Splatters and Drips',
      label: 'Splatters and Drips',
    },
    {
      value: 'Dripping Paint',
      label: 'Dripping Paint',
    },
    {
      value: 'Acrylic',
      label: 'Acrylic',
    },
    {
      value: 'Freedom',
      label: 'Freedom',
    },
    {
      value: 'Heavy Brush',
      label: 'Heavy Brush',
    },
  ]

  private : string = 'line';
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
