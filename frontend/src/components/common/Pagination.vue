<template>
  <div v-if="pages > 1" class="flex items-center justify-center gap-1 mt-8">
    <button @click="$emit('change', page - 1)" :disabled="!hasPrev" class="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
      <ChevronLeft class="w-4 h-4" />
      <span class="hidden sm:inline">Prev</span>
    </button>
    <template v-for="p in visiblePages" :key="p">
      <span v-if="p === '...'" class="px-3 py-2 text-gray-400">…</span>
      <button v-else @click="$emit('change', p)" :class="['px-3 py-2 text-sm rounded-lg border transition-colors', p === page ? 'bg-primary border-primary text-white font-semibold' : 'border-gray-200 text-gray-600 hover:bg-gray-50']">{{ p }}</button>
    </template>
    <button @click="$emit('change', page + 1)" :disabled="!hasNext" class="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
      <span class="hidden sm:inline">Next</span>
      <ChevronRight class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({ page: Number, pages: Number, hasNext: Boolean, hasPrev: Boolean })
defineEmits(['change'])

const visiblePages = computed(() => {
  const { page, pages } = props
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
  const arr = [1]
  if (page > 3) arr.push('...')
  for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) arr.push(i)
  if (page < pages - 2) arr.push('...')
  arr.push(pages)
  return arr
})
</script>
