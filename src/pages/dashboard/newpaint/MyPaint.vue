<template>
  <q-dialog
    ref="dialog"
    v-model="paint.isModal"
    @hide="onDialogHide"
  >
    <q-card class="row q-pa-md">
      <div
        class="
          col-xs-12 col-sm-6
          items-center items-center
          justify-evenly
          q-pb-none
        "
      >
        <div class="q-pa-md">
          <div class="items-center justufy-center">
            <q-img src="../../../assets/images/painting.jpg" />
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 items-center q-pt-ms justify-evenly">
        <div class="header">
          <h4>{{ $t('dashboard.myPaint.title') }}</h4>
        </div>
        <div class="q-pa-md">
          <q-input
            v-model="paint.descriptionPaint"
            :label="$t('dashboard.myPaint.description')"
            maxlength="55"
            counter
          />
        </div>
        <div class="q-pa-md">
          <p>{{ $t('dashboard.myPaint.bidback') }}</p>
          <q-select
            v-model="paint.bidback"
            :options="royalties"
          >
            <template #append>
              <q-btn flat>
                {{ $t('dashboard.myPaint.percent') }}
              </q-btn>
            </template>
          </q-select>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6 items-center q-pa-md">
            <p>{{ $t('dashboard.myPaint.creator') }}</p>
            <q-select
              v-model="paint.royalties"
              :options="royalties"
            >
              <template #append>
                <q-btn flat>
                  {{ $t('dashboard.myPaint.percent') }}
                </q-btn>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-6 items-center q-pa-md">
            <p>{{ $t('dashboard.myPaint.investors') }}</p>
            <q-select
              v-model="paint.investors"
              :options="royalties"
            >
              <template #append>
                <q-btn flat>
                  {{ $t('dashboard.myPaint.percent') }}
                </q-btn>
              </template>
            </q-select>
          </div>
        </div>
        <div class="row justify-evenly q-gutter-xs">
          <div>
            <algo-button
              size="lg"
              color="primary"
              type="reset"
              outline
            >
              {{ $t('dashboard.myPaint.buttonReload') }}
            </algo-button>
          </div>
          <div>
            <algo-button
              size="lg"
              color="primary"
              type="submit"
              outline
              @click="OpenModal = true"
            >
              {{ $t('dashboard.myPaint.buttonRegister') }}
            </algo-button>
            <mint-modal v-model="OpenModal" />
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import MintModal from '../../collectible/MintModal.vue';
import { QDialog } from 'quasar';

interface ICreatePaint {
  descriptionPaint: string;
  bidback: number;
  royalties: number;
  investors: number;
  isModal: boolean;
}
@Options({
  components: {
    AlgoButton,
    MintModal,
  },
})
export default class MyPaint extends Vue {
  private isSale: boolean = true;
  OpenModal: boolean = false;

  paint: ICreatePaint = {
    descriptionPaint: '',
    bidback: 0,
    royalties: 0,
    investors: 0,
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

  declare $refs: {
    dialog: QDialog;
  };

  royalties = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 2.5,
      label: '2.5',
    },
    {
      value: 5,
      label: '5',
    },
    {
      value: 10,
      label: '10',
    },
  ];
}
</script>
<style scoped>
.row {
  width: 100%;
  border-radius: 2%;
  min-width: 10em;
  max-width: 70em;
}

.togglePut {
  width: 0;
}

p,
span {
  font-weight: bold;
  font-size: 1.2rem;
}

h4 {
  font-weight: bold;
  font-size: 1.9rem;
}
</style>
