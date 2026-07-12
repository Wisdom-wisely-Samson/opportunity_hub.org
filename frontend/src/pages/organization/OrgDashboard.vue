<template>
  <div class="space-y-6">
    <!-- Welcome -->
    <div
      class="relative bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-5 sm:p-6 text-white overflow-hidden"
    >
      <div
        class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
      ></div>
      <div class="relative flex items-center gap-4">
        <div
          class="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden"
        >
          <img
            v-if="org?.logo?.url"
            :src="org.logo.url"
            :alt="org.organizationName"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-white font-bold text-xl">{{
            orgInitials
          }}</span>
        </div>
        <div class="min-w-0">
          <h1 class="text-lg sm:text-xl font-bold truncate">
            {{ org?.organizationName || "Your Organization" }}
          </h1>
          <div class="flex items-center flex-wrap gap-x-2 gap-y-1 mt-0.5">
            <span
              v-if="org?.isVerified"
              class="flex items-center gap-1 text-accent text-sm font-medium"
            >
              <BadgeCheck class="w-4 h-4" />
              Verified
            </span>
            <span v-else class="flex items-center gap-1 text-white/70 text-sm">
              <Clock class="w-3.5 h-3.5" />
              Pending Verification
            </span>
            <span class="text-white/60 text-sm capitalize"
              >· {{ org?.type?.replace("_", " ") }}</span
            >
          </div>
        </div>
      </div>

      <div
        v-if="!org?.isVerified"
        class="relative mt-4 bg-white/10 border border-white/20 rounded-xl p-3 text-sm flex items-start gap-2"
      >
        <AlertTriangle class="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span
          >Your organization is pending admin verification. You can post
          opportunities but they won't be publicly listed until verified.</span
        >
      </div>
    </div>

    <!-- Stats -->
    <LoadingSpinner v-if="isLoading" />
    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div class="card">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500">Total Postings</p>
            <p class="text-2xl sm:text-3xl font-bold text-primary mt-1">
              {{ stats.totalOpportunities }}
            </p>
          </div>
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
          >
            <BriefcaseBusiness class="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500">Active</p>
            <p class="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
              {{ stats.activeOpportunities }}
            </p>
          </div>
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0"
          >
            <CircleCheck class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500">Applications</p>
            <p class="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">
              {{ stats.totalApplications }}
            </p>
          </div>
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0"
          >
            <Users class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500">Pending Review</p>
            <p class="text-2xl sm:text-3xl font-bold text-orange-500 mt-1">
              {{ stats.pendingApplications }}
            </p>
          </div>
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0"
          >
            <Hourglass class="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div>
      <h2
        class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3"
      >
        Quick Actions
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <router-link
          to="/org/opportunities/create"
          class="card card-flat hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5 transition-all duration-200 text-center cursor-pointer group"
        >
          <div
            class="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 group-hover:bg-primary group-hover:text-white transition-colors"
          >
            <Plus class="w-5 h-5" />
          </div>
          <p
            class="text-sm font-semibold text-gray-700 group-hover:text-primary"
          >
            Post Opportunity
          </p>
        </router-link>
        <router-link
          to="/org/opportunities"
          class="card card-flat hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5 transition-all duration-200 text-center cursor-pointer group"
        >
          <div
            class="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 group-hover:bg-primary group-hover:text-white transition-colors"
          >
            <ClipboardList class="w-5 h-5" />
          </div>
          <p
            class="text-sm font-semibold text-gray-700 group-hover:text-primary"
          >
            Manage Listings
          </p>
        </router-link>
        <router-link
          to="/org/applicants"
          class="card card-flat hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5 transition-all duration-200 text-center cursor-pointer group"
        >
          <div
            class="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 group-hover:bg-primary group-hover:text-white transition-colors"
          >
            <Users class="w-5 h-5" />
          </div>
          <p
            class="text-sm font-semibold text-gray-700 group-hover:text-primary"
          >
            View Applicants
          </p>
        </router-link>
        <router-link
          to="/org/profile"
          class="card card-flat hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5 transition-all duration-200 text-center cursor-pointer group"
        >
          <div
            class="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 group-hover:bg-primary group-hover:text-white transition-colors"
          >
            <Settings class="w-5 h-5" />
          </div>
          <p
            class="text-sm font-semibold text-gray-700 group-hover:text-primary"
          >
            Edit Profile
          </p>
        </router-link>
      </div>
    </div>

    <!-- Recent Applications -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold text-gray-900">Recent Applications</h2>
        <router-link
          to="/org/applicants"
          class="text-sm text-primary hover:underline inline-flex items-center gap-1"
        >
          View all
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>
      </div>
      <div v-if="recentApps.length" class="space-y-3">
        <div
          v-for="app in recentApps"
          :key="app._id"
          class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div
            class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden"
          >
            <img
              v-if="app.applicant?.profilePicture?.url"
              :src="app.applicant.profilePicture.url"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-primary text-xs font-bold">{{
              (app.applicant?.fullName || "U").charAt(0).toUpperCase()
            }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">
              {{ app.applicant?.fullName || "Applicant" }}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {{ app.opportunity?.title }}
            </p>
          </div>
          <StatusBadge :status="app.status" />
        </div>
      </div>
      <p v-else class="text-sm text-gray-500 text-center py-4">
        No applications yet
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { organizationService } from "@/services/organizationService";
import { applicationService } from "@/services/applicationService";
import { useAuthStore } from "@/stores/authStore";
import StatusBadge from "@/components/common/StatusBadge.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import router from "../../router";
import {
  BadgeCheck,
  Clock,
  AlertTriangle,
  BriefcaseBusiness,
  CircleCheck,
  Users,
  Hourglass,
  Plus,
  ClipboardList,
  Settings,
  ArrowRight,
} from "lucide-vue-next";

const authStore = useAuthStore();
const org = ref(null);
const stats = ref({
  totalOpportunities: 0,
  activeOpportunities: 0,
  totalApplications: 0,
  pendingApplications: 0,
});
const recentApps = ref([]);
const isLoading = ref(true);

const orgInitials = computed(() => {
  const name = org.value?.organizationName || "";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
});

onMounted(async () => {
  try {
    const [orgRes, statsRes, appsRes] = await Promise.all([
      organizationService.getMyProfile(),
      organizationService.getDashboard(),
      applicationService.getApplications(),
    ]);
    org.value = orgRes.data.data;
    stats.value = statsRes.data.data;
    recentApps.value = (appsRes.data.data || []).slice(0, 5);
  } catch {
    /* silent */
  } finally {
    isLoading.value = false;
  }
});
</script>
