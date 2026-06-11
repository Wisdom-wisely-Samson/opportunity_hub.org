<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">My Applications</h1>

    <!-- Status filters -->
    <div class="flex gap-2 overflow-x-auto pb-1">
      <button v-for="s in statuses" :key="s.value" @click="filterStatus = s.value; fetchApps()" :class="['flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors', filterStatus === s.value ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-primary']">
        {{ s.label }} <span v-if="s.value" class="ml-1 opacity-70">({{ countByStatus(s.value) }})</span>
      </button>
    </div>

    <LoadingSpinner v-if="isLoading" text="Loading applications..." />
    <div v-else-if="filtered.length" class="space-y-4">
      <div v-for="app in filtered" :key="app._id" class="card">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-2xl">
            {{ categoryIcon(app.opportunity?.category) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <router-link :to="`/opportunities/${app.opportunity?._id}`" class="font-bold text-gray-900 hover:text-primary transition-colors line-clamp-1">{{ app.opportunity?.title }}</router-link>
                <p class="text-sm text-gray-500 mt-0.5">{{ app.opportunity?.organization?.organizationName }}</p>
              </div>
              <StatusBadge :status="app.status" />
            </div>
            <div class="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
              <span>📍 {{ app.opportunity?.location }}</span>
              <span>📅 Applied {{ formatRelativeTime(app.createdAt) }}</span>
              <span v-if="app.statusUpdatedAt && app.status !== 'pending'">🔄 Updated {{ formatRelativeTime(app.statusUpdatedAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Accepted message -->
        <div v-if="app.status === 'accepted'" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          🎉 Congratulations! Your application has been accepted. Check your email for next steps.
          <p v-if="app.notes" class="mt-1"><strong>Note:</strong> {{ app.notes }}</p>
        </div>
        <div v-if="app.status === 'rejected' && app.notes" class="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
          <strong>Feedback:</strong> {{ app.notes }}
        </div>

        <!-- Actions -->
        <div class="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <router-link :to="`/opportunities/${app.opportunity?._id}`" class="btn-ghost btn-sm border border-gray-200">View Opportunity</router-link>
          <button v-if="app.status === 'pending'" @click="withdraw(app._id)" class="btn-ghost btn-sm border border-red-200 text-red-500 hover:bg-red-50">Withdraw</button>
          <a v-if="app.cv?.url" :href="app.cv.url" target="_blank" class="btn-ghost btn-sm border border-gray-200">📄 My CV</a>
        </div>
      </div>
    </div>
    <EmptyState v-else icon="📝" title="No applications found" :description="filterStatus ? 'No applications with this status.' : 'You haven\'t applied for any opportunities yet.'">
      <router-link to="/opportunities" class="btn-primary btn-sm">Browse Opportunities</router-link>
    </EmptyState>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { applicationService } from '@/services/applicationService'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useToast } from '@/composables/useToast'
import { formatRelativeTime, categoryIcon } from '@/utils/helpers'

const toast = useToast()
const applications = ref([])
const isLoading = ref(true)
const filterStatus = ref('')

const statuses = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
]

const filtered = computed(() =>
  filterStatus.value ? applications.value.filter(a => a.status === filterStatus.value) : applications.value
)

const countByStatus = (status) => applications.value.filter(a => a.status === status).length

const fetchApps = async () => {
  isLoading.value = true
  try {
    const { data } = await applicationService.getApplications()
    applications.value = data.data
  } catch { /* silent */ } finally {
    isLoading.value = false
  }
}

const withdraw = async (id) => {
  if (!confirm('Are you sure you want to withdraw this application?')) return
  try {
    await applicationService.withdrawApplication(id)
    applications.value = applications.value.filter(a => a._id !== id)
    toast.success('Application withdrawn')
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to withdraw')
  }
}

onMounted(fetchApps)
</script>
