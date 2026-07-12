<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 space-y-8">

    <!-- HEADER -->
    <div class="rounded-3xl bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 p-8 shadow-xl animate-fade-in">
      <h1 class="text-4xl font-bold text-white">Admin Dashboard</h1>
      <p class="text-primary-100 mt-2">Platform overview & management system</p>
    </div>

    <LoadingSpinner v-if="isLoading" />

    <template v-else>

      <!-- STATS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <!-- USERS -->
        <div class="group rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 hover:-translate-y-1 transition">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-primary-200 text-sm">Total Users</p>
              <h2 class="text-4xl font-bold text-white mt-2">{{ stats.totalUsers || 0 }}</h2>
              <p class="text-accent text-xs mt-2">+{{ stats.newUsersThisMonth || 0 }} this month</p>
            </div>
            <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <UsersIcon class="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <!-- ORGS -->
        <div class="group rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 hover:-translate-y-1 transition">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-primary-200 text-sm">Organizations</p>
              <h2 class="text-4xl font-bold text-white mt-2">{{ stats.totalOrganizations || 0 }}</h2>
              <p class="text-accent text-xs mt-2">{{ stats.pendingOrganizations || 0 }} pending</p>
            </div>
            <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <BuildingOffice2Icon class="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <!-- OPPORTUNITIES -->
        <div class="group rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 hover:-translate-y-1 transition">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-primary-200 text-sm">Opportunities</p>
              <h2 class="text-4xl font-bold text-white mt-2">{{ stats.totalOpportunities || 0 }}</h2>
              <p class="text-accent text-xs mt-2">{{ stats.activeOpportunities || 0 }} active</p>
            </div>
            <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
              <BriefcaseIcon class="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <!-- APPLICATIONS -->
        <div class="group rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 hover:-translate-y-1 transition">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-primary-200 text-sm">Applications</p>
              <h2 class="text-4xl font-bold text-white mt-2">{{ stats.totalApplications || 0 }}</h2>
              <p class="text-accent text-xs mt-2">{{ stats.acceptedApplications || 0 }} accepted</p>
            </div>
            <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <DocumentTextIcon class="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

      </div>

      <!-- QUICK ACTIONS -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

        <router-link to="/admin/organizations" class="rounded-3xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition">
          <ShieldCheckIcon class="w-8 h-8 text-primary-300 mb-3" />
          <p class="text-white font-semibold">Verify Orgs</p>
          <p class="text-xs text-primary-200">{{ stats.pendingOrganizations || 0 }} pending</p>
        </router-link>

        <router-link to="/admin/users" class="rounded-3xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition">
          <UsersIcon class="w-8 h-8 text-primary-300 mb-3" />
          <p class="text-white font-semibold">Manage Users</p>
        </router-link>

        <router-link to="/admin/opportunities" class="rounded-3xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition">
          <BriefcaseIcon class="w-8 h-8 text-primary-300 mb-3" />
          <p class="text-white font-semibold">Opportunities</p>
        </router-link>

        <router-link to="/admin/reports" class="rounded-3xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition">
          <ChartBarIcon class="w-8 h-8 text-primary-300 mb-3" />
          <p class="text-white font-semibold">Reports</p>
        </router-link>

      </div>

      <!-- ANALYTICS -->
      <div class="grid md:grid-cols-2 gap-6">

        <!-- CATEGORY -->
        <div class="rounded-3xl bg-white/5 border border-white/10 p-6">
          <div class="flex justify-between mb-4">
            <h2 class="text-white font-bold">Opportunities by Category</h2>
            <ChartBarIcon class="w-6 h-6 text-primary-300" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div v-for="cat in stats.opportunitiesByCategory || []" :key="cat._id"
              class="rounded-2xl bg-white/5 border border-white/10 p-4 text-center hover:bg-white/10 transition">
              <p class="text-2xl font-bold text-white">{{ cat.count }}</p>
              <p class="text-xs text-primary-200 capitalize">{{ cat._id }}</p>
            </div>
          </div>
        </div>

        <!-- ROLES -->
        <div class="rounded-3xl bg-white/5 border border-white/10 p-6">
          <div class="flex justify-between mb-4">
            <h2 class="text-white font-bold">Users by Role</h2>
            <UsersIcon class="w-6 h-6 text-primary-300" />
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div v-for="role in stats.usersByRole || []" :key="role._id"
              class="rounded-2xl bg-white/5 border border-white/10 p-4 text-center hover:bg-white/10 transition">
              <p class="text-2xl font-bold text-white">{{ role.count }}</p>
              <p class="text-xs text-primary-200 capitalize">{{ role._id }}</p>
            </div>
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

import {
  UsersIcon,
  BuildingOffice2Icon,
  BriefcaseIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

const stats = ref({})
const isLoading = ref(true)

onMounted(async () => {
  try {
    const { data } = await adminService.getDashboard()
    stats.value = data.data
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})
</script>