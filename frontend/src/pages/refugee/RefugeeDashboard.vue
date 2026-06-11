<template>
  <div class="space-y-6">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-primary to-primary-600 rounded-2xl p-6 text-white">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0">
          <img v-if="user?.profilePicture?.url" :src="user.profilePicture.url" class="w-full h-full object-cover" :alt="user.fullName" />
          <span v-else class="text-accent font-bold text-xl">{{ initials }}</span>
        </div>
        <div>
          <p class="text-primary-200 text-sm">Welcome back,</p>
          <h1 class="text-xl sm:text-2xl font-bold">{{ user?.fullName || 'Refugee' }} 👋</h1>
          <p class="text-primary-200 text-xs mt-1">{{ user?.currentLocation || 'Location not set' }}</p>
        </div>
      </div>
      <div v-if="!user?.isEmailVerified" class="mt-4 p-3 bg-accent/20 border border-accent/30 rounded-lg text-sm text-accent-100 flex items-center gap-2">
        ⚠️ Please verify your email to unlock all features.
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard label="Total Applications" :value="stats.total" icon="📝" iconBg="bg-blue-50" />
      <StatCard label="Pending Review" :value="stats.pending" icon="⏳" iconBg="bg-yellow-50" />
      <StatCard label="Accepted" :value="stats.accepted" icon="✅" iconBg="bg-green-50" valueColor="text-green-600" />
      <StatCard label="Saved" :value="savedCount" icon="🔖" iconBg="bg-purple-50" />
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <router-link to="/opportunities" class="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary hover:shadow-sm transition-all text-center">
          <span class="text-2xl">🔍</span><span class="text-xs font-semibold text-gray-700">Browse Opportunities</span>
        </router-link>
        <router-link to="/refugee/cv" class="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary hover:shadow-sm transition-all text-center">
          <span class="text-2xl">📄</span><span class="text-xs font-semibold text-gray-700">Upload CV</span>
        </router-link>
        <router-link to="/refugee/profile" class="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary hover:shadow-sm transition-all text-center">
          <span class="text-2xl">👤</span><span class="text-xs font-semibold text-gray-700">Edit Profile</span>
        </router-link>
        <router-link to="/refugee/saved" class="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary hover:shadow-sm transition-all text-center">
          <span class="text-2xl">🔖</span><span class="text-xs font-semibold text-gray-700">Saved Opps</span>
        </router-link>
      </div>
    </div>

    <!-- Recent Applications -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900">Recent Applications</h2>
        <router-link to="/refugee/applications" class="text-sm text-primary hover:underline font-medium">View all →</router-link>
      </div>
      <LoadingSpinner v-if="isLoading" size="sm" />
      <div v-else-if="applications.length" class="space-y-3">
        <div v-for="app in applications.slice(0, 5)" :key="app._id" class="card flex items-center gap-4 p-4">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span class="text-lg">{{ categoryIcon(app.opportunity?.category) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 text-sm truncate">{{ app.opportunity?.title }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ app.opportunity?.organization?.organizationName }} • {{ formatRelativeTime(app.createdAt) }}</p>
          </div>
          <StatusBadge :status="app.status" />
        </div>
      </div>
      <EmptyState v-else icon="📝" title="No applications yet" description="Start applying for opportunities that match your skills.">
        <router-link to="/opportunities" class="btn-primary btn-sm">Browse Opportunities</router-link>
      </EmptyState>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import StatCard from '@/components/dashboard/StatCard.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { applicationService } from '@/services/applicationService'
import { userService } from '@/services/userService'
import { getInitials, formatRelativeTime, categoryIcon } from '@/utils/helpers'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const initials = computed(() => getInitials(user.value?.fullName || user.value?.email || ''))
const applications = ref([])
const savedCount = ref(0)
const isLoading = ref(true)

const stats = computed(() => ({
  total: applications.value.length,
  pending: applications.value.filter(a => a.status === 'pending').length,
  accepted: applications.value.filter(a => a.status === 'accepted').length,
}))

onMounted(async () => {
  try {
    const [appRes, savedRes] = await Promise.all([
      applicationService.getApplications({ limit: 10 }),
      userService.getSavedOpportunities({ limit: 1 }),
    ])
    applications.value = appRes.data.data || []
    savedCount.value = savedRes.data.meta?.total || 0
  } catch { /* silent */ } finally {
    isLoading.value = false
  }
})
</script>
