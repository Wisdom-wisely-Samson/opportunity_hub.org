<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-white">Opportunities</h1>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3">
      <div class="flex-1 min-w-48 relative">
        <input v-model="search" @input="debouncedFetch" type="text" placeholder="Search opportunities..." class="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:border-accent" />
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>
      <select v-model="filterCategory" @change="page = 1; fetchOpps()" class="bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent">
        <option value="" class="text-gray-900">All Categories</option>
        <option v-for="c in categories" :key="c" :value="c" class="text-gray-900 capitalize">{{ c }}</option>
      </select>
      <select v-model="filterStatus" @change="page = 1; fetchOpps()" class="bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent">
        <option value="" class="text-gray-900">All Status</option>
        <option value="active" class="text-gray-900">Active</option>
        <option value="closed" class="text-gray-900">Closed</option>
        <option value="draft" class="text-gray-900">Draft</option>
        <option value="expired" class="text-gray-900">Expired</option>
      </select>
    </div>

    <p class="text-white/50 text-sm">{{ pagination.total || 0 }} opportunities found</p>

    <LoadingSpinner v-if="isLoading" />
    <div v-else-if="opportunities.length" class="space-y-2">
      <div v-for="opp in opportunities" :key="opp._id" class="bg-white/10 backdrop-blur rounded-2xl p-4 flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-lg">
          {{ categoryIcon(opp.category) }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <router-link :to="`/opportunities/${opp._id}`" class="font-semibold text-white hover:text-accent transition-colors truncate block">{{ opp.title }}</router-link>
              <p class="text-sm text-white/60">{{ opp.organization?.organizationName }}</p>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <span :class="['text-xs px-2 py-0.5 rounded-full', opp.status === 'active' ? 'bg-green-500/20 text-green-300' : opp.status === 'draft' ? 'bg-gray-500/20 text-gray-300' : 'bg-red-500/20 text-red-300']">{{ opp.status }}</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-3 mt-1.5 text-xs text-white/50">
            <span>{{ opp.category }}</span>
            <span>📍 {{ opp.location }}</span>
            <span>👥 {{ opp.applicationCount || 0 }} applicants</span>
            <span>👁 {{ opp.views || 0 }} views</span>
            <span>📅 {{ opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'No deadline' }}</span>
          </div>
        </div>
        <div class="flex gap-1 flex-shrink-0">
          <button v-if="opp.status === 'active'" @click="changeStatus(opp, 'closed')" class="p-1.5 text-orange-400 hover:bg-orange-500/20 rounded-lg transition-colors text-xs" title="Close">Close</button>
          <button v-if="opp.status !== 'active'" @click="changeStatus(opp, 'active')" class="p-1.5 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors text-xs" title="Activate">Activate</button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-white/50 py-10">No opportunities found</div>

    <!-- Pagination -->
    <div v-if="pagination.pages > 1" class="flex items-center justify-center gap-3">
      <button @click="page--; fetchOpps()" :disabled="page <= 1" class="p-2 text-white/60 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/10 transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <span class="text-white text-sm">{{ page }} / {{ pagination.pages }}</span>
      <button @click="page++; fetchOpps()" :disabled="page >= pagination.pages" class="p-2 text-white/60 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/10 transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminService } from '@/services/adminService'
import { opportunityService } from '@/services/opportunityService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useToast } from '@/composables/useToast'
import { categoryIcon } from '@/utils/helpers'

const toast = useToast()
const opportunities = ref([])
const isLoading = ref(true)
const search = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const page = ref(1)
const pagination = ref({})
const categories = ['job', 'scholarship', 'grant', 'training', 'internship', 'fellowship', 'entrepreneurship']
let searchTimeout = null

const fetchOpps = async () => {
  isLoading.value = true
  try {
    const { data } = await adminService.getOpportunities({
      search: search.value, category: filterCategory.value,
      status: filterStatus.value, page: page.value, limit: 20
    })
    opportunities.value = data.data
    pagination.value = data.meta || {}
  } catch { /* silent */ } finally {
    isLoading.value = false
  }
}

const debouncedFetch = () => {
  clearTimeout(searchTimeout)
  page.value = 1
  searchTimeout = setTimeout(fetchOpps, 400)
}

const changeStatus = async (opp, status) => {
  try {
    await opportunityService.updateOpportunity(opp._id, { status })
    opp.status = status
    toast.success(`Status updated to ${status}`)
  } catch {
    toast.error('Failed to update')
  }
}

onMounted(fetchOpps)
</script>
