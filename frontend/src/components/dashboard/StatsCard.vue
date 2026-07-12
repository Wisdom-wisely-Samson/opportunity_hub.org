<template>
  <div
    class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
  >
    <!-- Background Glow -->
    <div
      class="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-3xl"
      :class="iconBackground"
    />

    <!-- Header -->
    <div class="relative flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-white/60">
          {{ title }}
        </p>

        <h2 class="mt-3 text-4xl font-bold tracking-tight text-white">
          {{ displayValue }}
        </h2>
      </div>

      <div
        class="flex h-14 w-14 items-center justify-center rounded-2xl"
        :class="iconContainer"
      >
        <component :is="icon" class="h-7 w-7" :class="iconColor" />
      </div>
    </div>

    <!-- Footer -->
    <div class="relative mt-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <ArrowTrendingUpIcon v-if="trend >= 0" class="h-5 w-5 text-green-400" />

        <ArrowTrendingDownIcon v-else class="h-5 w-5 text-red-400" />

        <span
          class="font-semibold"
          :class="trend >= 0 ? 'text-green-400' : 'text-red-400'"
        >
          {{ Math.abs(trend) }}%
        </span>

        <span class="text-sm text-white/50"> this month </span>
      </div>

      <span class="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
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

const iconContainer = computed(
  () =>
    ({
      primary: "bg-primary/20",
      green: "bg-green-500/20",
      blue: "bg-blue-500/20",
      red: "bg-red-500/20",
      yellow: "bg-yellow-500/20",
    })[props.color] || "bg-primary/20",
);

const iconColor = computed(
  () =>
    ({
      primary: "text-primary-300",
      green: "text-green-400",
      blue: "text-blue-400",
      red: "text-red-400",
      yellow: "text-yellow-400",
    })[props.color] || "text-primary-300",
);

const iconBackground = computed(
  () =>
    ({
      primary: "bg-primary",
      green: "bg-green-500",
      blue: "bg-blue-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
    })[props.color] || "bg-primary",
);
</script>
