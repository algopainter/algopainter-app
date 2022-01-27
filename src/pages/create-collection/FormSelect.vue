<template>
  <div class="select-field-options q-mt-md">
    <q-btn flat class="q-mr-sm" @click="addOption()">
      <q-icon
        name="add_circle"
        color="grey-4"
        class="q-mr-sm"
        size="30px"
      />
      Add select field option
    </q-btn>
    <q-btn flat @click="removeOption()">
      <q-icon
        name="remove_circle"
        color="grey-4"
        class="q-mr-sm"
        size="30px"
      />
      Remove select field option
    </q-btn>
    <div v-for="(option, index) in params[i].options" :key="index">
      <q-input
        v-model="params[i].options[index]"
        :label="`Option ${index + 1}:`"
      />
    </div>
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
      'option'
    )
  }

  removeOption() {
    this.params[this.i].options.pop();
  }
}
</script>

<style scoped lang="scss" />
