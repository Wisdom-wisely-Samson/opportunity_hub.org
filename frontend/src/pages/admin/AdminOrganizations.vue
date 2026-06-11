<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-white">Organizations</h1>

    <!-- Filter Tabs -->
    <div class="flex gap-1 p-1 bg-white/10 rounded-xl w-fit">
      <button v-for="tab in tabs" :key="tab.value" @click="filterVerified = tab.value; fetchOrgs()" :class="['px-4 py-1.5 rounded-lg text-sm font-medium transition-colors', filterVerified === tab.value ? 'bg-white text-primary' : 'text-white/70 hover:text-white']">
        {{ tab.label }}
      </button>
    </div>

    <LoadingSpinner v-if="isLoading" />
    <div v-else-if="organizations.length" class="space-y-3">
      <div v-for="org in organizations" :key="org._id" class="bg-white/10 backdrop-blur rounded-2xl p-5">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img v-if="org.logo?.url" :src="org.logo.url" class="w-full h-full object-cover" />
            <span v-else class="text-white font-bold">{{ (org.organizationName || 'O').charAt(0) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-bold text-white">{{ org.organizationName }}</h3>
                <p class="text-sm text-white/60 capitalize">{{ org.type?.replace('_', ' ') }}</p>
              </div>
              <div v-if="org.isVerified" class="flex items-center gap-1 text-accent text-sm font-medium">
                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                Verified
              </div>
              <span v-else class="text-xs text-orange-300 bg-orange-500/20 px-2 py-1 rounded-full">Pending</span>
            </div>
            <div class="flex flex-wrap gap-3 mt-2 text-xs text-white/50">
              <span v-if="org.user?.email">✉ {{ org.user.email }}</span>
              <span v-if="org.website">🌐 {{ org.website }}</span>
              <span>📅 Joined {{ new Date(org.createdAt).toLocaleDateString() }}</span>
            </div>
            <p v-if="org.description" class="text-sm text-white/60 mt-2 line-clamp-2">{{ org.description }}</p>
          </div>
        </div>

        <div class="flex gap-2 mt-4 pt-3 border-t border-white/10">
          <button v-if="!org.isVerified" @click="verify(org, 'verify')" :disabled="processingId === org._id" class="flex-1 bg-accent/20 hover:bg-accent/30 text-accent text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <span v-if="processingId === org._id" class="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin inline-block mr-1"></span>
            ✓ Verify Organization
          </button>
          <button v-if="org.isVerified" @click="verify(org, 'unverify')" :disabled="processingId === org._id" class="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            ✕ Revoke Verification
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-white/50 py-10">No organizations found</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminService } from '@/services/adminService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const organizations = ref([])
const isLoading = ref(true)
const filterVerified = ref('pending')
const processingId = ref(null)

const tabs = [
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: '', label: 'All' },
]

const fetchOrgs = async () => {
  isLoading.value = true
  try {
    const params = filterVerified.value === 'pending' ? { isVerified: false }
      : filterVerified.value === 'verified' ? { isVerified: true } : {}
    const { data } = await adminService.getOrganizations(params)
    organizations.value = data.data
  } catch { /* silent */ } finally {
    isLoading.value = false
  }
}

const verify = async (org, action) => {
  processingId.value = org._id
  try {
    await adminService.verifyOrganization(org._id, action)
    org.isVerified = action === 'verify'
    toast.success(action === 'verify' ? 'Organization verified!' : 'Verification revoked')
    if (filterVerified.value !== '') organizations.value = organizations.value.filter(o => o._id !== org._id)
  } catch {
    toast.error('Action failed')
  } finally {
    processingId.value = null
  }
}

onMounted(fetchOrgs)
</script>
