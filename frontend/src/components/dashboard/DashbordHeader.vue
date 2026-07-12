<template>
  <div
    class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-primary via-primary-700 to-primary-900 p-8 shadow-2xl"
  >
    <!-- Background decoration -->
    <div
      class="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
    ></div>

    <div
      class="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-white/5 blur-3xl"
    ></div>

    <div
      class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
    >
      <!-- Left -->
      <div>
        <div
          class="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm text-white/80 backdrop-blur"
        >
          👋 Welcome Back
        </div>

        <h1 class="text-4xl font-bold tracking-tight text-white">
          {{ greeting }},
          <span class="text-accent">{{ userName }}</span>
        </h1>

        <p class="mt-3 text-primary-100">
          {{ today }}
        </p>

        <p class="mt-2 max-w-2xl text-sm text-primary-200">
          Here's what's happening across your platform today. Review new
          registrations, monitor opportunities, and keep everything running
          smoothly.
        </p>
      </div>

      <!-- Right -->
      <div class="flex flex-wrap gap-3">
        <PrimaryButton @click="$emit('createOpportunity')">
          + New Opportunity
        </PrimaryButton>

        <PrimaryButton variant="secondary" @click="$emit('refresh')">
          Refresh
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import PrimaryButton from "@/components/ui/PrimaryButton.vue";

defineEmits(["createOpportunity", "refresh"]);

const props = defineProps({
  userName: {
    type: String,
    default: "Administrator",
  },
});

const hour = new Date().getHours();

const greeting = computed(() => {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
});

const today = computed(() =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date()),
);
</script>
