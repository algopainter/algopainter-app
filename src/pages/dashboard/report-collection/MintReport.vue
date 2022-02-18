<template>
  <div class="q-pa-md">
    <q-table
      :rows="collectionReport"
      :columns="columns"
      row-key="name"
      class="table-mint-report"
      hide-bottom
      separator="vertical"
      flat
      bordered
    />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { IReportCollection } from 'src/models/IReportCollection';

export default class MintReport extends Vue {
  collectionReport: IReportCollection[] = [
    {
      index: 1,
      collectionName: 'algoArtMint',
      amount: 500,
      createdRoater: 5,
      tokenSymbol: 'ALGOP',
      date: '',
      creatorGain: 0,
    },
    {
      index: 2,
      collectionName: 'algoArtMint',
      amount: 500,
      createdRoater: 5,
      tokenSymbol: 'ALGOP',
      date: '',
      creatorGain: 0,
    },
    {
      index: 3,
      collectionName: 'algoArtMint',
      amount: 500,
      createdRoater: 5,
      tokenSymbol: 'ALGOP',
      date: '',
      creatorGain: 0,
    },
    {
      index: 4,
      collectionName: 'algoArtMint',
      amount: 600,
      createdRoater: 5,
      tokenSymbol: 'ALGOP',
      date: '',
      creatorGain: 0,
    },
  ];

columns = [
  {
    name: 'index',
    required: true,
    label: 'Art',
    field: (collectionReport: { index: number }) => `# ${collectionReport.index}`,
    style: ('text-align: center')

  },
  {
    name: 'collection',
    required: true,
    label: 'Collection',
    field: (collectionReport: { collectionName: string }) => collectionReport.collectionName,
    style: ('text-align: center')
  },
  {
    name: 'ValueToMint',
    required: true,
    label: 'Value to Mint',
    field: (collectionReport: { amount: string, tokenSymbol: string }) => `${collectionReport.amount} ${collectionReport.tokenSymbol}`,
    style: ('text-align: center')

  },
  {
    name: 'ValueToMint',
    required: true,
    label: 'Creator %',
    field: (collectionReport: { createdRoater: string }) => collectionReport.createdRoater,
    style: ('text-align: center')

  },

]
}
</script>

<style lang="sass">
.table-mint-report
  width: 80%

  .table-mint-report
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: #F4538D
    font-weight: bold
    text-align: center
    color: white

</style>
