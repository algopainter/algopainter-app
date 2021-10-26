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
                    :model-value="field.value"
                    :options="endTimeOptions(formProps.values.endDate)"
                    :label="$t('dashboard.sellYourArt.endTime')"
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
                    type="number"
                    :label="$t('dashboard.sellYourArt.bidBack')"
                    :model-value="field.value"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                    :rules="[val => val <= 30 || 'Please insert a number that is smaller than 30',
                             val => val >= 0 || 'The number must be bigger than 0']"
                    @update:modelValue="handleChange"
                  />
                </v-field>
              </div>
              <div
                v-if="isCreator"
                class="col-12"
              >
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  class="col-12"
                  :label="$t('dashboard.sellYourArt.bidBack')"
                  name="pirs"
                  rules="required"
                >
                  <q-input
                    type="number"
                    :label="$t('dashboard.sellYourArt.pirs')"
                    :model-value="field.value"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                    :rules="[val => val <= 30 || 'Please insert a number that is smaller than 30',
                             val => val >= 0 || 'The number must be bigger than 0']"
                    @update:modelValue="handleChange"
                  />
                </v-field>
              </div>
              <div class="col-12">
                <div class="q-mr-md q-mb-md">
                  {{ $t('dashboard.auctionPage.feeMessage') }}
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
        :is-creator="isCreator"
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
import { numberToString } from 'src/helpers/format/numberToString';
import { getImage } from 'src/api/images';
import { IImage } from 'src/models/IImage';
import AlgoPainterAuctionSystemProxy, {
  TokenType,
} from 'src/eth/AlgoPainterAuctionSystemProxy';
import AlgoPainterItemProxy from 'src/eth/AlgoPainterItemProxy';
import AlgoPainterBidBackPirsProxy from 'src/eth/AlgoPainterBidBackPirsProxy';
import { getAuctionSystemContractByNetworkId } from 'src/eth/Config';
import { NetworkInfo } from 'src/store/user/types';

import AlgoButton from 'components/common/Button.vue';
import DateField from 'components/fields/DateField.vue';
import TimeField from 'components/fields/TimeField.vue';
import CreateAuctionStatusCard
  from 'components/auctions/auction/CreateAuctionStatusCard.vue';

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
  CreateAuctionAwaitingInput,
  CreateAuctionAwaitingConfirmation,
  CreateAuctionError,
  AuctionCreated,
  SettingBidbackAwaitingInput,
  SettingBidbackAwaitingConfirmation,
  SettingBidbackError,
  SettingBidbackCompleted,
  SettingPirsAwaitingInput,
  SettingPirsAwaitingConfirmation,
  SettingPirsError,
  SettingPirsCompleted,
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
    }),
  },
})
export default class SellYourArt extends Vue {
  clone = clone;

  auctionSystem!: AlgoPainterAuctionSystemProxy;
  artTokenContract!: AlgoPainterItemProxy;
  networkInfo!: NetworkInfo;
  userAccount!: string;

  image: IImage | null = null;
  loading: boolean = false;
  loadingCoins: boolean = false;
  bidbackSystem!: AlgoPainterBidBackPirsProxy;
  pirsSystem!: AlgoPainterBidBackPirsProxy;
  auctionId!: number;
  isCreator: boolean = false;

  coin: string = '3';

  allowedTokens: IAllowedTokens = {};

  creatingAuction: boolean = false;
  displayingStatus: boolean = false;
  createAuctionStatus: CreatingAuctionStatus | null = null;
  createBidBackStatus: CreatingAuctionStatus | null = null;

  /*
  async getFee() {
    await this.auctionSystem.getAuctionAmountInfo(10000, this.userAccount).on('transactionHash', () => {
      console.log('auction');
    }).on('error', () => {
      console.log('error');
    });
  }

  mounted() {
    void this.getFee();
  }
  */

  mounted() {
    void this.validatePirs();
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

    const selectedOption = this.allowedCoins
      .find((option) => option.value === this.coin);

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

  async validatePirs() {
    const { id } = this.$route.params;

    this.image = await getImage(id as string);
    if (this.image.creator === this.userAccount) {
      this.isCreator = true;
    } else {
      this.isCreator = false;
    }
    // console.log('creatorrr', this.image.collectionOwner);
    // console.log('userAccount', this.userAccount);
  }

  get nowFormatted() {
    return moment().format('YYYY/MM/DD');
  }

  created() {
    if (!localStorage.isConnected) {
      return this.$router.push('/');
    }

    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    this.bidbackSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
    this.pirsSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);

    void this.loadImage();
    void this.loadAvailableTokens();
  }

  async loadImage() {
    const { id } = this.$route.params;

    this.loading = true;

    this.image = await getImage(id as string);
    this.artTokenContract = new AlgoPainterItemProxy(this.image.collectionOwner);

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
    return date >= this.nowFormatted;
  }

  endTimeOptions(date: string) {
    const now = moment();
    const currentDate = now.format('MM/DD/YYYY');

    return (hour: number, minute: number | null) => {
      if (currentDate !== date) {
        return true;
      }

      const currentHour = now.hour();
      const currentMinute = now.minute();

      return !minute
        ? hour >= currentHour
        : hour !== currentHour || minute > currentMinute;
    };
  }
  // aqui

  async approveContract() {
    this.createAuctionStatus = CreatingAuctionStatus.CheckingContractApproved;

    const contractApproved = await this.artTokenContract
      .isApprovedForAll(this.userAccount, this.auctionSystemContractAddress);

    if (contractApproved) {
      return;
    }

    this.createAuctionStatus =
      CreatingAuctionStatus.ContractApprovedAwaitingInput;

    await this.artTokenContract.setApprovalForAll(
      this.auctionSystemContractAddress,
      true,
      this.userAccount,
    ).on('transactionHash', () => {
      this.createAuctionStatus =
        CreatingAuctionStatus.ContractApprovedAwaitingConfirmation;
    }).on('error', () => {
      this.createAuctionStatus = CreatingAuctionStatus.ContractApprovedError;
    });
  }

  async createAuction(auction: INewAuction) {
    try {
      this.creatingAuction = true;
      this.displayingStatus = true;

      if (!this.image || !this.selectedCoin) {
        return;
      }

      await this.approveContract();

      const { minimumPrice, endDate, endTime, bidBack, pirs } = auction;
      const { decimalPlaces } = this.selectedCoin;

      const minimumPriceFormatted = currencyToBlockchain(
        Number(minimumPrice),
        decimalPlaces,
      );

      this.createAuctionStatus =
        CreatingAuctionStatus.CreateAuctionAwaitingInput;

      const auctionResponse = await this.auctionSystem.createAuction(
        TokenType.ERC721,
        this.image.collectionOwner,
        this.image.nft.index,
        numberToString(minimumPriceFormatted),
        moment(`${endDate} ${endTime}`, 'MM/DD/YYYY hh:mm').unix(),
        this.selectedCoin.tokenAddress,
        this.userAccount,
      ).on('transactionHash', () => {
        this.createAuctionStatus =
          CreatingAuctionStatus.CreateAuctionAwaitingConfirmation;
      }).on('error', () => {
        this.createAuctionStatus = CreatingAuctionStatus.CreateAuctionError;
      });

      this.createAuctionStatus = CreatingAuctionStatus.AuctionCreated;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.auctionId = auctionResponse.events.AuctionCreated.returnValues.auctionId as number;
      await this.setBidback(bidBack);
      await this.setInvestorPirs(pirs);

      this.creatingAuction = false;
    } catch {
      this.creatingAuction = false;
    }
  }

  async setBidback(bidBack: number) {
    this.createAuctionStatus = CreatingAuctionStatus.SettingBidbackAwaitingInput;
    await this.bidbackSystem.setBidbackRate(
      this.auctionId,
      bidBack,
      this.userAccount,
    ).on('transactionHash', () => {
      this.createAuctionStatus = CreatingAuctionStatus.SettingBidbackAwaitingConfirmation;
    }).on('error', () => {
      this.createAuctionStatus = CreatingAuctionStatus.SettingBidbackError;
    });
    this.createAuctionStatus = CreatingAuctionStatus.SettingBidbackCompleted;
  }

  async setInvestorPirs(pirs: number) {
    const { id } = this.$route.params;
    this.image = await getImage(id as string);
    console.log('params', this.image.collectionOwner, this.image.nft.index, pirs);
    this.createAuctionStatus = CreatingAuctionStatus.SettingPirsAwaitingInput;
    await this.pirsSystem.setInvestorPirsRate(
      this.image.collectionOwner,
      this.image.nft.index,
      pirs,
      this.userAccount,
    ).on('transactionHash', () => {
      this.createAuctionStatus = CreatingAuctionStatus.SettingPirsAwaitingConfirmation;
      console.log('transactionHash pirs');
    }).on('error', () => {
      this.createAuctionStatus = CreatingAuctionStatus.SettingPirsError;
      console.log('error pirs');
    });
    this.createAuctionStatus = CreatingAuctionStatus.SettingPirsCompleted;
  }

  onCloseStatusDialog() {
    this.displayingStatus = false;

    if (this.createAuctionStatus === CreatingAuctionStatus.AuctionCreated) {
      this.$q.notify({
        type: 'positive',
        message: 'Auction created successfully',
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
