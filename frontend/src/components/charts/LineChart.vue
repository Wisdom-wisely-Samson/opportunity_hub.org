<template>
  <BaseChart
    title="User Growth"
    subtitle="Last 12 Months"
    :loading="loading"
    :empty="!values.length"
>

<Line
    :data="chartData"
    :options="options"
/>

</BaseChart>
</template>

<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "vue-chartjs";

import { ChartBarIcon } from "@heroicons/vue/24/outline";

import AppCard from "@/components/ui/AppCard.vue";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton.vue";
import EmptyState from "@/components/ui/EmptyState.vue";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const props = defineProps({
  title: String,

  subtitle: String,

  loading: Boolean,

  labels: {
    type: Array,
    default: () => [],
  },

  values: {
    type: Array,
    default: () => [],
  },
});

const chartData = {
  labels: props.labels,

  datasets: [
    {
      label: props.title,

      data: props.values,

      borderColor: "#01596D",

      backgroundColor: "rgba(1,89,109,.15)",

      fill: true,

      borderWidth: 3,

      tension: 0.4,

      pointRadius: 4,

      pointHoverRadius: 6,
    },
  ],
};

const chartOptions = {
  responsive: true,

  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },
  },

  scales: {
    x: {
      grid: {
        color: "rgba(255,255,255,.05)",
      },

      ticks: {
        color: "#d1d5db",
      },
    },

    y: {
      grid: {
        color: "rgba(255,255,255,.05)",
      },

      ticks: {
        color: "#d1d5db",
      },
    },
  },
};
</script>
