<template>
  <div v-if="collectionReport.length > 0" class="q-pa-md full-width row justify-center">
    <q-table
      :rows="collectionReport"
      :columns="columns"
      row-key="name"
      class="table-mint-report"
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
import { IReportMints } from 'src/models/IReportMints';

export default class MintReport extends Vue {
  collectionReport: IReportMints[] = [];
columns = [
  {
    name: 'art',
    required: true,
    label: 'Art',
    field: (collectionReport: { nft: string }) => `${collectionReport.nft || '-'}`,
    style: ('text-align: center')

  },
  {
    name: 'collection',
    required: true,
    label: 'Collection',
    field: (collectionReport: { collection: string }) => collectionReport.collection,
    style: ('text-align: center')
  },
  {
    name: 'ValueToMint',
    required: true,
    label: 'Value to Mint',
    field: (collectionReport: { amount: string}) => `${collectionReport.amount || '-'}`,
    style: ('text-align: center')

  },
  {
    name: 'ValueToMint',
    required: true,
    label: 'Creator %',
    field: (collectionReport: { creator: string }) => collectionReport.creator,
    style: ('text-align: center')

  },
  {
    name: 'Status',
    required: true,
    label: 'Status',
    field: (collectionReport:{toClaim:boolean; sellDT: string}) => this.check(collectionReport.toClaim, collectionReport.sellDT),
    style: ('text-align: center; color: red')
  },
]

mounted() {
  void this.getReport()
}

get accountAddress() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return this.$store.getters['user/account'] as string;
}

check(claim: boolean, date:string) {
  const time = moment().isAfter(date);
  if (!time) {
    return 'Auction is not over yet'
  } else if (time && claim) {
    return 'Waiting for the NFT claim'
  } else if (time && !claim) {
    return 'Available'
  }
}

getReport() {
  void this.$store.dispatch({
    type: 'collections/getReportMints',
    artist: this.accountAddress
  }).then(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const report = this.$store.getters['collections/GET_REPORT_MINTS'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    this.collectionReport = report
  });
}
}
</script>

<style lang="sass">
.table-mint-report
  width: 80%

  .table-mint-report
  .q-table__top,
  thead tr:first-child th
    background-color: #F4538D
    font-weight: bold
    text-align: center
    color: white

</style>
