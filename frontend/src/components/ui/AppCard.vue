<template>
  <component
    :is="tag"
    :class="[
      'rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg transition-all duration-300',
      hover && 'hover:-translate-y-1 hover:shadow-2xl hover:border-primary-500/30',
      clickable && 'cursor-pointer',
      padding,
      customClass
    ]"
  >
    <slot />
  </component>
</template>

<script setup>
defineProps({
  tag: {
    type: String,
    default: 'div'
  },

  padding: {
    type: String,
    default: 'p-6'
  },

  hover: {
    type: Boolean,
    default: true
  },

  clickable: {
    type: Boolean,
    default: false
  },

  customClass: {
    type: String,
    default: ''
  }
})
</script>