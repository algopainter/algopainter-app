<template>
  <div>
    <vue-apex-charts
      type="pie"
      :options="options"
      :series="series"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import VueApexCharts from 'vue3-apexcharts';

class Props {
  labels = prop<string[]>({
    required: true,
  });

  values = prop<number[]>({
    required: true,
  });

  colors = prop<string[]>({
    required: true,
  });
}

@Options({
  components: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    VueApexCharts,
  },
})
export default class PieChart extends Vue.with(Props) {
  options = {
    chart: {
      id: 'vuechart-example',
    },
    labels: this.labels,
    colors: this.colors,
  };

  series = this.values;
}
</script>
