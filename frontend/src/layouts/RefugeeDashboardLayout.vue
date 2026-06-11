<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppNavbar />
    <div class="flex flex-1">
      <!-- Sidebar desktop -->
      <aside class="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 min-h-full">
        <nav class="p-4 space-y-1 mt-4">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">My Account</p>
          <SidebarLink to="/refugee/dashboard" icon="📊">Dashboard</SidebarLink>
          <SidebarLink to="/refugee/profile" icon="👤">My Profile</SidebarLink>
          <SidebarLink to="/refugee/cv" icon="📄">My CV</SidebarLink>
          <SidebarLink to="/refugee/applications" icon="📝">My Applications</SidebarLink>
          <SidebarLink to="/refugee/saved" icon="🔖">Saved Opportunities</SidebarLink>
          <div class="border-t border-gray-100 my-3"></div>
          <SidebarLink to="/opportunities" icon="🔍">Browse Opportunities</SidebarLink>
        </nav>
      </aside>
      <!-- Mobile bottom nav -->
      <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex">
        <MobileNavItem to="/refugee/dashboard" icon="📊" label="Home" />
        <MobileNavItem to="/opportunities" icon="🔍" label="Browse" />
        <MobileNavItem to="/refugee/applications" icon="📝" label="Applied" />
        <MobileNavItem to="/refugee/saved" icon="🔖" label="Saved" />
        <MobileNavItem to="/refugee/profile" icon="👤" label="Profile" />
      </div>
      <main class="flex-1 min-w-0 pb-16 lg:pb-0">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import AppNavbar from '@/components/common/AppNavbar.vue'
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const SidebarLink = {
  props: ['to', 'icon'],
  template: `
    <router-link :to="to" :class="['flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100']">
      <span>{{ icon }}</span><slot />
    </router-link>`,
  setup(props) {
    const route = useRoute()
    const isActive = computed(() => route.path === props.to)
    return { isActive }
  }
}

const MobileNavItem = {
  props: ['to', 'icon', 'label'],
  template: `
    <router-link :to="to" :class="['flex-1 flex flex-col items-center justify-center py-2 text-xs gap-0.5 transition-colors', isActive ? 'text-primary font-semibold' : 'text-gray-500']">
      <span class="text-xl">{{ icon }}</span><span>{{ label }}</span>
    </router-link>`,
  setup(props) {
    const route = useRoute()
    const isActive = computed(() => route.path.startsWith(props.to))
    return { isActive }
  }
}
</script>
