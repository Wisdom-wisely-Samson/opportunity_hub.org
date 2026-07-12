<template>
  <teleport to="body">
    <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 items-end max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      <transition-group name="slide-up">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['flex items-start gap-3 w-full bg-white rounded-xl shadow-lg border p-4 pointer-events-auto', borderClass(toast.type)]"
        >
          <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', iconBgClass(toast.type)]">
            <component :is="icon(toast.type)" :class="['w-4 h-4', textClass(toast.type)]" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold" :class="textClass(toast.type)">{{ typeLabel(toast.type) }}</p>
            <p class="text-sm text-gray-600 mt-0.5 leading-snug">{{ toast.message }}</p>
          </div>
          <button @click="toastStore.removeToast(toast.id)" class="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors">
            <X class="w-4 h-4" />
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '@/stores/toastStore'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const toastStore = useToastStore()
const toasts = computed(() => toastStore.toasts)

const icon = (type) => ({ success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info }[type] || Info)
const typeLabel = (type) => ({ success: 'Success', error: 'Error', warning: 'Warning', info: 'Info' }[type] || type)
const borderClass = (type) => ({ success: 'border-green-200', error: 'border-red-200', warning: 'border-yellow-200', info: 'border-blue-200' }[type] || 'border-gray-200')
const iconBgClass = (type) => ({ success: 'bg-green-50', error: 'bg-red-50', warning: 'bg-yellow-50', info: 'bg-blue-50' }[type] || 'bg-gray-50')
const textClass = (type) => ({ success: 'text-green-700', error: 'text-red-700', warning: 'text-yellow-700', info: 'text-blue-700' }[type] || 'text-gray-700')
</script>
