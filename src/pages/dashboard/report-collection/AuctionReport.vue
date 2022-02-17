<template>
  <div class="q-pa-md">
    <q-table
      :rows="collectionReport"
      :columns="columns"
      row-key="name"
      class="table-auction-report"
      hide-bottom
      separator="vertical"
      flat
      bordered
    />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import moment from 'moment';
import { IReportCollection } from 'src/models/IReportCollection';

export default class AuctionReport extends Vue {
 dataform: string = ''

  collectionReport: IReportCollection[]= [
    {
      index: 1,
      collectionName: 'algoArtMint',
      amount: 500,
      createdRoater: 5,
      tokenSymbol: 'ALGOP',
      date: '2022-01-21T21:38:01.000Z',
      creatorGain: 70,
    },
    {
      index: 2,
      collectionName: 'algoArtMint',
      amount: 500,
      createdRoater: 5,
      tokenSymbol: 'ALGOP',
      date: '2022-01-21T21:38:01.000Z',
      creatorGain: 60,
    },
    {
      index: 3,
      collectionName: 'algoArtMint',
      amount: 500,
      createdRoater: 5,
      tokenSymbol: 'ALGOP',
      date: '2022-01-21T21:38:01.000Z',
      creatorGain: 50,
    },
    {
      index: 4,
      collectionName: 'algoArtMint',
      amount: 600,
      createdRoater: 5,
      tokenSymbol: 'ALGOP',
      date: '2022-01-21T21:38:01.000Z',
      creatorGain: 30,
    },
  ]

  columns = [
    {
      name: 'index',
      required: true,
      label: 'Art',
      field: (collectionReport: { index: number }) => `# ${collectionReport.index}`,
      // style: ('text-align: center')
    },
    {
      name: 'collection',
      required: true,
      label: 'Collection',
      field: (collectionReport: { collectionName: string }) => collectionReport.collectionName,
      style: ('text-align: center')
    },
    {
      name: 'Creator',
      required: true,
      label: '% Creator',
      field: (collectionReport: { createdRoater: string }) => collectionReport.createdRoater,
      style: ('text-align: center')
    },
    {
      name: 'Date of sale',
      required: true,
      label: 'Date of sale',
      field: (collectionReport:{date: string}) => this.formatDt(collectionReport.date),
      style: ('text-align: center')
    },
    {
      name: 'Sale Value',
      required: true,
      label: 'Sale Value',
      field: (collectionReport:{amount: string, tokenSymbol: string}) => `${collectionReport.amount} ${collectionReport.tokenSymbol}`,
      style: ('text-align: center')
    },
    {
      name: 'Creator gain',
      required: true,
      label: 'Creator gain',
      field: (collectionReport:{creatorGain: string, tokenSymbol: string}) => `${collectionReport.creatorGain} ${collectionReport.tokenSymbol}`,
      style: ('text-align: center')
    },
  ];

  formatDt(date: string) {
    return moment(date).format('DD/MM/YYYY hh:mm:ss')
  }
}
</script>
<style lang="sass">
.table-auction-report
  width: 80%

  .table-auction-report
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: #F4538D
    font-weight: bold
    text-align: center
</style>
