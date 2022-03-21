<template>
  <div v-if="collectionReport.length > 0" class="q-pa-md full-width row justify-center">
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
  <div v-else class="q-pa-md full-width row justify-center">
    <p>
      {{ $t('dashboard.report.noHaveCollection') }}
    </p>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import moment from 'moment';
import { IReportCollection } from 'src/models/IReportCollection';

export default class AuctionReport extends Vue {
 dataform: string = ''

 get accountAddress() {
   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
   return this.$store.getters['user/account'] as string;
 }

 mounted() {
   void this.getReport()
 }

  collectionReport: IReportCollection[]= []

  columns = [
    {
      name: 'Art',
      required: true,
      label: 'Art',
      field: (collectionReport: { nft: string }) => `${collectionReport.nft}`,
    },
    {
      name: 'collection',
      required: true,
      label: 'Collection',
      field: (collectionReport: { collection: string }) => collectionReport.collection,
      style: ('text-align: center')
    },
    {
      name: 'Date of sale',
      required: true,
      label: 'Date of sale',
      field: (collectionReport:{sellDT: string}) => collectionReport.sellDT ? this.formatDt(collectionReport.sellDT) : '-',
      style: ('text-align: center')
    },
    {
      name: 'Sale Value',
      required: true,
      label: 'Sale Value',
      field: (collectionReport:{amount: string}) => `${collectionReport.amount || '-'}`,
      style: ('text-align: center')
    },
    {
      name: 'Creator gain',
      required: true,
      label: 'Creator gain',
      field: (collectionReport:{toClaim: boolean, creator: string}) => collectionReport.toClaim ? `(waiting claim)` : `${collectionReport.creator || '-'}`,
      style: ('text-align: center')
    },
  ];

  formatDt(date: string) {
    return moment(date).format('DD/MM/YYYY hh:mm:ss')
  }

  getReport() {
    void this.$store.dispatch({
      type: 'collections/getReportAuctions',
      artist: this.accountAddress
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const report = this.$store.getters['collections/GET_REPORT_AUCTIONS'];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      this.collectionReport = report
    });
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
