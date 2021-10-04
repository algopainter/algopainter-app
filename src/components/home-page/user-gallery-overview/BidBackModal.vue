<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    @hide="openBidBackModal()"
  >
    <q-card class="q-pa-lg">
      <p
        class="row justify-center text-h5 text-bold text-primary"
      >
        {{ ' ' + $t('dashboard.auctions.bidBackModal.title') }}
      </p>
      <div v-if="!loadingTable">
        <p class="q-mb-none">
          <span class="text-bold text-secondary">{{ $t(`dashboard.auctions.currentBalance`) }}</span> {{ $t(`dashboard.algop`) }} {{ formattedBalance() }}
        </p>
        <p class="q-mb-none">
          <span class="text-bold text-secondary">{{ $t(`dashboard.auctions.currentBidBackAmount`) }}</span>{{ ` $${auctionToken} ${bidBackAmount}` }}
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

interface IUserBid {
  name: string | null;
  account: string;
  highestBid: number;
  tokenSymbol: string;
  stackedALGOP: number;
}

@Options({
  components: {
    AlgoButton,
  },
})
export default class BidBackModal extends Vue {
  modal: boolean = false;
  userBalance: number = 0;

  userBid: IUserBid[] = [];
  loadingTable: boolean = true;
  auctionToken: string = '';
  bidBackAmount: number = 0;
  columns = [
    {
      name: 'name',
      required: true,
      label: 'Name',
      align: 'left',
      field: (userBid: { name: string; account: string; }) => (userBid.name) ? userBid.name : userBid.account,
      sortable: true,
    },
    {
      name: 'highestBid',
      required: true,
      label: 'Bid',
      field: (userBid: { highestBid: number; }) => userBid.highestBid,
      sortable: true,
    },
    {
      name: 'stackedALGOP',
      required: true,
      label: 'ALGOP Stacked',
      field: (userBid: { stackedALGOP: number; }) => userBid.stackedALGOP,
      sortable: true,
    },
    {
      name: 'participation',
      required: true,
      label: 'BidBack %',
      field: (userBid: { stackedALGOP: number; }) => userBid.stackedALGOP,
      sortable: true,
    },
  ];

  getAuctions() {
    this.loadingTable = true;
    void this.$store.dispatch({
      type: 'auctions/getAuctions',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      id: this.auctionId as string,
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const auction = this.$store.getters['auctions/getAuctions'] as IAuctionItem;
      const auctionBids = auction.bids;
      const auctionBidsReversed: IBid[] = [];
      const bidderAccounts: string|string[] = [];

      const highestBidAmount = auction.highestBid.amount / 1000000000000000000;
      const bidBackFee = 0.10;
      this.bidBackAmount = highestBidAmount * bidBackFee;

      auctionBids.forEach(bid => {
        auctionBidsReversed.push(bid);
      });
      auctionBidsReversed.reverse();

      auctionBidsReversed.forEach(bid => {
        const account = this.formatAccount(bid.account);
        const name = this.formatName(bid.name);
        const tokenSymbol = bid.tokenSymbol;
        this.auctionToken = tokenSymbol;
        const highestBid = bid.amount / 1000000000000000000;

        if (!bidderAccounts.includes(account)) {
          bidderAccounts.push(account);
          this.userBid.push({ name: name, account: account, highestBid: highestBid, tokenSymbol: tokenSymbol, stackedALGOP: 0 });
        }
      });
      this.loadingTable = false;
    });
  }

  formatAccount(account:string) {
    return account.slice(0, 4) + '...' + account.slice(account.length - 4);
  }

  formatName(name:string) {
    const nameArray = name.split(' ');
    nameArray[0] = (nameArray[0].length <= 11)
      ? nameArray[0]
      : nameArray[0].slice(0, 11) + '...';
    return nameArray[0];
  }

  get auctionId() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    console.log("this.$store.getters['auctions/getBidBackId']", this.$store.getters['auctions/getBidBackId']);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['auctions/getBidBackId'];
  }

  get account() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/account'];
  }

  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/isConnected'];
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

  async setAccountBalance() {
    this.userBalance = (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await UserUtils.fetchAccountBalance(this.$store.getters['user/networkInfo'], this.$store.getters['user/account']));
  }

  formattedBalance() {
    return UserUtils.formatAccountBalance(this.userBalance, 2);
  }

  openBidBackModal() {
    console.log('openBidBackModal');
    void this.$store.dispatch({
      type: 'auctions/openBidBackModal',
      auctionId: '',
    });
  }
}
</script>
<style style="scss" scoped>
  .close-button-container {
    width: 100%;
  }
</style>
