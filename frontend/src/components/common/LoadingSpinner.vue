<template>
  <div :class="['flex items-center justify-center', overlay ? 'fixed inset-0 bg-white/80 z-50' : 'py-12']">
    <div class="flex flex-col items-center gap-3">
      <div :class="['rounded-full border-4 border-gray-200 animate-spin', sizeClass]" style="border-top-color: #01596D;"></div>
      <p v-if="text" class="text-sm text-gray-500 font-medium">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  size: { type: String, default: 'md' },
  overlay: Boolean,
  text: String,
})
const sizeClass = computed(() => ({ sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' }[props.size] || 'w-10 h-10'))
</script>
