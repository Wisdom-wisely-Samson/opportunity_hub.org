<template>
  <div class="w-full max-w-md">
    <div class="card shadow-lg">
      <div class="text-center mb-8">
        <div class="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock class="w-7 h-7 text-accent" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Reset Your Password</h1>
        <p class="text-gray-500 text-sm mt-1">Enter your new password below</p>
      </div>
      <div v-if="!success">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">New Password</label>
            <input v-model="form.password" type="password" required minlength="8" class="input-field" placeholder="Min 8 characters" />
          </div>
          <div>
            <label class="label">Confirm New Password</label>
            <input v-model="form.confirmPassword" type="password" required class="input-field" placeholder="Repeat new password" />
            <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="error-message flex items-center gap-1">
              <AlertCircle class="w-3.5 h-3.5 flex-shrink-0" />
              Passwords don't match
            </p>
          </div>
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{{ error }}</div>
          <button type="submit" :disabled="isLoading || form.password !== form.confirmPassword" class="btn-primary w-full btn-lg flex items-center justify-center gap-2">
            <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
            {{ isLoading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>
      </div>
      <div v-else class="text-center">
        <div class="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 class="w-8 h-8" />
        </div>
        <h2 class="text-lg font-bold text-gray-900">Password Reset!</h2>
        <p class="text-gray-600 text-sm mt-2">Your password has been reset successfully.</p>
        <router-link to="/login" class="btn-primary w-full mt-6 block text-center">Sign In with New Password</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { authService } from '@/services/authService'
import { extractErrorMessage } from '@/utils/helpers'
import { Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-vue-next'

const route = useRoute()
const form = reactive({ password: '', confirmPassword: '' })
const isLoading = ref(false)
const success = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (form.password !== form.confirmPassword) return
  isLoading.value = true; error.value = ''
  try {
    await authService.resetPassword(route.params.token, { password: form.password, confirmPassword: form.confirmPassword })
    success.value = true
  } catch (err) {
    error.value = extractErrorMessage(err)
  } finally {
    isLoading.value = false
  }
}
</script>
