<template>
  <div class="row">
    <div class="col-6 q-pa-sm">
      <q-form class="api-parameters">
        <h4 class="q-mb-md">Collection Info</h4>
        <q-input
          v-model="collectionInfo.api"
          label="API"
          stack-label
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
          <p class="label">Name</p>
          <q-input v-model="params[i].name" />
          <p class="label">Field type</p>
          <q-select
            v-model="params[i].fieldType"
            :options="fieldTypeOptions"
            @update:model-value="fieldTypeUpdateDefaultValue(i)"
          />
          <div
            v-if="params[i].fieldType === 'Input Textfield'"
            class="data-type-field q-pa-md q-my-md"
          >
            <p class="label">
              Data type
            </p>
            <q-select
              v-model="params[i].dataType"
              :options="dataTypeOptions"
              @update:model-value="dataTypeUpdateDefaultValue(i)"
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
              v-model="params[i].min"
              label="Min"
              class="col-6 q-pr-md"
              mask="#"
              fill-mask="0"
              reverse-fill-mask
            />
            <q-input
              v-model="params[i].max"
              label="Max"
              class="col-6 q-pl-md"
              mask="#"
              fill-mask="0"
              reverse-fill-mask
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
              v-model="params[i].defaultValue"
              label="Default value"
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
      <form-generator :params="params" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import { IFormParams, ICollectionNFTCreationAPI } from 'src/models/ICreatorCollection'
import FormGenerator from './FormGenerator.vue';
import FormSelect from './FormSelect.vue';
import { Watch } from 'vue-property-decorator';

class Props {
  step = prop({
    type: Number,
    required: true,
  });
}

@Options({
  components: {
    FormGenerator,
    FormSelect
  },
})

export default class APIParameters extends Vue.with(Props) {
  collectionInfo = {
    api: '',
    method: 'GET',
  }

  methodOptions = [
    'GET', 'POST'
  ]

  params: IFormParams[] = [
    {
      name: 'Enter a name',
      dataType: 'string',
      fieldType: 'Input Textfield',
      options: [
        {
          label: 'option label',
          value: 'option value'
        }
      ],
      min: 0,
      max: 10,
      defaultValue: ''
    }
  ]

  dataTypeOptions = [
    'string', 'number'
  ]

  fieldTypeOptions = [
    'Input Textfield', 'Select', 'Checkbox', 'Slider'
  ]

  addParam() {
    this.params.push(
      {
        name: 'Enter a name',
        dataType: 'string',
        fieldType: 'Input Textfield',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 0,
        defaultValue: ''
      }
    )
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

  @Watch('step')
  onStepChanged() {
    if (this.step === 4) {
      const data: ICollectionNFTCreationAPI = {
        url: this.collectionInfo.api,
        parameters: this.params
      }

      this.$emit('data', data, this.step - 1);
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
