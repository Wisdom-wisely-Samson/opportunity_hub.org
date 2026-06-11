<template>
  <div class="w-full max-w-md">
    <div class="card shadow-lg">
      <div class="text-center mb-8">
        <img src="/logo.svg" alt="Opportunity Hub" class="w-16 h-16 object-contain mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p class="text-gray-500 text-sm mt-1">Sign in to your Opportunity Hub account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="label">Email Address</label>
          <input v-model="form.email" type="email" required class="input-field" :class="{ 'input-error': errors.email }" placeholder="your@email.com" autocomplete="email" />
          <p v-if="errors.email" class="error-message">⚠ {{ errors.email }}</p>
        </div>
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="label mb-0">Password</label>
            <router-link to="/forgot-password" class="text-xs text-primary hover:underline font-medium">Forgot password?</router-link>
          </div>
          <div class="relative">
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required class="input-field pr-11" :class="{ 'input-error': errors.password }" placeholder="Enter your password" autocomplete="current-password" />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="error-message">⚠ {{ errors.password }}</p>
        </div>

        <div v-if="authError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{{ authError }}</div>

        <button type="submit" :disabled="isLoading" class="btn-primary w-full btn-lg mt-2">
          <span v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Don't have an account?
        <router-link to="/register" class="text-primary font-semibold hover:underline">Create one free</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import { extractErrorMessage } from '@/utils/helpers'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const authError = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  authError.value = ''
  errors.email = ''
  errors.password = ''

  if (!form.email) { errors.email = 'Email is required'; return }
  if (!form.password) { errors.password = 'Password is required'; return }

  isLoading.value = true
  try {
    await authStore.login({ email: form.email, password: form.password })
    toast.success('Welcome back!')
    const redirect = route.query.redirect
    const role = authStore.user?.role
    if (redirect) { router.push(redirect) }
    else if (role === 'refugee') { router.push('/refugee/dashboard') }
    else if (role === 'organization') { router.push('/org/dashboard') }
    else if (role === 'admin') { router.push('/admin/dashboard') }
    else { router.push('/') }
  } catch (err) {
    authError.value = extractErrorMessage(err)
  } finally {
    isLoading.value = false
  }
}
</script>
