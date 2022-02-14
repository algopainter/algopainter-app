<template>
  <div class="row">
    <div
      v-if="!isPreviewingForm"
      :class="[$q.screen.lt.sm || $q.screen.lt.md ? 'q-pa-sm' : 'col-6 q-pa-sm']"
    >
      <q-form class="api-parameters">
        <h4 class="q-mb-md">Collection Info</h4>
        <q-input
          v-model.trim="collectionInfo.api"
          label="API"
          class="col-6 q-pr-md"
          stack-label
          :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
        />
        <q-checkbox
          v-model="collectionInfo.isSpecialParamsChecked"
          color="primary"
          :label="$t('dashboard.createCollection.stepThree.hasSpecialParams')"
        />
        <div
          v-if="!collectionInfo.isSpecialParamsChecked"
          class="parameter-card q-pa-md q-my-md"
        >
          <q-checkbox
            v-model="collectionInfo.isSizeInUrlChecked"
            color="primary"
            :label="$t('dashboard.createCollection.stepThree.hasSizeInUrl')"
          />
          <div class="row">
            <q-input
              v-model.number="collectionInfo.width"
              label="Preview image width"
              class="col-6 q-pr-md"
              mask="#"
              fill-mask="0"
              reverse-fill-mask
            />
            <q-input
              v-model.number="collectionInfo.width"
              label="Preview image height"
              class="col-6 q-pl-md"
              mask="#"
              fill-mask="0"
              reverse-fill-mask
            />
          </div>
        </div>
        <h4 class="q-mb-md">Fixed Parameters</h4>
        <div
          v-for="(param, i) in fixedParams"
          :key="i"
          class="parameter-card q-pa-md q-my-md"
        >
          <div class="row items-center justify-between">
            <p class="parameter-label">
              {{ `Fixed parameter Nº ${i + 1}:` }}
            </p>
            <q-icon
              name="remove_circle"
              color="grey-4"
              size="25px"
              class="cursor-pointer"
              @click="removeFixedParam(i)"
            />
          </div>
          <div class="row">
            <q-input
              v-model.trim="fixedParams[i].name"
              label="name"
              class="col-6 q-pr-md"
              :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
            />
            <q-input
              v-model.trim="fixedParams[i].value"
              class="col-6 q-pl-md"
              label="value"
              :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
            />
          </div>
        </div>
        <q-btn
          flat
          class="q-mr-sm"
          @click="addFixedParam()"
        >
          <q-icon
            name="add_circle"
            color="grey-4"
            class="q-mr-sm"
            size="30px"
          />
          Add fixed parameter
        </q-btn>
        <h4 class="q-mb-md">Collection Parameters</h4>
        <div
          v-for="(param, i) in params"
          :key="i"
          class="parameter-card q-pa-md q-my-md"
        >
          <div class="row items-center justify-between">
            <p class="parameter-label">
              {{ `Parameter Nº ${i + 1}:` }}
            </p>
            <q-icon
              name="remove_circle"
              color="grey-4"
              size="25px"
              class="cursor-pointer"
              @click="removeParam(i)"
            />
          </div>
          <div class="row">
            <q-input
              v-model.trim="params[i].name"
              label="name"
              class="col-6 q-pr-md"
              :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
            />
            <q-input
              v-model.trim="params[i].label"
              class="col-6 q-pl-md"
              label="label"
              :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
            />
          </div>
          <q-select
            v-model="params[i].fieldType"
            label="Field type"
            :options="fieldTypeOptions"
            @update:model-value="fieldTypeUpdateDefaultValue(i)"
          />
          <div
            v-if="params[i].fieldType === 'Input Textfield'"
            class="data-type-field row q-pa-md q-my-md"
          >
            <q-select
              v-model="params[i].dataType"
              label="Data type"
              class="col-6 q-pr-md"
              :options="dataTypeOptions"
              @update:model-value="dataTypeUpdateDefaultValue(i)"
            />
            <q-input
              v-model.number="params[i].maxLength"
              label="Max length"
              class="col-6 q-pl-md"
              mask="#"
              fill-mask="0"
              reverse-fill-mask
            />
          </div>
          <form-select
            v-if="params[i].fieldType === 'Select'"
            :params="params"
            :i="i"
          />
          <div
            v-if="params[i].fieldType === 'Slider'"
            class="min-max-field row q-pa-md q-my-md"
          >
            <q-input
              v-model.number="params[i].min"
              label="Min"
              class="col-6 q-pr-md"
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              :rules="[ val => validateMin(val, i) || minFieldErrMsg ]"
            />
            <q-input
              v-model.number="params[i].max"
              label="Max"
              class="col-6 q-pl-md"
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              :rules="[ val => validateMax(val, i) || maxFieldErrMsg ]"
            />
          </div>
          <div class="default-value-field">
            <p
              v-if="params[i].fieldType === 'Slider'"
              class="label"
            >
              Default value
            </p>
            <q-input
              v-if="params[i].fieldType === 'Input Textfield'"
              v-model.trim="params[i].defaultValue"
              label="Default value"
              stack-label
              :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
            />
            <q-select
              v-else-if="params[i].fieldType === 'Select'"
              v-model="params[i].defaultValue"
              label="Default value"
              stack-label
              :options="params[i].options"
            />
            <q-checkbox
              v-else-if="params[i].fieldType === 'Checkbox'"
              v-model="params[i].defaultValue"
              label="Default value"
            />
            <q-slider
              v-else-if="params[i].fieldType === 'Slider'"
              v-model="params[i].defaultValue"
              label
              :marker-labels="setMarkers(i)"
              :min="Number(params[i].min)"
              :max="Number(params[i].max)"
            />
          </div>
        </div>
        <div class="q-pt-md">
          <q-checkbox
            v-model="isFeeChecked"
            color="primary"
            :label="$t('dashboard.createCollection.stepThree.feeChecked', {fee: '0.1'})"
          />
          <q-checkbox
            v-model="isPreviewUrlChecked"
            color="primary"
            :label="$t('dashboard.createCollection.stepThree.previewUrlChecked')"
          />
        </div>
        <q-input
          v-model="generatePreviewUrl"
          readonly
        >
        </q-input>
      </q-form>
      <q-btn
        flat
        class="q-mt-sm"
        @click="addParam()"
      >
        <q-icon
          name="add_circle"
          color="grey-4"
          size="30px"
        />
        Add parameter
      </q-btn>
    </div>
    <div
      v-if="isPreviewingForm || !isSmallDevice"
      :class="[$q.screen.lt.sm || $q.screen.lt.md ? 'q-pa-sm' : 'col-6 q-pa-sm']"
    >
      <form-previewer :params="params" />
    </div>
  </div>
  <q-page-sticky
    v-if="isSmallDevice"
    position="bottom-right"
    :offset="[18, 18]"
  >
    <q-btn
      fab
      icon="preview"
      color="primary"
      :label="[isPreviewingForm ? $t('dashboard.createCollection.stepThree.goBack') : $t('dashboard.createCollection.stepThree.previewForm')]"
      @click="isPreviewingForm = !isPreviewingForm"
    />
  </q-page-sticky>
  <error v-if="(isError || isEmptyFieldError || isMinMaxError) && isVerifyingTheForm" :error-msg="errorMsg" />
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import { IFormParams, ICollectionNFTCreationAPI } from 'src/models/ICreatorCollection'
import FormPreviewer from './FormPreviewer.vue';
import FormSelect from './FormSelect.vue';
import { Watch } from 'vue-property-decorator';
import Error from './Error.vue';
import { QSelect } from 'quasar';

class Props {
  step = prop({
    type: Number,
    required: true,
  });

  checkForm = prop({
    type: String,
    required: true,
  });
}

@Options({
  components: {
    FormPreviewer,
    FormSelect,
    Error
  },
})

export default class APIParameters extends Vue.with(Props) {
  declare $refs: {
    artistName: QSelect;
  };

  collectionInfo = {
    api: 'https://myapi.app/api/',
    isSpecialParamsChecked: false,
    isSizeInUrlChecked: false,
    width: 400,
    height: 400
  }

  fixedParams = [
    {
      name: 'fixed name',
      value: 'fixed value'
    }
  ]

  params: IFormParams[] = [
    {
      name: 'name',
      label: 'Enter a name',
      dataType: 'string',
      maxLength: 64,
      fieldType: 'Input Textfield',
      options: [
        {
          label: 'option label',
          value: 'option value'
        }
      ],
      min: 0,
      max: 10,
      defaultValue: 'default'
    }
  ]

  dataTypeOptions = [
    'string', 'number'
  ]

  fieldTypeOptions = [
    'Input Textfield', 'Select', 'Checkbox', 'Slider'
  ]

  isPreviewUrlChecked: boolean = false;
  isFeeChecked: boolean = false;
  isError: boolean = false;
  isEmptyFieldError: boolean = false;
  errorMsg: string = '';
  emptyFieldErrMsg: string = '';
  minFieldErrMsg: string = '';
  maxFieldErrMsg: string = '';
  isMinMaxError: boolean = false;
  defaultFieldErrMsg: string = '';
  defaultFieldError: boolean = false;
  isVerifyingTheForm: boolean = false;
  isPreviewingForm: boolean = false;
  windowWidth: number = window.innerWidth;
  isSmallDevice!: boolean;

  created() {
    this.isSmallDevice = (this.windowWidth < 1024);
  }

  mounted() {
    this.$nextTick(() => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      window.addEventListener('resize', this.updateWindowWidth);
    }).catch(console.error);
  }

  beforeDestroy() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    window.removeEventListener('resize', this.updateWindowWidth);
  }

  updateWindowWidth() {
    this.windowWidth = window.innerWidth;
  }

  @Watch('windowWidth')
  onWindowWidthChanged() {
    this.isSmallDevice = (this.windowWidth < 1024);
  }

  addParam() {
    this.params.push(
      {
        name: 'name',
        label: 'Enter a name',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Input Textfield',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 0,
        defaultValue: 'default'
      }
    )
  }

  addFixedParam() {
    this.fixedParams.push(
      {
        name: 'fixed name',
        value: 'fixed value'
      }
    )
  }

  get generatePreviewUrl() {
    let previewUrl: string = this.collectionInfo.api + '?';

    if (!this.collectionInfo.isSpecialParamsChecked) {
      if (this.collectionInfo.isSizeInUrlChecked) {
        previewUrl += `size=${this.collectionInfo.width}x${this.collectionInfo.height}&`;
      } else {
        previewUrl += `width=${this.collectionInfo.width}&height=${this.collectionInfo.height}&`;
      }
    }

    this.fixedParams.forEach((param) => {
      previewUrl += `${param.name}=${param.value.toString()}&`
    })

    this.params.forEach((param, i) => {
      previewUrl += `${param.name}=${param.defaultValue.toString()}`

      if ((i + 1) !== this.params.length) {
        previewUrl += '&'
      }
    })
    const searchRegExp = /\s/g;

    return previewUrl.replace(searchRegExp, '%20');
  }

  fieldTypeUpdateDefaultValue(i: number) {
    switch (this.params[i].fieldType) {
      case 'Input Textfield':
        this.params[i].defaultValue = '';
        break;
      case 'Select':
        this.params[i].defaultValue = this.params[i].options[0].label;
        break;
      case 'Checkbox':
        this.params[i].defaultValue = false;
        break;
      case 'Slider':
        this.params[i].defaultValue = Number(this.params[i].min);
    }
  }

  dataTypeUpdateDefaultValue(i: number) {
    switch (this.params[i].dataType) {
      case 'string':
        this.params[i].defaultValue = '';
        break;
      case 'number':
        this.params[i].defaultValue = 0;
    }
  }

  setMarkers(i: number) {
    let markers!: [{ value: number, label: string }];

    for (let iteration: number = Number(this.params[i].min); iteration <= Number(this.params[i].max); iteration++) {
      iteration === Number(this.params[i].min)
        ? markers = [{ value: iteration, label: iteration.toString() }]
        : markers.push({ value: iteration, label: iteration.toString() });
    }

    return markers;
  }

  removeParam(i: number) {
    this.params.splice(i, 1);
  }

  removeFixedParam(i: number) {
    this.fixedParams.splice(i, 1);
  }

  validateMin(val: number, i: number) {
    if (val > this.params[i].max) {
      this.minFieldErrMsg = this.$t('dashboard.createCollection.stepThree.minError');
    } else if (val === this.params[i].max) {
      this.minFieldErrMsg = this.$t('dashboard.createCollection.stepThree.minMaxError');
    } else {
      this.isMinMaxError = false;
      return true;
    }

    this.isMinMaxError = true;
    return false;
  }

  validateMax(val: number, i: number) {
    if (val < this.params[i].min) {
      this.maxFieldErrMsg = this.$t('dashboard.createCollection.stepThree.maxError');
    } else if (val === this.params[i].min) {
      this.maxFieldErrMsg = this.$t('dashboard.createCollection.stepThree.minMaxError');
    } else {
      this.isMinMaxError = false;
      return true;
    }

    this.isMinMaxError = true;
    return false;
  }

  validateIfEmpty(val: string) {
    if (val === '') {
      this.emptyFieldErrMsg = this.$t('dashboard.createCollection.stepThree.fieldRequired');
    } else {
      this.isEmptyFieldError = false;
      return true;
    }

    this.isEmptyFieldError = true;
    return false;
  }

  verifyForm() {
    this.isVerifyingTheForm = true;

    if (this.isEmptyFieldError) {
      this.errorMsg = this.$t('dashboard.createCollection.stepThree.emptyFieldError');
    } else if (!this.isFeeChecked) {
      this.errorMsg = this.$t('dashboard.createCollection.stepThree.feeError');
    } else if (!this.isPreviewUrlChecked) {
      this.errorMsg = this.$t('dashboard.createCollection.stepThree.previewUrlError');
    } else if (this.isMinMaxError) {
      this.errorMsg = this.$t('dashboard.createCollection.stepThree.minMaxGeneralError');
    } else if (this.params.length === 0) {
      this.errorMsg = this.$t('dashboard.createCollection.stepThree.noParamsError');
    } else {
      this.isError = false;
      this.isVerifyingTheForm = false;
      return true;
    }

    this.isError = true;
    return false;
  }

  @Watch('checkForm')
  onCheckFormErrorChanged() {
    if (this.checkForm) {
      if (this.verifyForm()) {
        const data: ICollectionNFTCreationAPI = {
          url: this.collectionInfo.api,
          parameters: this.params
        }

        this.$emit('verify', true);
        this.$emit('data', data, this.step);
      } else {
        this.$emit('verify', false);
      }
    }
  }
}
</script>

<style scoped lang="scss">
  p {
    margin: 0px;
  }

  .api-parameters {
    .parameter-label {
      font-size: 15px;
      margin-bottom: 0px;
      color: rgb(0, 0 , 0);
      font-weight: 400;
    }

    .label {
      margin: 0px;
      position: relative;
      top: 15px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 400;
    }
  }

  .parameter-card,
  .min-max-field,
  .data-type-field {
    border: 1px $primary solid;
    border-radius: 5px;
  }

  a {
    text-decoration: none;
    color: #333;
  }

</style>
