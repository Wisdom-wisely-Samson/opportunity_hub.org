<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">My CV / Resume</h1>

    <!-- Current CV -->
    <div v-if="user?.cv?.url" class="card">
      <h2 class="font-bold text-gray-900 mb-4">Current CV</h2>
      <div class="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
        <span class="text-3xl">📄</span>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-900 truncate">{{ user.cv.filename || 'My CV' }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Uploaded {{ formatDate(user.cv.uploadedAt) }}</p>
        </div>
        <div class="flex gap-2">
          <a :href="user.cv.url" target="_blank" rel="noopener noreferrer" class="btn-outline btn-sm">👁 View</a>
          <button @click="deleteCV" :disabled="isDeleting" class="btn-danger btn-sm">{{ isDeleting ? '...' : '🗑 Delete' }}</button>
        </div>
      </div>
    </div>

    <!-- Upload New -->
    <div class="card">
      <h2 class="font-bold text-gray-900 mb-4">{{ user?.cv?.url ? 'Upload New CV' : 'Upload Your CV' }}</h2>
      <p class="text-sm text-gray-500 mb-6">Upload your CV in PDF format. This will be attached to your applications automatically.</p>

      <input type="file" ref="fileInput" @change="handleFileChange" accept=".pdf" class="hidden" />
      <div
        @click="fileInput?.click()"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="handleDrop"
        :class="['border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors', isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50']"
      >
        <div v-if="!selectedFile">
          <p class="text-4xl mb-3">📄</p>
          <p class="font-semibold text-gray-700">Click to upload or drag & drop</p>
          <p class="text-sm text-gray-400 mt-1">PDF only — Max 10MB</p>
        </div>
        <div v-else class="flex items-center justify-center gap-3 text-primary">
          <span class="text-3xl">📄</span>
          <div class="text-left">
            <p class="font-semibold truncate max-w-64">{{ selectedFile.name }}</p>
            <p class="text-xs text-gray-500">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
          </div>
        </div>
      </div>

      <div v-if="error" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{{ error }}</div>

      <button v-if="selectedFile" @click="uploadCV" :disabled="isUploading" class="btn-primary w-full mt-4">
        <span v-if="isUploading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        {{ isUploading ? 'Uploading...' : 'Upload CV' }}
      </button>
    </div>

    <!-- Tips -->
    <div class="card bg-primary/5 border-primary/20">
      <h3 class="font-bold text-primary mb-3">💡 CV Tips</h3>
      <ul class="space-y-2 text-sm text-gray-700">
        <li class="flex gap-2"><span class="text-primary font-bold flex-shrink-0">•</span>Keep your CV to 1–2 pages maximum</li>
        <li class="flex gap-2"><span class="text-primary font-bold flex-shrink-0">•</span>Include your education, work experience, and key skills</li>
        <li class="flex gap-2"><span class="text-primary font-bold flex-shrink-0">•</span>Highlight languages you speak and your proficiency level</li>
        <li class="flex gap-2"><span class="text-primary font-bold flex-shrink-0">•</span>Use clear, simple formatting that is easy to read</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { userService } from '@/services/userService'
import { useToast } from '@/composables/useToast'
import { formatDate, extractErrorMessage } from '@/utils/helpers'

const authStore = useAuthStore()
const toast = useToast()
const user = computed(() => authStore.user)
const selectedFile = ref(null)
const fileInput = ref(null)
const isDragging = ref(false)
const isUploading = ref(false)
const isDeleting = ref(false)
const error = ref('')

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file?.size > 10 * 1024 * 1024) { error.value = 'File too large (max 10MB)'; return }
  selectedFile.value = file; error.value = ''
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file?.type !== 'application/pdf') { error.value = 'Only PDF files are allowed'; return }
  selectedFile.value = file; error.value = ''
}

const uploadCV = async () => {
  isUploading.value = true; error.value = ''
  try {
    const fd = new FormData(); fd.append('cv', selectedFile.value)
    const { data } = await userService.uploadCV(fd)
    authStore.updateUser({ cv: data.data.cv })
    selectedFile.value = null
    toast.success('CV uploaded successfully!')
  } catch (err) {
    error.value = extractErrorMessage(err)
  } finally {
    isUploading.value = false
  }
}

const deleteCV = async () => {
  if (!confirm('Are you sure you want to delete your CV?')) return
  isDeleting.value = true
  try {
    await userService.deleteCV()
    authStore.updateUser({ cv: null })
    toast.success('CV deleted')
  } catch (err) {
    toast.error(extractErrorMessage(err))
  } finally {
    isDeleting.value = false
  }
}
</script>
