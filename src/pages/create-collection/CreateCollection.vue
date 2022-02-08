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
        :done="step > 3"
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
import { api } from 'src/boot/axios';
import { mapGetters } from 'vuex';
import { NetworkInfo } from 'src/store/user/types';
import { nanoid } from 'nanoid';
import Web3Helper from 'src/helpers/web3Helper';
import { isError } from 'src/helpers/utils';
import { IAboutTheCollection, ICollectionMetrics, ICollectionNFTCreationAPI } from 'src/models/ICreatorCollection';

@Options({
  components: {
    AboutTheCollection,
    CollectionMetrics,
    ApiParameters,
  },
  computed: {
    ...mapGetters('user', {
      userAccount: 'account',
      networkInfo: 'networkInfo',
      isConnected: 'isConnected',
    }),
  },
})

export default class CreateCollection extends Vue {
  isConnected?: boolean;
  userAccount!: string;
  networkinfo?: NetworkInfo;

  step: number = 1;
  isStepTwoDisabled = false;
  isStepOneDisabled = false;
  teste: boolean = true;

  collectionData = {
    aboutTheCollection: {} as IAboutTheCollection,
    collectionMetrics: {} as ICollectionMetrics,
    apiParameters: {} as ICollectionNFTCreationAPI,
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
        console.log('this.collectionData.aboutTheCollection', this.collectionData.aboutTheCollection);
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
        this.step++;
        break;
      case 4:
        console.log('this.collectionData.apiParameters', this.collectionData.apiParameters);
        this.postCollection().catch(console.error);
        //send this.collectionData to the API
        console.log(this.collectionData);
    }
  }

  async postCollection() {
    try {
      const data = {
        title: this.collectionData.aboutTheCollection.nameCollection,
        description: this.collectionData.aboutTheCollection.description,
        owner: this.collectionData.aboutTheCollection.artistName,
        avatar: this.collectionData.aboutTheCollection.avatar,
        account: this.userAccount,
        metrics: this.collectionData.collectionMetrics,
        api: this.collectionData.apiParameters,
        salt: nanoid(),
      };

      const web3helper = new Web3Helper();
      const signatureOrError = await web3helper.hashMessageAndAskForSignature(data, this.userAccount);

      if (isError(signatureOrError as Error)) {
        return;
      }

      const request = {
        data,
        signature: signatureOrError,
        account: this.userAccount,
        salt: data.salt,
      };

      const res = await api.post('collections', request);

      console.log('res', res)
    } catch (e) {
      this.$q.notify({
        type: 'negative',
        message: 'error mint image',
      });
    }
  }

  async post(url: string, data: any) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const resData = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return resData;
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
