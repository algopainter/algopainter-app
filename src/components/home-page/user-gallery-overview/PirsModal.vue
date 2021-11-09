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
        <div v-if="!loadingTable">
          <p class="q-mb-none">
            <span class="text-bold text-secondary">{{ $t(`dashboard.auctions.pirsModal.yourBalance`) }}</span>
            {{ $t(`dashboard.auctions.pirsModal.algop`) }} {{ formattedBalance }}
          </p>
          <p class="q-mb-none">
            <span class="text-bold text-secondary">{{ $t(`dashboard.auctions.pirsModal.totalPirsAmount`) }}</span>
            {{ $t(`dashboard.auctions.pirsModal.algop`) }} {{ totalPirsStaked }}
          </p>
        </div>
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
        'getPirsItemIndex',
        'getPirsCollectionOwner',
      ]),
  },
})
export default class PirsModal extends Vue {
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  getPirsItemIndex!: number;
  getPirsCollectionOwner!: string;
  isConnected!: boolean;

  modal: boolean = false;
  userBalance: number = 0;
  formattedBalance: string = '';
  totalPirsStaked: number = 0;

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
      label: 'ALGOP Stacked',
      field: (pastOwnersList: { stackedAlgop: number; }) => pastOwnersList.stackedAlgop,
      sortable: true,
    },
    {
      name: 'participation',
      required: true,
      label: 'Pirs %',
      field: (pastOwnersList: { stackedAlgopPercentage: number; }) => pastOwnersList.stackedAlgopPercentage,
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

  auction: IAuctionItem | null = null;

  getAuctionPirs() {
    void this.$store.dispatch({
      type: 'auctions/getAuctions',
      collectionOwner: this.getPirsCollectionOwner,
      itemIndex: this.getPirsItemIndex,
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
              pastOwner.stackedAlgop = pirsUserList[account as unknown as number] as number;
              isVariableSet = true;
            } else if (!isVariableSet) {
              pastOwner.stackedAlgop = 0;
            }
            if (typeof pastOwner.stackedAlgop === 'number') {
              pastOwner.stackedAlgopPercentage = (pastOwner.stackedAlgop > 0) ? (pastOwner.stackedAlgop / this.totalPirsStaked) * 100 : 0;
              pastOwner.stackedAlgopPercentage = pastOwner.stackedAlgopPercentage.toFixed(2) as unknown as number;
            }
          });
        });
      }

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

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      void this.setAccountBalance();
    }
  }

  @Watch('getPirsCollectionOwner')
  onAuctionIdChanged() {
    this.pastOwnersList = [];

    if (this.getPirsCollectionOwner !== '') {
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
      collectionOwner: '',
      itemIndex: undefined,
    });
  }
}
</script>
<style style="scss" scoped>
  .close-button-container {
    width: 100%;
  }
</style>
