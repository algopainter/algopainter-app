<template>
  <h4 class="q-mb-md">Form Preview</h4>
  <q-form class="form-generator">
    <div v-for="(param, i) in params" :key="i">
      <p class="label">{{ params[i].name }}</p>
      <q-input
        v-if="params[i].fieldType === 'Input Textfield'"
        :type="type(i)"
      />
      <q-select
        v-else-if="params[i].fieldType === 'Select'"
        :options="params[i].options"
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

export default class FormGenerator extends Vue.with(Props) {
  type(i: number) {
    switch (this.params[i].dataType) {
      case 'string':
        return 'String';
      case 'int number':
        return 'int number';
      case 'number':
        return 'number';
    }
  }
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
