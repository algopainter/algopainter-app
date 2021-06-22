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
        <div class="col-xs-12 col-sm-6 items-center q-px-md">
          <span>{{ $t('dashboard.myPaint.sale') }}</span>
          <q-toggle
            v-model="isSale"
            size="xl"
            class="togglePut"
          />
        </div>
        <div class="q-pa-md">
          <p>{{ $t('dashboard.myPaint.bidback') }}</p>
          <q-input
            v-model="paint.bidback"
            type="number"
            min="0"
            max="99"
            onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          >
            <template #append>
              <q-icon name="%" />
            </template>
          </q-input>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6 items-center q-pa-md">
            <p>{{ $t('dashboard.myPaint.creator') }}</p>
            <q-input
              v-model="paint.royalties"
              type="number"
              min="0"
              max="99"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57"
            >
              <template #append>
                <q-icon name="%" />
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-6 items-center q-pa-md">
            <p>{{ $t('dashboard.myPaint.investors') }}</p>
            <q-input
              v-model="paint.investors"
              type="number"
              min="0"
              max="99"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57"
            >
              <template #append>
                <q-icon name="%" />
              </template>
            </q-input>
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
            >
              {{ $t('dashboard.myPaint.buttonRegister') }}
            </algo-button>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
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
  },
})
export default class MyPaint extends Vue {
  private isSale: boolean = true;

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

   declare $refs:{
    dialog: QDialog;
  };
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
