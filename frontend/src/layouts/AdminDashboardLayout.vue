<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppNavbar />
    <div class="flex flex-1">
      <aside class="hidden lg:flex flex-col w-64 bg-primary min-h-full">
        <div class="p-4 border-b border-primary-400">
          <p class="text-accent font-bold text-sm uppercase tracking-wider">Admin Panel</p>
        </div>
        <nav class="p-4 space-y-1">
          <SidebarLink to="/admin/dashboard" icon="📊">Dashboard</SidebarLink>
          <SidebarLink to="/admin/users" icon="👥">Users</SidebarLink>
          <SidebarLink to="/admin/organizations" icon="🏢">Organizations</SidebarLink>
          <SidebarLink to="/admin/opportunities" icon="📋">Opportunities</SidebarLink>
          <SidebarLink to="/admin/reports" icon="📈">Reports</SidebarLink>
        </nav>
      </aside>
      <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-primary z-40 flex">
        <MobileNavItem to="/admin/dashboard" icon="📊" label="Home" />
        <MobileNavItem to="/admin/users" icon="👥" label="Users" />
        <MobileNavItem to="/admin/organizations" icon="🏢" label="Orgs" />
        <MobileNavItem to="/admin/opportunities" icon="📋" label="Opps" />
        <MobileNavItem to="/admin/reports" icon="📈" label="Reports" />
      </div>
      <main class="flex-1 min-w-0 pb-16 lg:pb-0">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
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
  template: `<router-link :to="to" :class="['flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', isActive ? 'bg-white text-primary' : 'text-primary-100 hover:bg-primary-400']"><span>{{ icon }}</span><slot /></router-link>`,
  setup(props) {
    const route = useRoute()
    const isActive = computed(() => route.path === props.to)
    return { isActive }
  }
}

const MobileNavItem = {
  props: ['to', 'icon', 'label'],
  template: `<router-link :to="to" :class="['flex-1 flex flex-col items-center justify-center py-2 text-xs gap-0.5', isActive ? 'text-accent font-semibold' : 'text-primary-200']"><span class="text-xl">{{ icon }}</span><span>{{ label }}</span></router-link>`,
  setup(props) {
    const route = useRoute()
    const isActive = computed(() => route.path === props.to)
    return { isActive }
  }
}
</script>
