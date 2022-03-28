<template>
  <h5 class="text-bold">Form Preview</h5>
  <q-form class="form-generator">
    <div v-for="(param, i) in params" :key="i">
      <p v-if="params[i].fieldType === 'Slider'" class="label">{{ params[i].label }}</p>
      <q-input
        v-if="params[i].fieldType === 'Input Textfield'"
        v-model="generatedParams[i]"
        :label="params[i].label"
        stack-label
        :maxlength="params[i].maxLength"
        :type="type(i)"
      />
      <q-select
        v-else-if="params[i].fieldType === 'Select'"
        v-model="generatedParams[i]"
        :label="params[i].label"
        stack-label
        :options="params[i].options"
        :multiple="params[i].maxValues != 1"
        :max-values="params[i].maxValues"
      />
      <q-checkbox
        v-else-if="params[i].fieldType === 'Checkbox'"
        v-model="generatedParams[i]"
        :label="params[i].label"
      />
      <q-slider
        v-else-if="params[i].fieldType === 'Slider'"
        v-model="generatedParams[i]"
        label
        :min="Number(params[i].min)"
        :max="Number(params[i].max)"
      />
    </div>
  </q-form>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
import { PropType } from 'vue';
import { IFormParams } from 'src/models/ICreatorCollection'

class Props {
  params = prop({
    type: Object as PropType<IFormParams[]>,
    required: true,
  });
}

export default class FormPreviewer extends Vue.with(Props) {
    generatedParams: (number | string | boolean)[] = [];

    type(i: number) {
      switch (this.params[i].dataType) {
        case 'string':
          return 'text';
        case 'number':
          return 'number';
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
}
</script>

<style scoped lang="scss">
  .form-generator {
    .label {
      margin: 0px;
      position: relative;
      top: 15px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 400;
    }
  }
</style>
