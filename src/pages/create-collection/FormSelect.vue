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
      <div class="row">
        <q-input
          ref="optionsLabel"
          v-model="params[i].options[index].label"
          label="Label:"
          class="col-6 q-pr-md"
          :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
        />
        <q-input
          ref="optionsValue"
          v-model="params[i].options[index].value"
          label="Value:"
          class="col-6 q-pl-md"
          :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
        />
      </div>
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
import { IFormParams } from 'src/models/ICreatorCollection';
import { Watch } from 'vue-property-decorator';
import { QInput } from 'quasar';

class Props {
  params = prop({
    type: Object as PropType<IFormParams[]>,
    required: true,
  });

  i = prop({
    type: Number,
    required: true,
  });

  checkForm = prop({
    type: Boolean,
    required: true,
  });
}

export default class FormSelect extends Vue.with(Props) {
  emptyFieldErrMsg!: string;
  isEmptyFieldError: boolean = false;

  declare $refs: {
    optionsLabel: QInput[];
    optionsValue: QInput[];
  };

  addOption() {
    this.params[this.i].options.push(
      {
        label: '',
        value: ''
      }
    )
  }

  removeOption(index: number) {
    this.params[this.i].options.splice(index, 1);
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

  @Watch('checkForm')
  onCheckFormChanged() {
    if (this.checkForm) {
      if (this.$refs.optionsLabel.every(option => {
        return option.validate();
      }) && this.$refs.optionsValue.every(option => {
        return option.validate();
      })) {
        this.$emit('verify', true);
      } else {
        this.$emit('verify', false);
      }
    }
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
