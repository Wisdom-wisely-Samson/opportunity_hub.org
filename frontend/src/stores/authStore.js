import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isRefugee = computed(() => user.value?.role === 'refugee')
  const isOrganization = computed(() => user.value?.role === 'organization')
  const isAdmin = computed(() => user.value?.role === 'admin')

  const setTokens = (tokens) => {
    accessToken.value = tokens.accessToken
    localStorage.setItem('hub_access_token', tokens.accessToken)
    if (tokens.refreshToken) localStorage.setItem('hub_refresh_token', tokens.refreshToken)
  }

  const setUser = (userData) => {
    user.value = userData
    localStorage.setItem('hub_user', JSON.stringify(userData))
  }

  const clearAuth = () => {
    user.value = null
    accessToken.value = null
    localStorage.removeItem('hub_access_token')
    localStorage.removeItem('hub_refresh_token')
    localStorage.removeItem('hub_user')
  }

  const initAuth = async () => {
    const token = localStorage.getItem('hub_access_token')
    const savedUser = localStorage.getItem('hub_user')
    if (token && savedUser) {
      accessToken.value = token
      user.value = JSON.parse(savedUser)
      // Refresh user data from server
      try {
        const { data } = await userService.getProfile()
        setUser(data.data)
      } catch {
        clearAuth()
      }
    }
  }

  const login = async (credentials) => {
    isLoading.value = true
    try {
      const { data } = await authService.login(credentials)
      setTokens(data.data)
      setUser(data.data.user)
      return data
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    try {
      const { data } = await authService.register(userData)
      setTokens(data.data)
      setUser(data.data.user)
      return data
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch { /* ignore */ }
    clearAuth()
  }

  const updateUser = (updates) => {
    user.value = { ...user.value, ...updates }
    localStorage.setItem('hub_user', JSON.stringify(user.value))
  }

  return {
    user, accessToken, isLoading,
    isAuthenticated, isRefugee, isOrganization, isAdmin,
    initAuth, login, register, logout, updateUser, setUser, clearAuth,
  }
})
