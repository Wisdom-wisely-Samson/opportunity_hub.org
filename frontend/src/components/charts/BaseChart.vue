<template>
  <AppCard class="h-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-white">
          {{ title }}
        </h3>

        <p v-if="subtitle" class="mt-1 text-sm text-white/50">
          {{ subtitle }}
        </p>
      </div>

      <slot name="actions" />
    </div>

    <!-- Loading -->

    <div v-if="loading" class="h-[340px]">
      <LoadingSkeleton type="card" wrapperClass="h-full" />
    </div>

    <!-- Empty -->

    <EmptyState
      v-else-if="empty"
      title="No analytics available"
      description="Statistics will appear once enough data has been collected."
      :icon="ChartBarIcon"
    />

    <!-- Chart -->

    <div v-else class="h-[340px]">
      <slot />
    </div>
  </AppCard>
</template>

<script setup>
import { ChartBarIcon } from "@heroicons/vue/24/outline";

import AppCard from "@/components/ui/AppCard.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton.vue";

defineProps({
  title: String,

  subtitle: String,

  loading: Boolean,

  empty: Boolean,
});
</script>
