<template>
  <div class="flex flex-col items-center justify-center text-center py-16 px-6">
    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
      <slot name="icon">
        <SearchX class="w-9 h-9" />
      </slot>
    </div>
    <h3 class="text-lg font-bold text-gray-800 mb-2">{{ title }}</h3>
    <p class="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup>
import { SearchX } from 'lucide-vue-next'

defineProps({
  title: { type: String, default: 'Nothing here yet' },
  description: { type: String, default: 'There is nothing to display at the moment.' },
})
</script>
