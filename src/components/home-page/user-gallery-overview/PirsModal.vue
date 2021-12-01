<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
  >
    <q-card class="q-pa-lg">
      <p
        class="row justify-center text-h5 text-bold text-primary"
      >
        {{ ' ' + $t('dashboard.auctions.pirsModal.title') }}
      </p>
      <div v-show="!loadingTable">
        <p class="q-mb-none">
          <span class="text-bold text-secondary">{{ $t(`dashboard.auctions.pirsModal.yourBalance`) }}</span>
          {{ $t(`dashboard.auctions.pirsModal.algop`) }} {{ formattedBalance }}
        </p>
        <p class="q-mb-none">
          <span class="text-bold text-secondary">{{ $t(`dashboard.auctions.pirsModal.totalPirsAmount`) }}</span>
          {{ $t(`dashboard.auctions.pirsModal.algop`) }} {{ setFormatCurrency(totalPirsStaked).toFixed(2) }}
        </p>
      </div>
      <div class="q-pa-md">
        <q-table
          :rows="pastOwnersList"
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
          :label="$t('dashboard.auctions.pirsModal.returnBtn')"
          color="primary"
          outline
          @click="openPirsModal()"
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
import { IOwnerPirs } from 'src/models/IOwnerPirs';
import { mapGetters } from 'vuex';
import AlgoPainterBidBackPirsProxy from 'src/eth/AlgoPainterBidBackPirsProxy';
import AlgoPainterRewardsSystemProxy from 'src/eth/AlgoPainterRewardsSystemProxy';
import { NetworkInfo } from 'src/store/user/types';
import { IAuctionItem } from 'src/models/IAuctionItem';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { auctionCoins } from 'src/helpers/auctionCoins';

interface IUserOwner {
  name: string;
  account: string
  formattedAccount: string | unknown;
  stackedAlgop: number;
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
export default class PirsModal extends Vue {
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  getAuctionInfo!: IAuctionItem;
  isConnected!: boolean;

  modal: boolean = false;
  userBalance: number = 0;
  formattedBalance: string = '';
  totalPirsStaked: number = 0;
  auction: IAuctionItem | null = null;

  pastOwnersList: IUserOwner[] = [];
  loadingTable: boolean = true;
  columns = [
    {
      name: 'name',
      required: true,
      label: 'Name',
      align: 'left',
      field: (pastOwnersList: { name: string; account: string; }) => (pastOwnersList.name) ? pastOwnersList.name : pastOwnersList.account,
      sortable: true,
    },
    {
      name: 'stackedAlgop',
      required: true,
      label: 'ALGOP Staked',
      field: (pastOwnersList: { stackedAlgop: number; }) => this.setFormatCurrency(pastOwnersList.stackedAlgop).toFixed(2),
      sortable: true,
    },
    {
      name: 'participation',
      required: true,
      label: 'Pirs %',
      field: (pastOwnersList: { stackedAlgopPercentage: number; }) => pastOwnersList.stackedAlgopPercentage.toFixed(2),
      sortable: true,
    },
  ];

  mounted() {
    if (this.isConnected) {
      this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
      this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
    }
    void this.setAccountBalance();
  }

  getAuctionPirs() {
    void this.$store.dispatch({
      type: 'auctions/getAuctions',
      collectionOwner: this.getAuctionInfo.item.collectionOwner,
      itemIndex: this.getAuctionInfo.item.index,
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.auction = this.$store.getters['auctions/getPirsAuction'] as IAuctionItem;
    });
  }

  getImagePastOwners() {
    this.loadingTable = true;

    void this.$store.dispatch({
      type: 'auctions/getImagePastOwners',
      imgId: this.auction?.item._id as string,
    }).then(async() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const response = this.$store.getters['auctions/getImagePastOwners'] as IOwnerPirs[];
      const pastOwners: IOwnerPirs[] = [];

      response.forEach(owner => {
        pastOwners.push(owner);
      });

      pastOwners.forEach(owner => {
        const account = owner.account;
        const formattedAccount = this.formatAccount(account);
        const name = this.formatName(owner.name);

        this.pastOwnersList.push({
          name: name,
          account: account,
          formattedAccount: formattedAccount,
          stackedAlgop: 0,
          stackedAlgopPercentage: 0,
        });
      });

      if (this.auction) {
        this.totalPirsStaked = await this.rewardsSystem.getTotalPirsStakes(
          this.auction?.index,
        );
      }

      const pirsUserList = this.auction?.pirs;
      let isVariableSet = false;

      if (pirsUserList) {
        Object.keys(pirsUserList).forEach((account) => {
          this.pastOwnersList.forEach((pastOwner) => {
            if (account === pastOwner.account) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              pastOwner.stackedAlgop = pirsUserList[account];
              isVariableSet = true;
            } else if (!isVariableSet) {
              pastOwner.stackedAlgop = 0;
            }
            if (typeof pastOwner.stackedAlgop === 'number') {
              pastOwner.stackedAlgopPercentage = (pastOwner.stackedAlgop > 0) ? (pastOwner.stackedAlgop / this.totalPirsStaked) * 100 : 0;
              pastOwner.stackedAlgopPercentage = parseFloat(pastOwner.stackedAlgopPercentage.toFixed(2));
            }
          });
        });
      }

      this.loadingTable = false;
    });
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

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
      this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
      void this.setAccountBalance();
    }
  }

  @Watch('getAuctionInfo')
  onAuctionInfoChanged() {
    this.pastOwnersList = [];

    if (this.getAuctionInfo.item.collectionOwner !== '') {
      void this.getAuctionPirs();
    }
  }

  @Watch('auction')
  onAuctionChanged() {
    void this.getImagePastOwners();
  }

  @Watch('userBalance')
  onUserBalanceChanged() {
    if (this.isConnected) {
      void this.setAccountBalance();
    }
  }

  async setAccountBalance() {
    this.userBalance = (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await UserUtils.fetchAccountBalance(this.$store.getters['user/networkInfo'], this.$store.getters['user/account']));
    void this.setformattedBalance();
  }

  setformattedBalance() {
    this.formattedBalance = UserUtils.formatAccountBalance(this.userBalance, 2);
  }

  openPirsModal() {
    void this.$store.dispatch({
      type: 'auctions/openPirsModal',
    });
  }
}
</script>
<style style="scss" scoped>
  .close-button-container {
    width: 100%;
  }
</style>
