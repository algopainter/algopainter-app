<template>
  <div class="q-pa-md row justify-center">
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
import { IReportEarnings } from 'src/models/IReportEarnings';

export default class ReportEarnings extends Vue {
 dataform: string = ''

  collectionReport: IReportEarnings[]= [
    {
      date: '2022-01-21T21:38:01.000Z',
      index: 1,
      collectionName: 'algoArtMint',
      createdRoater: 5,
      saleValue: 500,
      Bidback: 50,
      Pirs: 30,
      tokenSymbol: 'ALGOP',
      creatorGain: 70,
    },
    {
      date: '2022-01-21T21:38:01.000Z',
      index: 2,
      collectionName: 'algoArtMint',
      saleValue: 0,
      Bidback: 50,
      Pirs: 30,
      createdRoater: 5,
      tokenSymbol: 'ALGOP',
      creatorGain: 60,
    },
    {
      date: '2022-01-21T21:38:01.000Z',
      index: 3,
      collectionName: 'algoArtMint',
      saleValue: 500,
      Bidback: 50,
      Pirs: 30,
      createdRoater: 5,
      tokenSymbol: 'ALGOP',
      creatorGain: 50,
    },
    {
      date: '2022-01-21T21:38:01.000Z',
      index: 4,
      collectionName: 'algoArtMint',
      saleValue: 500,
      Bidback: 0,
      Pirs: 0,
      createdRoater: 5,
      tokenSymbol: 'ALGOP',
      creatorGain: 30,
    },
  ]

  columns = [
    {
      name: 'end of auction',
      required: true,
      label: 'End of auction',
      field: (collectionReport:{date: string}) => this.formatDt(collectionReport.date),
      style: ('text-align: center')
    },
    {
      name: 'Art',
      required: true,
      label: 'Art',
      field: (collectionReport: { index: string }) => collectionReport.index,
      style: ('text-align: center')
    },
    {
      name: 'Collection',
      required: true,
      label: 'Collection',
      field: (collectionReport: { collectionName: string }) => collectionReport.collectionName,
      style: ('text-align: center')
    },
    {
      name: 'Sale Value',
      required: true,
      label: 'Sale Value',
      field: (collectionReport:{saleValue: string, tokenSymbol: string}) => collectionReport.saleValue ? `${collectionReport.saleValue} ${collectionReport.tokenSymbol}` : '-',
      style: ('text-align: center')
    },
    {
      name: 'bidback gain',
      required: true,
      label: 'Bidback Gain',
      field: (collectionReport:{Bidback: string, tokenSymbol: string}) => collectionReport.Bidback ? `${collectionReport.Bidback} ${collectionReport.tokenSymbol}` : '-',
      style: ('text-align: center')
    },
    {
      name: 'PIRS gain',
      required: true,
      label: 'PIRS Gain',
      field: (collectionReport:{Pirs: string, tokenSymbol: string}) => collectionReport.Pirs ? `${collectionReport.Pirs} ${collectionReport.tokenSymbol}` : '-',
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
    color: white
</style>
