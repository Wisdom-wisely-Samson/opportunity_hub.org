<template>
  <div class="relative w-full">
    
    <!-- Icon -->
    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
      <MagnifyingGlassIcon class="w-4 h-4" />
    </div>

    <!-- Input -->
    <input
      :value="modelValue"
      @input="onInput"
      :placeholder="placeholder"
      class="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-2xl pl-10 pr-10 py-2.5
             focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
             transition-all duration-200"
    />

    <!-- Clear button -->
    <button
      v-if="modelValue"
      @click="clear"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
    >
      <XMarkIcon class="w-4 h-4" />
    </button>

  </div>
</template>

<script setup>
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  }
})

const emit = defineEmits(['update:modelValue', 'clear'])

const onInput = (e) => {
  emit('update:modelValue', e.target.value)
}

const clear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>