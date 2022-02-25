<template>
  <h4 class="q-mb-md">Form Generator</h4>
  <q-form class="form-generator">
    <div v-for="(param, i) in formParams" :key="i">
      <p v-if="formParams[i].fieldType === 'Slider'" class="label">{{ formParams[i].label }}</p>
      <q-input
        v-if="formParams[i].fieldType === 'Input Textfield'"
        v-model="generatedParams[i]"
        :label="formParams[i].label"
        stack-label
        :maxlength="formParams[i].maxLength"
        :type="type(i)"
        :rules="[ val => validateIfEmpty(val) || emptyFieldErrMsg ]"
      />
      <q-select
        v-else-if="formParams[i].fieldType === 'Select'"
        v-model="generatedParams[i]"
        :label="formParams[i].label"
        stack-label
        :options="formParams[i].options"
      />
      <q-checkbox
        v-else-if="formParams[i].fieldType === 'Checkbox'"
        v-model="generatedParams[i]"
        :label="formParams[i].label"
      />
      <q-slider
        v-else-if="formParams[i].fieldType === 'Slider'"
        v-model="generatedParams[i]"
        label
        :marker-labels="setMarkers(i)"
        :min="Number(formParams[i].min)"
        :max="Number(formParams[i].max)"
      />
    </div>
    <algo-button
      :label="$t('dashboard.newPainting.leftInfoBtnName')"
      :class="[$q.screen.lt.sm || $q.screen.lt.md ? 'full-width q-mt-lg q-mb-lg' : 'full-width q-mt-lg']"
      :disable="isEmptyFieldError"
      color="primary"
      @click.prevent="parseGeneratedParams()"
    />
  </q-form>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { PropType } from 'vue';
import { IFormParams } from 'src/models/ICreatorCollection'
import AlgoButton from 'components/common/Button.vue';
import { Watch } from 'vue-property-decorator';

class Props {
  formParams = prop({
    type: Object as PropType<IFormParams[]>,
    required: true,
  });

  defaultValues = prop({
    type: Object as PropType<(number | string | boolean)[]>,
    required: true,
  });

  clearForm = prop({
    type: Boolean,
    required: true,
  });
}

@Options({
  components: {
    AlgoButton
  }
})
export default class FormPreviewer extends Vue.with(Props) {
    generatedParams: (number | string | boolean | {label: string, value: string | number})[] = [];
    parsedGeneratedParams: string[] = [];
    emptyFieldErrMsg: string = '';
    isEmptyFieldError: boolean = false;

    mounted() {
      this.setDefaultValues();
    }

    setDefaultValues() {
      this.generatedParams = this.defaultValues;
    }

    @Watch('clearForm')
    onClearFormChanged() {
      if (this.clearForm) {
        this.setDefaultValues();
      }
    }

    type(i: number) {
      switch (this.formParams[i].dataType) {
        case 'string':
          return 'text';
        case 'number':
          return 'number';
      }
    }

    parseGeneratedParams() {
      this.generatedParams.forEach((param, i) => {
        if (typeof param === 'object') {
          this.parsedGeneratedParams[i] = param.value.toString();
        } else {
          this.parsedGeneratedParams[i] = param.toString();
        }
      })

      this.$emit('generatePreview', this.parsedGeneratedParams);
    }

    setMarkers(i: number) {
      let markers!: [{ value: number, label: string }];

      for (let iteration: number = Number(this.formParams[i].min); iteration <= Number(this.formParams[i].max); iteration++) {
        iteration === Number(this.formParams[i].min)
          ? markers = [{ value: iteration, label: iteration.toString() }]
          : markers.push({ value: iteration, label: iteration.toString() });
      }

      return markers;
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
