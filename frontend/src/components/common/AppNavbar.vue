<template>
  <nav class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2.5 flex-shrink-0">
          <img
            src="/logo.svg"
            alt="Opportunity Hub"
            class="w-9 h-9 object-contain"
          />
          <span class="font-bold text-primary text-lg hidden sm:block"
            >Opportunity <span class="text-primary">Hub</span></span
          >
        </router-link>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-1">
          <router-link to="/" :class="navLinkClass('/')">Home</router-link>
          <router-link
            to="/opportunities"
            :class="navLinkClass('/opportunities')"
            >Opportunities</router-link
          >
          <router-link to="/about" :class="navLinkClass('/about')"
            >About</router-link
          >
          <router-link to="/contact" :class="navLinkClass('/contact')"
            >Contact</router-link
          >
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-2">
          <!-- Notifications (authenticated) -->
          <Notifications v-if="isAuthenticated" />

          <!-- User menu (authenticated) -->
          <div v-if="isAuthenticated" class="relative" ref="userMenuRef">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div
                class="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center flex-shrink-0"
              >
                <img
                  v-if="avatar.image"
                  :src="avatar.image"
                  alt="avatar"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-white text-sm font-bold">{{
                  avatar.initials
                }}</span>
              </div>
              <span
                class="text-sm font-medium text-gray-700 hidden sm:block max-w-24 truncate"
                >{{ user?.fullName || user?.email }}</span
              >
              <ChevronDown class="w-4 h-4 text-gray-500 hidden sm:block" />
            </button>
            <transition name="slide-down">
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
              >
                <div class="px-4 py-2.5 border-b border-gray-100">
                  <p class="text-sm font-semibold text-gray-900 truncate">
                    {{ user?.fullName || "User" }}
                  </p>
                  <p class="text-xs text-gray-500 capitalize">
                    {{ user?.role }}
                  </p>
                </div>
                <router-link
                  :to="dashboardPath"
                  @click="showUserMenu = false"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  ><LayoutDashboard class="w-4 h-4" /> Dashboard</router-link
                >
                <router-link
                  :to="profilePath"
                  @click="showUserMenu = false"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  ><User class="w-4 h-4" /> Profile</router-link
                >
                <div class="border-t border-gray-100 my-1"></div>
                <button
                  @click="handleLogout"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut class="w-4 h-4" /> Sign Out
                </button>
              </div>
            </transition>
          </div>

          <!-- Guest buttons -->
          <template v-else>
            <router-link
              to="/login"
              class="hidden sm:inline-flex btn-ghost text-sm"
              >Sign In</router-link
            >
            <router-link to="/register" class="btn-primary btn-sm text-sm"
              >Get Started</router-link
            >
          </template>

          <!-- Mobile hamburger -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X v-if="showMobileMenu" class="w-5 h-5" />
            <Menu v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="slide-down">
        <div
          v-if="showMobileMenu"
          class="md:hidden border-t border-gray-100 py-3 space-y-1"
        >
          <router-link
            to="/"
            @click="showMobileMenu = false"
            class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >Home</router-link
          >
          <router-link
            to="/opportunities"
            @click="showMobileMenu = false"
            class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >Opportunities</router-link
          >
          <router-link
            to="/about"
            @click="showMobileMenu = false"
            class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >About</router-link
          >
          <router-link
            to="/contact"
            @click="showMobileMenu = false"
            class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >Contact</router-link
          >
          <div
            v-if="!isAuthenticated"
            class="pt-2 border-t border-gray-100 space-y-2 px-1"
          >
            <router-link
              to="/login"
              @click="showMobileMenu = false"
              class="block btn-outline w-full text-center text-sm"
              >Sign In</router-link
            >
            <router-link
              to="/register"
              @click="showMobileMenu = false"
              class="block btn-primary w-full text-center text-sm"
              >Get Started Free</router-link
            >
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { getInitials, getAvatar } from "@/utils/helpers";
import Notifications from "@/components/common/Notifications.vue";
import { ChevronDown, LayoutDashboard, User, LogOut, Menu, X } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const notifStore = useNotificationStore();

const showMobileMenu = ref(false);
const showUserMenu = ref(false);
const userMenuRef = ref(null);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);
const initials = computed(() =>
  getInitials(user.value?.fullName || user.value?.email || ""),
);
const avatar = computed(() => getAvatar(user.value))
const dashboardPath = computed(() => {
  const role = user.value?.role;
  if (role === "refugee") return "/refugee/dashboard";
  if (role === "organization") return "/org/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/";
});

const profilePath = computed(() => {
  const role = user.value?.role;
  if (role === "refugee") return "/refugee/profile";
  if (role === "organization") return "/org/profile";
  return "/";
});

const navLinkClass = (path) => {
  const isActive =
    path === "/" ? route.path === "/" : route.path.startsWith(path);
  return [
    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
    isActive
      ? "text-primary bg-primary/5"
      : "text-gray-600 hover:text-primary hover:bg-gray-100",
  ];
};

const handleLogout = async () => {
  showUserMenu.value = false;
  await authStore.logout();
  router.push("/");
};

const handleOutsideClick = (e) => {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
  if (isAuthenticated.value) notifStore.fetchNotifications();
});

onUnmounted(() => document.removeEventListener("click", handleOutsideClick));
</script>
