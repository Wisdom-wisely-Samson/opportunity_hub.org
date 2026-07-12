<template>
  <aside
    class="h-screen w-64 bg-primary-900 border-r border-primary-500/40 flex flex-col"
  >

    <!-- LOGO -->
    <div class="p-6 border-b border-primary-500/40">
      <h1 class="text-xl font-bold text-white">
        Opportunity Hub
      </h1>
      <p class="text-xs text-accent-100 mt-1">
        Admin Panel
      </p>
    </div>

    <!-- NAV -->
    <nav class="flex-1 overflow-y-auto p-4 space-y-2">

      <router-link
        v-for="item in menu"
        :key="item.name"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition"
        :class="isActive(item.path)
          ? 'bg-accent text-primary-900'
          : 'text-primary-100 hover:bg-primary-800 hover:text-white'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        {{ item.name }}
      </router-link>

    </nav>

    <!-- FOOTER -->
    <div class="p-4 border-t border-primary-500/40">
      <div class="text-xs text-primary-100">
        Logged in as
      </div>
      <div class="text-sm text-white font-semibold">
        Admin
      </div>
    </div>

  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

import {
  HomeIcon,
  UsersIcon,
  BuildingOffice2Icon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()

const menu = [
  { name: 'Dashboard', path: '/admin', icon: HomeIcon },
  { name: 'Users', path: '/admin/users', icon: UsersIcon },
  { name: 'Organizations', path: '/admin/organizations', icon: BuildingOffice2Icon },
  { name: 'Opportunities', path: '/admin/opportunities', icon: BriefcaseIcon },
  { name: 'Applications', path: '/admin/applications', icon: ClipboardDocumentListIcon },
  { name: 'Reports', path: '/admin/reports', icon: ChartBarIcon },
  { name: 'Notifications', path: '/admin/notifications', icon: BellIcon },
  { name: 'Settings', path: '/admin/settings', icon: Cog6ToothIcon }
]

const isActive = (path) => {
  return route.path === path
}
</script>
