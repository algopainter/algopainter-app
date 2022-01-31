<template>
  <div class="q-pa-md">
    <q-stepper
      ref="stepper"
      v-model="step"
      color="primary"
      animated
      keep-alive
      flat
      :contracted="$q.screen.lt.sm || $q.screen.lt.md"
    >
      <q-step
        :name="1"
        :title="$t('dashboard.createCollection.stepOneTitle')"
        icon="assignment"
        :done="step > 1"
      >
        <h6 v-if="$q.screen.lt.sm || $q.screen.lt.md" class="title">{{ $t('dashboard.createCollection.stepOneTitle') }}</h6>
        <about-the-collection :step="step" @data="storeData" @check-form="verifyStepOne" />
      </q-step>

      <q-step
        :name="2"
        :title="$t('dashboard.createCollection.stepTwoTitle')"
        icon="multiline_chart"
        :done="step > 2"
      >
        <h6 v-if="$q.screen.lt.sm || $q.screen.lt.md" class="title">{{ $t('dashboard.createCollection.stepTwoTitle') }}</h6>
        <collection-metrics :step="step" @data="storeData" @verify="verifyStepTwo" />
      </q-step>

      <q-step
        :name="3"
        :title="$t('dashboard.createCollection.stepThreeTitle')"
        icon="auto_graph"
      >
        <h6 v-if="$q.screen.lt.sm || $q.screen.lt.md" class="title">{{ $t('dashboard.createCollection.stepThreeTitle') }}</h6>
        <api-parameters :step="step" @data="storeData" />
      </q-step>

      <template #navigation>
        <q-stepper-navigation>
          <q-btn color="primary" :disable="isStepTwoDisabled" :label="step === 3 ? 'Finish' : 'Continue'" @click="next()" />
          <q-btn
            v-if="step > 1" flat color="primary" label="Back" class="q-ml-sm"
            @click="previous()"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AboutTheCollection from './AboutTheCollection.vue';
import CollectionMetrics from './CollectionMetrics.vue';
import ApiParameters from './APIParameters.vue';
import { Watch } from 'vue-property-decorator';

@Options({
  components: {
    AboutTheCollection,
    CollectionMetrics,
    ApiParameters,
  },
})

export default class CreateCollection extends Vue {
  step: number = 1;
  isStepTwoDisabled = false;
  isStepOneDisabled = false;
  teste: boolean = true;

  collectionData = {
    aboutTheCollection: {} as unknown,
    collectionMetrics: {} as unknown,
    apiParameters: {} as unknown,
  }

  @Watch('step')
  onStepChanged() {
    switch (this.step) {
      case 1:
        this.isStepTwoDisabled = false;
        break;
    }
  }

  verifyStepTwo(validation: boolean) {
    this.isStepTwoDisabled = validation;
  }

  verifyStepOne(payload: boolean) {
    this.isStepTwoDisabled = payload;
  }

  storeData(data: any, step: number) {
    switch (step) {
      case 1:
        this.collectionData.aboutTheCollection = data;
        console.log('this.collectionData.collectionMetrics', this.collectionData.aboutTheCollection);
        break;
      case 2:
        this.collectionData.collectionMetrics = data;
        console.log('this.collectionData.collectionMetrics', this.collectionData.collectionMetrics);
        break;
      case 3:
        this.collectionData.apiParameters = data;
        console.log('this.collectionData.apiParameters', this.collectionData.apiParameters);
        break;
    }
  }

  next() {
    switch (this.step) {
      case 1:
        this.isStepTwoDisabled = true;
        this.step++;
        break;
      case 2:
        this.step++;
        break;
      case 3:
        //send this.collectionData to the API
        console.log(this.collectionData);
        break;
    }
  }

  previous() {
    this.step--;
  }
}
</script>
<style lang="scss">
  .title {
    margin: 0px;
  }
</style>
