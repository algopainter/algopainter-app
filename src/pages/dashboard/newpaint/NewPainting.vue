<template>
  <q-page
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
              maxlength="55"
              counter
            />
          </div>
          <div>
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
          </div>
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
            <label>{{ $t('dashboard.newPainting.yourInspiration') }}</label>
            <div class="row">
              <div>
                <q-option-group
                  v-model="painting.inspiration"
                  :options="inspirationOptions"
                  color="primary"
                />
              </div>
            </div>
          </div>
          <div class="col-12">
            <algo-button
              class="btn justify-center q-py-md"
              type="submit"
              color="primary"
              :label="$t('dashboard.newPainting.generatePainting')"
              @click="painting.isModal = true"
            />
            <q-dialog
              ref="dialog"
              v-model="painting.isModal"
              @hide="onDialogHide"
            >
              <MyPaint />
            </q-dialog>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import AlgoButton from 'components/common/Button.vue';

import Mypaint from './MyPaint.vue';

import { QDialog } from 'quasar';

@$q.dialog({
  component: Mypaint,
})

interface IPainting {
  text: string;
  paintOnWall: boolean;
  applyRandomColors: boolean;
  inversionProbability: number;
  inspiration: string;
  isModal: boolean;
}

@Options({
  components: { AlgoButton, Mypaint },
})
export default class NewPainting extends Vue {
  painting: IPainting = {
    text: '',
    paintOnWall: false,
    applyRandomColors: false,
    inversionProbability: 50,
    inspiration: 'random',
    isModal: false,
  };

  show() {
    console.log('teste3333');
    this.$refs.dialog.show();
  }

  hide() {
    console.log('teste');
    this.$refs.dialog.hide();
  }

  onDialogHide() {
    console.log('test7777');
    this.$emit('hide');
  }

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

  declare $refs:{
    dialog: QDialog
  };
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
