<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
  >
    <q-card class="q-pa-lg">
      <p class="row justify-center text-h5 text-bold text-primary">
        {{ ' ' + $t('dashboard.auctions.bidBackModal.title') }}
      </p>
      <div v-if="!loadingTable">
        <p class="q-mb-none">
          <span class="text-bold text-secondary">{{ $t(`dashboard.auctions.bidBackModal.yourBalance`) }}</span>
          {{ $t(`dashboard.auctions.bidBackModal.algop`) }} {{ formattedBalance }}
        </p>
        <p class="q-mb-none">
          <span class="text-bold text-secondary">{{ $t(`dashboard.auctions.bidBackModal.totalBidBackAmount`) }}</span>
          {{ $t(`dashboard.auctions.bidBackModal.algop`) }} {{ setFormatCurrency(totalBidBackStaked) }}
        </p>
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
        <algo-button
          class="q-my-md q-mx-sm action"
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
import UserUtils from 'src/helpers/user';
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
  highestBid: number;
  tokenSymbol: string;
  stackedAlgop: number | unknown;
  stackedAlgopPercentage: number;
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
export default class BidBackModal extends Vue {
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
      name: 'stackedAlgop',
      required: true,
      label: 'ALGOP stacked',
      field: (userBid: { stackedAlgop: number }) => this.setFormatCurrency(userBid.stackedAlgop),
      sortable: true,
    },
    {
      name: 'participation',
      required: true,
      label: 'BidBack %',
      field: (userBid: { stackedAlgopPercentage: number }) => userBid.stackedAlgopPercentage,
      sortable: true,
    },
  ];

  created() {
    this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
    this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
  }

  mounted() {
    void this.setAccountBalance();
  }

  @Watch('getAuctionInfo')
  onGetAuctionChanged() {
    this.userBid = [];
    if (this.getAuctionInfo) {
      void this.getAuctions();
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

  setFormatCurrency(amount: number) {
    return blockchainToCurrency(amount, this.coinDetails.decimalPlaces);
  }

  getAuctions() {
    this.loadingTable = true;

    void this.$store.dispatch({
      type: 'auctions/getAuctions',
      account: this.getAuctionInfo._id,
    }).then(async() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const auction = this.$store.getters['auctions/getAuctions'] as IAuctionItem;
      const auctionBids = auction.bids;
      const auctionBidsReversed: IBid[] = [];
      const bidderAccounts: string | string[] = [];

      auctionBids.forEach((bid) => {
        auctionBidsReversed.push(bid);
      });
      auctionBidsReversed.reverse();

      auctionBidsReversed.forEach((bid) => {
        const account = bid.account;
        const formattedAccount = this.formatAccount(account);
        const name = this.formatName(bid.name);
        const tokenSymbol = bid.tokenSymbol;
        const highestBid = bid.netAmount / 1000000000000000000;

        if (!bidderAccounts.includes(account)) {
          bidderAccounts.push(account);

          this.userBid.push({
            name: name,
            account: account,
            formattedAccount: formattedAccount,
            highestBid: highestBid,
            tokenSymbol: tokenSymbol,
            stackedAlgop: 0,
            stackedAlgopPercentage: 0,
          });
        }
      });

      this.totalBidBackStaked = await this.rewardsSystem.getTotalBidBackStakes(this.getAuctionInfo.index);
      let isVariableSet = false;

      if (auction.bidbacks) {
        Object.keys(auction.bidbacks).forEach((account) => {
          this.userBid.forEach((bidder) => {
            if (account === bidder.account) {
              bidder.stackedAlgop = auction.bidbacks[account];
              isVariableSet = true;
            } else if (!isVariableSet) {
              bidder.stackedAlgop = 0;
            }
            if (typeof bidder.stackedAlgop === 'number') {
              bidder.stackedAlgopPercentage = parseFloat(((bidder.stackedAlgop > 0)
                ? (bidder.stackedAlgop / this.totalBidBackStaked) * 100
                : 0).toFixed(2));
            }
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

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      void this.setAccountBalance();
    }
  }

  @Watch('userBalance')
  onUserBalanceChanged() {
    if (this.isConnected) {
      void this.setAccountBalance();
    }
  }

  async setAccountBalance() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.userBalance = await UserUtils.fetchAccountBalance(this.$store.getters['user/networkInfo'], this.$store.getters['user/account']);
    void this.setformattedBalance();
  }

  setformattedBalance() {
    this.formattedBalance = UserUtils.formatAccountBalance(this.userBalance, 2);
  }

  openBidBackModal() {
    console.log('openBidBackModal');
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
</style>
