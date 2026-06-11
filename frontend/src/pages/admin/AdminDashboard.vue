<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-white">Admin Dashboard</h1>
      <p class="text-primary-200 text-sm mt-0.5">Platform overview & management</p>
    </div>

    <LoadingSpinner v-if="isLoading" />
    <template v-else>
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white/10 backdrop-blur rounded-2xl p-4 text-white">
          <p class="text-3xl font-bold">{{ stats.totalUsers || 0 }}</p>
          <p class="text-sm text-white/70 mt-1">Total Users</p>
          <p class="text-xs text-accent mt-1">+{{ stats.newUsersThisMonth || 0 }} this month</p>
        </div>
        <div class="bg-white/10 backdrop-blur rounded-2xl p-4 text-white">
          <p class="text-3xl font-bold">{{ stats.totalOrganizations || 0 }}</p>
          <p class="text-sm text-white/70 mt-1">Organizations</p>
          <p class="text-xs text-accent mt-1">{{ stats.pendingOrganizations || 0 }} pending</p>
        </div>
        <div class="bg-white/10 backdrop-blur rounded-2xl p-4 text-white">
          <p class="text-3xl font-bold">{{ stats.totalOpportunities || 0 }}</p>
          <p class="text-sm text-white/70 mt-1">Opportunities</p>
          <p class="text-xs text-accent mt-1">{{ stats.activeOpportunities || 0 }} active</p>
        </div>
        <div class="bg-white/10 backdrop-blur rounded-2xl p-4 text-white">
          <p class="text-3xl font-bold">{{ stats.totalApplications || 0 }}</p>
          <p class="text-sm text-white/70 mt-1">Applications</p>
          <p class="text-xs text-accent mt-1">{{ stats.acceptedApplications || 0 }} accepted</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <router-link to="/admin/organizations" class="bg-white/10 hover:bg-white/20 backdrop-blur rounded-2xl p-4 text-white text-center cursor-pointer transition-all">
          <div class="text-2xl mb-2">🏢</div>
          <p class="text-sm font-semibold">Verify Orgs</p>
          <p v-if="stats.pendingOrganizations" class="text-xs text-accent mt-1">{{ stats.pendingOrganizations }} pending</p>
        </router-link>
        <router-link to="/admin/users" class="bg-white/10 hover:bg-white/20 backdrop-blur rounded-2xl p-4 text-white text-center cursor-pointer transition-all">
          <div class="text-2xl mb-2">👥</div>
          <p class="text-sm font-semibold">Manage Users</p>
        </router-link>
        <router-link to="/admin/opportunities" class="bg-white/10 hover:bg-white/20 backdrop-blur rounded-2xl p-4 text-white text-center cursor-pointer transition-all">
          <div class="text-2xl mb-2">📋</div>
          <p class="text-sm font-semibold">Opportunities</p>
        </router-link>
        <router-link to="/admin/reports" class="bg-white/10 hover:bg-white/20 backdrop-blur rounded-2xl p-4 text-white text-center cursor-pointer transition-all">
          <div class="text-2xl mb-2">📊</div>
          <p class="text-sm font-semibold">Reports</p>
        </router-link>
      </div>

      <!-- Opportunities by Category -->
      <div class="bg-white/10 backdrop-blur rounded-2xl p-5">
        <h2 class="font-bold text-white mb-4">Opportunities by Category</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div v-for="cat in stats.opportunitiesByCategory || []" :key="cat._id" class="bg-white/10 rounded-xl p-3 text-center">
            <p class="text-xl font-bold text-white">{{ cat.count }}</p>
            <p class="text-xs text-white/70 capitalize mt-0.5">{{ cat._id }}</p>
          </div>
        </div>
      </div>

      <!-- Users by Role -->
      <div class="bg-white/10 backdrop-blur rounded-2xl p-5">
        <h2 class="font-bold text-white mb-4">Users by Role</h2>
        <div class="grid grid-cols-3 gap-3">
          <div v-for="role in stats.usersByRole || []" :key="role._id" class="bg-white/10 rounded-xl p-3 text-center">
            <p class="text-2xl font-bold text-white">{{ role.count }}</p>
            <p class="text-xs text-white/70 capitalize mt-0.5">{{ role._id }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminService } from '@/services/adminService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const stats = ref({})
const isLoading = ref(true)

onMounted(async () => {
  try {
    const { data } = await adminService.getDashboard()
    stats.value = data.data
  } catch { /* silent */ } finally {
    isLoading.value = false
  }
})
</script>
