<template>
  <div class="p-6">
    <div class="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
      <p class="text-sm font-semibold text-primary">Applying for:</p>
      <p class="font-bold text-gray-900 mt-1">{{ opportunity?.title }}</p>
      <p class="text-sm text-gray-500">{{ opportunity?.organization?.organizationName }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Cover Letter -->
      <div>
        <label class="label">Cover Letter <span class="text-gray-400 font-normal">(Optional)</span></label>
        <textarea v-model="form.coverLetter" rows="6" placeholder="Tell the organization why you're a great fit for this opportunity..." class="textarea-field" maxlength="2000"></textarea>
        <p class="text-xs text-gray-400 text-right mt-1">{{ form.coverLetter.length }}/2000</p>
      </div>

      <!-- CV Upload -->
      <div>
        <label class="label">CV / Resume</label>
        <div v-if="userCV && !uploadNewCV" class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center gap-2 text-sm text-green-700">
            <span>📄</span>
            <span class="font-medium">{{ userCV.filename || 'My CV' }}</span>
            <span class="text-xs text-green-500">(Profile CV)</span>
          </div>
          <button type="button" @click="uploadNewCV = true" class="text-xs text-primary hover:underline">Upload different</button>
        </div>
        <div v-else>
          <input type="file" ref="fileInput" @change="handleFileChange" accept=".pdf" class="hidden" />
          <div @click="fileInput?.click()" class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
            <div v-if="!selectedFile">
              <p class="text-2xl mb-2">📄</p>
              <p class="text-sm font-medium text-gray-700">Click to upload your CV</p>
              <p class="text-xs text-gray-400 mt-1">PDF only, max 10MB</p>
            </div>
            <div v-else class="flex items-center justify-center gap-2 text-sm text-primary">
              <span>📄</span><span class="font-medium truncate max-w-48">{{ selectedFile.name }}</span>
            </div>
          </div>
          <button v-if="userCV && uploadNewCV" type="button" @click="uploadNewCV = false" class="text-xs text-gray-500 mt-1 hover:underline">Use profile CV instead</button>
        </div>
      </div>

      <!-- Errors -->
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{{ error }}</div>

      <div class="flex gap-3 pt-2">
        <button type="button" @click="$emit('close')" class="btn-ghost flex-1 border border-gray-200">Cancel</button>
        <button type="submit" :disabled="isLoading" class="btn-primary flex-1">
          <span v-if="isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ isLoading ? 'Submitting...' : 'Submit Application' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { applicationService } from '@/services/applicationService'
import { useToast } from '@/composables/useToast'

const props = defineProps({ opportunity: Object })
const emit = defineEmits(['close', 'submitted'])

const authStore = useAuthStore()
const toast = useToast()
const userCV = computed(() => authStore.user?.cv)

const form = ref({ coverLetter: '' })
const selectedFile = ref(null)
const uploadNewCV = ref(!userCV.value)
const isLoading = ref(false)
const error = ref('')
const fileInput = ref(null)

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file && file.size > 10 * 1024 * 1024) { error.value = 'File size must not exceed 10MB'; return }
  selectedFile.value = file
  error.value = ''
}

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const formData = new FormData()
    formData.append('opportunityId', props.opportunity._id)
    formData.append('coverLetter', form.value.coverLetter)
    if (selectedFile.value) formData.append('cv', selectedFile.value)

    await applicationService.createApplication(formData)
    toast.success('Application submitted successfully!')
    emit('submitted')
    emit('close')
  } catch (err) {
    error.value = err?.response?.data?.message || 'Failed to submit application'
  } finally {
    isLoading.value = false
  }
}
</script>
