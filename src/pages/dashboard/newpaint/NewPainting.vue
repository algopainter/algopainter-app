<template>
  <div
    id="new-painting"
    class="row q-pb-lg"
  >
    <div class="col-12 col-sm-6 q-pa-lg flex flex-center">
      <q-img
        src="../../../assets/images/hashly-gwei.svg"
        class="img"
      />
    </div>
    <div class="col-12 col-sm-6 column justify-center">
      <div>
        <div class="header q-py-md">
          {{ $t('dashboard.newPainting.create') }}
        </div>
        <div class="q-col-gutter-md">
          <div>
            <q-input
              v-model="painting.text"
              :label="$t('dashboard.newPainting.typeAText')"
              maxlength="64"
              counter
            />
          </div>
          <!--
            <label>{{ $t('dashboard.newPainting.paintOnWall') }}</label>
            <div class="row q-col-gutter-md">
              <q-radio
                v-model="painting.paintOnWall"
                :val="true"
                :label="$t('dashboard.newPainting.yesLabel')"
              />
              <q-radio
                v-model="painting.paintOnWall"
                :val="false"
                :label="$t('dashboard.newPainting.noLabel')"
              />
            </div>
            -->
          <div>
            <label>{{ $t('dashboard.newPainting.randomColors') }}</label>
            <div class="row q-col-gutter-md">
              <q-radio
                v-model="painting.applyRandomColors"
                :val="true"
                :label="$t('dashboard.newPainting.yesLabel')"
              />
              <q-radio
                v-model="painting.applyRandomColors"
                :val="false"
                :label="$t('dashboard.newPainting.noLabel')"
              />
            </div>
          </div>
          <div v-show="painting.applyRandomColors">
            <label>
              {{ $t('dashboard.newPainting.colorInversionProbability') }}
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
              :label="$t('dashboard.newPainting.inspirations')"
              :options="inspirationValue"
            />
          </div>
          <div>
            <q-select
              v-model="painting.exhibition"
              :label="$t('dashboard.newPainting.exhibition')"
              :options="exhibitionValue"
            />
          </div>
          <div>
            <q-select
              v-model="painting.technique"
              :label="$t('dashboard.newPainting.technique')"
              :options="techniqueValue"
            />
          </div>
          <div class="row justify-center">
            <algo-button
              class="btn justify-center q-py-md"
              type="submit"
              color="primary"
              :label="$t('dashboard.newPainting.generatePainting')"
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
  components: { AlgoButton, MyPaint },
})
export default class NewPainting extends Vue {
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
        label: this.$t('dashboard.newPainting.inspirations.random'),
        value: 'random',
      },
      {
        label: this.$t('dashboard.newPainting.inspirations.calm'),
        value: 'calm',
      },
      {
        label: this.$t('dashboard.newPainting.inspirations.colorful'),
        value: 'colorful-blocks',
      },
      {
        label: this.$t('dashboard.newPainting.inspirations.paths'),
        value: 'colorful-paths',
      },
      {
        label: this.$t('dashboard.newPainting.inspirations.flows'),
        value: 'hot-flows',
      },
      {
        label: this.$t('dashboard.newPainting.inspirations.galaxy'),
        value: 'galaxy',
      },
      {
        label: this.$t('dashboard.newPainting.inspirations.days'),
        value: '5000-Days',
      },
    ];
  }
}
</script>

<style lang="scss" scoped>
#new-painting {
  .img {
    height: 429px;
    width: 230px;
    border: none;
  }

  .span-label {
    display: flex;
    align-items: center;
  }
  .btn {
    width: 50%;
  }
}
</style>
