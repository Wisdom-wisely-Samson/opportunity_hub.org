<template>
  <div class="w-full max-w-md">
    <div class="card shadow-lg text-center">
      <LoadingSpinner v-if="isLoading" text="Verifying your email..." />
      <div v-else-if="success">
        <div class="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4">
          <PartyPopper class="w-8 h-8" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Email Verified!</h1>
        <p class="text-gray-600 text-sm mt-2">Your email has been verified. You can now access all features.</p>
        <router-link to="/login" class="btn-primary w-full mt-6 block text-center">Sign In Now</router-link>
      </div>
      <div v-else>
        <div class="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <XCircle class="w-8 h-8" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Verification Failed</h1>
        <p class="text-gray-600 text-sm mt-2">{{ error || 'The verification link is invalid or has expired.' }}</p>
        <p class="text-sm text-gray-500 mt-3">If you already have an account, please log in and resend the verification email from your profile.</p>
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
import { PartyPopper, XCircle } from 'lucide-vue-next'

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
