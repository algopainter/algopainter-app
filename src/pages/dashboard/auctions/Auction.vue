<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <auction-info-chart
      :values="[44, 100, 13, 33]"
    />
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AuctionInfoChart from 'components/charts/AuctionInfoChart.vue';

@Options({
  components: {
    AuctionInfoChart,
  },
})
export default class AuctionsList extends Vue {
}
</script>
