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
          <p v-if="errors.email" class="error-message flex items-center gap-1">
            <AlertCircle class="w-3.5 h-3.5 flex-shrink-0" />
            {{ errors.email }}
          </p>
        </div>
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="label mb-0">Password</label>
            <router-link to="/forgot-password" class="text-xs text-primary hover:underline font-medium">Forgot password?</router-link>
          </div>
          <div class="relative">
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required class="input-field pr-11" :class="{ 'input-error': errors.password }" placeholder="Enter your password" autocomplete="current-password" />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <EyeOff v-if="showPassword" class="w-5 h-5" />
              <Eye v-else class="w-5 h-5" />
            </button>
          </div>
          <p v-if="errors.password" class="error-message flex items-center gap-1">
            <AlertCircle class="w-3.5 h-3.5 flex-shrink-0" />
            {{ errors.password }}
          </p>
        </div>

        <div v-if="authError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{{ authError }}</div>

        <button type="submit" :disabled="isLoading" class="btn-primary w-full btn-lg mt-2 flex items-center justify-center gap-2">
          <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
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
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

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
