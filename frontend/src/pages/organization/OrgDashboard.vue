<template>
  <div class="space-y-6">
    <!-- Welcome -->
    <div class="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img v-if="org?.logo?.url" :src="org.logo.url" :alt="org.organizationName" class="w-full h-full object-cover" />
          <span v-else class="text-white font-bold text-xl">{{ orgInitials }}</span>
        </div>
        <div>
          <h1 class="text-xl font-bold">{{ org?.organizationName || 'Your Organization' }}</h1>
          <div class="flex items-center gap-2 mt-0.5">
            <span v-if="org?.isVerified" class="flex items-center gap-1 text-accent text-sm font-medium"><svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>Verified</span>
            <span v-else class="text-white/70 text-sm">⏳ Pending Verification</span>
            <span class="text-white/60 text-sm capitalize">· {{ org?.type?.replace('_', ' ') }}</span>
          </div>
        </div>
      </div>

      <div v-if="!org?.isVerified" class="mt-4 bg-white/10 border border-white/20 rounded-xl p-3 text-sm">
        ⚠️ Your organization is pending admin verification. You can post opportunities but they won't be publicly listed until verified.
      </div>
    </div>

    <!-- Stats -->
    <LoadingSpinner v-if="isLoading" />
    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card text-center">
        <p class="text-3xl font-bold text-primary">{{ stats.totalOpportunities }}</p>
        <p class="text-sm text-gray-500 mt-1">Total Postings</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-green-600">{{ stats.activeOpportunities }}</p>
        <p class="text-sm text-gray-500 mt-1">Active</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-blue-600">{{ stats.totalApplications }}</p>
        <p class="text-sm text-gray-500 mt-1">Applications</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-orange-500">{{ stats.pendingApplications }}</p>
        <p class="text-sm text-gray-500 mt-1">Pending Review</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <router-link to="/org/opportunities/create" class="card card-flat hover:border-primary hover:bg-primary/5 transition-all text-center cursor-pointer group">
        <div class="text-3xl mb-2">➕</div>
        <p class="text-sm font-semibold text-gray-700 group-hover:text-primary">Post Opportunity</p>
      </router-link>
      <router-link to="/org/applicants" class="card card-flat hover:border-primary hover:bg-primary/5 transition-all text-center cursor-pointer group">
        <div class="text-3xl mb-2">👥</div>
        <p class="text-sm font-semibold text-gray-700 group-hover:text-primary">View Applicants</p>
      </router-link>
      <router-link to="/org/profile" class="card card-flat hover:border-primary hover:bg-primary/5 transition-all text-center cursor-pointer group">
        <div class="text-3xl mb-2">⚙️</div>
        <p class="text-sm font-semibold text-gray-700 group-hover:text-primary">Edit Profile</p>
      </router-link>
    </div>

    <!-- Recent Applications -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold text-gray-900">Recent Applications</h2>
        <router-link to="/org/applicants" class="text-sm text-primary hover:underline">View all →</router-link>
      </div>
      <div v-if="recentApps.length" class="space-y-3">
        <div v-for="app in recentApps" :key="app._id" class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
          <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img v-if="app.applicant?.profilePicture?.url" :src="app.applicant.profilePicture.url" class="w-full h-full object-cover" />
            <span v-else class="text-primary text-xs font-bold">{{ (app.applicant?.fullName || 'U').charAt(0).toUpperCase() }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ app.applicant?.fullName || 'Applicant' }}</p>
            <p class="text-xs text-gray-500 truncate">{{ app.opportunity?.title }}</p>
          </div>
          <StatusBadge :status="app.status" />
        </div>
      </div>
      <p v-else class="text-sm text-gray-500 text-center py-4">No applications yet</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { organizationService } from '@/services/organizationService'
import { applicationService } from '@/services/applicationService'
import { useAuthStore } from '@/stores/authStore'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const authStore = useAuthStore()
const org = ref(null)
const stats = ref({ totalOpportunities: 0, activeOpportunities: 0, totalApplications: 0, pendingApplications: 0 })
const recentApps = ref([])
const isLoading = ref(true)

const orgInitials = computed(() => {
  const name = org.value?.organizationName || ''
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
})

onMounted(async () => {
  try {
    const [orgRes, statsRes, appsRes] = await Promise.all([
      organizationService.getMyProfile(),
      organizationService.getDashboard(),
      applicationService.getApplications()
    ])
    org.value = orgRes.data.data
    stats.value = statsRes.data.data
    recentApps.value = (appsRes.data.data || []).slice(0, 5)
  } catch { /* silent */ } finally {
    isLoading.value = false
  }
})
</script>
