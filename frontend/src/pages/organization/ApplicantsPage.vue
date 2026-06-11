<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Applicants</h1>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3">
      <select v-model="filterOpportunity" @change="fetchApps" class="select-field flex-1 min-w-48">
        <option value="">All Opportunities</option>
        <option v-for="o in opportunities" :key="o._id" :value="o._id">{{ o.title }}</option>
      </select>
      <div class="flex gap-1 p-1 bg-gray-100 rounded-xl">
        <button v-for="s in statuses" :key="s.value" @click="filterStatus = s.value" :class="['px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', filterStatus === s.value ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900']">
          {{ s.label }} <span v-if="countByStatus(s.value) > 0" class="ml-1 text-xs text-gray-400">({{ countByStatus(s.value) }})</span>
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="isLoading" text="Loading applicants..." />
    <div v-else-if="filtered.length" class="space-y-3">
      <div v-for="app in filtered" :key="app._id" class="card">
        <div class="flex items-start gap-4">
          <!-- Avatar -->
          <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img v-if="app.applicant?.profilePicture?.url" :src="app.applicant.profilePicture.url" class="w-full h-full object-cover" />
            <span v-else class="text-primary font-bold text-lg">{{ (app.applicant?.fullName || 'U').charAt(0).toUpperCase() }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-bold text-gray-900">{{ app.applicant?.fullName || 'Unknown' }}</h3>
                <p class="text-sm text-gray-500">{{ app.applicant?.email }}</p>
              </div>
              <StatusBadge :status="app.status" />
            </div>
            <p class="text-sm text-primary mt-1 font-medium">{{ app.opportunity?.title }}</p>
            <div class="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
              <span v-if="app.applicant?.currentLocation">📍 {{ app.applicant.currentLocation }}</span>
              <span v-if="app.applicant?.countryOfOrigin">🌍 From {{ app.applicant.countryOfOrigin }}</span>
              <span>📅 Applied {{ new Date(app.createdAt).toLocaleDateString() }}</span>
            </div>

            <!-- Skills -->
            <div v-if="app.applicant?.skills?.length" class="flex flex-wrap gap-1.5 mt-2">
              <span v-for="skill in app.applicant.skills.slice(0,5)" :key="skill" class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{{ skill }}</span>
              <span v-if="app.applicant.skills.length > 5" class="text-xs text-gray-400">+{{ app.applicant.skills.length - 5 }} more</span>
            </div>

            <!-- Cover Letter Preview -->
            <div v-if="app.coverLetter" class="mt-2 p-2.5 bg-gray-50 rounded-lg text-sm text-gray-600 line-clamp-2">
              "{{ app.coverLetter }}"
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
          <a v-if="app.cv?.url" :href="app.cv.url" target="_blank" class="btn-ghost btn-sm border border-gray-200">📄 View CV</a>
          <button @click="openReview(app)" class="btn-ghost btn-sm border border-primary text-primary hover:bg-primary/5">Review</button>
          <button v-if="app.status === 'pending' || app.status === 'reviewed'" @click="updateStatus(app._id, 'accepted')" class="btn-ghost btn-sm border border-green-300 text-green-600 hover:bg-green-50">✓ Accept</button>
          <button v-if="app.status === 'pending' || app.status === 'reviewed'" @click="updateStatus(app._id, 'rejected')" class="btn-ghost btn-sm border border-red-200 text-red-500 hover:bg-red-50">✕ Reject</button>
          <button v-if="app.status === 'pending'" @click="updateStatus(app._id, 'reviewed')" class="btn-ghost btn-sm border border-blue-200 text-blue-600 hover:bg-blue-50">Mark Reviewed</button>
        </div>
      </div>
    </div>
    <EmptyState v-else icon="👥" title="No applicants found" description="No applications match your current filters." />

    <!-- Review Modal -->
    <div v-if="reviewApp" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="reviewApp = null">
      <div class="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h3 class="font-bold text-gray-900 mb-1">Review Application</h3>
        <p class="text-sm text-gray-500 mb-4">{{ reviewApp.applicant?.fullName }} — {{ reviewApp.opportunity?.title }}</p>

        <div v-if="reviewApp.coverLetter" class="mb-4">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Cover Letter</p>
          <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{{ reviewApp.coverLetter }}</p>
        </div>

        <div class="mb-4">
          <label class="label">Update Status</label>
          <select v-model="reviewStatus" class="select-field">
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div class="mb-5">
          <label class="label">Notes / Feedback <span class="text-gray-400 font-normal">(optional, sent to applicant)</span></label>
          <textarea v-model="reviewNotes" rows="3" class="textarea-field" placeholder="Add a note or feedback for the applicant..."></textarea>
        </div>
        <div class="flex gap-3">
          <button @click="reviewApp = null" class="btn-outline flex-1">Cancel</button>
          <button @click="submitReview" :disabled="isReviewing" class="btn-primary flex-1">
            <span v-if="isReviewing" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ isReviewing ? 'Saving...' : 'Save Review' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { applicationService } from '@/services/applicationService'
import { opportunityService } from '@/services/opportunityService'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const route = useRoute()
const applications = ref([])
const opportunities = ref([])
const isLoading = ref(true)
const filterOpportunity = ref(route.query.opportunity || '')
const filterStatus = ref('')
const reviewApp = ref(null)
const reviewStatus = ref('')
const reviewNotes = ref('')
const isReviewing = ref(false)

const statuses = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
]

const filtered = computed(() => {
  let list = applications.value
  if (filterOpportunity.value) list = list.filter(a => a.opportunity?._id === filterOpportunity.value)
  if (filterStatus.value) list = list.filter(a => a.status === filterStatus.value)
  return list
})

const countByStatus = (status) => {
  let list = applications.value
  if (filterOpportunity.value) list = list.filter(a => a.opportunity?._id === filterOpportunity.value)
  return status ? list.filter(a => a.status === status).length : list.length
}

const fetchApps = async () => {
  isLoading.value = true
  try {
    const { data } = await applicationService.getApplications()
    applications.value = data.data
  } catch { /* silent */ } finally {
    isLoading.value = false
  }
}

const updateStatus = async (id, status, notes = '') => {
  try {
    await applicationService.updateApplicationStatus(id, { status, notes })
    const app = applications.value.find(a => a._id === id)
    if (app) { app.status = status; if (notes) app.notes = notes }
    toast.success(`Application ${status}`)
  } catch {
    toast.error('Failed to update status')
  }
}

const openReview = (app) => {
  reviewApp.value = app
  reviewStatus.value = app.status
  reviewNotes.value = app.notes || ''
}

const submitReview = async () => {
  isReviewing.value = true
  try {
    await applicationService.updateApplicationStatus(reviewApp.value._id, {
      status: reviewStatus.value,
      notes: reviewNotes.value
    })
    const app = applications.value.find(a => a._id === reviewApp.value._id)
    if (app) { app.status = reviewStatus.value; app.notes = reviewNotes.value }
    toast.success('Review saved')
    reviewApp.value = null
  } catch {
    toast.error('Failed to save review')
  } finally {
    isReviewing.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    fetchApps(),
    opportunityService.getMyOpportunities().then(({ data }) => { opportunities.value = data.data }).catch(() => {})
  ])
})
</script>
