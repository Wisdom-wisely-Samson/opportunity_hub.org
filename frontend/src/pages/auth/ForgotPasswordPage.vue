<template>
  <div class="w-full max-w-md">
    <div class="card shadow-lg">
      <div class="text-center mb-8">
        <img src="/logo.svg" alt="Opportunity Hub" class="w-16 h-16 object-contain mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900">Forgot Password?</h1>
        <p class="text-gray-500 text-sm mt-1">Enter your email and we'll send a reset link</p>
      </div>
      <div v-if="!sent">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">Email Address</label>
            <input v-model="email" type="email" required class="input-field" placeholder="your@email.com" />
          </div>
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{{ error }}</div>
          <button type="submit" :disabled="isLoading" class="btn-primary w-full btn-lg">
            <span v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>
      </div>
      <div v-else class="text-center">
        <div class="text-5xl mb-4">📧</div>
        <h2 class="text-lg font-bold text-gray-900">Check Your Email!</h2>
        <p class="text-gray-600 text-sm mt-2">We've sent a password reset link to <strong>{{ email }}</strong>. The link expires in 1 hour.</p>
        <router-link to="/login" class="btn-primary w-full mt-6 block text-center">Back to Sign In</router-link>
      </div>
      <router-link to="/login" class="block text-center text-sm text-primary hover:underline mt-4">← Back to Sign In</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { authService } from '@/services/authService'
import { extractErrorMessage } from '@/utils/helpers'

const email = ref('')
const isLoading = ref(false)
const sent = ref(false)
const error = ref('')

const handleSubmit = async () => {
  isLoading.value = true; error.value = ''
  try {
    await authService.forgotPassword(email.value)
    sent.value = true
  } catch (err) {
    error.value = extractErrorMessage(err)
  } finally {
    isLoading.value = false
  }
}
</script>
