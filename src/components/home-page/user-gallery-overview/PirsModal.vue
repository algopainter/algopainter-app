<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    @hide="openPirsModal()"
  >
    <q-card class="q-pa-lg">
      <p
        class="row justify-center text-h5 text-bold text-primary"
      >
        {{ ' ' + $t('dashboard.auctions.pirsModal.title') }}
      </p>
      <div v-if="!loadingTable">
        <p class="q-mb-none">
          <span class="text-bold text-secondary">{{ $t(`dashboard.auctions.currentBalance`) }}</span> {{ $t(`dashboard.algop`) }} {{ formattedBalance }}
        </p>
        <!-- <p class="q-mb-none">
          <span class="text-bold text-secondary">{{ $t(`dashboard.auctions.currentBidBackAmount`) }}</span>{{ ` ${bidBackAmount}` }}
        </p> -->
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
import { IOwnerPirs } from 'src/models/IOwnerPirs';
import { mapGetters } from 'vuex';
import AlgoPainterBidBackPirsProxy from 'src/eth/AlgoPainterBidBackPirsProxy';
import AlgoPainterRewardsSystemProxy from 'src/eth/AlgoPainterRewardsSystemProxy';
import { NetworkInfo } from 'src/store/user/types';

interface IUserOwner {
  stackedAlgop: number;
  stackedAlgopPercentage: number;
  name: string;
  account: string
}

interface IBidbackPercentages {
  percentages: [],
  users: [],
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
        'getBidbackIndex',
      ]),
  },
})
export default class PirsModal extends Vue {
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  getBidbackIndex!: number;
  isConnected!: boolean;

  modal: boolean = false;
  userBalance: number = 0;
  formattedBalance: string = '';

  userBid: IUserOwner[] = [];
  loadingTable: boolean = true;
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
      name: 'stackedAlgop',
      required: true,
      label: 'ALGOP Stacked',
      field: (userBid: { stackedAlgop: number; }) => userBid.stackedAlgop,
      sortable: true,
    },
    {
      name: 'participation',
      required: true,
      label: 'Pirs %',
      field: (userBid: { stackedAlgopPercentage: number; }) => userBid.stackedAlgopPercentage,
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

  async getBidbackPercentages() {
    try {
      const response = await this.rewardsSystem.getBidbackPercentages(this.getBidbackIndex) as unknown as IBidbackPercentages;
      const bidbackPercentages = response.percentages;

      for (let i = 0; i < this.userBid.length; i++) {
        this.userBid[i].stackedAlgopPercentage = (typeof bidbackPercentages[i] === 'undefined') ? 0 : bidbackPercentages[i];
      }
    } catch {
      console.log('error getPirsPercentages');
    }
  }

  getImagePastOwners() {
    this.loadingTable = true;
    void this.$store.dispatch({
      type: 'auctions/getImagePastOwners',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      imgId: this.auctionId as string,
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const response = this.$store.getters['auctions/getImagePastOwners'] as IOwnerPirs[];
      const pastOwners: IOwnerPirs[] = [];
      const bidderAccounts: string|string[] = [];

      response.forEach(owner => {
        pastOwners.push(owner);
      });

      pastOwners.forEach(owner => {
        console.log('owner', owner);
        const account = this.formatAccount(owner.account);
        const name = this.formatName(owner.name);

        if (!bidderAccounts.includes(account)) {
          bidderAccounts.push(account);
          this.userBid.push({ name: name, account: account, stackedAlgop: 0, stackedAlgopPercentage: 0 });
        }
      });
      void this.getBidbackPercentages();
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['auctions/getPirsId'];
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
      void this.getImagePastOwners();
    }
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
