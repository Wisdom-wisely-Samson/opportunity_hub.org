<template>
  <div
    class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg hover:-translate-y-1 transition-all duration-300"
  >
    <div class="flex items-start justify-between">

      <!-- Left content -->
      <div>
        <p class="text-sm text-primary-200">
          {{ title }}
        </p>

        <h2 class="text-3xl font-bold text-white mt-2">
          {{ value }}
        </h2>

        <div v-if="subtitle" class="mt-2 text-xs" :class="subtitleClass">
          {{ subtitle }}
        </div>
      </div>

      <!-- Icon -->
      <div
        class="w-12 h-12 rounded-2xl flex items-center justify-center"
        :class="iconBg"
      >
        <component :is="icon" class="w-6 h-6 text-white" />
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },

  value: {
    type: [String, Number],
    required: true
  },

  subtitle: {
    type: String,
    default: ''
  },

  subtitleClass: {
    type: String,
    default: 'text-accent'
  },

  icon: {
    type: [Object, Function],
    required: true
  },

  iconBg: {
    type: String,
    default: 'bg-primary'
  }
})
</script>