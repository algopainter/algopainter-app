<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    class="report-and-simulator"
  >
    <q-card class="q-pa-lg modal-card-container">
      <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'column items-center q-pb-sm' : 'row justify-between q-px-md q-pb-md']">
        <p class="row text-h5 text-bold title">
          {{ ' ' + $t('dashboard.auctions.pirsModal.title') }}
        </p>
        <div class="row header-right">
          <div class="column q-mr-md">
            <p class="text-h8 text-bold">
              {{ ' ' + $t('dashboard.auctions.pirsModal.auctionRate') }}
            </p>
            <p
              v-if="auctionPirsRate"
              class="text-h8 text-bold"
            >
              {{ (auctionPirsRate * 100).toFixed(2) + "%" }}
            </p>
            <p
              v-else
              class="text-h8 text-bold"
            >
              {{ $t('dashboard.auctions.pirsModal.auctionRatePlaceholder') }}
            </p>
          </div>
          <div class="column">
            <p class="text-h8 text-bold">
              {{ ' ' + $t('dashboard.auctions.pirsModal.lastBid') }}
            </p>
            <p class="text-h8 text-bold">
              {{
                ' ' +
                  $t('dashboard.auctions.pirsModal.lastBidValue', {
                    highestBid: formatHighestBidAmount().toFixed(2),
                    auctionCurrency: getAuctionInfoPirs.minimumBid.tokenSymbol,
                  })
              }}
            </p>
          </div>
        </div>
      </div>
      <q-table
        :rows="pastOwnersList"
        :columns="columns"
        row-key="name"
        hide-bottom
        flat
        :loading="loadingTable"
      />
      <div class="row justify-center">
        <algo-button
          :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'smaller-algo-button q-mt-md' : 'q-mt-md']"
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
  account: string;
  formattedAccount: string | unknown;
  stakedAlgop: number;
  stakedAlgopPercentage: number;
  pirsPrize: string;
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
        'getAuctionInfoPirs',
      ]),
  },
})
export default class PirsModal extends Vue {
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  getAuctionInfoPirs!: IAuctionItem;
  isConnected!: boolean;
  auctionPirsRate!: number;

  modal: boolean = false;
  totalPirsStaked: number = 0;
  auction: IAuctionItem | null = null;
  auctionCurrency!: string;

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
      name: 'stakedAlgop',
      required: true,
      label: 'ALGOP Staked',
      field: (pastOwnersList: { stakedAlgop: number; }) => this.setFormatCurrency(pastOwnersList.stakedAlgop).toFixed(2),
      sortable: true,
    },
    {
      name: 'participation',
      required: true,
      label: 'Pirs %',
      field: (pastOwnersList: { stakedAlgopPercentage: number; }) => pastOwnersList.stakedAlgopPercentage.toFixed(2),
      sortable: true,
    },
    {
      name: 'prizeAmount',
      required: true,
      label: 'Pirs',
      field: (pastOwnersList: { pirsPrize: string }) => pastOwnersList.pirsPrize,
      sortable: true,
    },
  ];

  created() {
    if (this.isConnected) {
      this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
      this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
    }
  }

  async getAuctionPirsRate() {
    this.auctionPirsRate = (await this.bidBackPirsSystem.getInvestorPirsRate(this.getAuctionInfoPirs.index)) / 10000;
  }

  formatHighestBidAmount() {
    return blockchainToCurrency(
      this.getAuctionInfoPirs.highestBid
        ? this.getAuctionInfoPirs.highestBid.netAmount
        : 0,
      this.coinDetails.decimalPlaces,
    );
  }

  getAuctionPirs() {
    void this.getAuctionPirsRate();
    void this.$store.dispatch({
      type: 'auctions/getAuctions',
      collectionOwner: this.getAuctionInfoPirs.item.collectionOwner,
      itemIndex: this.getAuctionInfoPirs.item.index,
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.auction = this.$store.getters['auctions/getPirsAuction'] as IAuctionItem;
    });
  }

  getImagePastOwners() {
    this.loadingTable = true;

    this.auctionCurrency = this.getAuctionInfoPirs.minimumBid.tokenSymbol;

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
          stakedAlgop: 0,
          stakedAlgopPercentage: 0,
          pirsPrize: `0.000 ${this.auctionCurrency}`,
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
              pastOwner.stakedAlgop = pirsUserList[account];
              isVariableSet = true;
            } else if (!isVariableSet) {
              pastOwner.stakedAlgop = 0;
            }
            if (typeof pastOwner.stakedAlgop === 'number') {
              pastOwner.stakedAlgopPercentage = (pastOwner.stakedAlgop > 0) ? (pastOwner.stakedAlgop / this.totalPirsStaked) * 100 : 0;
              pastOwner.stakedAlgopPercentage = parseFloat(pastOwner.stakedAlgopPercentage.toFixed(2));
            }
          });
        });
      }

      const auctionPirsPrize = this.formatHighestBidAmount() * this.auctionPirsRate;

      if (this.getAuctionInfoPirs.pirshare) {
        Object.keys(this.getAuctionInfoPirs.pirshare).forEach(() => {
          this.pastOwnersList.forEach((account) => {
            account.pirsPrize = `${((account.stakedAlgopPercentage / 100) * auctionPirsPrize).toFixed(2)} ${this.auctionCurrency}`;
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
      void this.getAuctionPirsRate();
    }
  }

  @Watch('getAuctionInfoPirs')
  onAuctionInfoChanged() {
    this.pastOwnersList = [];
    if (this.getAuctionInfoPirs.item.collectionOwner !== '') {
      void this.getAuctionPirs();
    }
  }

  @Watch('auction')
  onAuctionChanged() {
    void this.getImagePastOwners();
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
  .modal-card-container{
  max-width: 800px !important;
  border-radius: 20px;
  }
  .header-right p, title {
  margin-bottom: 0px;
}
</style>
