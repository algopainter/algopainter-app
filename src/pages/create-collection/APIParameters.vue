<template>
  <div class="row">
    <div class="col-6 q-pa-sm">
      <q-form class="api-parameters">
        <h4 class="q-mb-md">Collection Info</h4>
        <q-input
          v-model.trim="collectionInfo.api"
          label="API"
          stack-label
          :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
        >
        </q-input>
        <q-select
          v-model="collectionInfo.method"
          label="Method"
          stack-label
          :options="methodOptions"
        />
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
          <q-input
            v-model.trim="params[i].name"
            label="name"
            :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
          />
          <q-input
            v-model.trim="params[i].label"
            label="label"
            :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
          />
          <q-select
            v-model="params[i].fieldType"
            label="label"
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
              class="col-6 q-pr-md"
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
              :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
            />
            <q-select
              v-else-if="params[i].fieldType === 'Select'"
              v-model="params[i].defaultValue"
              label="Default value"
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
      </q-form>
      <q-btn
        flat
        class="q-mr-sm"
        @click="addParam()"
      >
        <q-icon
          name="add_circle"
          color="grey-4"
          class="q-mr-sm"
          size="30px"
        />
        Add parameter
      </q-btn>
    </div>
    <div class="col-6 q-pa-sm">
      <form-previewer :params="params" />
      <div class="q-pa-sm">
        <q-checkbox
          v-model="isPreviewUrlChecked"
          color="primary"
          :label="$t('dashboard.createCollection.stepThree.isPreviewUrlChecked')"
        />
        <p class="text-bold">{{ $t('dashboard.createCollection.stepThree.previewUrl', {url: generatePreviewUrl}) }}</p>
      </div>
    </div>
  </div>
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
    method: 'GET',
  }

  methodOptions = [
    'GET', 'POST'
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

  get generatePreviewUrl() {
    let previewUrl: string = this.collectionInfo.api + '?';

    this.params.forEach((param, i) => {
      previewUrl += `${param.name}=${param.defaultValue.toString()}`

      if ((i + 1) !== this.params.length) {
        previewUrl += '/'
      }
    })

    return previewUrl;
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
    } else if (!this.isPreviewUrlChecked) {
      console.log('in');
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

</style>
