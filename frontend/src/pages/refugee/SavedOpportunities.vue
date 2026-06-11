<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Saved Opportunities</h1>

    <!-- Search & Filters -->
    <div class="flex gap-3">
      <div class="flex-1 relative">
        <input v-model="search" type="text" placeholder="Search saved opportunities..." class="input-field pl-10" />
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>
      <select v-model="filterCategory" class="select-field w-auto">
        <option value="">All Categories</option>
        <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
      </select>
    </div>

    <LoadingSpinner v-if="isLoading" text="Loading saved opportunities..." />
    <div v-else-if="filtered.length" class="grid gap-4 sm:grid-cols-2">
      <div v-for="item in filtered" :key="item._id" class="card group hover:shadow-md transition-shadow">
        <div class="flex items-start gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-xl">
            {{ categoryIcon(item.opportunity?.category) }}
          </div>
          <div class="flex-1 min-w-0">
            <router-link :to="`/opportunities/${item.opportunity?._id}`" class="font-bold text-gray-900 hover:text-primary transition-colors line-clamp-1 block">
              {{ item.opportunity?.title }}
            </router-link>
            <p class="text-sm text-gray-500">{{ item.opportunity?.organization?.organizationName }}</p>
          </div>
          <button @click="unsave(item._id, item.opportunity?._id)" class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50" title="Remove from saved">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="flex flex-wrap gap-2 mb-3">
          <span :class="['badge', categoryBadgeClass(item.opportunity?.category)]">{{ item.opportunity?.category }}</span>
          <span v-if="item.opportunity?.isRemote" class="badge bg-blue-50 text-blue-700">Remote</span>
        </div>

        <div class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
          <span v-if="item.opportunity?.location">📍 {{ item.opportunity.location }}</span>
          <span v-if="item.opportunity?.deadline">📅 {{ formatDeadline(item.opportunity.deadline) }}</span>
        </div>

        <div class="flex gap-2 pt-3 border-t border-gray-100">
          <router-link :to="`/opportunities/${item.opportunity?._id}`" class="btn-primary btn-sm flex-1 text-center">View & Apply</router-link>
          <button @click="unsave(item._id, item.opportunity?._id)" class="btn-ghost btn-sm border border-red-200 text-red-500 hover:bg-red-50">Remove</button>
        </div>
      </div>
    </div>
    <EmptyState v-else icon="🔖" title="No saved opportunities" :description="search || filterCategory ? 'No matches found. Try adjusting your filters.' : 'Browse opportunities and save the ones you\'re interested in.'">
      <router-link to="/opportunities" class="btn-primary btn-sm">Browse Opportunities</router-link>
    </EmptyState>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { userService } from '@/services/userService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useToast } from '@/composables/useToast'
import { categoryIcon } from '@/utils/helpers'

const toast = useToast()
const saved = ref([])
const isLoading = ref(true)
const search = ref('')
const filterCategory = ref('')

const categories = [
  { value: 'job', label: 'Jobs' },
  { value: 'scholarship', label: 'Scholarships' },
  { value: 'grant', label: 'Grants' },
  { value: 'training', label: 'Training' },
  { value: 'internship', label: 'Internships' },
  { value: 'fellowship', label: 'Fellowships' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
]

const categoryBadgeClass = (cat) => ({
  job: 'badge-job', scholarship: 'badge-scholarship', grant: 'badge-grant',
  training: 'badge-training', internship: 'badge-internship',
  fellowship: 'badge-fellowship', entrepreneurship: 'badge-entrepreneurship'
}[cat] || 'badge')

const filtered = computed(() => {
  let list = saved.value
  if (filterCategory.value) list = list.filter(i => i.opportunity?.category === filterCategory.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(i => i.opportunity?.title?.toLowerCase().includes(q) || i.opportunity?.organization?.organizationName?.toLowerCase().includes(q))
  }
  return list
})

const formatDeadline = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  if (d < now) return `Expired ${d.toLocaleDateString()}`
  const days = Math.ceil((d - now) / 86400000)
  if (days <= 7) return `⚠ ${days}d left`
  return `Closes ${d.toLocaleDateString()}`
}

const fetchSaved = async () => {
  isLoading.value = true
  try {
    const { data } = await userService.getSavedOpportunities()
    saved.value = data.data
  } catch { /* silent */ } finally {
    isLoading.value = false
  }
}

const unsave = async (savedId, opportunityId) => {
  try {
    await userService.unsaveOpportunity(opportunityId)
    saved.value = saved.value.filter(i => i._id !== savedId)
    toast.success('Removed from saved')
  } catch {
    toast.error('Failed to remove')
  }
}

onMounted(fetchSaved)
</script>
