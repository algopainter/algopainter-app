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
        <about-the-collection :step="step" :check-form="verifyFormOne" @data="storeData" @verifyFormOne="verifyStepOne" />
      </q-step>

      <q-step
        :name="2"
        :title="$t('dashboard.createCollection.stepTwoTitle')"
        icon="multiline_chart"
        :done="step > 2"
      >
        <collection-metrics :step="step" :check-form="verifyFormTwo" @data="storeData" @verify="verifyStepTwo" />
      </q-step>

      <q-step
        :name="3"
        :title="$t('dashboard.createCollection.stepThreeTitle')"
        icon="auto_graph"
        :done="step > 3"
      >
        <api-parameters :step="step" :check-form="verifyFormThree" @data="storeData" @verify="verifyStepThree" />
      </q-step>

      <q-step
        :name="4"
        :title="$t('dashboard.createCollection.stepFourTitle')"
        icon="summarize"
        :done="step > 4"
      >
        <collection-summary :check-form="verifyFormFour" :collection-data="collectionData" @data="storeData" @verify="verifyStepFour" />
      </q-step>

      <template #navigation>
        <q-stepper-navigation>
          <q-btn color="primary" :disable="isStepTwoDisabled" :label="step === 4 ? 'Finish' : 'Continue'" @click="next()" />
          <q-btn
            v-if="step > 1" flat color="primary" label="Back" class="q-ml-sm"
            @click="previous()"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
    <div class="flex">
      <collection-modal v-model="openModalCreate" :status-data="statusData" :artist-collection-status="artistCollectionStatus" :ok-btn-disabled="okBtnDisabled" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AboutTheCollection from './AboutTheCollection.vue';
import CollectionMetrics from './CollectionMetrics.vue';
import ApiParameters from './APIParameters.vue';
import CollectionSummary from './CollectionSummary.vue';
import { Watch } from 'vue-property-decorator';
import { api } from 'src/boot/axios';
import { mapGetters } from 'vuex';
import { NetworkInfo } from 'src/store/user/types';
import { nanoid } from 'nanoid';
import Web3Helper from 'src/helpers/web3Helper';
import { isError } from 'src/helpers/utils';
import UserController from 'src/controllers/user/UserController';
import { IProfile } from 'src/models/IProfile';
import { IAboutTheCollection, ICollectionMetrics, ICollectionNFTCreationAPI, IcollectionData } from 'src/models/ICreatorCollection';
import CollectionModal from 'src/components/modal/CollectionModal.vue'
import AlgoPainterArtistCollection, { PriceType, ArtistCollectionStatus } from 'src/eth/AlgoPainterArtistCollectionProxy'
import moment from 'moment';
import { toWei } from 'web3-utils'

@Options({
  components: {
    AboutTheCollection,
    CollectionMetrics,
    ApiParameters,
    CollectionModal,
    CollectionSummary
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
  PriceType = PriceType;
  isConnected?: boolean;
  userAccount!: string;
  networkinfo?: NetworkInfo;
  artistCollection = <AlgoPainterArtistCollection>{};
  artistCollectionStatus: ArtistCollectionStatus = ArtistCollectionStatus.ArtistCollectionAwaitingInput;
  statusData : string = 'Awaiting';
  statusblock: string = '';
  step: number = 1;
  isStepTwoDisabled: boolean = false;
  openModalCreate: boolean = false;

  verifyFormOne: boolean = false;
  verifyFormTwo: boolean = false;
  verifyFormThree: boolean = false;
  verifyFormFour: boolean = false;
  isFormOneVerified: boolean = false;
  isFormTwoVerified: boolean = false;
  isFormThreeVerified: boolean = false;
  isFormFourVerified: boolean = false;
  okBtnDisabled: boolean = true;
  collectionId!: string;
  hasCollection: boolean = false;
  networkInfo!: NetworkInfo;
  userController: UserController = new UserController();
  userProfile: IProfile = {};

  collectionData: IcollectionData = {
    aboutTheCollection: {} as IAboutTheCollection,
    collectionMetrics: {} as ICollectionMetrics,
    apiParameters: {} as ICollectionNFTCreationAPI,
  }

  convertido: Date | string = '';

  created() {
    this.artistCollection = new AlgoPainterArtistCollection(this.networkInfo);
  }

  mounted() {
    void this.registerCollection();
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

    verifyStepFour(payload: boolean) {
      this.isFormFourVerified = payload;
      this.verifyFormFour = false;
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
            if (this.isFormOneVerified) {
              this.step++;
              this.verifyFormOne = false;
            }
          }, 250)
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
              this.step++;
              this.verifyFormThree = false;
            }
          }, 250)
          break;
        case 4:
          this.verifyFormFour = true;
          setTimeout(() => {
            if (this.isFormFourVerified) {
              void this.createCollection()
              // this.postCollection().catch(console.error);
              this.verifyFormFour = false;
              this.openModalCreate = true;
            }
          }, 250)
      }
    }

    async postCollection() {
      this.statusData = 'aproved';
      try {
        const data = {
          description: this.collectionData.aboutTheCollection.description,
          avatar: this.collectionData.aboutTheCollection.avatar,
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

        await api.patch(`collections/${this.collectionId}`, request);
        this.statusData = 'confirme';
        this.okBtnDisabled = false;
      } catch (e) {
        this.statusData = 'error';
        this.$q.notify({
          type: 'negative',
          message: 'Error no Upload',
        });
      }
    }

    // async post(url: string, data: any) {
    //   const response = await fetch(url, {
    //     method: 'POST',
    //     headers: {
    //       'Content-type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    //   });

    //   const resData = await response.json();
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    //   return resData;
    // }

    previous() {
      this.step--;
    }

    priceType(type:string) {
      if (type === 'fixed') {
        return this.PriceType.Fixed
      } else {
        return this.PriceType.Variable
      }
    }

    async createCollection() {
      const priceblock: any[] = [];
      const priceRange = this.collectionData.collectionMetrics.priceRange;
      // eslint-disable-next-line array-callback-return
      priceRange.map(price => {
        priceblock.push(price.from);
        priceblock.push(price.to);
        priceblock.push(price.amount);
      })
      const startPrice = Number(priceblock[2])
      const startDT = moment(this.collectionData.collectionMetrics.startDT).unix();
      const endDT = moment(this.collectionData.collectionMetrics.endDT).unix();
      const times = [startDT, endDT]
      try {
        this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionAwaitingInput
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await this.artistCollection.createCollection(
          this.collectionData.collectionMetrics.walletAddress,
          times,
          this.collectionData.aboutTheCollection.nameCollection,
          this.collectionData.collectionMetrics.creatorPercentage,
          startPrice,
        this.collectionData.collectionMetrics.tokenPriceAddress as string,
        this.priceType(this.collectionData.collectionMetrics.priceType),
        this.collectionData.apiParameters.parameters.length,
        priceblock,
        this.collectionData.collectionMetrics.nfts,
        toWei(await this.artistCollection.getCollectionPrice(), 'ether'),
        this.userAccount
        ).on('transactionHash', () => {
          this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionAwaitingConfirmation
        }).on('receipt', (receipt): void => {
          if (receipt.events) {
            this.collectionId = receipt.events.CollectionCreated.returnValues.index
            console.log('collection id', this.collectionId)
          }
        }).on('error', () => {
          this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionError
          this.okBtnDisabled = false;
        })
      } catch (err) {
        console.log(err);
      }
      this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionCreated
      while (this.hasCollection === false) {
        const teste = await api.get(`collections?blockchainId=${this.collectionId}`);
        this.hasCollection = teste.data.length !== 0;
      }
      if (this.hasCollection) {
        void this.postCollection()
      }
    }
}
</script>
<style lang="scss">
  .title {
    margin: 0px;
  }
</style>
