
<template>
  <div
    v-if="loading"
    class="flex flex-center q-pa-xl"
  >
    <q-spinner
      color="primary"
      size="80px"
    />
  </div>
  <div
    v-else
    class="row q-col-gutter-lg"
  >
    <div
      v-if="image"
      class="col-12 col-sm-4 image-preview"
    >
      <div>
        <q-img :src="image.nft.previewImage" />
      </div>
      <div class="title">
        {{ image.title }}
      </div>
      <div class="description">
        {{ image.description }}
      </div>
    </div>
    <div class="col-12 col-sm-8">
      <div class="row q-col-gutter-md">
        <div class="col-12 header">
          {{ $t('dashboard.sellYourArt.createAuction') }}
        </div>
        <div class="col-12">
          <v-form v-slot="formProps">
            <q-form
              class="row q-col-gutter-md"
              @submit="formProps.handleSubmit(createAuction)"
            >
              <div class="col-12">
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  class="col-12"
                  :label="$t('dashboard.sellYourArt.minimumPrice')"
                  name="minimumPrice"
                  rules="required"
                >
                  <q-input
                    :label="$t('dashboard.sellYourArt.minimumPrice')"
                    :model-value="field.value"
                    inputmode="number"
                    mask="#.####"
                    reverse-fill-mask
                    fill-mask="0"
                    color="primary"
                    :rules="[
                      (val) =>
                        val > 0 || $t('dashboard.sellYourArt.setAMinimumPrice'),
                    ]"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    @update:modelValue="handleChange"
                  >
                    <template #append>
                      <q-btn-dropdown
                        color="primary"
                        flat
                      >
                        <template #label>
                          <q-avatar
                            v-if="selectedCoin"
                            size="sm"
                            class="q-mr-md"
                          >
                            <img :src="selectedCoin.img">
                          </q-avatar>
                          <div>
                            {{ selectedCoinLabel }}
                          </div>
                        </template>
                        <template #default>
                          <q-list>
                            <q-item
                              v-for="coin in allowedCoins"
                              :key="coin.value"
                              v-close-popup
                              clickable
                              @click="selectCoin(coin.value)"
                            >
                              <q-item-section avatar>
                                <q-avatar size="sm">
                                  <img :src="coin.img">
                                </q-avatar>
                              </q-item-section>
                              <q-item-section>
                                <q-item-label>
                                  {{ coin.label }}
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </template>
                      </q-btn-dropdown>
                    </template>
                  </q-input>
                </v-field>
              </div>
              <div class="col-12">
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  class="col-12"
                  :label="$t('dashboard.sellYourArt.endDate')"
                  name="endDate"
                  rules="required"
                >
                  <date-field
                    :model-value="field.value"
                    :options="endDateOptions"
                    :label="$t('dashboard.sellYourArt.endDate')"
                    :rules="[
                      (val) =>
                        val !== '' ||
                        $t('dashboard.sellYourArt.setAnEndDate'),
                    ]"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    @update:modelValue="handleChange"
                  />
                </v-field>
              </div>
              <div class="col-12">
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  class="col-12"
                  :label="$t('dashboard.sellYourArt.endTime')"
                  name="endTime"
                  rules="required"
                >
                  <time-field
                    :disable="!formProps.values.endDate"
                    :model-value="field.value"
                    :options="endTimeOptions(formProps.values.endDate)"
                    :label="$t('dashboard.sellYourArt.endTime')"
                    :rules="[
                      (val) =>
                        val !== '' ||
                        $t('dashboard.sellYourArt.setAnEndDate'),
                    ]"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    @update:modelValue="handleChange"
                  />
                </v-field>
              </div>
              <div class="col-12">
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  class="col-12"
                  :label="$t('dashboard.sellYourArt.bidBack')"
                  name="bidBack"
                  rules="required"
                >
                  <q-input
                    inputmode="number"
                    mask="#"
                    reverse-fill-mask
                    fill-mask="0"
                    :label="$t('dashboard.sellYourArt.bidBack')"
                    :model-value="field.value"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                    :rules="[
                      (val) => val >= 1 || $t('dashboard.sellYourArt.minimumBidBackRate'),
                      (val) => val <= 30 || $t('dashboard.sellYourArt.maximumBidBackRate'),
                    ]"
                    @update:modelValue="handleChange"
                  >
                    <template #append>
                      <q-icon name="mdi-help-circle-outline" />
                      <q-tooltip class="bg-primary">
                        {{ $t('dashboard.sellYourArt.bidBackTooltip') }}
                      </q-tooltip>
                    </template>
                  </q-input>
                </v-field>
              </div>
              <div class="col-12">
                <v-field
                  v-slot="{ field, handleChange }"
                  class="col-12"
                  :label="$t('dashboard.sellYourArt.pirs')"
                  name="pirs"
                >
                  <q-input
                    v-if="hasPirs"
                    inputmode="number"
                    mask="#"
                    filled
                    reverse-fill-mask
                    fill-mask="0"
                    :label="$t('dashboard.sellYourArt.pirs')"
                    readonly
                    :hint="$t('dashboard.sellYourArt.readOnlyField')"
                    :model-value="imagePirsRate ? imagePirsRate : 0"
                    @update:modelValue="handleChange"
                  >
                    <template #append>
                      <q-icon name="mdi-help-circle-outline" />
                      <q-tooltip class="bg-primary">
                        {{ $t('dashboard.sellYourArt.pirsTooltip') }}
                      </q-tooltip>
                    </template>
                  </q-input>
                  <q-input
                    v-else
                    v-model="PIRSRate"
                    inputmode="number"
                    mask="#"
                    reverse-fill-mask
                    fill-mask="0"
                    :label="$t('dashboard.sellYourArt.pirs')"
                    :model-value="field.value"
                    :rules="[
                      (val) => val >= 1 || $t('dashboard.sellYourArt.minimumPIRSRate'),
                      (val) => val <= 30 || $t('dashboard.sellYourArt.maximumPIRSRate'),
                    ]"
                    @update:modelValue="handleChange"
                  >
                    <template #append>
                      <q-icon name="mdi-help-circle-outline" />
                      <q-tooltip class="bg-primary">
                        {{ $t('dashboard.sellYourArt.pirsTooltip') }}
                      </q-tooltip>
                    </template>
                  </q-input>
                </v-field>
              </div>
              <div class="col-12">
                <v-field
                  v-slot="{ handleChange }"
                  class="col-12"
                  :label="$t('dashboard.sellYourArt.creatorRoyalties')"
                  name="royalties"
                >
                  <q-input
                    inputmode="number"
                    mask="#"
                    :hint="$t('dashboard.sellYourArt.readOnlyField')"
                    filled
                    reverse-fill-mask
                    fill-mask="0"
                    :label="$t('dashboard.sellYourArt.creatorRoyalties')"
                    :model-value="collectionCreatorRoyaltiesRate"
                    readonly
                    @update:modelValue="handleChange"
                  >
                    <template #append>
                      <q-icon name="mdi-help-circle-outline" />
                      <q-tooltip class="bg-primary">
                        {{ $t('dashboard.sellYourArt.creatorTooltip') }}
                      </q-tooltip>
                    </template>
                  </q-input>
                </v-field>
              </div>
              <div class="col-12">
                <div class="q-mr-md">
                  <q-field
                    v-if="!hasPirs"
                    ref="toggle"
                    :value="isUserInformedThatPirsCanBeOnlySetOnce"
                    :rules="[
                      (val) => isUserInformedThatPirsCanBeOnlySetOnce === true || $t('dashboard.sellYourArt.acknowledgeTerm'),
                    ]"
                    borderless
                    dense
                    hide-bottom-space
                  >
                    <template #control>
                      <q-checkbox
                        v-model="isUserInformedThatPirsCanBeOnlySetOnce"
                        color="green"
                        :label="$t('dashboard.sellYourArt.pirsMessage')"
                      />
                    </template>
                  </q-field>
                  <q-field
                    ref="toggle"
                    :value="isUserInformedAboutTheFee"
                    :rules="[
                      (val) => isUserInformedAboutTheFee === true || $t('dashboard.sellYourArt.acknowledgeTerm'),
                    ]"
                    borderless
                    dense
                    hide-bottom-space
                  >
                    <template #control>
                      <q-checkbox
                        v-model="isUserInformedAboutTheFee"
                        color="green"
                        :label="
                          $t('dashboard.sellYourArt.feeMessage', {
                            auctionFeePercentage: auctionFeeRate,
                          })
                        "
                      />
                    </template>
                  </q-field>
                </div>
                <div class="flex justify-end">
                  <algo-button
                    class="q-mb-md"
                    type="submit"
                    color="primary"
                    :label="$t('dashboard.sellYourArt.createAuction')"
                  />
                </div>
              </div>
            </q-form>
          </v-form>
        </div>
      </div>
    </div>
    <q-dialog
      v-model="displayingStatus"
      persistent
    >
      <create-auction-status-card
        :create-auction-status="createAuctionStatus"
        :has-pirs="hasPirs"
        @request-close="onCloseStatusDialog"
      />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';
import moment from 'moment';
import { Form as VForm, Field as VField } from 'vee-validate';
import { clone } from 'ramda';

import { auctionCoins } from 'src/helpers/auctionCoins';
import { currencyToBlockchain } from 'src/helpers/format/currencyToBlockchain';
import { getImage } from 'src/api/images';
import { IImage } from 'src/models/IImage';
import AlgoPainterAuctionSystemProxy, {
  TokenType,
} from 'src/eth/AlgoPainterAuctionSystemProxy';
import AlgoPainterItemProxy from 'src/eth/AlgoPainterItemProxy';
import AlgoPainterBidBackPirsProxy from 'src/eth/AlgoPainterBidBackPirsProxy';
import { getAuctionSystemContractByNetworkId } from 'src/eth/Config';
import { Watch } from 'vue-property-decorator';
import { NetworkInfo } from 'src/store/user/types';

import AlgoButton from 'components/common/Button.vue';
import DateField from 'components/fields/DateField.vue';
import TimeField from 'components/fields/TimeField.vue';
import CreateAuctionStatusCard from 'components/auctions/auction/CreateAuctionStatusCard.vue';
import AlgoPainterPersonalItemProxy from 'src/eth/AlgoPainterPersonalItemProxy';
import { numberToString } from 'src/helpers/format/numberToString';

interface INewAuction {
  minimumPrice: number;
  endDate: string;
  endTime: string;
  coin: string;
  bidBack: number;
  pirs: number;
}

interface IAllowedTokens {
  [key: string]: boolean;
}

enum CreatingAuctionStatus {
  CheckingContractApproved,
  ContractApprovedAwaitingInput,
  ContractApprovedAwaitingConfirmation,
  ContractApprovedError,
  SettingPirsAwaitingInput,
  SettingPirsAwaitingConfirmation,
  SettingPirsError,
  SettingPirsCompleted,
  CreateAuctionAwaitingInput,
  CreateAuctionAwaitingConfirmation,
  CreateAuctionError,
  AuctionCreated,
  SettingBidBackAwaitingInput,
  SettingBidBackAwaitingConfirmation,
  SettingBidBackError,
  SettingBidBackCompleted,
}

@Options({
  components: {
    AlgoButton,
    DateField,
    TimeField,
    CreateAuctionStatusCard,
    VForm,
    VField,
  },
  computed: {
    ...mapGetters('user', {
      userAccount: 'account',
      networkInfo: 'networkInfo',
      isConnected: 'isConnected',
    }),
  },
})
export default class SellYourArt extends Vue {
  clone = clone;

  auctionSystem!: AlgoPainterAuctionSystemProxy;
  rewardsRates!: AlgoPainterBidBackPirsProxy;
  artTokenContract!: AlgoPainterItemProxy;
  personalItemContract!: AlgoPainterPersonalItemProxy;

  networkInfo!: NetworkInfo;
  userAccount!: string;
  isConnected!: boolean;
  PIRSRate!: number;

  image: IImage | null = null;
  loading: boolean = false;
  loadingCoins: boolean = false;
  auctionId!: number;
  isCreator: boolean = false;
  hasPirs: boolean = false;
  createdPirs!: number | null;
  createdItems!: number;

  coin: string = '3';

  allowedTokens: IAllowedTokens = {};

  displayingStatus: boolean = false;
  createAuctionStatus: CreatingAuctionStatus | null = null;
  createBidBackStatus: CreatingAuctionStatus | null = null;

  isUserInformedAboutTheFee: boolean = false;
  isUserInformedThatPirsCanBeOnlySetOnce: boolean = false;
  auctionFeeRate!: string;
  hashPersonalItem!: string;

  imagePirsRate!: number | null;
  collectionCreatorRoyaltiesRate: number | null = 0;

  async mounted() {
    await this.prepareComponent();
  }

  async created() {
    if (!localStorage.isConnected) {
      return this.$router.push('/');
    }
    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    this.rewardsRates = new AlgoPainterBidBackPirsProxy(this.networkInfo);
    this.personalItemContract = new AlgoPainterPersonalItemProxy(this.networkInfo);
  }

  async prepareComponent() {
    await this.loadImage();
    await this.loadAvailableTokens();
    await this.getAuctionRates();
  }

  @Watch('isConnected')
  async onIsConnectedChanged() {
    if (this.isConnected) {
      this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);
      this.rewardsRates = new AlgoPainterBidBackPirsProxy(this.networkInfo);
      this.personalItemContract = new AlgoPainterPersonalItemProxy(this.networkInfo);
      await this.prepareComponent();
    }
  }

  async getAuctionRates() {
    const { id } = this.$route.params;
    this.image = await getImage(id as string);

    if (this.image.collectionName === 'PersonalItem') {
      this.hashPersonalItem = await this.personalItemContract.getTokenHashForAuction(this.image.nft.index) as string;
      this.createdItems = await this.rewardsRates.getCreatorRoyaltiesByTokenAddress(this.hashPersonalItem);
    } else {
      this.createdPirs = await this.rewardsRates.getCreatorRoyaltiesByTokenAddress(this.image.collectionOwner);
    }

    this.collectionCreatorRoyaltiesRate = this.createdItems / 100;
    this.hasPirs = await this.rewardsRates.hasPIRSRateSetPerImage(this.image.collectionOwner, this.image.nft.index);

    if (this.hasPirs) {
      this.imagePirsRate = (this.image.pirs.investorRate || 0) / 100;
    }

    await this.getAuctionFeeRate();
  }

  async getAuctionFeeRate() {
    const auctionFeeRate =
      (await this.auctionSystem.getAuctionFeeRate()) / 10000;

    this.auctionFeeRate = this.$n(auctionFeeRate, 'percent', {
      maximumFractionDigits: 2,
    } as unknown as string);
  }

  get auctionSystemContractAddress() {
    return getAuctionSystemContractByNetworkId(this.networkInfo.id);
  }

  get allowedCoins() {
    return auctionCoins.filter((rawCoin) => {
      return this.allowedTokens[rawCoin.tokenAddress.toLowerCase()];
    });
  }

  get selectedCoin() {
    if (!this.coin) {
      return null;
    }

    const selectedOption = this.allowedCoins.find(
      (option) => option.value === this.coin,
    );

    if (!selectedOption) {
      return null;
    }

    return selectedOption;
  }

  get selectedCoinLabel() {
    if (!this.selectedCoin) {
      return this.$t('dashboard.sellYourArt.selectCoin');
    }

    return this.selectedCoin.label;
  }

  get nowFormatted() {
    return moment().format('YYYY/MM/DD');
  }

  async loadImage() {
    const { id } = this.$route.params;

    this.loading = true;

    this.image = await getImage(id as string);
    this.artTokenContract = new AlgoPainterItemProxy(
      this.image.collectionOwner,
    );

    const owner = await this.artTokenContract.ownerOf(this.image.nft.index);

    if (owner.toLowerCase() !== this.userAccount) {
      return this.$router.push('/');
    }

    this.loading = false;
  }

  async loadAvailableTokens() {
    try {
      this.loadingCoins = true;

      const tokens = await this.auctionSystem.getAllowedTokens();

      this.allowedTokens = tokens.reduce((curr, token) => {
        return { ...curr, [token.toLowerCase()]: true };
      }, {});

      this.loadingCoins = false;
    } catch {
      this.loadingCoins = false;
    }
  }

  selectCoin(coin: string) {
    this.coin = coin;
  }

  endDateOptions(date: string) {
    const dayWrapper = moment().add(30, 'days');
    const dayString = dayWrapper.format('YYYY/MM/DD');
    return date > this.nowFormatted && date <= dayString;
  }

  endTimeOptions(date: string) {
    const now = moment().add(24, 'hours');
    const currentDate = now.format('MM/DD/YYYY');

    return (hour: number, minute: number | null) => {
      if (currentDate !== date) {
        return true;
      }

      const currentHour = now.hour();
      const currentMinute = now.minute();
      return !minute
        ? hour > currentHour
        : hour !== currentHour || minute > currentMinute;
    };
  }

  async approveContract() {
    if (typeof this.PIRSRate === 'undefined') {
      if (this.imagePirsRate) {
        this.PIRSRate = this.imagePirsRate;
      }
    }
    this.createAuctionStatus = CreatingAuctionStatus.CheckingContractApproved;

    const contractApproved = await this.artTokenContract.isApprovedForAll(
      this.userAccount,
      this.auctionSystemContractAddress,
    );

    if (contractApproved) {
      return;
    }

    this.createAuctionStatus = CreatingAuctionStatus.ContractApprovedAwaitingInput;

    await this.artTokenContract.setApprovalForAll(
      this.auctionSystemContractAddress,
      true,
      this.userAccount,
    ).on('transactionHash', () => {
      this.createAuctionStatus = CreatingAuctionStatus.ContractApprovedAwaitingConfirmation;
    }).on('error', () => {
      this.createAuctionStatus = CreatingAuctionStatus.ContractApprovedError;
    });
  }

  async setInvestorPirs(pirs: number) {
    const { id } = this.$route.params;
    this.image = await getImage(id as string);
    this.createAuctionStatus = CreatingAuctionStatus.SettingPirsAwaitingInput;
    await this.rewardsRates
      .setPIRSRate(
        this.image.collectionOwner,
        this.image.nft.index,
        pirs,
        this.userAccount,
      )
      .on('transactionHash', () => {
        this.createAuctionStatus =
          CreatingAuctionStatus.SettingPirsAwaitingConfirmation;
      })
      .on('error', () => {
        this.createAuctionStatus = CreatingAuctionStatus.SettingPirsError;
      });
    this.createAuctionStatus = CreatingAuctionStatus.SettingPirsCompleted;
  }

  async createAuction(auction: INewAuction) {
    try {
      this.displayingStatus = true;

      if (!this.image || !this.selectedCoin) {
        return;
      }

      await this.approveContract();
      if (!this.hasPirs) {
        await this.setInvestorPirs(this.PIRSRate * 100);
      }

      const { minimumPrice, endDate, endTime, bidBack } = auction;
      const bidBackRate = bidBack * 100;
      let { pirs } = auction;
      const { decimalPlaces } = this.selectedCoin;
      if (typeof pirs === 'undefined') {
        if (this.imagePirsRate) {
          pirs = this.imagePirsRate;
        }
      }
      const minimumPriceFormatted = currencyToBlockchain(
        Number(minimumPrice),
        decimalPlaces,
      );

      this.createAuctionStatus =
        CreatingAuctionStatus.CreateAuctionAwaitingInput;

      if (
        (await this.createAuctionResponse(
          minimumPriceFormatted,
          endDate,
          endTime,
          bidBackRate,
        )) !== 'no error'
      ) {
        this.displayingStatus = false;
        return;
      }

      const auctionResponse = await this.auctionSystem
        .createAuction(
          TokenType.ERC721,
          this.image.collectionOwner,
          this.image.nft.index,
          numberToString(minimumPriceFormatted),
          moment(`${endDate} ${endTime}`, 'MM/DD/YYYY hh:mm').unix(),
          this.selectedCoin.tokenAddress,
          bidBackRate,
          this.userAccount,
        )
        .on('transactionHash', () => {
          this.createAuctionStatus = CreatingAuctionStatus.CreateAuctionAwaitingConfirmation;
        })
        .on('error', () => {
          this.createAuctionStatus = CreatingAuctionStatus.CreateAuctionError;
        });

      this.createAuctionStatus = CreatingAuctionStatus.AuctionCreated;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.auctionId = auctionResponse.events.AuctionCreated.returnValues.auctionId as number;
    } catch {
      this.displayingStatus = false;
    }
  }

  async createAuctionResponse(
    minimumPriceFormatted: number,
    endDate: string,
    endTime: string,
    bidBack: number,
  ) {
    if (this.image && this.selectedCoin) {
      try {
        await this.auctionSystem.createAuctionCall(
          TokenType.ERC721,
          this.image.collectionOwner,
          this.image.nft.index,
          numberToString(minimumPriceFormatted),
          moment(`${endDate} ${endTime}`, 'MM/DD/YYYY hh:mm').unix(),
          this.selectedCoin.tokenAddress,
          bidBack,
          this.userAccount,
        );
        return 'no error';
      } catch (e:any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const obj = JSON.parse(e.message.replace('Internal JSON-RPC error.', '')) as { code: number; data: string; message: string };
        switch (obj.message) {
          case 'execution reverted: AlgoPainterAuctionSystem:INVALID_TIME_STAMP':
            return this.$q.notify({
              type: 'negative',
              message: this.$t(
                'dashboard.sellYourArt.errorHandling.invalidTimeStamp',
              ),
              icon: 'mdi-alert',
            });
          default:
            return this.$q.notify({
              type: 'negative',
              message: this.$t('dashboard.sellYourArt.errorHandling.default'),
              icon: 'mdi-alert',
            });
        }
      }
    }
  }

  onCloseStatusDialog() {
    this.displayingStatus = false;

    if (
      this.createAuctionStatus ===
        CreatingAuctionStatus.SettingBidBackCompleted ||
      this.createAuctionStatus === CreatingAuctionStatus.AuctionCreated
    ) {
      this.$q.notify({
        type: 'positive',
        message: this.$t('dashboard.sellYourArt.auctionCreated'),
      });

      void this.$router.push('/');
    }
  }
}
</script>

<style lang="scss" scoped>
.image-preview {
  .title {
    font-weight: bold;
    font-size: 1.8rem;
  }
}
</style>
