<template>
  <div
    class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
  >
    <div>
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white">
        {{ title }}
      </h1>

      <p
        v-if="subtitle"
        class="mt-2 text-sm text-primary-200"
      >
        {{ subtitle }}
      </p>
    </div>

    <div
      v-if="$slots.actions"
      class="flex items-center gap-3"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },

  subtitle: {
    type: String,
    default: ''
  }
})
</script>