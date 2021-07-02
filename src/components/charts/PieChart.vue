<template>
  <div>
    <vue-apex-charts
      type="pie"
      :options="options"
      :series="series"
      :height="height"
    />
  </div>
</template>

<script lang="ts">
import { ApexOptions } from 'apexcharts';
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
  options: ApexOptions = {
    chart: {
      id: 'vuechart-example',
    },
    labels: this.labels,
    legend: {
      position: 'bottom',
      fontWeight: 700,
      markers: {
        radius: 0,
        offsetX: -3,
        offsetY: -2,
        width: 15,
        height: 15,
      },
      itemMargin: {
        horizontal: 25,
      },
      fontSize: '16px',
    },
    colors: this.colors,
    responsive: [
      {
        breakpoint: 1023,
        options: {
          legend: {
            fontSize: '16px',
            itemMargin: {
              horizontal: 20,
            },
          },
        },
      },
      {
        breakpoint: 1439,
        options: {
          legend: {
            fontSize: '14px',
            itemMargin: {
              horizontal: 10,
            },
          },
        },
      },
      {
        breakpoint: 599,
        options: {
          legend: {
            fontSize: '11px',
            markers: {
              offsetX: 0,
              width: 12,
              height: 12,
            },
            itemMargin: {
              horizontal: 4,
            },
          },
        },
      },
    ],
  };

  series = this.values;

  height: number = 600;
}
</script>
