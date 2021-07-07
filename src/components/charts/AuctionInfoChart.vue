<template>
  <div>
    <pie-chart
      :height="height"
      :width="width"
      :values="values"
      :options="options"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import PieChart from 'components/charts/PieChart.vue';
import { ApexOptions } from 'apexcharts';

class Props {
  values = prop<number[]>({
    required: true,
  });

  height = prop<number>({
    required: false,
  });

  width = prop<number>({
    required: false,
  });
}

@Options({
  components: {
    PieChart,
  },
})
export default class AuctionInfoChart extends Vue.with(Props) {
  options: ApexOptions = {
    chart: {
      id: 'auction-info-chart',
    },
    labels: ['Sellers', 'Creator', 'Investors', 'BidBack'],
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
    colors: ['#F4538D', '#9E0039', '#D0004B', '#FFBCD4'],
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
}
</script>
