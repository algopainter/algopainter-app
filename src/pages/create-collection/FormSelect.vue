<template>
  <div class="select-field-options q-mt-md">
    <div v-for="(option, index) in params[i].options" :key="index" class="option-card q-pa-md q-my-md">
      <div class="row items-center justify-between">
        <p class="option-label">{{ `Option Nº ${index + 1}:` }}</p>
        <q-icon
          name="remove_circle"
          color="grey-4"
          size="25px"
          class="cursor-pointer"
          @click="removeOption(index)"
        />
      </div>
      <q-input
        v-model="params[i].options[index].label"
        label="Label"
      />
      <q-input
        v-model="params[i].options[index].value"
        label="Value"
      />
    </div>
    <q-btn flat class="q-mr-sm" @click="addOption()">
      <q-icon
        name="add_circle"
        color="grey-4"
        class="q-mr-sm"
        size="30px"
      />
      Add option
    </q-btn>
  </div>
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

  i = prop({
    type: Number,
    required: true,
  });
}

export default class FormSelect extends Vue.with(Props) {
  addOption() {
    this.params[this.i].options.push(
      {
        label: 'option label',
        value: 'option value'
      }
    )
  }

  removeOption(index: number) {
    this.params[this.i].options.splice(index, 1);
  }
}
</script>

<style scoped lang="scss" >
  .option-label {
    font-size: 15px;
    margin-bottom: 0px;
    color: #000000;
    font-weight: 400;
  }

  .option-card {
    border: 1px $primary solid;
    border-radius: 5px;
  }
</style>
