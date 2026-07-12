<template>
  <div class="relative">
    <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      :value="modelValue"
      @input="handleInput"
      type="search"
      :placeholder="placeholder"
      class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-800 placeholder-gray-400 text-sm transition-shadow"
    />
    <button v-if="modelValue" @click="$emit('update:modelValue', '')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
      <X class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup>
import { debounce } from '@/utils/helpers'
import { Search, X } from 'lucide-vue-next'

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
