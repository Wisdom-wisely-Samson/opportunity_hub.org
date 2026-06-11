import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { opportunityService } from '@/services/opportunityService'

export const useOpportunityStore = defineStore('opportunity', () => {
  const opportunities = ref([])
  const currentOpportunity = ref(null)
  const isLoading = ref(false)
  const filters = reactive({ search: '', category: '', location: '', status: 'active', sort: '-createdAt' })
  const pagination = reactive({ page: 1, pages: 1, total: 0, limit: 12, hasNext: false, hasPrev: false })

  const fetchOpportunities = async (params = {}) => {
    isLoading.value = true
    try {
      const queryParams = { ...filters, page: pagination.page, limit: pagination.limit, ...params }
      const { data } = await opportunityService.getOpportunities(queryParams)
      opportunities.value = data.data
      Object.assign(pagination, data.meta)
    } finally {
      isLoading.value = false
    }
  }

  const fetchOpportunityById = async (id) => {
    isLoading.value = true
    try {
      const { data } = await opportunityService.getOpportunityById(id)
      currentOpportunity.value = data.data
      return data.data
    } finally {
      isLoading.value = false
    }
  }

  const setFilters = (newFilters) => {
    Object.assign(filters, newFilters)
    pagination.page = 1
  }

  const resetFilters = () => {
    Object.assign(filters, { search: '', category: '', location: '', status: 'active', sort: '-createdAt' })
    pagination.page = 1
  }

  const setPage = (page) => { pagination.page = page }

  return {
    opportunities, currentOpportunity, isLoading, filters, pagination,
    fetchOpportunities, fetchOpportunityById, setFilters, resetFilters, setPage,
  }
})
