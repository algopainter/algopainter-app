<template>
  <div class="row">
    <div
      v-if="!isPreviewingForm"
      :class="[$q.screen.lt.sm || $q.screen.lt.md ? 'q-pa-sm' : 'col-6 q-pa-sm']"
    >
      <q-form class="api-parameters">
        <h5 class="text-bold">Collection Information</h5>
        <q-input
          ref="collectionAPI"
          v-model.trim="collectionInfo.api"
          placeholder="https://myapi.app/api/"
          label="API:"
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
              ref="collectionWidth"
              v-model.number="collectionInfo.width"
              label="Preview image width"
              placeholder="400"
              class="col-6 q-pr-md"
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
            />
            <q-input
              ref="collectionHeight"
              v-model.number="collectionInfo.height"
              placeholder="400"
              label="Preview image height"
              class="col-6 q-pl-md"
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
            />
          </div>
        </div>
        <h5 class="text-bold">Fixed Parameters</h5>
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
              ref="fixedParamsName"
              v-model.trim="fixedParams[i].name"
              label="name:"
              class="col-6 q-pr-md"
              :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
            />
            <q-input
              ref="fixedParamsValue"
              v-model.trim="fixedParams[i].value"
              class="col-6 q-pl-md"
              label="value:"
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
        <h5 class="text-bold">Collection Parameters</h5>
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
              ref="paramsName"
              v-model.trim="params[i].name"
              label="name:"
              class="col-6 q-pr-md"
              :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
            />
            <q-input
              ref="paramsLabel"
              v-model.trim="params[i].label"
              class="col-6 q-pl-md"
              label="label:"
              :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
            />
          </div>
          <q-select
            v-model="params[i].fieldType"
            label="Field type:"
            :options="fieldTypeOptions"
            @update:model-value="fieldTypeUpdateDefaultValue(i)"
          />
          <div
            v-if="params[i].fieldType === 'Input Textfield'"
            class="data-type-field row q-pa-md q-my-md"
          >
            <q-select
              v-model="params[i].dataType"
              label="Data type:"
              class="col-6 q-pr-md"
              :options="dataTypeOptions"
              @update:model-value="dataTypeUpdateDefaultValue(i)"
            />
            <q-input
              v-if="params[i].dataType === 'string'"
              ref="paramsMaxLength"
              v-model.number="params[i].maxLength"
              label="Max length:"
              class="col-6 q-pl-md"
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
            />
          </div>
          <div v-if="params[i].fieldType === 'Select'">
            <form-select
              :params="params"
              :i="i"
              :check-form="verifyFormSelect"
              @verify="checkIfFormSelectIsVerified"
            />
            <q-input
              ref="maxOptions"
              v-model.number="params[i].maxValues"
              label="Max selections:"
              class="col-6 q-pr-md"
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
            />
          </div>
          <div
            v-if="params[i].fieldType === 'Slider'"
            class="min-max-field row q-pa-md q-my-md"
          >
            <q-input
              ref="paramsMin"
              v-model.number="params[i].min"
              label="Min:"
              class="col-6 q-pr-md"
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              :rules="[ val => validateMin(val, i) || minFieldErrMsg ]"
            />
            <q-input
              ref="paramsMax"
              v-model.number="params[i].max"
              label="Max:"
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
              class="label q-pb-md"
            >
              Default value
            </p>
            <q-input
              v-if="params[i].fieldType === 'Input Textfield'"
              ref="paramsDefault"
              v-model.number="params[i].defaultValue"
              label="Default value:"
              :type="type(i)"
              :maxlength="params[i].maxLength"
            />
            <q-select
              v-else-if="params[i].fieldType === 'Select'"
              ref="paramsQSelectDefault"
              v-model="params[i].defaultValue"
              label="Default value:"
              stack-label
              :options="params[i].options"
            />
            <q-checkbox
              v-else-if="params[i].fieldType === 'Checkbox'"
              v-model="params[i].defaultValue"
              label="Default value:"
            />
            <q-slider
              v-else-if="params[i].fieldType === 'Slider'"
              v-model="params[i].defaultValue"
              label
              :min="Number(params[i].min)"
              :max="Number(params[i].max)"
            />
          </div>
        </div>
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
        <q-checkbox
          v-model="isPreviewUrlChecked"
          :label="$t('dashboard.createCollection.stepThree.previewUrlChecked')"
          class="q-pt-md"
          color="primary"
        />
        <q-input
          v-model="generatePreviewUrl"
          readonly
        />
        <p style="margin-top:24px;">{{ $t('dashboard.createCollection.stepThree.help') }}</p>
      </q-form>
    </div>
    <div
      v-if="isPreviewingForm || !isSmallDevice"
      :class="[$q.screen.lt.sm || $q.screen.lt.md ? 'q-pa-sm full-width' : 'col-6 q-pa-sm']"
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
import { IFormParams, ICollectionNFTCreationAPI, IFormFixedParams, IFormCollectionInfo } from 'src/models/ICreatorCollection';
import FormPreviewer from './FormPreviewer.vue';
import FormSelect from './FormSelect.vue';
import { Watch } from 'vue-property-decorator';
import Error from './Error.vue';
import { QInput, QSelect } from 'quasar';

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
    collectionAPI: QInput;
    collectionWidth: QInput;
    collectionHeight: QInput;
    fixedParamsName: QInput[];
    fixedParamsValue: QInput[];
    paramsName: QInput[];
    paramsLabel: QInput[];
    paramsMaxLength: QInput[];
    paramsMin: QInput[];
    paramsMax: QInput[];
    paramsDefault: QInput[];
    paramsQSelectDefault: QSelect[];
  };

  collectionInfo: IFormCollectionInfo = {
    api: '',
    isSpecialParamsChecked: true,
    isSizeInUrlChecked: false,
    width: 0,
    height: 0
  }

  fixedParams: IFormFixedParams[] = [];

  params: IFormParams[] = [
    {
      name: '',
      label: '',
      dataType: 'string',
      maxLength: 0,
      fieldType: 'Input Textfield',
      options: [
        {
          label: '',
          value: '',
        }
      ],
      maxValues: 0,
      min: 0,
      max: 0,
      defaultValue: 0
    }
  ]

  dataTypeOptions = [
    'string', 'number'
  ]

  fieldTypeOptions = [
    'Input Textfield', 'Select', 'Checkbox', 'Slider'
  ]

  isPreviewUrlChecked: boolean = false;
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
  verifyFormSelect: boolean = false;
  isFormSelectVerified: boolean = false;

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

  type(i: number) {
    switch (this.params[i].dataType) {
      case 'string':
        return 'text';
      case 'number':
        return 'number';
    }
  }

  addParam() {
    this.params.push(
      {
        name: '',
        label: '',
        dataType: 'string',
        maxLength: 0,
        fieldType: 'Input Textfield',
        options: [
          {
            label: '',
            value: '',
          }
        ],
        maxValues: 0,
        min: 0,
        max: 0,
        defaultValue: ''
      }
    )
  }

  addFixedParam() {
    this.fixedParams.push(
      {
        name: '',
        value: ''
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
      previewUrl += (typeof param.defaultValue === 'object') ? `${param.name}=${param.defaultValue.value.toString()}` : `${param.name}=${param.defaultValue.toString()}`;

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

  // setMarkers(i: number) {
  //   let markers!: [{ value: number, label: string }];

  //   for (let iteration: number = Number(this.params[i].min); iteration <= Number(this.params[i].max); iteration++) {
  //     iteration === Number(this.params[i].min)
  //       ? markers = [{ value: iteration, label: iteration.toString() }]
  //       : markers.push({ value: iteration, label: iteration.toString() });
  //   }

  //   return markers;
  // }

  removeParam(i: number) {
    this.params.splice(i, 1);
  }

  removeFixedParam(i: number) {
    this.fixedParams.splice(i, 1);
  }

  validateMin(val: number, i: number) {
    if (val > this.params[i].max && this.params[i].max === 0) {
      this.isMinMaxError = false;
      return true;
    } else if (val > this.params[i].max) {
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

  checkIfFormSelectIsVerified(check:boolean) {
    this.isFormSelectVerified = check;
    this.verifyFormSelect = false;
  }

  verifyForm() {
    this.isVerifyingTheForm = true;

    if (this.params.some(param => {
      return param.fieldType === 'Select';
    })) {
      this.verifyFormSelect = true;
    }

    if (this.params.length === 0) {
      this.errorMsg = this.$t('dashboard.createCollection.stepThree.noParamsError');
    } else if (
      !this.$refs.collectionAPI.validate() ||
      (!this.collectionInfo.isSpecialParamsChecked && !this.$refs.collectionWidth.validate()) ||
      (!this.collectionInfo.isSpecialParamsChecked && !this.$refs.collectionHeight.validate()) ||
      (this.$refs.fixedParamsName && !this.$refs.fixedParamsName.every(field => {
        return field.validate();
      })) ||
      (this.$refs.fixedParamsName && !this.$refs.fixedParamsValue.every(field => {
        return field.validate();
      })) ||
      !this.$refs.paramsName.every(field => {
        return field.validate();
      }) ||
      !this.$refs.paramsLabel.every(field => {
        return field.validate();
      }) ||
      (this.$refs.paramsMaxLength && !this.$refs.paramsMaxLength.every(field => {
        return field.validate();
      })) ||
      (this.$refs.paramsMin && !this.$refs.paramsMin.every(field => {
        return field.validate();
      })) ||
      (this.$refs.paramsMax && !this.$refs.paramsMax.every(field => {
        return field.validate();
      })) ||
      (this.verifyFormSelect && !this.isFormSelectVerified)
    ) {
      this.errorMsg = this.$t('dashboard.createCollection.stepThree.emptyFieldError');
    } else if (!this.isPreviewUrlChecked) {
      this.errorMsg = this.$t('dashboard.createCollection.stepThree.previewUrlError');
    } else if (this.isMinMaxError) {
      this.errorMsg = this.$t('dashboard.createCollection.stepThree.minMaxGeneralError');
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
          collectionInfo: this.collectionInfo,
          fixedParams: this.fixedParams,
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
