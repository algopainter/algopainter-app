<template>
  <q-dialog
    v-if="!loadingAuctionInfo"
    ref="dialog"
    v-model="modal"
    class="report-and-simulator"
  >
    <q-card class="q-pa-lg modal-card-container">
      <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'column items-center q-pb-sm' : 'row justify-between q-px-md q-pb-md']">
        <p class="row text-h5 text-bold title">
          {{ ' ' + $t('dashboard.auctions.bidBackModalSimulator.title') }}
        </p>
        <div class="row header-right">
          <div class="column q-mr-md">
            <p class="text-h8 text-bold">
              {{ ' ' + $t('dashboard.auctions.bidBackModalSimulator.auctionRate') }}
            </p>
            <p
              v-if="auctionBidBackRate"
              class="text-h8 text-bold"
            >
              {{ (auctionBidBackRate * 100).toFixed(2) + "%" }}
            </p>
            <p
              v-else
              class="text-h8 text-bold"
            >
              {{ $t('dashboard.auctions.bidBackModalSimulator.auctionRatePlaceholder') }}
            </p>
          </div>
          <div class="row">
            <div class="column">
              <p class="text-h8 text-bold">
                {{ ' ' + $t('dashboard.auctions.bidBackModalSimulator.lastBid') }}
              </p>
              <p
                v-if="auctionBidBackRate"
                class="text-h8 text-bold"
              >
                {{ ' ' + $t('dashboard.auctions.bidBackModalSimulator.lastBidValue', {
                  highestBid: formatHighestBidAmount(),
                  auctionCurrency: getAuctionInfoBidBack.highestBid.tokenSymbol})
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'row justify-center q-pb-md smaller-placeholder q-px-md' : 'row justify-center q-pb-md']">
        <q-input
          v-model="stakeAmount"
          :disable="loadingTable"
          dense
          color="primary"
          type="number"
          debounce="700"
          :suffix="$t('dashboard.auctions.bidBackModalSimulator.algop')"
          :placeholder="formattedBalance"
        />
      </div>
      <q-table
        :rows="userBid"
        :columns="columns"
        row-key="name"
        hide-bottom
        flat
        :loading="loadingTable"
      />
      <div class="row justify-center q-mt-md">
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
          v-if="getAuctionInfoBidBack.ended"
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
          v-else-if="stakeAmount === null || stakeAmount < 0 || stakeAmount === 0 && !hasJustStaked"
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
      <q-checkbox
        v-model="isUserAwareThatAmountWillBeSummed"
        :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'smaller-checkbox-text' : '']"
        color="green"
        :label="$t('dashboard.auctions.bidBackModalSimulator.stakeCheckbox', { amount: stakeAmount })"
      />
      <div class="row justify-center">
        <algo-button
          :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'smaller-algo-button q-mt-md q-mx-sm' : 'q-mt-md q-mx-sm']"
          :label="$t('dashboard.auctions.bidBackModalSimulator.returnBtn')"
          color="primary"
          outline
          :disabled="isCancelDisabled"
          @click="openBidBackSimulatorModal()"
        />
        <algo-button
          :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'smaller-algo-button q-mt-md q-mx-sm' : 'q-mt-md q-mx-sm']"
          :label="$t('dashboard.auctions.bidBackModalSimulator.interactionBtn')"
          color="primary"
          :disabled="isDisabled || !isUserAwareThatAmountWillBeSummed"
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
  highestBid: string;
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
        'getAuctionInfoBidBack',
      ]),
  },
})
export default class BidBackModalSimulator extends Vue {
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  getAuctionInfoBidBack!: IAuctionItem;
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
  hasJustStaked: boolean = false;

  isUserAwareThatAmountWillBeSummed: boolean = false;

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
      style: (userBid: { name: string}) => userBid.name === 'You' ? 'font-weight: bold' : 'font-weight: normal',
    },
    {
      name: 'highestBid',
      required: true,
      label: 'Bid',
      field: (userBid: { highestBid: number }) => userBid.highestBid,
      sortable: true,
      style: (userBid: { name: string}) => userBid.name === 'You' ? 'font-weight: bold' : 'font-weight: normal',
    },
    {
      name: 'stakedAlgop',
      required: true,
      label: 'ALGOP staked',
      field: (userBid: { stakedAlgop: number }) => userBid.stakedAlgop,
      sortable: true,
      style: (userBid: { name: string}) => userBid.name === 'You' ? 'font-weight: bold' : 'font-weight: normal',
    },
    {
      name: 'participation',
      required: true,
      label: 'BidBack (%)',
      field: (userBid: { stakedAlgopPercentage: number }) => userBid.stakedAlgopPercentage,
      sortable: true,
      style: (userBid: { name: string}) => userBid.name === 'You' ? 'font-weight: bold' : 'font-weight: normal',
    },
    {
      name: 'prizeAmount',
      required: true,
      label: 'BidBack',
      field: (userBid: { bidBackPrize: string }) => userBid.bidBackPrize,
      sortable: true,
      style: (userBid: { name: string}) => userBid.name === 'You' ? 'font-weight: bold' : 'font-weight: normal',
    },
  ];

   @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
      this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
      this.auctionCoinTokenProxy = new ERC20TokenProxy(this.algoPainterContractByNetworkId);
      this.setAccountBalance().catch(console.error);
    }
  }

   created() {
     if (this.isConnected) {
       this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
       this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
       this.auctionCoinTokenProxy = new ERC20TokenProxy(this.algoPainterContractByNetworkId);
     }
   }

   mounted() {
     this.setAccountBalance().catch(console.error);
     this.hasJustStaked = false;
   }

  @Watch('getAuctionInfoBidBack')
   onGetAuctionChanged() {
     this.userBid = [];
     if (this.getAuctionInfoBidBack) {
       this.loadingAuctionInfo = false;
       this.setTableInfo(false).catch(console.error);
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
      await this.rewardsSystem.stakeBidback(this.getAuctionInfoBidBack.index, numberToString(stakeAmount), this.account)
        .on('transactionHash', () => {
          this.placingBidBackStatus = PlacingBidBackStatus.IncreateAllowanceAwaitingConfirmation;
        })
        .on('error', () => {
          this.placingBidBackStatus = PlacingBidBackStatus.IncreateAllowanceError;
          setTimeout(() => {
            this.openBidBackSimulatorModal();
            this.placingBidBackStatus = null;
          }, 3000);
        });
      this.placingBidBackStatus =
        PlacingBidBackStatus.IncreateAllowanceCompleted;
      setTimeout(() => {
        try {
          this.$store.dispatch({
            type: 'auctions/updateBidBackStakedAlgop',
            collectionOwner: this.getAuctionInfoBidBack.item.collectionOwner,
            itemIndex: this.getAuctionInfoBidBack.item.index,
          }).catch(console.error);
        } catch (e) {
          console.log('Error - updateBidBackStakedAlgop - BidBackSimulatorModal');
        } finally {
          this.openBidBackSimulatorModal();
          this.placingBidBackStatus = null;
        }
      }, 3000);
    } catch (e) {
      console.log('Error - stakeAlgop - BidBackSimulatorModal');
    } finally {
      this.isCancelDisabled = false;
      this.isConfirmBtnLoading = false;
      this.isDisabled = true;
      this.hasJustStaked = true;
    }
  }

  declare $refs: {
    dialog: QDialog;
  };

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return (
        coin.tokenAddress.toLowerCase() ===
        this.getAuctionInfoBidBack.minimumBid.tokenPriceAddress
      );
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  get getLastBid() {
    const bidAmount = blockchainToCurrency(
      this.getAuctionInfoBidBack.highestBid.netAmount,
      this.coinDetails.decimalPlaces,
    );

    return this.$n(bidAmount, 'decimal', {
      maximumFractionDigits: this.coinDetails.decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  bidvalue(bid: number) {
    const bidAmount = blockchainToCurrency(
      bid,
      this.coinDetails.decimalPlaces,
    );

    return this.$n(bidAmount, 'decimal', {
      maximumFractionDigits: this.coinDetails.decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  formatHighestBidAmount() {
    const bidBackAmount = blockchainToCurrency(
      this.getAuctionInfoBidBack.highestBid.netAmount,
      this.coinDetails.decimalPlaces);
    return this.$n(bidBackAmount, 'decimal', {
      maximumFractionDigits: this.coinDetails.decimalPlaces,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }

  async setTableInfo(isASimulation: boolean = true) {
    this.userBid = [];
    this.loadingTable = true;

    const stakeAmount = (isASimulation) ? Number(this.stakeAmount) : this.stakeAmount;

    const auctionBids = this.getAuctionInfoBidBack.bids;
    const auctionBidsReversed: IBid[] = [];
    const bidderAccounts: string | string[] = [];

    this.auctionBidBackRate = await this.bidBackPirsSystem.getBidBackRate(this.getAuctionInfoBidBack.index) / 10000;

    auctionBids.forEach((bid) => {
      auctionBidsReversed.push(bid);
    });
    auctionBidsReversed.reverse();

    auctionBidsReversed.forEach((bid) => {
      const account = bid.account;
      const formattedAccount = this.formatAccount(account);
      const name = this.formatName(bid.name, bid.account);
      this.auctionCurrency = bid.tokenSymbol;
      const amountBid = blockchainToCurrency(
        bid.netAmount,
        this.coinDetails.decimalPlaces,
      );
      const formatAmount = this.$n(amountBid, 'decimal', {
        maximumFractionDigits: this.coinDetails.decimalPlaces,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      const highestBid = formatAmount;

      if (!bidderAccounts.includes(account)) {
        bidderAccounts.push(account);

        this.userBid.push({
          name: name,
          account: account,
          formattedAccount: formattedAccount,
          highestBid: highestBid,
          auctionCurrency: this.auctionCurrency,
          stakedAlgop: name === 'You' && isASimulation && stakeAmount ? stakeAmount : 0,
          stakedAlgopPercentage: auctionBidsReversed.length === 1 && isASimulation ? 100 : 0,
          bidBackPrize:
            auctionBidsReversed.length === 1 && isASimulation
              ? `${(this.formatHighestBidAmount())} ${this.auctionCurrency}`
              : `0.000 ${this.auctionCurrency}`,
        });
      }
    });

    if (auctionBidsReversed.length === 1 && isASimulation) {
      this.loadingTable = false;
      return;
    }

    this.totalBidBackStaked = blockchainToCurrency(await this.rewardsSystem.getTotalBidBackStakes(this.getAuctionInfoBidBack.index), this.coinDetails.decimalPlaces);

    if (isASimulation && typeof stakeAmount === 'number') {
      this.totalBidBackStaked = Number(this.totalBidBackStaked) + stakeAmount;
      if (this.getAuctionInfoBidBack.bidbackshare) {
        if (this.getAuctionInfoBidBack.bidbackshare[this.account]) {
          this.totalBidBackStaked = Number(this.totalBidBackStaked) - blockchainToCurrency(this.getAuctionInfoBidBack.bidbackshare[this.account], this.coinDetails.decimalPlaces);
        }
      }
    }

    let isVariableSet = false;

    if (this.getAuctionInfoBidBack.bidbackshare) {
      Object.keys(this.getAuctionInfoBidBack.bidbackshare).forEach((account) => {
        this.userBid.forEach((bidder) => {
          if (account === bidder.account) {
            if (account === this.account && isASimulation) {
              isVariableSet = true;
            } else {
              bidder.stakedAlgop = blockchainToCurrency(this.getAuctionInfoBidBack.bidbackshare[account], this.coinDetails.decimalPlaces);
              isVariableSet = true;
            }
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

      const auctionBidBackPrize = blockchainToCurrency(
        this.getAuctionInfoBidBack.highestBid.netAmount,
        this.coinDetails.decimalPlaces) * this.auctionBidBackRate;

      Object.keys(this.getAuctionInfoBidBack.bidbackshare).forEach(() => {
        this.userBid.forEach((bidder) => {
          const valuePrize = ((bidder.stakedAlgopPercentage / 100) * auctionBidBackPrize);
          const formatPrize = this.$n(valuePrize, 'decimal', {
            maximumFractionDigits: this.coinDetails.decimalPlaces,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);
          bidder.bidBackPrize = `${formatPrize} ${this.auctionCurrency}`;
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
      this.setAccountBalance().catch(console.error);
    }
  }

  @Watch('stakeAmount')
  onStakeAmountChanged() {
    if (this.getAuctionInfoBidBack) {
      const stakeAmount = Number(this.stakeAmount);
      if (stakeAmount <= 0 || stakeAmount === null || stakeAmount > this.userBalance || this.getAuctionInfoBidBack.ended) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
      this.setTableInfo().catch(console.error);
    }
  }

  async setAccountBalance() {
    this.userBalance = await UserUtils.fetchAccountBalance(this.networkInfo, this.account);
    this.stakeAmount = this.userBalance;
    this.setformattedBalance();
  }

  setformattedBalance() {
    this.formattedBalance = UserUtils.formatAccountBalance(this.userBalance, 2);
  }

  openBidBackSimulatorModal() {
    this.$store.dispatch({
      type: 'auctions/openBidBackSimulatorModal',
    }).catch(console.error);
  }
}
</script>
<style style="scss" scoped>
.close-button-container {
  width: 100%;
}
.modal-card-container{
  max-width: 800px !important;
  border-radius: 20px;
}
.header-right p, title {
  margin-bottom: 0px;
}
</style>
