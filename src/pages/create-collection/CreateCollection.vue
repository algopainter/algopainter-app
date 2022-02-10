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
        <about-the-collection :step="step" :check-form="verifyFormOne" @data="storeData" @verifyFormOne="verifyStepOne" />
      </q-step>

      <q-step
        :name="2"
        :title="$t('dashboard.createCollection.stepTwoTitle')"
        icon="multiline_chart"
        :done="step > 2"
      >
        <h6 v-if="$q.screen.lt.sm || $q.screen.lt.md" class="title">{{ $t('dashboard.createCollection.stepTwoTitle') }}</h6>
        <collection-metrics :step="step" :check-form="verifyFormTwo" @data="storeData" @verify="verifyStepTwo" />
      </q-step>

      <q-step
        :name="3"
        :title="$t('dashboard.createCollection.stepThreeTitle')"
        icon="auto_graph"
        :done="step > 3"
      >
        <h6 v-if="$q.screen.lt.sm || $q.screen.lt.md" class="title">{{ $t('dashboard.createCollection.stepThreeTitle') }}</h6>
        <api-parameters :step="step" :check-form="verifyFormThree" @data="storeData" @verify="verifyStepThree" />
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
import UserController from 'src/controllers/user/UserController';
import { IProfile } from 'src/models/IProfile';
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
  accountAddress: ['loadUserProfile'],

})

export default class CreateCollection extends Vue {
  isConnected?: boolean;
  userAccount!: string;
  networkinfo?: NetworkInfo;

  step: number = 1;
  isStepTwoDisabled: boolean = false;

  verifyFormOne: boolean = false;
  verifyFormTwo: boolean = false;
  isFormOneVerified: boolean = false;
  isFormTwoVerified: boolean = false;
  verifyFormThree: boolean = false;
  isFormThreeVerified: boolean = false;
  userController: UserController = new UserController();
  userProfile: IProfile = {};

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
      default:
        this.isStepTwoDisabled = false;
    }
  }

  mounted() {
    void this.registerCollection();
  }

  get accountAddress() {
    return this.$store.state.user.account;
  }

    @Watch('accountAddress')
  onPropertyChanged() {
    void this.registerCollection();
  }

    async registerCollection() {
      const result = await this.userController.getUserProfile(
      this.accountAddress?.toLowerCase() as string,
      );
      if (result.isFailure) {
        this.$q.notify({
          type: 'negative',
          message: this.$t(
            'dashboard.createCollection.hasNoProfile'
          ),
        });
        await this.$router.push('/edit-profile/' + 'registerCollection');
      } else {
        await this.$router.push('/create-collection');
      }
    }

    verifyStepOne(payload: boolean) {
      this.isFormOneVerified = payload;
      this.verifyFormOne = false;
    }

    verifyStepTwo(payload: boolean) {
      this.isFormTwoVerified = payload;
      this.verifyFormTwo = false;
    }

    verifyStepThree(payload: boolean) {
      this.isFormThreeVerified = payload;
      this.verifyFormThree = false;
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
          this.verifyFormOne = true;
          setTimeout(() => {
            console.log('isFormTwoVerified', this.isFormOneVerified);
            if (this.isFormOneVerified) {
              console.log('in');
              this.step++;
              this.verifyFormOne = false;
            }
          }, 500)
          break;
        case 2:
          this.verifyFormTwo = true;
          setTimeout(() => {
            if (this.isFormTwoVerified) {
              this.step++;
              this.verifyFormTwo = false;
            }
          }, 250)
          break;
        case 3:
          this.verifyFormThree = true;
          setTimeout(() => {
            if (this.isFormThreeVerified) {
              this.postCollection().catch(console.error);
              this.verifyFormThree = false;
            }
          }, 250)
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
