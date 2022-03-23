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
        <collection-summary :check-form="verifyFormFour" :collection-data="collectionData" :call-err-msg="errMsg" @data="storeData" @verify="verifyStepFour" />
      </q-step>

      <template #navigation>
        <q-stepper-navigation>
          <q-btn
            color="primary"
            :disable="isStepTwoDisabled"
            :label="step === 4 ? 'Finish' : 'Continue'" @click="next()"
          />
          <q-btn
            v-if="step > 1" flat color="primary" label="Back" class="q-ml-sm"
            @click="previous()"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
    <div class="flex">
      <collection-modal v-model="openModalCreate" :artist-collection-status="artistCollectionStatus" :ok-btn-disabled="okBtnDisabled" />
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
import UserController from 'src/controllers/user/UserController';
import { IProfile } from 'src/models/IProfile';
import { IAboutTheCollection, ICollectionMetrics, ICollectionNFTCreationAPI, IcollectionData } from 'src/models/ICreatorCollection';
import CollectionModal from 'src/components/modal/CollectionModal.vue'
import AlgoPainterArtistCollection, { PriceType, ArtistCollectionStatus } from 'src/eth/AlgoPainterArtistCollectionProxy';
import AlgoPainterTokenProxy from 'src/eth/AlgoPainterTokenProxy';
import moment from 'moment';
import { toWei, randomHex } from 'web3-utils'
import { getArtistCollectionAddress } from 'src/eth/Config';
import { IAxiosIPFSPost } from 'src/models/IAxios';

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
  algoPainterTokenProxy!: AlgoPainterTokenProxy;
  artistCollection = <AlgoPainterArtistCollection>{};
  registerPrice!: string;
  networkinfo?: NetworkInfo;

  PriceType = PriceType;
  isConnected?: boolean;
  userAccount!: string;
  artistCollectionStatus: ArtistCollectionStatus = ArtistCollectionStatus.ArtistCollectionAwaitingConfirmation;
  statusblock: string = '';
  step: number = 1;
  isStepTwoDisabled: boolean = false;
  openModalCreate: boolean = false;
  errMsg: string = '';

  verifyFormOne: boolean = false;
  verifyFormTwo: boolean = false;
  verifyFormThree: boolean = false;
  verifyFormFour: boolean = false;
  isFormOneVerified: boolean = false;
  isFormTwoVerified: boolean = false;
  isFormThreeVerified: boolean = false;
  isFormFourVerified: boolean = false;
  okBtnDisabled: boolean = true;
  networkInfo!: NetworkInfo;
  userController: UserController = new UserController();
  userProfile: IProfile = {};
  dataIPFSHash!: string;

  times: number[] = [];
  priceblock: string[] = [];
  startPrice!: number;

  collectionData: IcollectionData = {
    aboutTheCollection: {} as IAboutTheCollection,
    collectionMetrics: {} as ICollectionMetrics,
    apiParameters: {} as ICollectionNFTCreationAPI,
  }

  convertido: Date | string = '';

  created() {
    this.artistCollection = new AlgoPainterArtistCollection(this.networkInfo);
    this.algoPainterTokenProxy = new AlgoPainterTokenProxy(this.networkInfo);
  }

  async mounted() {
    await this.registerCollection();
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
          break;
        case 2:
          this.collectionData.collectionMetrics = data;
          break;
        case 3:
          this.collectionData.apiParameters = data;
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

          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          setTimeout(async() => {
            if (this.isFormFourVerified) {
              this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionAwaitingConfirmation;
              this.parseData();

              this.openModalCreate = true;
              const isDataIPFSHashGenerated = await this.generateDataIPFSHash();
              const isCallVerified = await this.createCollectionCall();

              if (isDataIPFSHashGenerated && isCallVerified) {
                this.verifyFormFour = false;
                if (isDataIPFSHashGenerated) {
                  await this.createCollection();
                }
              }
            }
          }, 250)
      }
    }

    previous() {
      this.step--;
    }

    parseData() {
      const priceRange = this.collectionData.collectionMetrics.priceRange;

      // eslint-disable-next-line array-callback-return
      priceRange.map(price => {
        this.priceblock.push(price.from.toString());
        this.priceblock.push(price.to.toString());
        this.priceblock.push(price.amount.toString());
      })

      this.startPrice = Number(this.priceblock[2]);

      const startDT = moment(this.collectionData.collectionMetrics.startDT).unix();
      const endDT = moment(this.collectionData.collectionMetrics.endDT).unix();
      this.times = [startDT, endDT];
    }

    async generateDataIPFSHash() {
      const data = {
        description: this.collectionData.aboutTheCollection.description,
        avatar: this.collectionData.aboutTheCollection.avatar,
        api: this.collectionData.apiParameters,
        website: this.collectionData.aboutTheCollection.webSite
      };

      const previewPayload = {
        name: this.collectionData.aboutTheCollection.description,
        description: this.collectionData.aboutTheCollection.description,
        mintedBy: this.userAccount,
        image: this.collectionData.aboutTheCollection.avatar,
        fileName: randomHex(32) + '.png'
      };

      try {
        const resAvatar: IAxiosIPFSPost = await api.post('images/pintoipfs/FILE?resize=1', previewPayload);
        data.avatar = `https://ipfs.io/ipfs/${resAvatar.data.ipfsHash.toString()}`;
        const res = await api.post('images/pintoipfs/JSON', data);
        this.dataIPFSHash = res.data.ipfsHash;
        return true;
      } catch (e) {
        this.openModalCreate = false;
        this.errMsg = this.$t('dashboard.createCollection.stepFour.ipfsErr');
        this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionError;
        return false;
      }
    }

    priceType(type:string) {
      if (type === 'fixed') {
        return this.PriceType.Fixed
      } else {
        return this.PriceType.Variable
      }
    }

    async createCollectionCall() {
      this.errMsg = '';

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await this.artistCollection.createCollectionCall(
          this.collectionData.collectionMetrics.walletAddress,
          this.times,
          this.collectionData.aboutTheCollection.nameCollection,
          this.collectionData.collectionMetrics.creatorPercentage,
          this.startPrice,
          this.collectionData.collectionMetrics.tokenPriceAddress as string,
          this.priceType(this.collectionData.collectionMetrics.priceType),
          this.priceblock,
          this.collectionData.collectionMetrics.nfts,
          this.userAccount,
          this.dataIPFSHash
        )
        return true
      } catch (e:any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (e.message && e.message.indexOf('START_TIME_RANGE_INVALID') >= 0) {
          this.errMsg = this.$t('dashboard.createCollection.stepFour.startTimeErrMsg');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        } else if (e.message && e.message.indexOf('END_TIME_RANGE_INVALID') >= 0) {
          this.errMsg = this.$t('dashboard.createCollection.stepFour.endTimeErrMsg');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        } else if (e.message && e.message.indexOf('COLLECTION_NAME_NOT_UNIQUE') >= 0) {
          this.errMsg = this.$t('dashboard.createCollection.stepFour.collectionNameErrMsg');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        } else if (e.message && e.message.indexOf('TOKEN_UNAVAILABLE') >= 0) {
          this.errMsg = this.$t('dashboard.createCollection.stepFour.tokenErrMsg');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        } else if (e.message && e.message.indexOf('MINIMUM_ALLOWANCE_REQUIRED') >= 0) {
          return true;
        } else {
          this.errMsg = e.message;
        }

        this.openModalCreate = false;
        return false;
      }
    }

    async getAllowance() {
      try {
        this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionAwaitingInput;
        this.registerPrice = toWei(await this.artistCollection.getCollectionPrice());

        if (this.registerPrice) {
          let allowance = false;

          await this.algoPainterTokenProxy.approve(
            this.artistCollectionContractAddress,
            this.registerPrice,
            this.userAccount
          )
            .on('error', () => {
              this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionError;
              setTimeout(() => {
                this.okBtnDisabled = false;
                return false;
              }, 1000);
            })
            .on('transactionHash', () => {
              this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionAwaitingConfirmation;
            })
            .on('confirmation', () => {
              allowance = true;
            })
            .catch(e => {
              console.error(e);
              allowance = false;
            });

          return allowance;
        }
      } catch (e) {
        this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionError;
        this.okBtnDisabled = false;
        return false;
      }
    }

    get artistCollectionContractAddress() {
      return getArtistCollectionAddress(this.networkInfo.id);
    }

    async createCollection() {
      this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionAwaitingConfirmation;

      const allowance = await this.getAllowance();

      if (allowance) {
        this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionAwaitingInput;

        await this.artistCollection.createCollection(
          this.collectionData.collectionMetrics.walletAddress,
          this.times,
          this.collectionData.aboutTheCollection.nameCollection,
          this.collectionData.collectionMetrics.creatorPercentage,
          this.startPrice,
          this.collectionData.collectionMetrics.tokenPriceAddress as string,
          this.priceType(this.collectionData.collectionMetrics.priceType),
          this.priceblock,
          this.collectionData.collectionMetrics.nfts,
          this.userAccount,
          this.dataIPFSHash
        ).on('transactionHash', (a) => {
          this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionAwaitingConfirmation;
        }).on('error', (e) => {
          this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionError;
          this.okBtnDisabled = false;
        })

        this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionCreated;
        this.okBtnDisabled = false;
      } else {
        this.artistCollectionStatus = ArtistCollectionStatus.ArtistCollectionError;
        this.okBtnDisabled = false;
      }
    };
}
</script>
<style lang="scss">
  .title {
    margin: 0px;
  }
</style>

function randomHex(arg0: number) {
  throw new Error('Function not implemented.');
}
