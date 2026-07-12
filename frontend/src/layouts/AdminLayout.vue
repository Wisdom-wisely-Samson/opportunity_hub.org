<template>
  <div class="flex h-screen bg-primary-900 text-primary-50 overflow-hidden">
    <!-- SIDEBAR -->
    <AdminSidebar class="hidden md:flex" />

    <!-- MAIN -->
    <div class="flex flex-col flex-1">
      <!-- TOPBAR -->
      <AdminTopbar :pageTitle="pageTitle" />

      <!-- CONTENT -->
      <main class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- PAGE TRANSITION -->
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import AdminSidebar from "./AdminSidebar.vue";
import AdminTopbar from "./AdminTopbar.vue";

const route = useRoute();

const pageTitle = computed(() => {
  return route.meta?.title || "Dashboard";
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
