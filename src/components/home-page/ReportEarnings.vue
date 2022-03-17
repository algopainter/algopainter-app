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
import { Vue } from 'vue-class-component';
import moment from 'moment';
import { IReportEarnings } from 'src/models/IReportEarnings';

export default class ReportEarnings extends Vue {
 dataform: string = '';
 haveEarnings: boolean = false;

  collectionReport: IReportEarnings[]= [];

  mounted() {
    void this.getReport()
  }

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
      field: (collectionReport: { nft: string }) => `${collectionReport.nft || '-'}`,
      style: ('text-align: center')
    },
    {
      name: 'Collection',
      required: true,
      label: 'Collection',
      field: (collectionReport: { collectionName: string }) => `${collectionReport.collectionName || '-'}`,
      style: ('text-align: center')
    },
    {
      name: 'Sale Value',
      required: true,
      label: 'Sale Value',
      field: (collectionReport:{saleValue: string}) => `${collectionReport.saleValue || '-'}`,
      style: ('text-align: center')
    },
    {
      name: 'bidback gain',
      required: true,
      label: 'Bidback Gain',
      field: (collectionReport:{Bidback: string}) => `${collectionReport.Bidback || '-'}`,
      style: ('text-align: center')
    },
    {
      name: 'PIRS gain',
      required: true,
      label: 'PIRS Gain',
      field: (collectionReport:{Pirs: string}) => `${collectionReport.Pirs || '-'}`,
      style: ('text-align: center')
    },
  ];

  formatDt(date: string) {
    return moment(date).format('DD/MM/YYYY hh:mm:ss')
  }

  get accountAddress() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/account'] as string;
  }

  getReport() {
    void this.$store.dispatch({
      type: 'collections/getReportUser',
      account: this.accountAddress
    }).then(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const report = this.$store.getters['collections/GET_REPORT_USER'];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      this.collectionReport = report
      console.log(' this.collectionReport', this.collectionReport)
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
