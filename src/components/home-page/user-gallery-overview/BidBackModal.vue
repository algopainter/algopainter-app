<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    class="report-and-simulator"
  >
    <q-card
      class="q-pa-lg modal-card-container"
    >
      <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'column items-center q-pb-sm' : 'row justify-between q-px-md q-pb-md']">
        <p class="row text-h5 text-bold title">
          {{ ' ' + $t('dashboard.auctions.bidBackModal.title') }}
        </p>
        <div class="row header-right">
          <div class="column q-mr-md">
            <p class="text-h8 text-bold">
              {{ ' ' + $t('dashboard.auctions.bidBackModal.auctionRate') }}
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
              {{ $t('dashboard.auctions.bidBackModal.auctionRatePlaceholder') }}
            </p>
          </div>
          <div class="row">
            <div class="column">
              <p class="text-h8 text-bold">
                {{ ' ' + $t('dashboard.auctions.bidBackModal.lastBid') }}
              </p>
              <p
                v-if="auctionBidBackRate"
                class="text-h8 text-bold"
              >
                {{ ' ' + $t('dashboard.auctions.bidBackModal.lastBidValue', {
                  highestBid: formatHighestBidAmount(),
                  auctionCurrency: getAuctionInfoBidBack.highestBid.tokenSymbol})
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <q-table
        :rows="userBid"
        :columns="columns"
        row-key="name"
        hide-bottom
        flat
        :loading="loadingTable"
      />
      <div class="row justify-center">
        <algo-button
          :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'smaller-algo-button q-mt-md' : 'q-mt-md']"
          :label="$t('dashboard.auctions.bidBackModal.returnBtn')"
          color="primary"
          outline
          @click="openBidBackModal()"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AlgoButton from 'src/components/common/Button.vue';
import { Watch } from 'vue-property-decorator';
import { IAuctionItem } from 'src/models/IAuctionItem';
import { IBid } from 'src/models/IBid';
import { mapGetters } from 'vuex';
import AlgoPainterBidBackPirsProxy from 'src/eth/AlgoPainterBidBackPirsProxy';
import AlgoPainterRewardsSystemProxy from 'src/eth/AlgoPainterRewardsSystemProxy';
import { NetworkInfo } from 'src/store/user/types';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { auctionCoins } from 'src/helpers/auctionCoins';

interface IUserBid {
  name: string | null;
  account: string | unknown;
  formattedAccount: string | unknown;
  highestBid: string;
  tokenSymbol: string;
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
export default class BidBackModal extends Vue {
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  getAuctionInfoBidBack!: IAuctionItem;
  isConnected!: boolean;
  auctionBidBackRate!: number;
  auctionCurrency!: string;

  modal: boolean = false;
  totalBidBackStaked: number = 0;

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
      field: (userBid: { highestBid: string }) => userBid.highestBid,
      sortable: true,
    },
    {
      name: 'stakedAlgop',
      required: true,
      label: 'ALGOP staked',
      field: (userBid: { stakedAlgop: number }) => this.setFormatCurrency(userBid.stakedAlgop).toFixed(2),
      sortable: true,
    },
    {
      name: 'participation',
      required: true,
      label: 'BidBack %',
      field: (userBid: { stakedAlgopPercentage: number }) => userBid.stakedAlgopPercentage.toFixed(2),
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

  @Watch('getAuctionInfoBidBack')
  onGetAuctionChanged() {
    this.userBid = [];
    if (this.getAuctionInfoBidBack) {
      void this.getAuctions();
    }
  }

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return (
        coin.tokenAddress.toLowerCase() ===
        '0x01a9188076f1231df2215f67b6a63231fe5e293e'
      );
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  formatHighestBidAmount() {
    const amountBid = blockchainToCurrency(
      this.getAuctionInfoBidBack.highestBid
        ? this.getAuctionInfoBidBack.highestBid.netAmount
        : 0,
      this.coinDetails.decimalPlaces,
    );
    return this.$n(amountBid, 'decimal', {
      maximumFractionDigits: this.coinDetails.decimalPlaces,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }

  setFormatCurrency(amount: number) {
    return blockchainToCurrency(amount, this.coinDetails.decimalPlaces);
  }

  getAuctions() {
    this.loadingTable = true;

    void this.getAuctionBidBackRate();

    void this.$store.dispatch({
      type: 'auctions/getAuctions',
      account: this.getAuctionInfoBidBack.owner,
      collectionOwner: this.getAuctionInfoBidBack.item.collectionOwner,
      itemIndex: this.getAuctionInfoBidBack.item.index,
    }).then(async() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const auction = this.$store.getters['auctions/getPirsAuction'] as IAuctionItem;
      const auctionBids = auction.bids;
      const auctionBidsReversed: IBid[] = [];
      const bidderAccounts: string | string[] = [];

      auctionBids.forEach(bid => {
        auctionBidsReversed.push(bid);
      });
      auctionBidsReversed.reverse();

      auctionBidsReversed.forEach(bid => {
        const account = bid.account;
        const formattedAccount = this.formatAccount(account);
        const name = this.formatName(bid.name);
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
            tokenSymbol: this.auctionCurrency,
            stakedAlgop: 0,
            stakedAlgopPercentage: 0,
            bidBackPrize:
            auctionBidsReversed.length === 1
              ? `${(this.formatHighestBidAmount())} ${this.auctionCurrency}`
              : `0.000 ${this.auctionCurrency}`,
          });
        }
      });

      this.totalBidBackStaked = await this.rewardsSystem.getTotalBidBackStakes(this.getAuctionInfoBidBack.index);
      let isVariableSet = false;

      if (auction.bidbacks) {
        Object.keys(auction.bidbacks).forEach((account) => {
          this.userBid.forEach((bidder) => {
            if (account === bidder.account) {
              bidder.stakedAlgop = auction.bidbacks[account];
              isVariableSet = true;
            } else if (!isVariableSet) {
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
    });
  }

  formatAccount(account: string) {
    return account.slice(0, 4) + '...' + account.slice(account.length - 4);
  }

  formatName(name: string) {
    const nameArray = name.split(' ');
    nameArray[0] = (nameArray[0].length <= 11)
      ? nameArray[0]
      : nameArray[0].slice(0, 11) + '...';
    return nameArray[0];
  }

  created() {
    if (this.isConnected) {
      this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
      this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
    }
  }

  async getAuctionBidBackRate() {
    this.auctionBidBackRate = await this.bidBackPirsSystem.getBidBackRate(this.getAuctionInfoBidBack.index) / 10000;
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
      this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
      void this.getAuctionBidBackRate();
    }
  }

  openBidBackModal() {
    void this.$store.dispatch({
      type: 'auctions/openBidBackModal',
    });
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

<style lang="scss">
.report-and-simulator{
  .q-table thead, .q-table tr, .q-table th, .q-table td {
      border-color: $primary;
      border-bottom-width: 1.5px !important;
  }

  .q-table thead th {
    font-weight: bold;
    font-size: 14px;
  }

  .q-field__control-container {
    justify-content: center;
    input, div {
      color: $primary;
      font-size: 20px;
      font-weight: bold;
    }
    input {
      text-align: left;
    }
  }

  .smaller-placeholder {
    .q-field__control-container {
      input, div {
        font-size: 16px;
      }
      }
  }

  .smaller-checkbox-text {
    .q-checkbox__label {
      font-size: 10px;
    }
  }

  .smaller-algo-button {
    min-width: 0px;
    width: 100px;
  }
}
</style>
