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
          {{ ' ' + $t('dashboard.auctions.pirsModalSimulator.title') }}
        </p>
        <div class="row header-right">
          <div class="column q-mr-md">
            <p class="text-h8 q-mb-none text-bold">
              {{ ' ' + $t('dashboard.auctions.pirsModalSimulator.auctionRate') }}
            </p>
            <p
              v-if="auctionPirsRate"
              class="text-h8 q-mb-none text-bold"
            >
              {{ (auctionPirsRate * 100).toFixed(2) + "%" }}
            </p>
            <p
              v-else
              class="text-h8 q-mb-none text-bold"
            >
              {{ $t('dashboard.auctions.pirsModalSimulator.auctionRatePlaceholder') }}
            </p>
          </div>
          <div class="column">
            <p class="text-h8 q-mb-none text-bold">
              {{ ' ' + $t('dashboard.auctions.pirsModalSimulator.lastBid') }}
            </p>
            <p class="text-h8 q-mb-none text-bold">
              {{
                ' ' +
                  $t('dashboard.auctions.pirsModalSimulator.lastBidValue', {
                    highestBid: formatHighestBidAmount(),
                    auctionCurrency: getAuctionInfoPirs.minimumBid.tokenSymbol,
                  })
              }}
            </p>
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
          :suffix="$t('dashboard.auctions.pirsModalSimulator.algop')"
          :placeholder="formattedBalance"
        />
      </div>
      <q-table
        :rows="pastOwnersList"
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
          <q-icon name="mdi-alert-circle" color="yellow" size="md" />
          {{ $t('dashboard.stackModalAlgop.interact') }}
        </p>
        <p
          v-else-if="
            placingBidBackStatus ===
              PlacingBidBackStatus.IncreateAllowanceAwaitingConfirmation
          "
          class="q-mb-none"
        >
          <q-icon name="mdi-alert" color="yellow" size="md" />
          {{ $t('dashboard.stackModalAlgop.confirmWallet') }}
        </p>
        <p
          v-else-if="
            placingBidBackStatus === PlacingBidBackStatus.IncreateAllowanceError
          "
          class="q-mb-none"
        >
          <q-icon name="mdi-alert-circle" color="red" size="md" />
          {{ $t('dashboard.stackModalAlgop.error') }}
        </p>
        <p
          v-else-if="
            placingBidBackStatus ===
              PlacingBidBackStatus.IncreateAllowanceCompleted
          "
          class="q-mb-none"
        >
          <q-icon name="mdi-check" color="green" size="md" />
          {{ $t('dashboard.stackModalAlgop.stakeSucess') }}
        </p>
      </div>
      <div class="row justify-center">
        <p v-if="getAuctionInfoPirs.ended" class="q-mb-none">
          <q-icon name="mdi-alert-circle" color="yellow" size="md" />
          {{
            $t('dashboard.auctions.pirsModalSimulator.rules.auctionEnded')
          }}
        </p>
        <p
          v-else-if="stakeAmount && stakeAmount > userBalance"
          class="q-mb-none"
        >
          <q-icon name="mdi-alert-circle" color="red" size="md" />
          {{ $t('dashboard.auctions.pirsModalSimulator.rules.noMoney') }}
        </p>
        <p
          v-else-if="stakeAmount === null || stakeAmount < 0 || (stakeAmount === 0 && !hasJustStaked)"
          class="q-mb-none"
        >
          <q-icon name="mdi-alert-circle" color="red" size="md" />
          {{
            $t('dashboard.auctions.pirsModalSimulator.rules.moreThanZero')
          }}
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
          :label="$t('dashboard.auctions.pirsModalSimulator.returnBtn')"
          color="primary"
          outline
          :disabled="isCancelDisabled"
          @click="openPirsSimulatorModal()"
        />
        <algo-button
          :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'smaller-algo-button q-mt-md q-mx-sm' : 'q-mt-md q-mx-sm']"
          :label="$t('dashboard.auctions.pirsModalSimulator.interactionBtn')"
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
import { IOwnerPirs } from 'src/models/IOwnerPirs';

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

interface IUserOwner {
  name: string | null;
  account: string | unknown;
  formattedAccount: string | unknown;
  auctionCurrency: string;
  stakedAlgop: number | unknown;
  stakedAlgopPercentage: number;
  pirsPrize: string;
}

@Options({
  components: {
    AlgoButton,
  },
  computed: {
    ...mapGetters('user', ['networkInfo', 'account', 'isConnected']),
    ...mapGetters('auctions', ['getAuctionInfoPirs']),
  },
})
export default class PirsModalSimulator extends Vue {
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  getAuctionInfoPirs!: IAuctionItem;
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
  auctionPirsRate!: number;
  auctionCurrency!: string;
  hasJustStaked: boolean = false;

  totalPirsStaked: number = 0;
  isUserAwareThatAmountWillBeSummed: boolean = false;

  loadingTable: boolean = true;
  columns = [
    {
      name: 'name',
      required: true,
      label: 'Name',
      align: 'left',
      field: (pastOwnersList: { name: string; formattedAccount: string }) =>
        pastOwnersList.name ? pastOwnersList.name : pastOwnersList.formattedAccount,
      sortable: true,
      style: (userBid: { name: string}) => userBid.name === 'You' ? 'font-weight: bold' : 'font-weight: normal',
    },
    {
      name: 'stakedAlgop',
      required: true,
      label: 'ALGOP staked',
      field: (pastOwnersList: { stakedAlgop: number }) => pastOwnersList.stakedAlgop,
      sortable: true,
      style: (userBid: { name: string}) => userBid.name === 'You' ? 'font-weight: bold' : 'font-weight: normal',
    },
    {
      name: 'participation',
      required: true,
      label: 'Pirs (%)',
      field: (pastOwnersList: { stakedAlgopPercentage: number }) => pastOwnersList.stakedAlgopPercentage,
      sortable: true,
      style: (userBid: { name: string}) => userBid.name === 'You' ? 'font-weight: bold' : 'font-weight: normal',
    },
    {
      name: 'prizeAmount',
      required: true,
      label: 'Pirs',
      field: (pastOwnersList: { pirsPrize: string }) => pastOwnersList.pirsPrize,
      sortable: true,
      style: (userBid: { name: string}) => userBid.name === 'You' ? 'font-weight: bold' : 'font-weight: normal',
    },
  ];

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(
        this.networkInfo,
      );
      this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
      this.auctionCoinTokenProxy = new ERC20TokenProxy(
        this.algoPainterContractByNetworkId,
      );
      this.setAccountBalance().catch(console.error);
    }
  }

  created() {
    if (this.isConnected) {
      this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(
        this.networkInfo,
      );
      this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
      this.auctionCoinTokenProxy = new ERC20TokenProxy(
        this.algoPainterContractByNetworkId,
      );
    }
  }

  mounted() {
    this.setAccountBalance().catch(console.error);
    this.hasJustStaked = false;
  }

  @Watch('getAuctionInfoPirs')
  onGetAuctionChanged() {
    this.pastOwnersList = [];
    if (this.getAuctionInfoPirs) {
      this.loadingAuctionInfo = false;
      this.getImagePastOwners(false).catch(console.error);
    }
  }

  get algoPainterContractByNetworkId() {
    return getAlgoPainterContractByNetworkId(this.networkInfo.id);
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

  @Watch('stakeAmount')
  onStakeAmountChanged() {
    if (this.getAuctionInfoPirs) {
      const stakeAmount = Number(this.stakeAmount);
      if (stakeAmount <= 0 || stakeAmount === null || stakeAmount > this.userBalance || this.getAuctionInfoPirs.ended) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
      this.getImagePastOwners().catch(console.error);
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
      await this.rewardsSystem
        .stakePirs(
          this.getAuctionInfoPirs.index,
          numberToString(stakeAmount),
          this.account,
        )
        .on('transactionHash', () => {
          this.placingBidBackStatus =
            PlacingBidBackStatus.IncreateAllowanceAwaitingConfirmation;
        })
        .on('error', () => {
          this.placingBidBackStatus =
            PlacingBidBackStatus.IncreateAllowanceError;
          setTimeout(() => {
            this.openPirsSimulatorModal();
            this.placingBidBackStatus = null;
          }, 3000);
        });
      this.placingBidBackStatus =
        PlacingBidBackStatus.IncreateAllowanceCompleted;
      setTimeout(() => {
        try {
          this.$store.dispatch({
            type: 'auctions/updatePirsStakedAlgop',
            collectionOwner: this.getAuctionInfoPirs.item.collectionOwner,
            itemIndex: this.getAuctionInfoPirs.item.index,
          }).catch(console.error);
        } catch (e) {
          console.log('updatePirsStakedAlgop error PirsSimulatorModal');
        } finally {
          this.openPirsSimulatorModal();
          this.placingBidBackStatus = null;
        }
      }, 3000);
    } catch (e) {
      console.log('error - stakeAlgop PirsSimulatorModal', e);
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
        this.getAuctionInfoPirs.minimumBid.tokenPriceAddress
      );
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  setFormatCurrency(amount: number) {
    return blockchainToCurrency(amount, this.coinDetails.decimalPlaces);
  }

  formatHighestBidAmount() {
    return blockchainToCurrency(
      this.getAuctionInfoPirs.highestBid
        ? this.getAuctionInfoPirs.highestBid.netAmount
        : 0,
      this.coinDetails.decimalPlaces,
    );
  }

  auction: IAuctionItem | null = null;
  pastOwnersList: IUserOwner[] = [];

  async getImagePastOwners(isASimulation: boolean = true) {
    this.loadingTable = true;
    this.pastOwnersList = [];

    const stakeAmount = (isASimulation) ? Number(this.stakeAmount) : this.stakeAmount;

    this.auctionPirsRate = (await this.bidBackPirsSystem.getPIRSRate(this.getAuctionInfoPirs.index)) / 10000;
    this.totalPirsStaked = this.setFormatCurrency(await this.rewardsSystem.getTotalPirsStakes(this.getAuctionInfoPirs.index));

    this.auctionCurrency = this.getAuctionInfoPirs.minimumBid.tokenSymbol;

    this.$store
      .dispatch({
        type: 'auctions/getImagePastOwners',
        imgId: this.getAuctionInfoPirs.item._id,
      })
      .then(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const response = this.$store.getters[
          'auctions/getImagePastOwners'
        ] as IOwnerPirs[];
        const pastOwners: IOwnerPirs[] = [];

        response.forEach((owner) => {
          pastOwners.push(owner);
        });
        pastOwners.reverse();

        pastOwners.forEach((owner) => {
          const name = this.formatName(owner.name, owner.account);
          const account = owner.account;
          const formattedAccount = this.formatAccount(account);

          this.pastOwnersList.push({
            name: name,
            account: account,
            formattedAccount: formattedAccount,
            auctionCurrency: this.auctionCurrency,
            stakedAlgop:
              name === 'You' && isASimulation && stakeAmount
                ? stakeAmount + this.totalPirsStaked
                : 0,
            stakedAlgopPercentage:
              pastOwners.length === 1 && isASimulation ? 100 : 0,
            pirsPrize:
              pastOwners.length === 1 && isASimulation
                ? `${(
                    this.formatHighestBidAmount() * this.auctionPirsRate
                )}  ${this.auctionCurrency}`
                : `0.000 ${this.auctionCurrency}`,
          });
        });

        if (pastOwners.length === 1 && isASimulation) {
          this.loadingTable = false;
          return;
        }

        if (isASimulation && typeof stakeAmount === 'number') {
          this.totalPirsStaked = Number(this.totalPirsStaked) + stakeAmount;
          if (this.getAuctionInfoPirs.pirshare) {
            if (this.getAuctionInfoPirs.pirshare[this.account]) {
              this.totalPirsStaked = Number(this.totalPirsStaked) - blockchainToCurrency(this.getAuctionInfoPirs.pirshare[this.account], this.coinDetails.decimalPlaces);
            }
          }
        }

        let isVariableSet = false;

        if (this.getAuctionInfoPirs.pirshare) {
          Object.keys(this.getAuctionInfoPirs.pirshare).forEach((account) => {
            this.pastOwnersList.forEach((pastOwner) => {
              if (account === pastOwner.account) {
                if (account === this.account && isASimulation) {
                  isVariableSet = true;
                } else {
                  pastOwner.stakedAlgop = this.setFormatCurrency(this.getAuctionInfoPirs.pirshare[account]);
                  isVariableSet = true;
                }
              } else if (!isVariableSet && pastOwner.name !== 'You') {
                pastOwner.stakedAlgop = 0;
              }
              if (typeof pastOwner.stakedAlgop === 'number') {
                pastOwner.stakedAlgopPercentage = parseFloat(((pastOwner.stakedAlgop > 0)
                  ? (pastOwner.stakedAlgop / this.totalPirsStaked) * 100
                  : 0).toFixed(2));
                pastOwner.stakedAlgopPercentage = parseFloat(pastOwner.stakedAlgopPercentage.toFixed(2));
              }
            });
          });
        }

        const auctionPirsPrize = blockchainToCurrency(
          this.getAuctionInfoPirs.highestBid.netAmount,
          this.coinDetails.decimalPlaces) * this.auctionPirsRate;

        if (this.getAuctionInfoPirs.pirshare) {
          Object.keys(this.getAuctionInfoPirs.pirshare).forEach(() => {
            this.pastOwnersList.forEach((account) => {
              account.pirsPrize = `${((account.stakedAlgopPercentage / 100) * auctionPirsPrize)} ${this.auctionCurrency}`;
            });
          });
        }

        if (!this.getAuctionInfoPirs.pirshare) {
          this.pastOwnersList.forEach((pastOwner) => {
            if (pastOwner.account === this.account && isASimulation) {
              pastOwner.stakedAlgop = stakeAmount;
              pastOwner.stakedAlgopPercentage = 100.00;
              pastOwner.stakedAlgopPercentage = 100.00;
              pastOwner.pirsPrize = `${((pastOwner.stakedAlgopPercentage / 100) * auctionPirsPrize).toFixed(2)} ${this.auctionCurrency}`;
            }
          });
        }

        this.loadingTable = false;
      }).catch(console.error);
  }

  formatAccount(account: string) {
    return account.slice(0, 4) + '...' + account.slice(account.length - 4);
  }

  formatName(name: string, account: string) {
    if (account === this.account) {
      return 'You';
    }

    const nameArray = name.split(' ');
    nameArray[0] =
      nameArray[0].length <= 11
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

  async setAccountBalance() {
    this.userBalance = await UserUtils.fetchAccountBalance(
      this.networkInfo,
      this.account,
    );
    this.stakeAmount = this.userBalance;
    this.setformattedBalance();
  }

  setformattedBalance() {
    this.formattedBalance = UserUtils.formatAccountBalance(this.userBalance, 2);
  }

  openPirsSimulatorModal() {
    this.$store.dispatch({
      type: 'auctions/openPirsSimulatorModal',
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
