import { useToastStore } from '@/stores/toastStore'

export const useToast = () => {
  const store = useToastStore()
  return {
    success: store.success,
    error: store.error,
    warning: store.warning,
    info: store.info,
  }
}
