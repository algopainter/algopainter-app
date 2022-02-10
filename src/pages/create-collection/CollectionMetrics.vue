<template>
  <div class="start-date">
    <p class="label">{{ $t('dashboard.createCollection.stepTwo.startDT') }}</p>
    <q-input
      v-model="form.startDT"
      :rules="[ val => timeValidator() || dateErrorMsg ]"
    >
      <template #append>
        <q-icon
          name="event"
          class="cursor-pointer"
        >
          <q-popup-proxy
            ref="dateRef"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="form.startDT"
              mask="MM/DD/YYYY HH:mm"
            />
            <q-time
              v-model="form.startDT"
              mask="MM/DD/YYYY HH:mm"
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
  <div class="end-date">
    <p class="label">{{ $t('dashboard.createCollection.stepTwo.endDT') }}</p>
    <q-input
      v-model="form.endDT"
      :rules="[ val => timeValidator() || dateErrorMsg]"
    >
      <template #append>
        <q-icon
          name="event"
          class="cursor-pointer"
        >
          <q-popup-proxy
            ref="dateRef"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="form.endDT"
              mask="MM/DD/YYYY HH:mm"
            />
            <q-time
              v-model="form.endDT"
              mask="MM/DD/YYYY HH:mm"
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
  <q-input
    v-model="form.nfts"
    class="nft-amount"
    :label="$t('dashboard.createCollection.stepTwo.amount')"
    mask="#"
    fill-mask="0"
    reverse-fill-mask
    :rules="[ val => validateNfts(val) || nftsErrMsg]"
  />
  <div class="algo-radio">
    <p class="label">{{ $t('dashboard.createCollection.stepTwo.scheme') }}</p>
    <div class="row q-col-gutter-md">
      <q-radio
        v-model="form.priceType"
        :label="$t('dashboard.createCollection.stepTwo.fixed')"
        class="option"
        :val="'fixed'"
        @click="clearPriceRange()"
      />
      <q-radio
        v-model="form.priceType"
        :label="$t('dashboard.createCollection.stepTwo.variable')"
        class="option"
        :val="'variable'"
        @click="setFirstPriceRange()"
      />
    </div>
  </div>
  <div class="price">
    <div v-if="form.priceType === 'fixed'" class="fixed-price">
      <q-input
        v-model="form.priceRange[0].amount"
        :label="$t('dashboard.createCollection.stepTwo.price')"
        mask="#.####"
        fill-mask="0"
        reverse-fill-mask
      >
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
        </q-btn-dropdown>
      </q-input>
    </div>
    <div v-if="form.priceType === 'variable'" class="variable-price">
      <div
        v-for="(priceRange, index) in form.priceRange"
        :key="index"
        class="q-pa-md q-my-md variable-card"
      >
        <div class="row">
          <q-input
            v-model="form.priceRange[index].from"
            class="col-6 q-px-md"
            :label="$t('dashboard.createCollection.stepTwo.from')"
            readonly
          />
          <q-input
            v-model="form.priceRange[index].to"
            class="col-6 q-px-md"
            :label="$t('dashboard.createCollection.stepTwo.to')"
            :readonly="(index + 1) < form.priceRange.length"
            mask="#"
            fill-mask="0"
            reverse-fill-mask
            :rules="[ val => toPriceRangeValidator(val, index) || toPriceRangeError ]"
          />
        </div>
        <q-input
          v-model="form.priceRange[index].amount"
          class="q-px-md"
          :label="$t('dashboard.createCollection.stepTwo.price')"
          mask="#.####"
          fill-mask="0"
          reverse-fill-mask
        >
          <q-btn-dropdown
            v-if="index === 0"
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
          </q-btn-dropdown>
        </q-input>
      </div>
      <q-btn flat :disable="isAddDisabled()" class="q-mr-sm" @click="addPriceRange()">
        <q-icon
          name="add_circle"
          color="grey-4"
          class="q-mr-sm"
          size="30px"
        />
        {{ $t('dashboard.createCollection.stepTwo.add') }}
      </q-btn>
      <q-btn flat :disable="isRemoveDisabled" @click="removePriceRange()">
        <q-icon
          name="remove_circle"
          color="grey-4"
          class="q-mr-sm"
          size="30px"
        />
        {{ $t('dashboard.createCollection.stepTwo.remove') }}
      </q-btn>
    </div>
  </div>
  <q-input
    v-model="form.creatorPercentage"
    :label="$t('dashboard.createCollection.stepTwo.creator')"
    suffix="%"
    mask="#"
    fill-mask="0"
    reverse-fill-mask
    :rules="[ val => validateCreator(val) || creatorErrMsg ]"
  />
  <q-input
    v-model.trim="form.walletAddress"
    :label="$t('dashboard.createCollection.stepTwo.address')"
    maxlength="42"
    :rules="[ val => validateWalletAddress(val) || walletAddressErrMsg ]"
  />
  <error v-if="(isError || isPriceRangeError) && isVerifyingTheForm" :error-msg="isErrorMsg" />
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { mapGetters } from 'vuex';
import { Watch } from 'vue-property-decorator';
import moment from 'moment';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterAuctionSystemProxy from 'src/eth/AlgoPainterAuctionSystemProxy';
import Error from './Error.vue';

interface ICollectionMetricsPriceRange {
  from: number;
  to: number;
  amount: number | string;
  tokenPriceAddress: string;
  tokenPriceSymbol: string;
}

interface ICollectionMetrics {
  nfts: number;
  startDT: Date | string;
  endDT: Date | string;
  priceType: 'fixed' | 'variable';
  tokenPriceAddress: string | null | undefined;
  tokenPriceSymbol: string | null | undefined;
  priceRange: ICollectionMetricsPriceRange[];
  creatorPercentage: number;
  walletAddress: string;
}

interface IAllowedTokens {
  [key: string]: boolean;
}

class Props {
  step = prop({
    type: Number,
    required: true,
  });

  checkForm = prop({
    type: String,
    required: true,
  });
}

@Options({
  computed: {
    ...mapGetters('user', {
      userAccount: 'account',
      networkInfo: 'networkInfo',
      isConnected: 'isConnected',
    }),
  },
  components: {
    Error,
  }
})
export default class CollectionMetrics extends Vue.with(Props) {
  auctionSystem!: AlgoPainterAuctionSystemProxy;
  networkInfo!: NetworkInfo;
  userAccount!: string;
  isConnected!: boolean;

  form: ICollectionMetrics = {
    nfts: 500,
    startDT: moment().add(24, 'hour').format('MM/DD/YYYY HH:mm'),
    endDT: moment().add(2184, 'hour').format('MM/DD/YYYY HH:mm'),
    priceType: 'fixed',
    tokenPriceAddress: process.env.VUE_APP_ALGOP_TOKEN_ADDRESS,
    tokenPriceSymbol: 'ALGOP',
    priceRange: [
      {
        from: 1,
        to: 500,
        amount: '600.0000',
        tokenPriceAddress: process.env.VUE_APP_ALGOP_TOKEN_ADDRESS || '',
        tokenPriceSymbol: 'ALGOP'
      }
    ],
    creatorPercentage: 1,
    walletAddress: '',
  }

  dateErrorMsg: string = '';
  isError: boolean = false;
  isErrorMsg: string = '';

  allowedTokens: IAllowedTokens = {};
  coin: string = '3';
  loadingCoins: boolean = false;

  isRemoveDisabled: boolean = true;
  toPriceRangeError: string = '';
  fromRangeArr: number[] = [];
  toRangeArr: number[] = [];
  isPriceRangeError: boolean = false;
  isVerifyingTheForm: boolean = false;
  creatorErrMsg: string = '';
  walletAddressErrMsg: string = '';
  nftsErrMsg: string = '';

  created() {
    if (this.isConnected) {
      this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    }
    void this.loadAvailableTokens();
  }

  mounted() {
    this.form.walletAddress = this.userAccount;
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    }
  }

  @Watch('checkForm')
  onCheckFormErrorChanged() {
    if (this.checkForm) {
      this.$emit('verify', this.verifyForm());
    }
  }

  verifyForm() {
    this.isVerifyingTheForm = true;

    if (this.isPriceRangeError) {
      this.isErrorMsg = this.$t('dashboard.createCollection.stepTwo.priceRangeErr');
    } else if (this.isError) {
      this.isErrorMsg = this.$t('dashboard.createCollection.stepTwo.isErr');
    } else if (this.toRangeArr[this.toRangeArr.length - 1] !== Number(this.form.nfts) && this.form.priceType === 'variable') {
      this.isPriceRangeError = true;
      this.isErrorMsg = this.$t('dashboard.createCollection.stepTwo.lastToField');
    } else if (this.form.priceType === 'variable' && this.form.priceRange.length === 1) {
      this.isPriceRangeError = true;
      this.isErrorMsg = this.$t('dashboard.createCollection.stepTwo.onlyOneRange');
    } else {
      this.isVerifyingTheForm = false;
      return true;
    }

    return false;
  }

  @Watch('form.tokenPriceSymbol')
  onFormTokenPriceSymbolTypeChanged() {
    this.form.priceRange.forEach((range) => {
      range.tokenPriceSymbol = this.form.tokenPriceSymbol || '';
      range.tokenPriceAddress = this.form.tokenPriceAddress || '';
    });
  }

  addPriceRange() {
    const lastTo = this.toRangeArr[this.toRangeArr.length - 1];

    this.form.priceRange.push({
      from: lastTo + 1,
      to: Number(this.form.nfts),
      amount: this.form.priceRange[0].amount,
      tokenPriceAddress: this.form.priceRange[0].tokenPriceAddress,
      tokenPriceSymbol: this.form.priceRange[0].tokenPriceSymbol
    })

    this.fromRangeArr.push(lastTo + 1);
    this.toRangeArr.push(Number(this.form.nfts));

    this.isRemoveDisabled = (this.form.priceRange.length === 1);
  }

  removePriceRange() {
    this.isPriceRangeError = false;
    this.form.priceRange.pop();
    this.fromRangeArr.pop();
    this.toRangeArr.pop();

    this.isRemoveDisabled = (this.form.priceRange.length === 1);
  }

  clearPriceRange() {
    this.isPriceRangeError = false;

    this.form.priceRange = [
      {
        from: 1,
        to: 500,
        amount: '600.0000',
        tokenPriceAddress: this.form.tokenPriceAddress || '',
        tokenPriceSymbol: this.form.tokenPriceSymbol || ''
      }
    ]
  }

  setFirstPriceRange() {
    this.isPriceRangeError = false;
    this.fromRangeArr = [1];
    this.toRangeArr = [this.form.nfts];
    this.form.priceRange[0].to = this.form.nfts;
    this.form.priceRange[0].tokenPriceAddress = this.form.tokenPriceAddress || '';
    this.form.priceRange[0].tokenPriceSymbol = this.form.tokenPriceSymbol || '';
  }

  toPriceRangeValidator(val: string, index: number) {
    this.toRangeArr[index] = Number(val);

    if (this.toRangeArr[index] > Number(this.form.nfts)) {
      this.toPriceRangeError = this.$t('dashboard.createCollection.stepTwo.rangeTooBig');
      this.isPriceRangeError = true;
      return false;
    } else if (this.toRangeArr[index] < this.fromRangeArr[index]) {
      this.toPriceRangeError = this.$t('dashboard.createCollection.stepTwo.toTooSmall');
      this.isPriceRangeError = true;
      return false;
    } else {
      this.isPriceRangeError = false;
      return true;
    }
  }

  validateNfts(val: string | number) {
    if (Number(val) === 0) {
      this.isError = true;
      this.nftsErrMsg = this.$t('dashboard.createCollection.stepTwo.emptyNfts');
      return false;
    } else if (Number(val) <= 1000) {
      this.isError = false;
      this.nftsErrMsg = '';
      return true;
    } else {
      this.isError = true;
      this.nftsErrMsg = this.$t('dashboard.createCollection.stepTwo.amountMax');
      return false;
    }
  }

  validateCreator(val: string | number) {
    if (Number(val) < 1) {
      this.isError = true;
      this.creatorErrMsg = this.$t('dashboard.createCollection.stepTwo.creatorMin');
      return false;
    } else if (Number(val) > 30) {
      this.isError = true;
      this.creatorErrMsg = this.$t('dashboard.createCollection.stepTwo.creatorMax');
      return false;
    } else {
      this.isError = false;
      this.creatorErrMsg = '';
      return true;
    }
  }

  validateWalletAddress(val: string) {
    if (val === '') {
      this.isError = true;
      this.walletAddressErrMsg = this.$t('dashboard.createCollection.stepTwo.emptyField');
      return false;
    } else if (val && val.length !== 42) {
      this.isError = true;
      this.walletAddressErrMsg = this.$t('dashboard.createCollection.stepTwo.wrongWallet');
      return false;
    } else {
      this.isError = false;
      this.walletAddressErrMsg = '';
      return true;
    }
  }

  isAddDisabled() {
    return this.toRangeArr[this.toRangeArr.length - 1] >= this.form.nfts || this.isPriceRangeError;
  }

  timeValidator() {
    const diffMinutes = moment(this.form.startDT).diff(moment(this.form.endDT), 'minute');
    const diffHour = moment(this.form.startDT).diff(moment(this.form.endDT), 'hour');
    const diffTodayMinutes = moment(this.form.startDT).diff(moment(), 'minute');

    if (diffTodayMinutes < 0) {
      this.dateErrorMsg = this.$t('dashboard.createCollection.stepTwo.dateB42day');
      this.isError = true;
      return false;
    }

    if (diffMinutes >= 1) {
      this.dateErrorMsg = this.$t('dashboard.createCollection.stepTwo.datePast');
      this.isError = true;
      return false;
    }

    if (diffMinutes > -1440) {
      this.dateErrorMsg = this.$t('dashboard.createCollection.stepTwo.dateMin');
      this.isError = true;
      return false;
    }

    if (diffHour < -2184) {
      this.dateErrorMsg = this.$t('dashboard.createCollection.stepTwo.dateMax');
      this.isError = true;
      return false;
    }

    this.isError = false;
    return true;
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
    this.form.tokenPriceAddress = this.allowedCoins[Number(coin) - 1].tokenAddress;
    this.form.tokenPriceSymbol = this.allowedCoins[Number(coin) - 1].label;
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

  parseForm() {
    const parsedForm: ICollectionMetrics = JSON.parse(JSON.stringify(this.form));

    parsedForm.nfts = Number(parsedForm.nfts);
    parsedForm.startDT = moment(parsedForm.startDT).toISOString();
    parsedForm.endDT = moment(parsedForm.endDT).toISOString();
    parsedForm.creatorPercentage = Number(parsedForm.creatorPercentage) * 100;

    parsedForm.priceRange.forEach((range: ICollectionMetricsPriceRange) => {
      range.to = Number(range.to);
      range.amount = typeof (range.amount) === 'string' ? Number(range.amount.replace(/\./g, '')) / 10000 : range.amount;
    })

    return parsedForm;
  }

  @Watch('step')
  onStepChanged() {
    if (this.step === 3) {
      if (this.form.priceType === 'fixed') {
        this.form.priceRange[0].to = Number(this.form.nfts);
      }

      this.$emit('data', this.parseForm(), this.step - 1);
    };
  }
}
</script>

<style scoped lang="scss">
.start-date,
.end-date {
  .label {
    margin: 0px;
    position: relative;
    top: 15px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 400;
  }
}

.algo-radio {
  margin-top: 1rem;
  .label {
    font-weight: 400;
    margin: 0 0 10px 0;
    color: rgba(0, 0, 0, 0.6);
  }
  .option {
    padding: 0px;
  }
}

.variable-card {
  border: 1px $primary solid;
  border-radius: 5px;
}
</style>
