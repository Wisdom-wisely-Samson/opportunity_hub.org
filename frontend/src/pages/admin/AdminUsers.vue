<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-white">Users</h1>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3">
      <div class="flex-1 min-w-48 relative">
        <input v-model="search" @input="debouncedFetch" type="text" placeholder="Search by name or email..." class="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:border-accent" />
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>
      <select v-model="filterRole" @change="fetchUsers" class="bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent">
        <option value="" class="text-gray-900">All Roles</option>
        <option value="refugee" class="text-gray-900">Refugees</option>
        <option value="organization" class="text-gray-900">Organizations</option>
        <option value="admin" class="text-gray-900">Admins</option>
      </select>
    </div>

    <!-- Stats -->
    <div class="flex gap-3 flex-wrap text-sm text-white/60">
      <span>Total: <strong class="text-white">{{ pagination.total || 0 }}</strong></span>
    </div>

    <LoadingSpinner v-if="isLoading" />
    <div v-else-if="users.length" class="space-y-2">
      <div v-for="user in users" :key="user._id" class="bg-white/10 backdrop-blur rounded-2xl p-4 flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img v-if="user.profilePicture?.url" :src="user.profilePicture.url" class="w-full h-full object-cover" />
          <span v-else class="text-accent text-sm font-bold">{{ (user.fullName || user.email || 'U').charAt(0).toUpperCase() }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <p class="font-semibold text-white">{{ user.fullName || '(no name)' }}</p>
            <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', user.role === 'admin' ? 'bg-accent/20 text-accent' : user.role === 'organization' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300']">{{ user.role }}</span>
            <span v-if="!user.isEmailVerified" class="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full">Unverified</span>
          </div>
          <p class="text-sm text-white/60 truncate">{{ user.email }}</p>
          <p class="text-xs text-white/40 mt-0.5">Joined {{ new Date(user.createdAt).toLocaleDateString() }} · Last login {{ user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never' }}</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span v-if="!user.isActive" class="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">Inactive</span>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-white/50 py-8">No users found</div>

    <!-- Pagination -->
    <div v-if="pagination.pages > 1" class="flex items-center justify-center gap-2">
      <button @click="page--; fetchUsers()" :disabled="page <= 1" class="p-2 text-white/60 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/10 transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <span class="text-white text-sm">Page {{ page }} of {{ pagination.pages }}</span>
      <button @click="page++; fetchUsers()" :disabled="page >= pagination.pages" class="p-2 text-white/60 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/10 transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminService } from '@/services/adminService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const users = ref([])
const isLoading = ref(true)
const search = ref('')
const filterRole = ref('')
const page = ref(1)
const pagination = ref({})
let searchTimeout = null

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const { data } = await adminService.getUsers({ search: search.value, role: filterRole.value, page: page.value })
    users.value = data.data
    pagination.value = data.meta || {}
  } catch { /* silent */ } finally {
    isLoading.value = false
  }
}

const debouncedFetch = () => {
  clearTimeout(searchTimeout)
  page.value = 1
  searchTimeout = setTimeout(fetchUsers, 400)
}

onMounted(fetchUsers)
</script>
