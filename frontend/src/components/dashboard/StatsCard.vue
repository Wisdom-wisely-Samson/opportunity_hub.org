<template>
  <div
    class="group relative overflow-hidden rounded-3xl border p-6 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_55px_-18px_rgba(15,23,42,0.45)]"
    :class="cardClasses"
  >
    <div
      class="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-25 blur-3xl"
      :class="iconBackground"
    />

    <div class="relative flex items-start justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500"
          :class="titleColor">
          {{ title }}
        </p>

        <h2 class="mt-3 text-3xl font-black tracking-tight text-slate-900">
          {{ displayValue }}
        </h2>
      </div>

      <div
        class="flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner"
        :class="iconContainer"
      >
        <component :is="icon" class="h-7 w-7" :class="iconColor" />
      </div>
    </div>

    <div class="relative mt-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <ArrowTrendingUpIcon v-if="trend >= 0" class="h-5 w-5 text-green-500" />
        <ArrowTrendingDownIcon v-else class="h-5 w-5 text-red-500" />

        <span class="font-semibold" :class="trend >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ Math.abs(trend) }}%
        </span>

        <span class="text-sm font-medium text-slate-500"> this month </span>
      </div>

      <span class="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
        Live
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";

import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  title: String,

  value: {
    type: Number,
    default: 0,
  },

  trend: {
    type: Number,
    default: 0,
  },

  icon: Object,

  color: {
    type: String,
    default: "primary",
  },
});

const current = ref(0);

watchEffect(() => {
  const target = props.value;

  current.value = 0;

  const step = Math.ceil(target / 40);

  const timer = setInterval(() => {
    if (current.value >= target) {
      current.value = target;

      clearInterval(timer);
    } else {
      current.value += step;
    }
  }, 15);
});

const displayValue = computed(() => current.value.toLocaleString());

const cardClasses = computed(
  () =>
    ({
      primary: "border-primary/20 bg-gradient-to-br from-primary/10 via-white to-white",
      green: "border-green-500/20 bg-gradient-to-br from-green-500/10 via-white to-white",
      blue: "border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-white to-white",
      red: "border-red-500/20 bg-gradient-to-br from-red-500/10 via-white to-white",
      yellow: "border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-white to-white",
      purple: "border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-white to-white",
    })[props.color] || "border-primary/20 bg-gradient-to-br from-primary/10 via-white to-white",
);

const titleColor = computed(
  () =>
    ({
      primary: "text-primary-700",
      green: "text-green-700",
      blue: "text-blue-700",
      red: "text-red-700",
      yellow: "text-yellow-700",
      purple: "text-purple-700",
    })[props.color] || "text-primary-700",
);

const iconContainer = computed(
  () =>
    ({
      primary: "bg-primary/15",
      green: "bg-green-500/15",
      blue: "bg-blue-500/15",
      red: "bg-red-500/15",
      yellow: "bg-yellow-500/15",
      purple: "bg-purple-500/15",
    })[props.color] || "bg-primary/15",
);

const iconColor = computed(
  () =>
    ({
      primary: "text-primary-600",
      green: "text-green-600",
      blue: "text-blue-600",
      red: "text-red-600",
      yellow: "text-yellow-600",
      purple: "text-purple-600",
    })[props.color] || "text-primary-600",
);

const iconBackground = computed(
  () =>
    ({
      primary: "bg-primary",
      green: "bg-green-500",
      blue: "bg-blue-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
    })[props.color] || "bg-primary",
);
</script>
