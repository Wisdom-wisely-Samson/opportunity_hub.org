<template>
  <div class="w-full max-w-md">
    <div class="card shadow-lg text-center">
      <LoadingSpinner v-if="isLoading" text="Verifying your email..." />
      <div v-else-if="success">
        <div class="text-5xl mb-4">🎉</div>
        <h1 class="text-2xl font-bold text-gray-900">Email Verified!</h1>
        <p class="text-gray-600 text-sm mt-2">Your email has been verified. You can now access all features.</p>
        <router-link to="/login" class="btn-primary w-full mt-6 block text-center">Sign In Now</router-link>
      </div>
      <div v-else>
        <div class="text-5xl mb-4">❌</div>
        <h1 class="text-2xl font-bold text-gray-900">Verification Failed</h1>
        <p class="text-gray-600 text-sm mt-2">{{ error || 'The verification link is invalid or has expired.' }}</p>
        <router-link to="/login" class="btn-outline w-full mt-6 block text-center">Go to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { authService } from '@/services/authService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const isLoading = ref(true)
const success = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    await authService.verifyEmail(route.params.token)
    success.value = true
  } catch (err) {
    error.value = err?.response?.data?.message || 'Verification failed'
  } finally {
    isLoading.value = false
  }
})
</script>
