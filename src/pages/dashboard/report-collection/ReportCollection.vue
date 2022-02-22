<template>
  <div>
    <div v-if="havecollection">
      <p>{{ $t('dashboard.report.textReport') }}</p>
      <q-btn v-for="option in options" :key="option" color="primary" class="btn-option" @click="currentOptions = option.to">
        {{ option.label }}
      </q-btn>
      <p>{{ $t('dashboard.report.fixedReport') }}</p>
      <component :is="currentOptions" class="row justify-center"></component>
    </div>
    <div v-else>
      <p>{{ $t('dashboard.report.noHaveCollection') }}</p>
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