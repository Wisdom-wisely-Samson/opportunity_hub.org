<template>
  <component :is="layoutComponent">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </component>
  <AppToast />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppToast from '@/components/common/AppToast.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import RefugeeDashboardLayout from '@/layouts/RefugeeDashboardLayout.vue'
import OrgDashboardLayout from '@/layouts/OrgDashboardLayout.vue'
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  const layout = route.meta.layout
  if (layout === 'auth') return AuthLayout
  if (layout === 'refugee') return RefugeeDashboardLayout
  if (layout === 'org') return OrgDashboardLayout
  if (layout === 'admin') return AdminDashboardLayout
  return DefaultLayout
})
</script>
