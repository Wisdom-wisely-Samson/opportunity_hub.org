<template>
  <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm text-gray-500 font-medium">{{ label }}</p>
        <p class="text-3xl font-bold mt-1" :class="valueColor">{{ value }}</p>
        <p v-if="sub" class="text-xs text-gray-400 mt-1">{{ sub }}</p>
      </div>
      <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0', iconBg]">{{ icon }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  sub: String,
  icon: { type: String, default: '📊' },
  iconBg: { type: String, default: 'bg-primary/10' },
  valueColor: { type: String, default: 'text-gray-900' },
})
</script>
