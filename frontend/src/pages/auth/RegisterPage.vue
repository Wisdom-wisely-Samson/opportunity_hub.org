<template>
  <div class="w-full max-w-lg">
    <div class="card shadow-lg">
      <div class="text-center mb-6">
        <img src="/logo.svg" alt="Opportunity Hub" class="w-16 h-16 object-contain mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900">Create Your Account</h1>
        <p class="text-gray-500 text-sm mt-1">Join thousands of people accessing opportunities</p>
      </div>

      <!-- Role Selection -->
      <div v-if="step === 'role'" class="space-y-4">
        <p class="text-sm font-semibold text-gray-700 text-center mb-4">I am registering as a...</p>
        <button @click="selectRole('refugee')" :class="['w-full p-5 rounded-xl border-2 text-left transition-all', selectedRole === 'refugee' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/40']">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <User class="w-6 h-6" />
            </div>
            <div>
              <p class="font-bold text-gray-900">Refugee / Applicant</p>
              <p class="text-sm text-gray-500 mt-0.5">I'm looking for jobs, scholarships, grants, and training opportunities</p>
            </div>
            <div v-if="selectedRole === 'refugee'" class="ml-auto w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Check class="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </button>
        <button @click="selectRole('organization')" :class="['w-full p-5 rounded-xl border-2 text-left transition-all', selectedRole === 'organization' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/40']">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Building2 class="w-6 h-6" />
            </div>
            <div>
              <p class="font-bold text-gray-900">Organization</p>
              <p class="text-sm text-gray-500 mt-0.5">I represent an NGO, employer, university, or training provider</p>
            </div>
            <div v-if="selectedRole === 'organization'" class="ml-auto w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Check class="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </button>
        <button @click="step = 'form'" :disabled="!selectedRole" class="btn-primary w-full btn-lg mt-2 flex items-center justify-center gap-1.5">
          Continue
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Registration Form -->
      <div v-if="step === 'form'">
        <button @click="step = 'role'" class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-4 transition-colors">
          <ArrowLeft class="w-4 h-4" />
          Back
        </button>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div v-if="selectedRole === 'organization'">
            <label class="label">Organization Name</label>
            <input v-model="form.organizationName" type="text" required class="input-field" placeholder="e.g. UNHCR Kenya" />
          </div>
          <div>
            <label class="label">{{ selectedRole === 'refugee' ? 'Full Name' : 'Contact Person Name' }}</label>
            <input v-model="form.fullName" type="text" class="input-field" placeholder="Your full name" />
          </div>
          <div>
            <label class="label">Email Address</label>
            <input v-model="form.email" type="email" required class="input-field" placeholder="your@email.com" />
          </div>
          <div>
            <label class="label">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPwd ? 'text' : 'password'" required class="input-field pr-11" placeholder="Min 8 chars, uppercase + number" />
              <button type="button" @click="showPwd = !showPwd" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <EyeOff v-if="showPwd" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label class="label">Confirm Password</label>
            <input v-model="form.confirmPassword" type="password" required class="input-field" placeholder="Repeat your password" />
            <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="error-message flex items-center gap-1">
              <AlertCircle class="w-3.5 h-3.5 flex-shrink-0" />
              Passwords don't match
            </p>
          </div>

          <div class="flex items-start gap-2 pt-1">
            <input v-model="form.agree" type="checkbox" id="agree" required class="w-4 h-4 mt-0.5 text-primary rounded border-gray-300 cursor-pointer flex-shrink-0" />
            <label for="agree" class="text-sm text-gray-600 cursor-pointer">I agree to the <router-link to="/terms-of-service" class="text-primary hover:underline">Terms of Service</router-link> and <router-link to="/privacy-policy" class="text-primary hover:underline">Privacy Policy</router-link></label>
          </div>

          <div v-if="authError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{{ authError }}</div>

          <button type="submit" :disabled="isLoading || form.password !== form.confirmPassword" class="btn-primary w-full btn-lg flex items-center justify-center gap-2">
            <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
      </div>

      <p class="text-center text-sm text-gray-500 mt-5">
        Already have an account?
        <router-link to="/login" class="text-primary font-semibold hover:underline">Sign in</router-link>
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
import { User, Building2, Check, ArrowRight, ArrowLeft, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const step = ref('role')
const selectedRole = ref(route.query.role || '')
const form = reactive({ fullName: '', email: '', password: '', confirmPassword: '', organizationName: '', agree: false })
const authError = ref('')
const isLoading = ref(false)
const showPwd = ref(false)

const selectRole = (role) => { selectedRole.value = role }

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    authError.value = 'Passwords do not match.'
    return
  }

  authError.value = ''
  isLoading.value = true
  try {
    await authStore.register({ ...form, role: selectedRole.value })
    toast.success('Account created! Please complete your profile to continue. Email verification is optional.')
    const role = selectedRole.value
    if (role === 'refugee') router.push('/refugee/profile')
    else if (role === 'organization') router.push('/org/profile')
    else router.push('/')
  } catch (err) {
    authError.value = extractErrorMessage(err)
  } finally {
    isLoading.value = false
  }
}
</script>
