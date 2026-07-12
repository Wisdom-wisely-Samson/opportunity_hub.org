<template>
  <span
    :class="[
      baseClass,
      variantClass
    ]"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const baseClass =
  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm'

const label = computed(() => {
  return props.status.charAt(0).toUpperCase() + props.status.slice(1)
})

const variantClass = computed(() => {
  switch (props.status) {
    case 'active':
      return 'bg-green-500/10 text-green-300 border-green-500/20'

    case 'closed':
      return 'bg-red-500/10 text-red-300 border-red-500/20'

    case 'draft':
      return 'bg-gray-500/10 text-gray-300 border-gray-500/20'

    case 'expired':
      return 'bg-orange-500/10 text-orange-300 border-orange-500/20'

    case 'pending':
      return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'

    case 'approved':
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'

    case 'rejected':
      return 'bg-red-500/10 text-red-300 border-red-500/20'

    default:
      return 'bg-white/10 text-white/70 border-white/10'
  }
})
</script>