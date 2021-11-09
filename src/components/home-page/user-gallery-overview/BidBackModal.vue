<template>
  <q-dialog ref="dialog" v-model="modal" @hide="openBidBackModal()">
    <q-card class="q-pa-lg">
      <p class="row justify-center text-h5 text-bold text-primary">
        {{ ' ' + $t('dashboard.auctions.bidBackModal.title') }}
      </p>
      <div v-if="!loadingTable">
        <p class="q-mb-none">
          <span class="text-bold text-secondary">{{
            $t(`dashboard.auctions.bidBackModal.yourBalance`)
          }}</span>
          {{ $t(`dashboard.auctions.bidBackModal.algop`) }}
          {{ formattedBalance }}
        </p>
        <p class="q-mb-none">
          <span class="text-bold text-secondary">{{
            $t(`dashboard.auctions.bidBackModal.totalBidBackAmount`)
          }}</span>
          {{ $t(`dashboard.auctions.bidBackModal.algop`) }}
          {{ totalBidBackStaked }}
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
    ...mapGetters('user', ['networkInfo', 'account', 'isConnected']),
    ...mapGetters('auctions', ['getBidBackIndex']),
  },
})
export default class BidBackModal extends Vue {
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  getBidBackIndex!: number;
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
      field: (userBid: { name: string; formattedAccount: string }) =>
        userBid.name ? userBid.name : userBid.formattedAccount,
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
      field: (userBid: { stackedAlgop: number }) => userBid.stackedAlgop,
      sortable: true,
    },
    {
      name: 'participation',
      required: true,
      label: 'BidBack %',
      field: (userBid: { stackedAlgopPercentage: number }) =>
        userBid.stackedAlgopPercentage,
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

  getAuctions() {
    this.loadingTable = true;

    void this.$store
      .dispatch({
        type: 'auctions/getAuctions',
        account: this.auctionId as string,
      })
      .then(async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const auction = this.$store.getters[
          'auctions/getAuctions'
        ] as IAuctionItem;
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
          const highestBid = bid.amount / 1000000000000000000;

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

        this.totalBidBackStaked =
          await this.rewardsSystem.getTotalBidBackStakes(this.getBidBackIndex);

        const bidBackUserList = auction.bidBacks;
        let isVariableSet = false;

        if (auction.bidBacks) {
          Object.keys(bidBackUserList).forEach((account) => {
            this.userBid.forEach((bidder) => {
              if (account === bidder.account) {
                bidder.stackedAlgop =
                  bidBackUserList[account as unknown as number];
                isVariableSet = true;
              } else if (!isVariableSet) {
                bidder.stackedAlgop = 0;
              }
              if (typeof bidder.stackedAlgop === 'number') {
                bidder.stackedAlgopPercentage =
                  bidder.stackedAlgop > 0
                    ? (bidder.stackedAlgop / this.totalBidBackStaked) * 100
                    : 0;
                bidder.stackedAlgopPercentage =
                  bidder.stackedAlgopPercentage.toFixed(2) as unknown as number;
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
    nameArray[0] =
      nameArray[0].length <= 11
        ? nameArray[0]
        : nameArray[0].slice(0, 11) + '...';
    return nameArray[0];
  }

  get auctionId() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['auctions/getBidBackId'];
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      void this.setAccountBalance();
    }
  }

  @Watch('auctionId')
  onAuctionIdChanged() {
    this.userBid = [];
    if (this.auctionId !== '') {
      void this.getAuctions();
    }
  }

  @Watch('userBalance')
  onUserBalanceChanged() {
    if (this.isConnected) {
      void this.setAccountBalance();
    }
  }

  async setAccountBalance() {
    this.userBalance =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await UserUtils.fetchAccountBalance(this.$store.getters['user/networkInfo'], this.$store.getters['user/account']
      );
    void this.setformattedBalance();
  }

  setformattedBalance() {
    this.formattedBalance = UserUtils.formatAccountBalance(this.userBalance, 2);
  }

  openBidBackModal() {
    void this.$store.dispatch({
      type: 'auctions/openBidBackModal',
      auctionId: '',
      auctionIndex: '',
    });
  }
}
</script>
<style style="scss" scoped>
.close-button-container {
  width: 100%;
}
</style>
