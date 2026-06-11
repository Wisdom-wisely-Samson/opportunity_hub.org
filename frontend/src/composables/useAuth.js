import { useAuthStore } from '@/stores/authStore'
import { computed } from 'vue'

export const useAuth = () => {
  const store = useAuthStore()
  return {
    user: computed(() => store.user),
    isAuthenticated: computed(() => store.isAuthenticated),
    isRefugee: computed(() => store.isRefugee),
    isOrganization: computed(() => store.isOrganization),
    isAdmin: computed(() => store.isAdmin),
    canAccess: (roles) => roles.includes(store.user?.role),
  }
}
