<template>
  <div class="flex flex-col items-center justify-center text-center py-16 px-6">
    <!-- Icon -->
    <div
      class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4"
    >
      <component :is="icon" class="w-7 h-7 text-primary-300" />
    </div>

    <!-- Title -->
    <h3 class="text-xl font-bold text-white">
      {{ title }}
    </h3>

    <!-- Description -->
    <p v-if="description" class="text-sm text-white/50 mt-2 max-w-md">
      {{ description }}
    </p>

    <!-- Action -->
    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  icon: {
    type: [Object, Function],
    required: true,
  },
});
</script>
