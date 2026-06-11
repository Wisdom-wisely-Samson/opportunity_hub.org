<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-container">
        <h1 class="page-header-title">Browse Opportunities</h1>
        <p class="page-header-sub">Discover {{ pagination.total }}+ opportunities tailored for refugees and underserved communities</p>
        <div class="mt-6 max-w-2xl">
          <SearchBar v-model="filters.search" placeholder="Search jobs, scholarships, grants..." @search="applyFilters" />
        </div>
      </div>
    </div>

    <div class="page-container py-8">
      <!-- Category chips -->
      <div class="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <button @click="setCategory('')" :class="['flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors', !filters.category ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-primary']">All</button>
        <button v-for="cat in categories" :key="cat.value" @click="setCategory(cat.value)" :class="['flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap', filters.category === cat.value ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-primary']">{{ cat.icon }} {{ cat.label }}</button>
      </div>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Filters Sidebar -->
        <div class="lg:w-64 flex-shrink-0">
          <OpportunityFilters v-model:filters="filters" @update:filters="updateFilter" @reset="resetFilters" />
        </div>

        <!-- Results -->
        <div class="flex-1 min-w-0">
          <!-- Results header -->
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm text-gray-600">
              <span v-if="isLoading">Loading...</span>
              <span v-else>{{ pagination.total }} opportunities found</span>
            </p>
            <button @click="showFilters = !showFilters" class="lg:hidden btn-ghost text-sm border border-gray-200">⚙️ Filters</button>
          </div>

          <!-- Mobile Filters -->
          <div v-if="showFilters" class="lg:hidden mb-4">
            <OpportunityFilters v-model:filters="filters" @update:filters="updateFilter" @reset="resetFilters" />
          </div>

          <!-- Loading skeleton -->
          <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div v-for="n in 6" :key="n" class="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <div class="flex gap-3"><div class="skeleton w-12 h-12 rounded-xl"></div><div class="flex-1 space-y-2"><div class="skeleton h-4 w-3/4"></div><div class="skeleton h-3 w-1/2"></div></div></div>
              <div class="skeleton h-3 w-full"></div>
              <div class="skeleton h-3 w-4/5"></div>
            </div>
          </div>

          <!-- Opportunities grid -->
          <div v-else-if="opportunities.length" class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <OpportunityCard v-for="opp in opportunities" :key="opp._id" :opportunity="opp" />
          </div>

          <!-- Empty state -->
          <EmptyState v-else icon="🔍" title="No opportunities found" description="Try adjusting your filters or search terms to find what you're looking for.">
            <button @click="resetFilters" class="btn-outline">Clear Filters</button>
          </EmptyState>

          <Pagination v-if="!isLoading" :page="pagination.page" :pages="pagination.pages" :has-next="pagination.hasNext" :has-prev="pagination.hasPrev" @change="changePage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import OpportunityCard from '@/components/opportunity/OpportunityCard.vue'
import OpportunityFilters from '@/components/opportunity/OpportunityFilters.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import Pagination from '@/components/common/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { opportunityService } from '@/services/opportunityService'

const route = useRoute()
const router = useRouter()
const opportunities = ref([])
const isLoading = ref(true)
const showFilters = ref(false)

const filters = reactive({
  search: route.query.search || '',
  category: route.query.category || '',
  location: route.query.location || '',
  sort: '-createdAt',
  remote: '',
})

const pagination = reactive({ page: 1, pages: 1, total: 0, limit: 12, hasNext: false, hasPrev: false })

const categories = [
  { value: 'job', label: 'Jobs', icon: '💼' },
  { value: 'scholarship', label: 'Scholarships', icon: '🎓' },
  { value: 'grant', label: 'Grants', icon: '💰' },
  { value: 'training', label: 'Training', icon: '📚' },
  { value: 'fellowship', label: 'Fellowships', icon: '🏆' },
  { value: 'internship', label: 'Internships', icon: '🔬' },
  { value: 'entrepreneurship', label: 'Entrepreneurship', icon: '🚀' },
]

const fetchOpportunities = async () => {
  isLoading.value = true
  try {
    const params = { ...filters, page: pagination.page, limit: pagination.limit }
    const { data } = await opportunityService.getOpportunities(params)
    opportunities.value = data.data
    Object.assign(pagination, data.meta)
  } catch { /* silent */ } finally {
    isLoading.value = false
  }
}

const applyFilters = () => { pagination.page = 1; fetchOpportunities() }
const setCategory = (cat) => { filters.category = cat; applyFilters() }
const updateFilter = (update) => { Object.assign(filters, update); applyFilters() }
const resetFilters = () => { Object.assign(filters, { search: '', category: '', location: '', sort: '-createdAt', remote: '' }); pagination.page = 1; fetchOpportunities() }
const changePage = (page) => { pagination.page = page; fetchOpportunities(); window.scrollTo({ top: 0, behavior: 'smooth' }) }

onMounted(fetchOpportunities)
</script>
