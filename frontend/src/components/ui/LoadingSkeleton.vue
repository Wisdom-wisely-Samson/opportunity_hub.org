<template>
  <div :class="['animate-pulse space-y-3', wrapperClass]">

    <!-- CARD SKELETON -->
    <div v-if="type === 'card'" class="rounded-3xl bg-white/5 border border-white/10 p-6 space-y-4">
      <div class="h-4 w-1/3 bg-white/10 rounded"></div>
      <div class="h-8 w-2/3 bg-white/10 rounded"></div>
      <div class="h-3 w-1/2 bg-white/10 rounded"></div>
    </div>

    <!-- METRIC SKELETON -->
    <div v-else-if="type === 'metric'" class="rounded-3xl bg-white/5 border border-white/10 p-6 flex justify-between">
      <div class="space-y-3 w-full">
        <div class="h-3 w-1/3 bg-white/10 rounded"></div>
        <div class="h-8 w-1/2 bg-white/10 rounded"></div>
        <div class="h-3 w-1/4 bg-white/10 rounded"></div>
      </div>
      <div class="w-12 h-12 rounded-2xl bg-white/10"></div>
    </div>

    <!-- LIST ITEM SKELETON -->
    <div v-else-if="type === 'list'" class="flex gap-3 items-center">
      <div class="w-10 h-10 rounded-xl bg-white/10"></div>
      <div class="flex-1 space-y-2">
        <div class="h-3 w-2/3 bg-white/10 rounded"></div>
        <div class="h-2 w-1/3 bg-white/10 rounded"></div>
      </div>
    </div>

    <!-- DEFAULT -->
    <div v-else class="h-4 w-full bg-white/10 rounded"></div>

  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'card' // card | metric | list | text
  },
  wrapperClass: {
    type: String,
    default: ''
  }
})
</script>