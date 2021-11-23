<template>
  <q-dialog
    v-if="!loadingAuctionInfo"
    ref="dialog"
    v-model="modal"
  >
    <q-card
      class="q-pa-lg"
      style="max-width: 750px;width:650px;"
    >
      <div class="row justify-between">
        <p class="row text-h5 text-bold">
          {{ ' ' + $t('dashboard.auctions.bidBackModalSimulator.title') }}
        </p>
        <div class="column">
          <p class="text-h8 q-mb-none text-bold">
            {{ ' ' + $t('dashboard.auctions.bidBackModalSimulator.lastBid') }}
          </p>
          <p class="text-h8 q-mb-none text-bold">
            {{ ' ' + $t('dashboard.auctions.bidBackModalSimulator.lastBidValue', {
              highestBid: formatHighestBidAmount(),
              auctionCurrency: getAuctionInfo.highestBid.tokenSymbol})
            }}
          </p>
        </div>
      </div>
      <div
        v-if="!loadingTable"
        class="row justify-center"
      >
        <q-input
          v-model="stakeAmount"
          dense
          color="primary"
          inputmode="number"
          :suffix="$t('dashboard.auctions.bidBackModalSimulator.algop')"
          :placeholder="formattedBalance"
          :bind="validateInput()"
          @blur="setTableInfo()"
        />
      </div>
      <div class="q-pa-md">
        <q-table
          :rows="userBid"
          :columns="columns"
          row-key="name"
          hide-bottom
          flat
          :loading="loadingTable"
        />
      </div>
      <div class="row justify-center">
        <p
          v-if="placingBidBackStatus === PlacingBidBackStatus.CheckingAllowance"
          class="q-mb-none"
        >
          <q-icon
            name="mdi-alert-circle"
            color="yellow"
            size="md"
          />
          {{ $t('dashboard.stackModalAlgop.interact') }}
        </p>
        <p
          v-else-if="placingBidBackStatus === PlacingBidBackStatus.IncreateAllowanceAwaitingConfirmation"
          class="q-mb-none"
        >
          <q-icon
            name="mdi-alert"
            color="yellow"
            size="md"
          />
          {{ $t('dashboard.stackModalAlgop.confirmWallet') }}
        </p>
        <p
          v-else-if="placingBidBackStatus === PlacingBidBackStatus.IncreateAllowanceError"
          class="q-mb-none"
        >
          <q-icon
            name="mdi-alert-circle"
            color="red"
            size="md"
          />
          {{ $t('dashboard.stackModalAlgop.error') }}
        </p>
        <p
          v-else-if="placingBidBackStatus === PlacingBidBackStatus.IncreateAllowanceCompleted"
          class="q-mb-none"
        >
          <q-icon
            name="mdi-check"
            color="green"
            size="md"
          />
          {{ $t('dashboard.stackModalAlgop.stakeSucess') }}
        </p>
      </div>
      <div class="row justify-center">
        <p
          v-if="getAuctionInfo.ended"
          class="q-mb-none"
        >
          <q-icon
            name="mdi-alert-circle"
            color="yellow"
            size="md"
          />
          {{ $t('dashboard.auctions.bidBackModalSimulator.rules.auctionEnded') }}
        </p>
        <p
          v-else-if="stakeAmount && stakeAmount > userBalance"
          class="q-mb-none"
        >
          <q-icon
            name="mdi-alert-circle"
            color="red"
            size="md"
          />
          {{ $t('dashboard.auctions.bidBackModalSimulator.rules.noMoney') }}
        </p>
        <p
          v-else-if="stakeAmount === null || stakeAmount <= 0"
          class="q-mb-none"
        >
          <q-icon
            name="mdi-alert-circle"
            color="red"
            size="md"
          />
          {{ $t('dashboard.auctions.bidBackModalSimulator.rules.moreThanZero') }}
        </p>
      </div>
      <div class="row justify-center">
        <algo-button
          class="q-my-md q-mx-sm action"
          :label="$t('dashboard.auctions.bidBackModalSimulator.returnBtn')"
          color="primary"
          outline
          :disabled="isCancelDisabled"
          @click="openBidBackSimulatorModal()"
        />
        <algo-button
          class="q-my-md q-mx-sm action"
          :label="$t('dashboard.auctions.bidBackModalSimulator.interactionBtn')"
          color="primary"
          :disabled="isDisabled"
          :loading="isConfirmBtnLoading"
          @click="stakeAlgop()"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { QDialog } from 'quasar';
import AlgoButton from 'src/components/common/Button.vue';
import UserUtils from 'src/helpers/user';
import { Watch } from 'vue-property-decorator';
import { IAuctionItem } from 'src/models/IAuctionItem';
import { IBid } from 'src/models/IBid';
import { mapGetters } from 'vuex';
import { numberToString } from 'src/helpers/format/numberToString';
import AlgoPainterBidBackPirsProxy from 'src/eth/AlgoPainterBidBackPirsProxy';
import AlgoPainterRewardsSystemProxy from 'src/eth/AlgoPainterRewardsSystemProxy';
import ERC20TokenProxy from 'src/eth/ERC20TokenProxy';
import getAlgoPainterContractByNetworkId, {
  getRewardsSystemContractByNetworkId,
} from 'src/eth/Config';
import { NetworkInfo } from 'src/store/user/types';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { currencyToBlockchain } from 'src/helpers/format/currencyToBlockchain';
import { auctionCoins } from 'src/helpers/auctionCoins';

enum PlacingBidBackStatus {
  CheckingAllowance,
  IncreateAllowanceAwaitingInput,
  IncreateAllowanceAwaitingConfirmation,
  IncreateAllowanceError,
  IncreateAllowanceCompleted,
  PlaceBidBackAwaitingInput,
  PlaceBidBackAwaitingConfirmation,
  PlaceBidBackError,
  BidBackCreated,
}

interface IUserBid {
  name: string | null;
  account: string | unknown;
  formattedAccount: string | unknown;
  highestBid: number;
  auctionCurrency: string;
  stakedAlgop: number | unknown;
  stakedAlgopPercentage: number;
  bidBackPrize: string;
}

@Options({
  components: {
    AlgoButton,
  },
  computed: {
    ...mapGetters(
      'user', [
        'networkInfo',
        'account',
        'isConnected',
      ]),
    ...mapGetters(
      'auctions', [
        'getAuctionInfo',
      ]),
  },
})
export default class BidBackModalSimulator extends Vue {
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  getAuctionInfo!: IAuctionItem;
  isConnected!: boolean;

  modal: boolean = false;
  userBalance: number = 0;
  formattedBalance: string = '';
  totalBidBackStaked: number = 0;
  loadingAuctionInfo: boolean = true;

  isConfirmBtnLoading: boolean = false;
  isCancelDisabled: boolean = false;
  stakeAmount: number | null = null;
  placingBidBackStatus: PlacingBidBackStatus | null = null;
  PlacingBidBackStatus = PlacingBidBackStatus;
  auctionCoinTokenProxy!: ERC20TokenProxy;
  isDisabled: boolean = true;
  auctionBidBackRate!: number;
  auctionCurrency!: string;

  userBid: IUserBid[] = [];
  loadingTable: boolean = true;
  columns = [
    {
      name: 'name',
      required: true,
      label: 'Name',
      align: 'left',
      field: (userBid: { name: string; formattedAccount: string }) => userBid.name ? userBid.name : userBid.formattedAccount,
      sortable: true,
    },
    {
      name: 'highestBid',
      required: true,
      label: 'Bid',
      field: (userBid: { highestBid: number }) => userBid.highestBid,
      sortable: true,
    },
    {
      name: 'stakedAlgop',
      required: true,
      label: 'ALGOP staked',
      field: (userBid: { stakedAlgop: number }) => userBid.stakedAlgop,
      sortable: true,
    },
    {
      name: 'participation',
      required: true,
      label: 'BidBack (%)',
      field: (userBid: { stakedAlgopPercentage: number }) => userBid.stakedAlgopPercentage,
      sortable: true,
    },
    {
      name: 'prizeAmount',
      required: true,
      label: 'BidBack',
      field: (userBid: { bidBackPrize: string }) => userBid.bidBackPrize,
      sortable: true,
    },
  ];

   @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
      this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
      this.auctionCoinTokenProxy = new ERC20TokenProxy(this.algoPainterContractByNetworkId);
      void this.setAccountBalance();
    }
  }

   //  created() {
   //    this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
   //    this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
   //    this.auctionCoinTokenProxy = new ERC20TokenProxy(this.algoPainterContractByNetworkId);
   //  }

   mounted() {
     void this.setAccountBalance();
   }

  @Watch('getAuctionInfo')
   onGetAuctionChanged() {
     this.userBid = [];
     if (this.getAuctionInfo) {
       this.loadingAuctionInfo = false;
       void this.setTableInfo(false);
     }
   }

  get algoPainterContractByNetworkId() {
    return getAlgoPainterContractByNetworkId(this.networkInfo.id) as string;
  }

  get auctionRewardsContractAddress() {
    return getRewardsSystemContractByNetworkId(this.networkInfo.id);
  }

  async approveContractTransfer(amount: number) {
    this.placingBidBackStatus = PlacingBidBackStatus.CheckingAllowance;

    const allowance = await this.auctionCoinTokenProxy.allowance(
      this.account,
      this.auctionRewardsContractAddress,
    );

    if (allowance < amount) {
      this.placingBidBackStatus =
        PlacingBidBackStatus.IncreateAllowanceAwaitingInput;

      const { decimalPlaces } = this.coinDetails;

      const allowanceAmount = currencyToBlockchain(
        Number.MAX_SAFE_INTEGER,
        decimalPlaces,
      );

      await this.auctionCoinTokenProxy
        .approve(
          this.auctionRewardsContractAddress,
          numberToString(allowanceAmount),
          this.account,
        )
        .on('error', () => {
          this.placingBidBackStatus =
            PlacingBidBackStatus.IncreateAllowanceError;
        })
        .on('transactionHash', () => {
          this.placingBidBackStatus =
            PlacingBidBackStatus.IncreateAllowanceAwaitingConfirmation;
        });
    }
  }

  validateInput() {
    this.stakeAmount = Number(this.stakeAmount);
    if (this.stakeAmount <= 0 || this.stakeAmount === null || this.stakeAmount > this.userBalance || this.getAuctionInfo.ended) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

  async stakeAlgop() {
    this.isConfirmBtnLoading = true;
    this.isCancelDisabled = true;

    const { decimalPlaces } = this.coinDetails;

    const stakeAmount = currencyToBlockchain(
      Number(this.stakeAmount),
      decimalPlaces,
    );

    await this.approveContractTransfer(stakeAmount);

    try {
      await this.rewardsSystem.stakeBidback(this.getAuctionInfo.index, numberToString(stakeAmount), this.account)
        .on('transactionHash', () => {
          this.placingBidBackStatus = PlacingBidBackStatus.IncreateAllowanceAwaitingConfirmation;
        })
        .on('error', () => {
          this.placingBidBackStatus = PlacingBidBackStatus.IncreateAllowanceError;
          setTimeout(() => {
            this.$refs.dialog.hide();
            this.$emit('hide');
            this.placingBidBackStatus = null;
          }, 3000);
        });
      this.placingBidBackStatus =
        PlacingBidBackStatus.IncreateAllowanceCompleted;
      setTimeout(() => {
        this.$refs.dialog.hide();
        this.$emit('hide');
        this.placingBidBackStatus = null;
      }, 3000);
    } catch (e) {
      console.log('error - stakeAlgop BidBackSimulatorModal', e);
    } finally {
      this.isCancelDisabled = false;
      this.stakeAmount = 0;
      this.isConfirmBtnLoading = false;
      this.isDisabled = true;
    }
  }

  declare $refs: {
    dialog: QDialog;
  };

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return (
        coin.tokenAddress.toLowerCase() ===
        this.getAuctionInfo.minimumBid.tokenPriceAddress
      );
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  formatHighestBidAmount() {
    return blockchainToCurrency(this.getAuctionInfo.highestBid.netAmount, this.coinDetails.decimalPlaces);
  }

  async setTableInfo(isASimulation: boolean = true) {
    this.userBid = [];
    this.loadingTable = true;

    const auctionBids = this.getAuctionInfo.bids;
    const auctionBidsReversed: IBid[] = [];
    const bidderAccounts: string | string[] = [];

    auctionBids.forEach((bid) => {
      auctionBidsReversed.push(bid);
    });
    auctionBidsReversed.reverse();

    auctionBidsReversed.forEach((bid) => {
      const account = bid.account;
      const formattedAccount = this.formatAccount(account);
      const name = this.formatName(bid.name, bid.account);
      this.auctionCurrency = bid.tokenSymbol;
      const highestBid = bid.netAmount / 1000000000000000000;

      if (!bidderAccounts.includes(account)) {
        bidderAccounts.push(account);

        this.userBid.push({
          name: name,
          account: account,
          formattedAccount: formattedAccount,
          highestBid: highestBid,
          auctionCurrency: this.auctionCurrency,
          stakedAlgop: name === 'You' && isASimulation && this.stakeAmount ? this.stakeAmount : 0,
          stakedAlgopPercentage: 0,
          bidBackPrize: '',
        });
      }
    });

    this.totalBidBackStaked = blockchainToCurrency(await this.rewardsSystem.getTotalBidBackStakes(this.getAuctionInfo.index), this.coinDetails.decimalPlaces);

    if (isASimulation) {
      if (typeof this.stakeAmount === 'number') {
        this.totalBidBackStaked = Number(this.totalBidBackStaked) + this.stakeAmount;
      }
    }

    let isVariableSet = false;

    if (this.getAuctionInfo.bidbacks) {
      Object.keys(this.getAuctionInfo.bidbacks).forEach((account) => {
        this.userBid.forEach((bidder) => {
          if (account === bidder.account) {
            if (account === this.account && isASimulation) {
              this.totalBidBackStaked =
                Number(this.totalBidBackStaked) - blockchainToCurrency(this.getAuctionInfo.bidbacks[account], this.coinDetails.decimalPlaces);
            } else {
              bidder.stakedAlgop = blockchainToCurrency(this.getAuctionInfo.bidbacks[account], this.coinDetails.decimalPlaces);
            }
            isVariableSet = true;
          } else if (!isVariableSet && bidder.name !== 'You') {
            bidder.stakedAlgop = 0;
          }
          if (typeof bidder.stakedAlgop === 'number') {
            bidder.stakedAlgopPercentage = parseFloat(((bidder.stakedAlgop > 0)
              ? (bidder.stakedAlgop / this.totalBidBackStaked) * 100
              : 0).toFixed(2));
          }
        });
      });

      this.auctionBidBackRate = await this.bidBackPirsSystem.getBidBackRate(this.getAuctionInfo.index) / 100;
      const auctionBidBackPrize = this.formatHighestBidAmount() * this.auctionBidBackRate;

      Object.keys(this.getAuctionInfo.bidbacks).forEach(() => {
        this.userBid.forEach((bidder) => {
          bidder.bidBackPrize = `${((bidder.stakedAlgopPercentage / 100) * auctionBidBackPrize).toFixed(3)} ${this.auctionCurrency}`;
        });
      });
    }

    this.loadingTable = false;
  }

  formatAccount(account: string) {
    return account.slice(0, 4) + '...' + account.slice(account.length - 4);
  }

  formatName(name: string, account: string) {
    if (account === this.account) {
      return 'You';
    }

    const nameArray = name.split(' ');
    nameArray[0] = (nameArray[0].length <= 11)
      ? nameArray[0]
      : nameArray[0].slice(0, 11) + '...';
    return nameArray[0];
  }

  @Watch('userBalance')
  onUserBalanceChanged() {
    if (this.isConnected) {
      void this.setAccountBalance();
    }
  }

  async setAccountBalance() {
    this.userBalance = await UserUtils.fetchAccountBalance(this.networkInfo, this.account);
    this.stakeAmount = this.userBalance;
    void this.setformattedBalance();
  }

  setformattedBalance() {
    this.formattedBalance = UserUtils.formatAccountBalance(this.userBalance, 2);
  }

  openBidBackSimulatorModal() {
    void this.$store.dispatch({
      type: 'auctions/openBidBackSimulatorModal',
    });
  }
}
</script>
<style style="scss" scoped>
.close-button-container {
  width: 100%;
}
</style>
