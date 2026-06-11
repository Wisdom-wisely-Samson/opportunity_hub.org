<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppNavbar />
    <div class="flex flex-1">
      <aside class="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 min-h-full">
        <nav class="p-4 space-y-1 mt-4">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">Organization</p>
          <SidebarLink to="/org/dashboard" icon="📊">Dashboard</SidebarLink>
          <SidebarLink to="/org/profile" icon="🏢">Org Profile</SidebarLink>
          <SidebarLink to="/org/opportunities/create" icon="➕">Post Opportunity</SidebarLink>
          <SidebarLink to="/org/opportunities" icon="📋">Manage Listings</SidebarLink>
          <SidebarLink to="/org/applicants" icon="👥">Applicants</SidebarLink>
        </nav>
      </aside>
      <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex">
        <MobileNavItem to="/org/dashboard" icon="📊" label="Home" />
        <MobileNavItem to="/org/opportunities/create" icon="➕" label="Post" />
        <MobileNavItem to="/org/opportunities" icon="📋" label="Listings" />
        <MobileNavItem to="/org/applicants" icon="👥" label="Applicants" />
        <MobileNavItem to="/org/profile" icon="🏢" label="Profile" />
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
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const SidebarLink = {
  props: ['to', 'icon'],
  template: `<router-link :to="to" :class="['flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100']"><span>{{ icon }}</span><slot /></router-link>`,
  setup(props) {
    const route = useRoute()
    const isActive = computed(() => route.path === props.to || (props.to !== '/org/dashboard' && route.path.startsWith(props.to)))
    return { isActive }
  }
}

const MobileNavItem = {
  props: ['to', 'icon', 'label'],
  template: `<router-link :to="to" :class="['flex-1 flex flex-col items-center justify-center py-2 text-xs gap-0.5 transition-colors', isActive ? 'text-primary font-semibold' : 'text-gray-500']"><span class="text-xl">{{ icon }}</span><span>{{ label }}</span></router-link>`,
  setup(props) {
    const route = useRoute()
    const isActive = computed(() => route.path === props.to)
    return { isActive }
  }
}
</script>
