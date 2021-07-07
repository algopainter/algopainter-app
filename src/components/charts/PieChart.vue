<template>
  <div>
    <vue-apex-charts
      type="pie"
      :options="options"
      :height="height"
      :width="width"
      :series="values"
    />
  </div>
</template>

<script lang="ts">
import { ApexOptions } from 'apexcharts';
import { Vue, Options, prop } from 'vue-class-component';
import VueApexCharts from 'vue3-apexcharts';

class Props {
  height = prop<number>({
    required: false,
  });

  values = prop<number[]>({
    required: true,
  });

  width = prop<number>({
    required: false,
  });

  options = prop<ApexOptions>({
    required: true,
  });
}

@Options({
  components: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    VueApexCharts,
  },
})

export default class PieChart extends Vue.with(Props) {}
</script>
