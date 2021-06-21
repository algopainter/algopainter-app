<template>
  <div>
    <pie-chart
      :labels="['Sellers', 'Creator', 'Investors', 'BidBack']"
      :colors="['#F4538D', '#9E0039', '#D0004B', '#FFBCD4']"
      :values="values"
      :chart-data="chartData"
      :options="options"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import PieChart from 'components/charts/PieChart.vue';

class Props {
  values = prop<number[]>({
    required: true,
  });
}

@Options({
  components: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    PieChart,
  },
})
export default class AuctionInfoChart extends Vue.with(Props) {
}
</script>
