<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeOnBackdrop"></div>
        <div :class="['relative bg-white w-full sm:rounded-2xl shadow-2xl z-10 overflow-hidden rounded-t-2xl', sizeClass, 'max-h-[90vh] flex flex-col']">
          <div v-if="title" class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
            <button @click="$emit('update:modelValue', false)" class="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <button v-else @click="$emit('update:modelValue', false)" class="absolute top-4 right-4 z-10 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div class="overflow-y-auto flex-1"><slot /></div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ modelValue: Boolean, title: String, size: { type: String, default: 'md' }, persistent: Boolean })
const emit = defineEmits(['update:modelValue'])
const sizeClass = computed(() => ({ sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' }[props.size] || 'sm:max-w-lg'))
const closeOnBackdrop = () => { if (!props.persistent) emit('update:modelValue', false) }
</script>
