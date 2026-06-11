import { defineStore } from 'pinia'
import { ref } from 'vue'
import { applicationService } from '@/services/applicationService'

export const useApplicationStore = defineStore('application', () => {
  const applications = ref([])
  const isLoading = ref(false)

  const fetchApplications = async (params = {}) => {
    isLoading.value = true
    try {
      const { data } = await applicationService.getApplications(params)
      applications.value = data.data
      return data
    } finally {
      isLoading.value = false
    }
  }

  const submitApplication = async (formData) => {
    const { data } = await applicationService.createApplication(formData)
    return data
  }

  const updateStatus = async (id, statusData) => {
    const { data } = await applicationService.updateStatus(id, statusData)
    const idx = applications.value.findIndex(a => a._id === id)
    if (idx !== -1) applications.value[idx] = data.data
    return data
  }

  const withdrawApplication = async (id) => {
    await applicationService.withdrawApplication(id)
    applications.value = applications.value.filter(a => a._id !== id)
  }

  return { applications, isLoading, fetchApplications, submitApplication, updateStatus, withdrawApplication }
})
