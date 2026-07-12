<template>
  <header
    class="h-16 bg-primary-900 border-b border-primary-500/40 flex items-center justify-between px-6"
  >
    <!-- LEFT: Breadcrumb / Page Title -->
    <div class="flex flex-col">
      <p class="text-xs text-accent-100">Admin Panel</p>
      <h2 class="text-sm font-semibold text-white">
        {{ pageTitle }}
      </h2>
    </div>

    <!-- CENTER: Search -->
    <div class="hidden md:block w-96">
      <SearchInput
        v-model="search"
        placeholder="Search users, opportunities..."
      />
    </div>

    <!-- RIGHT: Actions -->
    <div class="flex items-center gap-4">
      <!-- Notifications -->
      <button class="relative text-primary-100 hover:text-accent transition">
        <BellIcon class="w-6 h-6" />

        <span
          v-if="notifications > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full"
        >
          {{ notifications }}
        </span>
      </button>

      <!-- User -->
      <div class="flex items-center gap-2">
        <div
          class="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-primary-900 font-bold"
        >
          A
        </div>

        <div class="hidden sm:block">
          <p class="text-sm text-white font-semibold">Admin</p>
          <p class="text-xs text-primary-100">Super Admin</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { BellIcon } from "@heroicons/vue/24/outline";
import SearchInput from "@/components/ui/SearchInput.vue";

defineProps({
  pageTitle: {
    type: String,
    default: "Dashboard",
  },
});

const search = ref("");
const notifications = ref(3);
</script>
