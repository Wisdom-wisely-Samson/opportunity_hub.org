<template>
  <div class="relative">
    <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    <input
      :value="modelValue"
      @input="handleInput"
      type="search"
      :placeholder="placeholder"
      class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-800 placeholder-gray-400 text-sm transition-shadow"
    />
    <button v-if="modelValue" @click="$emit('update:modelValue', '')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
  </div>
</template>

<script setup>
import { debounce } from '@/utils/helpers'

const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: 'Search opportunities...' },
  debounceMs: { type: Number, default: 300 },
})
const emit = defineEmits(['update:modelValue', 'search'])

const handleInput = debounce((e) => {
  emit('update:modelValue', e.target.value)
  emit('search', e.target.value)
}, props.debounceMs)
</script>
