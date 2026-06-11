import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  const addToast = ({ type = 'info', message, duration = 5000 }) => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, type, message, duration })
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    return id
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (message, duration) => addToast({ type: 'success', message, duration })
  const error = (message, duration) => addToast({ type: 'error', message, duration })
  const warning = (message, duration) => addToast({ type: 'warning', message, duration })
  const info = (message, duration) => addToast({ type: 'info', message, duration })

  return { toasts, addToast, removeToast, success, error, warning, info }
})
