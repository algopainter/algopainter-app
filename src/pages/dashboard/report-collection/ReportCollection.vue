<template>
  <div>
    <p>{{ $t('dashboard.report.textReport') }}</p>
    <div>
      <div class="row justify-start">
        <q-tabs
          v-model="tab"
          class="text-primary"
        >
          <q-tab name="MintReport" label="Mint Report" />
          <q-tab name="AuctionReport" label="Collection Auction Report" />
        </q-tabs>
      </div>
      <div>
        <q-tab-panels
          v-model="tab"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="MintReport">
            <div class="">
              <MintReport />
            </div>
          </q-tab-panel>

          <q-tab-panel name="AuctionReport">
            <AuctionReport />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import MintReport from './MintReport.vue';
import AuctionReport from './AuctionReport.vue';

interface itensReport {
  to?: string;
  label?: string;
}
@Options({
  components: {
    MintReport,
    AuctionReport

  },
})

export default class ReportCollection extends Vue {
currentOptions: string = '' ;
havecollection: boolean = true;
tab: string = ''
get options(): itensReport[] {
  return [
    {
      to:'MintReport',
      label:'Mint Report'
    },
    {
      to:'AuctionReport',
      label:'Collection Auction Report'
    }
  ]
}
}
</script>
<style scoped>
.btn-option{
  display: flex;
  margin-bottom: 10px;
}
</style>