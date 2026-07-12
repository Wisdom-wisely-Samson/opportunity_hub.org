<template>
  <div class="relative w-full">

    <!-- Select -->
    <select
      :value="modelValue"
      @change="onChange"
      class="w-full appearance-none bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-2.5 pr-10
             focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
             transition-all duration-200"
    >
      <option value="" class="text-gray-900">
        {{ placeholder }}
      </option>

      <option
        v-for="option in options"
        :key="option.value || option"
        :value="option.value || option"
        class="text-gray-900"
      >
        {{ option.label || option }}
      </option>
    </select>

    <!-- Icon -->
    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
      <ChevronDownIcon class="w-4 h-4" />
    </div>

  </div>
</template>

<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },

  options: {
    type: Array,
    default: () => []
  },

  placeholder: {
    type: String,
    default: 'Select option'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const onChange = (e) => {
  emit('update:modelValue', e.target.value)
  emit('change', e.target.value)
}
</script>