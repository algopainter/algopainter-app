<template>
  <div>
    <div v-if="collectionReport.length > 0" class="q-pa-md row justify-center">
      <p>{{ $t('dashboard.reportEarnings.textEarnings') }}</p>
      <q-table
        :rows="collectionReport"
        :columns="columns"
        row-key="name"
        class="table-auction-report"
        separator="vertical"
        flat
        bordered
      />
    </div>
    <div v-else>
      <p>{{ $t('dashboard.reportEarnings.noHaveEarnings') }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';
import { IReportEarnings } from 'src/models/IReportEarnings';
import AlgoPainterRewardsSystemProxy from 'src/eth/AlgoPainterRewardsSystemProxy';
import { mapGetters } from 'vuex';
import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterBidBackPirsProxy from 'src/eth/AlgoPainterBidBackPirsProxy';

@Options({
  computed: {
    ...mapGetters('user', ['networkInfo', 'account', 'isConnected']),
  },
})
export default class ReportEarnings extends Vue {
  dataform: string = '';
  haveEarnings: boolean = false;
  collectionReport: IReportEarnings[]= [];
  rewardsSystem: AlgoPainterRewardsSystemProxy = <AlgoPainterRewardsSystemProxy>{};
  ratesSystem: AlgoPainterBidBackPirsProxy = <AlgoPainterBidBackPirsProxy>{};
  networkInfo: NetworkInfo = <NetworkInfo>{};
  account: string = '';
  isConnected: boolean = false;

  created() {
    this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
    this.ratesSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
  }

  async mounted() {
    await this.getReport();
  }

  columns = [
    {
      name: 'end of auction',
      required: true,
      label: 'End of auction',
      field: (collectionReport: IReportEarnings) => this.formatDt(collectionReport.sellDT),
      style: ('text-align: center')
    },
    {
      name: 'Art',
      required: true,
      label: 'Art',
      field: (collectionReport: IReportEarnings) => `#${collectionReport.nft || '-'}`,
      style: ('text-align: center')
    },
    {
      name: 'Collection',
      required: true,
      label: 'Collection',
      field: (collectionReport: IReportEarnings) => `${(collectionReport.collection == 'PersonalItem' ? 'Personal' : collectionReport.collection) || '-'}`,
      style: ('text-align: center')
    },
    {
      name: 'Sale Value',
      required: true,
      label: 'Sale Value',
      field: (collectionReport: IReportEarnings) => `${collectionReport.amount || '-'}`,
      style: ('text-align: center')
    },
    {
      name: 'bidback gain',
      required: true,
      label: 'Bidback Gain',
      field: (collectionReport: IReportEarnings) => `${collectionReport.bidback || '-'}`,
      style: ('text-align: center')
    },
    {
      name: 'PIRS gain',
      required: true,
      label: 'PIRS Gain',
      field: (collectionReport: IReportEarnings) => `${collectionReport.pirs || '-'}`,
      style: ('text-align: center')
    },
    {
      name: 'Status',
      required: true,
      label: 'Status',
      field: (collectionReport: IReportEarnings) => this.check(collectionReport.toClaim, collectionReport.sellDT),
      style: ('text-align: center')
    },
  ];

  formatDt(date?: Date) {
    return date ? moment(date).format('DD/MM/YYYY hh:mm:ss') : '-'
  }

  get accountAddress() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/account'] as string;
  }

  check(claim: boolean, date?:Date) {
    const time = moment().isAfter(date);
    if (!time) {
      return 'Auction is not over yet'
    } else if (time && claim) {
      return 'Waiting for the NFT claim'
    } else if (time && !claim) {
      return 'Available'
    }
  }

  async getReport() {
    await this.$store.dispatch({ type: 'collections/getReportUser', account: this.accountAddress });
    this.collectionReport = JSON.parse(JSON.stringify(this.$store.getters['collections/GET_REPORT_USER']));
  }
}

</script>
<style lang="sass">
.table-auction-report
  width: 80%

  .table-auction-report
  .q-table__top,
  thead tr:first-child th
    background-color: #F4538D
    font-weight: bold
    text-align: center
    color: white
</style>
