<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Manage Opportunities</h1>
      <router-link to="/org/opportunities/create" class="btn-primary btn-sm">+ Post New</router-link>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3">
      <div class="flex-1 min-w-48 relative">
        <input v-model="search" type="text" placeholder="Search opportunities..." class="input-field pl-10" />
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>
      <select v-model="filterStatus" class="select-field w-auto">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="closed">Closed</option>
        <option value="expired">Expired</option>
      </select>
      <select v-model="filterCategory" class="select-field w-auto">
        <option value="">All Categories</option>
        <option value="job">Job</option>
        <option value="scholarship">Scholarship</option>
        <option value="grant">Grant</option>
        <option value="training">Training</option>
        <option value="internship">Internship</option>
        <option value="fellowship">Fellowship</option>
        <option value="entrepreneurship">Entrepreneurship</option>
      </select>
    </div>

    <LoadingSpinner v-if="isLoading" text="Loading opportunities..." />
    <div v-else-if="filtered.length" class="space-y-3">
      <div v-for="opp in filtered" :key="opp._id" class="card">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-xl">
            {{ categoryIcon(opp.category) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <h3 class="font-bold text-gray-900 truncate">{{ opp.title }}</h3>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span :class="['badge', categoryBadgeClass(opp.category)]">{{ opp.category }}</span>
                  <span :class="['badge', statusBadgeClass(opp.status)]">{{ opp.status }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <router-link :to="`/org/opportunities/${opp._id}/edit`" class="p-2 text-gray-500 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </router-link>
                <button @click="confirmDelete(opp)" class="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
            <div class="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
              <span>📍 {{ opp.location }}</span>
              <span>📅 Deadline: {{ opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'N/A' }}</span>
              <span>👥 {{ opp.applicationCount || 0 }} applicants</span>
              <span>👁 {{ opp.views || 0 }} views</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <router-link :to="`/opportunities/${opp._id}`" class="btn-ghost btn-sm border border-gray-200">View Public</router-link>
          <router-link :to="`/org/applicants?opportunity=${opp._id}`" class="btn-ghost btn-sm border border-gray-200">View Applicants</router-link>
          <button v-if="opp.status === 'active'" @click="updateStatus(opp, 'closed')" class="btn-ghost btn-sm border border-orange-200 text-orange-600 hover:bg-orange-50">Close</button>
          <button v-if="opp.status === 'closed' || opp.status === 'draft'" @click="updateStatus(opp, 'active')" class="btn-ghost btn-sm border border-green-200 text-green-600 hover:bg-green-50">Activate</button>
        </div>
      </div>
    </div>
    <EmptyState v-else icon="📋" title="No opportunities found" :description="search || filterStatus || filterCategory ? 'Try adjusting your filters.' : 'Post your first opportunity to get started.'">
      <router-link to="/org/opportunities/new" class="btn-primary btn-sm">Post Opportunity</router-link>
    </EmptyState>

    <!-- Delete Confirm Modal -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="deleteTarget = null">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full">
        <div class="text-3xl mb-3">🗑️</div>
        <h3 class="font-bold text-gray-900 mb-2">Delete Opportunity?</h3>
        <p class="text-sm text-gray-600 mb-5">This will permanently delete "<strong>{{ deleteTarget.title }}</strong>" and all associated applications.</p>
        <div class="flex gap-3">
          <button @click="deleteTarget = null" class="btn-outline flex-1">Cancel</button>
          <button @click="deleteOpportunity" :disabled="isDeleting" class="btn-danger flex-1">
            <span v-if="isDeleting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { opportunityService } from '@/services/opportunityService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useToast } from '@/composables/useToast'
import { categoryIcon } from '@/utils/helpers'

const toast = useToast()
const opportunities = ref([])
const isLoading = ref(true)
const search = ref('')
const filterStatus = ref('')
const filterCategory = ref('')
const deleteTarget = ref(null)
const isDeleting = ref(false)

const categoryBadgeClass = (cat) => ({
  job: 'badge-job', scholarship: 'badge-scholarship', grant: 'badge-grant',
  training: 'badge-training', internship: 'badge-internship',
  fellowship: 'badge-fellowship', entrepreneurship: 'badge-entrepreneurship'
}[cat] || 'badge')

const statusBadgeClass = (s) => ({
  active: 'status-active', draft: 'status-draft',
  closed: 'status-closed', expired: 'status-expired'
}[s] || 'badge')

const filtered = computed(() => {
  let list = opportunities.value
  if (filterStatus.value) list = list.filter(o => o.status === filterStatus.value)
  if (filterCategory.value) list = list.filter(o => o.category === filterCategory.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(o => o.title?.toLowerCase().includes(q) || o.location?.toLowerCase().includes(q))
  }
  return list
})

const fetchOpps = async () => {
  isLoading.value = true
  try {
    const { data } = await opportunityService.getMyOpportunities()
    opportunities.value = data.data
  } catch { /* silent */ } finally {
    isLoading.value = false
  }
}

const updateStatus = async (opp, status) => {
  try {
    await opportunityService.updateOpportunity(opp._id, { status })
    opp.status = status
    toast.success(`Opportunity ${status}`)
  } catch {
    toast.error('Failed to update status')
  }
}

const confirmDelete = (opp) => { deleteTarget.value = opp }

const deleteOpportunity = async () => {
  isDeleting.value = true
  try {
    await opportunityService.deleteOpportunity(deleteTarget.value._id)
    opportunities.value = opportunities.value.filter(o => o._id !== deleteTarget.value._id)
    toast.success('Opportunity deleted')
    deleteTarget.value = null
  } catch {
    toast.error('Failed to delete')
  } finally {
    isDeleting.value = false
  }
}

onMounted(fetchOpps)
</script>
