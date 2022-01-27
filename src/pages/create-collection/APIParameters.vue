<template>
  <div class="row">
    <div class="col-6 q-pa-sm">
      <h4 class="q-mb-md">Collection Parameters</h4>
      <q-form class="api-parameters">
        <div
          v-for="(param, i) in params"
          :key="i"
          class="parameter-card q-pa-md q-my-md"
        >
          <div class="row items-center justify-between">
            <p class="parameter-label">{{ `Parameter Nº ${i + 1}:` }}</p>
            <q-icon
              name="remove_circle"
              color="grey-4"
              size="25px"
              class="cursor-pointer"
              @click="removeParam(i)"
            />
          </div>
          <p class="label">Parameter name</p>
          <q-input
            v-model="params[i].name"
          />
          <p class="label">Parameter field type</p>
          <q-select
            v-model="params[i].fieldType"
            :options="fieldTypeOptions"
          />
          <div v-if="params[i].fieldType === 'Input Textfield'" class="data-type-field">
            <p class="label">Parameter data type</p>
            <q-select
              v-model="params[i].dataType"
              :options="dataTypeOptions"
            />
          </div>
          <form-select v-if="params[i].fieldType === 'Select'" :params="params" :i="i" />
        </div>
      </q-form>
      <q-btn flat class="q-mr-sm" @click="addParam()">
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
import { Vue, Options } from 'vue-class-component';
import { IFormParams } from 'src/models/ICreatorCollection'
import FormGenerator from './FormGenerator.vue';
import FormSelect from './FormSelect.vue';

@Options({
  components: {
    FormGenerator,
    FormSelect
  },
})

export default class APIParameters extends Vue {
  params: IFormParams[] = [
    {
      name: 'Enter a name',
      dataType: 'string',
      fieldType: 'Input Textfield',
      options: [],
    }
  ]

  dataTypeOptions = [
    'string', 'int number', 'number'
  ]

  fieldTypeOptions = [
    'Input Textfield', 'Select'
  ]

  addParam() {
    this.params.push(
      {
        name: 'Enter a name',
        dataType: 'string',
        fieldType: 'Input Textfield',
        options: [],
      }
    )
  }

  removeParam(i: number) {
    this.params.splice(i, 1);
  }
}
</script>

<style scoped lang="scss">
  .api-parameters {
    .parameter-label {
      font-size: 15px;
      margin-bottom: 0px;
      color: rgb(255, 255, 255);
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

  .parameter-card {
    border: 1px $primary solid;
    border-radius: 5px;
  }
</style>
