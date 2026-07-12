<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      baseClass,
      variantClass,
      sizeClass,
      disabled && 'opacity-50 cursor-not-allowed'
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },

  variant: {
    type: String,
    default: 'primary' // primary | danger | ghost
  },

  size: {
    type: String,
    default: 'md' // sm | md | lg
  },

  disabled: {
    type: Boolean,
    default: false
  }
})

const baseClass =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'

const variantClass = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-red-500 hover:bg-red-600 text-white'

    case 'ghost':
      return 'bg-white/5 hover:bg-white/10 text-white border border-white/10'

    default:
      return 'bg-primary hover:bg-primary-600 text-white'
  }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'

    case 'lg':
      return 'px-6 py-3 text-base'

    default:
      return 'px-4 py-2.5 text-sm'
  }
})
</script>