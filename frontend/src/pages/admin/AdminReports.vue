<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-white">Reports & Analytics</h1>

    <LoadingSpinner v-if="isLoading" />
    <template v-else>
      <!-- Applications by Status -->
      <div class="bg-white/10 backdrop-blur rounded-2xl p-5">
        <h2 class="font-bold text-white mb-4">Applications by Status</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="item in reports.applicationsByStatus || []" :key="item._id" class="bg-white/10 rounded-xl p-3 text-center">
            <p class="text-2xl font-bold text-white">{{ item.count }}</p>
            <p class="text-xs capitalize mt-1" :class="statusColor(item._id)">{{ item._id }}</p>
          </div>
        </div>
      </div>

      <!-- User Growth -->
      <div class="bg-white/10 backdrop-blur rounded-2xl p-5">
        <h2 class="font-bold text-white mb-4">New Users — Last 6 Months</h2>
        <div class="space-y-2">
          <div v-for="item in (reports.userGrowth || []).slice(-6)" :key="item._id" class="flex items-center gap-3">
            <span class="text-white/60 text-sm w-20 flex-shrink-0">{{ formatMonth(item._id) }}</span>
            <div class="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
              <div class="bg-accent h-full rounded-full transition-all" :style="{ width: maxGrowth ? `${(item.count / maxGrowth) * 100}%` : '0%' }"></div>
            </div>
            <span class="text-white font-semibold text-sm w-8 text-right">{{ item.count }}</span>
          </div>
        </div>
      </div>

      <!-- Top Opportunities -->
      <div class="bg-white/10 backdrop-blur rounded-2xl p-5">
        <h2 class="font-bold text-white mb-4">Top Opportunities by Applications</h2>
        <div class="space-y-2">
          <div v-for="(opp, i) in (reports.topOpportunities || []).slice(0, 10)" :key="opp._id" class="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors">
            <span class="text-white/40 text-sm w-5 flex-shrink-0 font-mono">{{ i + 1 }}</span>
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-medium truncate">{{ opp.title }}</p>
              <p class="text-white/50 text-xs">{{ opp.organization }}</p>
            </div>
            <span class="text-accent font-bold text-sm">{{ opp.applicationCount }}</span>
          </div>
        </div>
      </div>

      <!-- Top Organizations -->
      <div class="bg-white/10 backdrop-blur rounded-2xl p-5">
        <h2 class="font-bold text-white mb-4">Top Organizations by Postings</h2>
        <div class="space-y-2">
          <div v-for="(org, i) in (reports.topOrganizations || []).slice(0, 8)" :key="org._id" class="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors">
            <span class="text-white/40 text-sm w-5 flex-shrink-0 font-mono">{{ i + 1 }}</span>
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-medium truncate">{{ org.name }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-accent font-bold text-sm">{{ org.opportunityCount }}</p>
              <p class="text-white/40 text-xs">postings</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminService } from '@/services/adminService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const reports = ref({})
const isLoading = ref(true)

const maxGrowth = computed(() => {
  const growth = reports.value.userGrowth || []
  return Math.max(...growth.map(g => g.count), 1)
})

const statusColor = (status) => ({
  pending: 'text-yellow-300', reviewed: 'text-blue-300',
  accepted: 'text-green-300', rejected: 'text-red-300'
}[status] || 'text-white/60')

const formatMonth = (id) => {
  if (!id?.year) return id
  const d = new Date(id.year, (id.month || 1) - 1)
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

onMounted(async () => {
  try {
    const { data } = await adminService.getReports()
    reports.value = data.data
  } catch { /* silent */ } finally {
    isLoading.value = false
  }
})
</script>
