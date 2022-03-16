<template>
  <h5 class="text-bold">Metrics</h5>
  <div class="row">
    <div class="start-date col-6 q-pr-md">
      <p class="label">{{ $t('dashboard.createCollection.stepTwo.startDT') }}</p>
      <q-input
        ref="startDT"
        v-model="form.startDT"
        :rules="[ val => startDtValidator() || dateErrorMsg ]"
        :disable="isEndDtErr"
        readonly
      >
        <template #append>
          <q-icon
            name="event"
            class="cursor-pointer"
          >
            <q-popup-proxy
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="form.startDT"
                :options="startOptions"
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
    <div class="end-date col-6 q-pl-md">
      <p class="label">{{ $t('dashboard.createCollection.stepTwo.endDT') }}</p>
      <q-input
        ref="endDT"
        v-model="form.endDT"
        :rules="[ val => endDtValidator() || dateErrorMsg]"
        readonly
        :disable="isStartDtErr"
      >
        <template #append>
          <q-icon
            name="event"
            class="cursor-pointer"
          >
            <q-popup-proxy
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="form.endDT"
                :options="endOptions"
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
  </div>
  <q-input
    ref="nfts"
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
        ref="amountFixed"
        v-model.number="form.priceRange[0].amount"
        :label="$t('dashboard.createCollection.stepTwo.price')"
        mask="#.####"
        fill-mask="0"
        reverse-fill-mask
        :rules="[ val => validateAmount(val) || priceAmountErrMsg]"
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
        <p class="label q-pl-md">
          {{ $t('dashboard.createCollection.stepTwo.priceRangeCounter', {num: index + 1}) }}
        </p>
        <div class="row">
          <q-input
            v-model="form.priceRange[index].from"
            :label="$t('dashboard.createCollection.stepTwo.from')"
            class="col-6 q-px-md"
            readonly
          />
          <q-input
            ref="to"
            v-model="form.priceRange[index].to"
            :label="$t('dashboard.createCollection.stepTwo.to')"
            class="col-6 q-px-md"
            :readonly="(index + 1) < form.priceRange.length"
            mask="#"
            fill-mask="0"
            reverse-fill-mask
            :rules="[ val => toPriceRangeValidator(val, index) || toPriceRangeError ]"
          />
        </div>
        <q-input
          ref="amountVariable"
          v-model="form.priceRange[index].amount"
          :label="$t('dashboard.createCollection.stepTwo.price')"
          class="col-6 q-px-md"
          mask="#.####"
          fill-mask="0"
          reverse-fill-mask
          :rules="[ val => validateAmount(val) || priceAmountErrMsg]"
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
      <error
        v-if="isPriceRangeLimitMsgShown"
        :error-msg="$t('dashboard.createCollection.stepTwo.priceErrorLimitMsg')"
        :wrapping-margin="'q-my-md'"
      >
        <template #icon>
          <q-avatar
            size="60px"
            color="warning"
            class="icon self-center"
            text-color="white"
          >
            <q-icon name="mdi-alert" />
          </q-avatar>
        </template>
      </error>
      <div class="row">
        <div class="q-mr-sm">
          <q-btn flat :disable="isAddDisabled()" class="q-mr-sm" @click="addPriceRange()">
            <q-icon
              name="add_circle"
              color="grey-4"
              size="30px"
            />
            {{ $t('dashboard.createCollection.stepTwo.add') }}
          </q-btn>
          <q-tooltip v-if="isAddDisabled()">
            {{ $t('dashboard.createCollection.stepTwo.addBtnDisabledMsg') }}
          </q-tooltip>
        </div>
        <div class="q-ml-sm">
          <q-btn flat :disable="isRemoveDisabled" @click="removePriceRange()">
            <q-icon
              name="remove_circle"
              color="grey-4"
              size="30px"
            />
            {{ $t('dashboard.createCollection.stepTwo.remove') }}
          </q-btn>
          <q-tooltip v-if="isRemoveDisabled">
            {{ $t('dashboard.createCollection.stepTwo.removeBtnDisabledMsg') }}
          </q-tooltip>
        </div>
      </div>
    </div>
  </div>
  <div class="row q-pt-lg">
    <q-input
      ref="creatorPercentage"
      v-model="form.creatorPercentage"
      :label="$t('dashboard.createCollection.stepTwo.creator')"
      class="col-6 q-pr-md"
      suffix="%"
      mask="#"
      fill-mask="0"
      reverse-fill-mask
      :rules="[ val => validateCreator(val) || creatorErrMsg ]"
    />
    <q-input
      ref="walletAddress"
      v-model.trim="form.walletAddress"
      :label="$t('dashboard.createCollection.stepTwo.address')"
      class="col-6 q-pl-md"
      maxlength="42"
      :rules="[ val => validateWalletAddress(val) || walletAddressErrMsg ]"
    />
  </div>
  <error v-if="(isError || isPriceRangeError || isStartDtErr || isEndDtErr) && isVerifyingTheForm" :error-msg="isErrorMsg" />
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { mapGetters } from 'vuex';
import { Watch } from 'vue-property-decorator';
import moment from 'moment';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterArtistCollection from 'src/eth/AlgoPainterArtistCollectionProxy'
import Error from './Error.vue';
import { ICollectionMetricsPriceRange, ICollectionMetrics, IAllowedTokens } from 'src/models/ICreatorCollection';
import { QInput } from 'quasar';

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
      networkInfo: 'networkInfo',
      isConnected: 'isConnected',
    }),
  },
  components: {
    Error,
  }
})
export default class CollectionMetrics extends Vue.with(Props) {
  artistCollection = <AlgoPainterArtistCollection>{};
  networkInfo!: NetworkInfo;
  isConnected!: boolean;

  declare $refs: {
    nfts: QInput;
    startDT: QInput;
    endDT: QInput;
    amountFixed: QInput;
    amountVariable: QInput[];
    creatorPercentage: QInput;
    walletAddress: QInput;
    to: QInput[];
  };

  form: ICollectionMetrics = {
    nfts: 0,
    startDT: '',
    endDT: '',
    priceType: 'fixed',
    tokenPriceAddress: process.env.VUE_APP_ALGOP_TOKEN_ADDRESS,
    tokenPriceSymbol: 'ALGOP',
    priceRange: [
      {
        from: 1,
        to: 500,
        amount: '',
        tokenPriceAddress: process.env.VUE_APP_ALGOP_TOKEN_ADDRESS || '',
        tokenPriceSymbol: 'ALGOP'
      }
    ],
    creatorPercentage: 0,
    walletAddress: '',
  }

  dateErrorMsg: string = '';
  isEndDtErr: boolean = false;
  isStartDtErr: boolean = false;
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
  priceAmountErrMsg: string = '';
  isPriceRangeLimitMsgShown: boolean = false;

  async created() {
    if (this.isConnected) {
      this.artistCollection = new AlgoPainterArtistCollection(this.networkInfo);
      await this.loadAvailableTokens();
    }
  }

  get nowFormatted() {
    return moment().format('YYYY/MM/DD');
  }

  startOptions(date: string) {
    return date > this.nowFormatted
  }

  endOptions(date: string) {
    const startDate = moment(this.form.startDT).format('YYYY/MM/DD')
    const dayWrapper = moment().add(90, 'days');
    const dayString = dayWrapper.format('YYYY/MM/DD');
    return date > startDate && date <= dayString;
  }

  @Watch('isConnected')
  async onIsConnectedChanged() {
    if (this.isConnected) {
      this.artistCollection = new AlgoPainterArtistCollection(this.networkInfo);
      await this.loadAvailableTokens();
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

    if (
      !this.$refs.startDT.validate() ||
      !this.$refs.endDT.validate() ||
      !this.$refs.nfts.validate() ||
      (this.form.priceType === 'fixed' && !this.$refs.amountFixed.validate()) ||
      (this.form.priceType === 'variable' && !this.$refs.amountVariable[this.form.priceRange.length - 1].validate()) ||
      !this.$refs.creatorPercentage.validate() ||
      !this.$refs.walletAddress.validate()
    ) {
      this.isErrorMsg = this.$t('dashboard.createCollection.stepTwo.isErr');
    } else if (this.isPriceRangeError) {
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
    if (this.form.priceType === 'variable' && (!this.$refs.amountVariable[this.form.priceRange.length - 1].validate() || !this.$refs.to[this.form.priceRange.length - 1].validate())) {
      return;
    }

    if (this.form.priceRange.length === 19) {
      this.isPriceRangeLimitMsgShown = true;
    }

    const lastTo = this.toRangeArr[this.toRangeArr.length - 1];

    this.form.priceRange.push({
      from: lastTo + 1,
      to: 0,
      amount: 0,
      tokenPriceAddress: this.form.priceRange[0].tokenPriceAddress,
      tokenPriceSymbol: this.form.priceRange[0].tokenPriceSymbol
    })

    this.fromRangeArr.push(lastTo + 1);
    this.toRangeArr.push(0);

    this.isRemoveDisabled = (this.form.priceRange.length === 1);
  }

  removePriceRange() {
    if (this.form.priceRange.length === 20) {
      this.isPriceRangeLimitMsgShown = false;
    }

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
        to: this.form.nfts,
        amount: this.form.priceRange[0].amount,
        tokenPriceAddress: this.form.tokenPriceAddress || '',
        tokenPriceSymbol: this.form.tokenPriceSymbol || ''
      }
    ]
  }

  setFirstPriceRange() {
    this.isAddDisabled();
    this.isPriceRangeError = false;
    this.fromRangeArr = [1];
    this.toRangeArr = [];
    this.form.priceRange[0].to = 0;
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
    if (this.form.priceType === 'variable') {
      void this.$refs.to[this.form.priceRange.length - 1].validate();
    }

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

  validateAmount(val: number) {
    if (val <= 0) {
      this.isError = true;
      this.priceAmountErrMsg = this.$t('dashboard.createCollection.stepTwo.priceAmountErrMsg');
      return false;
    } else {
      this.isError = false;
      this.priceAmountErrMsg = '';
      return true;
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
    return this.form.nfts === 0 || this.toRangeArr[this.toRangeArr.length - 1] >= this.form.nfts || this.isPriceRangeError || this.form.priceRange.length === 20;
  }

  startDtValidator() {
    const diffMinutes = moment(this.form.startDT).diff(moment(this.form.endDT), 'minute');
    const diffHour = moment(this.form.startDT).diff(moment(this.form.endDT), 'hour');
    const diffTodayMinutes = moment(this.form.startDT).diff(moment(), 'minute');

    if (!this.form.startDT) {
      this.dateErrorMsg = this.$t('dashboard.createCollection.stepTwo.emptyField');
      this.isStartDtErr = true;
      return false;
    } else if (diffTodayMinutes < 0) {
      this.dateErrorMsg = this.$t('dashboard.createCollection.stepTwo.dateB42day');
      this.isStartDtErr = true;
      return false;
    } else if (diffMinutes >= 1) {
      this.dateErrorMsg = this.$t('dashboard.createCollection.stepTwo.datePast');
      this.isStartDtErr = true;
      return false;
    } else if (diffMinutes > -1440) {
      this.dateErrorMsg = this.$t('dashboard.createCollection.stepTwo.dateMin');
      this.isStartDtErr = true;
      return false;
    } else if (diffHour < -2184) {
      this.dateErrorMsg = this.$t('dashboard.createCollection.stepTwo.dateMax');
      this.isStartDtErr = true;
      return false;
    }

    if (this.isEndDtErr) {
      void this.$refs.endDT.validate();
    }
    this.isStartDtErr = false;
    return true;
  }

  endDtValidator() {
    const diffMinutes = moment(this.form.startDT).diff(moment(this.form.endDT), 'minute');
    const diffHour = moment(this.form.startDT).diff(moment(this.form.endDT), 'hour');
    const diffTodayMinutes = moment(this.form.startDT).diff(moment(), 'minute');

    if (!this.form.endDT) {
      this.dateErrorMsg = this.$t('dashboard.createCollection.stepTwo.emptyField');
      this.isEndDtErr = true;
      return false;
    } else if (diffTodayMinutes < 0) {
      this.dateErrorMsg = this.$t('dashboard.createCollection.stepTwo.dateB42day');
      this.isEndDtErr = true;
      return false;
    } else if (diffMinutes >= 1) {
      this.dateErrorMsg = this.$t('dashboard.createCollection.stepTwo.datePast');
      this.isEndDtErr = true;
      return false;
    } else if (diffMinutes > -1440) {
      this.dateErrorMsg = this.$t('dashboard.createCollection.stepTwo.dateMin');
      this.isEndDtErr = true;
      return false;
    } else if (diffHour < -2184) {
      this.dateErrorMsg = this.$t('dashboard.createCollection.stepTwo.dateMax');
      this.isEndDtErr = true;
      return false;
    }

    if (this.isStartDtErr) {
      void this.$refs.startDT.validate(true);
    }
    this.isEndDtErr = false;
    return true;
  }

  async loadAvailableTokens() {
    try {
      this.loadingCoins = true;

      const tokens = await this.artistCollection.getCollectionAllowedTokens();

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
    this.form.tokenPriceAddress = this.allowedCoins[Number(coin) - 2].tokenAddress;
    this.form.tokenPriceSymbol = this.allowedCoins[Number(coin) - 2].label;
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
    .option {
      padding: 0px;
    }
  }

  .label {
    font-weight: 400;
    margin: 0 0 10px 0;
    color: rgba(0, 0, 0, 0.6);
  }

  .variable-card {
    border: 1px $primary solid;
    border-radius: 5px;
  }
</style>
