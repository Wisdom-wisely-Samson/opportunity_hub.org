<template>
  <div class="relative">
    <!-- Bell Icon -->
    <button
      @click="toggleDropdown"
      class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <span class="sr-only">Notifications</span>
      <Bell class="w-5 h-5 text-gray-600" />
      <!-- Unread badge -->
      <span
        v-if="store.hasUnread"
        class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
      ></span>
    </button>

    <!-- Dropdown -->
    <transition name="slide-down">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 p-3 z-50"
      >
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-gray-900">Notifications</h3>
          <button
            v-if="store.hasUnread"
            @click="store.markAllAsRead"
            class="text-sm text-primary hover:underline"
          >
            Mark all as read
          </button>
        </div>

        <div v-if="store.isLoading" class="p-3 text-gray-500 text-sm flex items-center gap-2">
          <Loader2 class="w-4 h-4 animate-spin" />
          Loading...
        </div>

        <ul
          v-else-if="store.notifications.length"
          class="divide-y divide-gray-100 max-h-64 overflow-y-auto"
        >
          <li
            v-for="n in store.notifications"
            :key="n._id"
            class="p-2 flex items-start gap-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            @click="handleNotificationClick(n)"
          >
            <div class="flex-1">
              <p class="text-sm text-gray-800 font-medium">{{ n.title }}</p>
              <p class="text-xs text-gray-600">{{ n.message }}</p>
              <p class="text-xs text-gray-400">
                {{ new Date(n.createdAt).toLocaleString() }}
              </p>
            </div>
            <span
              v-if="!n.isRead"
              class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"
            ></span>
          </li>
        </ul>

        <div v-else class="flex flex-col items-center py-6 text-gray-400">
          <BellOff class="w-8 h-8 mb-2" />
          <p class="text-sm text-gray-500">No notifications</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useNotificationStore } from "@/stores/notificationStore";
import { Bell, BellOff, Loader2 } from "lucide-vue-next";

const store = useNotificationStore();
const router = useRouter();
const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && !store.notifications.length) {
    store.fetchNotifications();
  }
};

const handleNotificationClick = (n) => {
  store.markAsRead(n._id);

  // Route based on type
  if (n.type === "organization_verification") {
    router.push("/org/verify");
  } else if (n.type === "organization_verified") {
    router.push("/org/opportunities/create");
  } else if (
    n.type === "application_submitted" ||
    n.type === "application_reviewed"
  ) {
    router.push(`/org/applicants?opportunity=${n.data?.opportunityId}`);
  } else if (n.type === "new_opportunity") {
    router.push(`/opportunities/${n.data?.opportunityId}`);
  }
};
onMounted(() => {
  store.fetchNotifications();
});
</script>
