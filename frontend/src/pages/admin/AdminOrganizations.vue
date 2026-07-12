<template>
  <div class="admin-page space-y-6 animate-fade-in">
    <section class="admin-hero">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div class="max-w-2xl">
          <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-400/20 bg-primary-400/10 px-3 py-1 text-xs font-semibold text-primary-100">
            <BuildingOffice2Icon class="h-4 w-4" />
            Partner Directory
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Organizations
          </h1>
          <p class="mt-2 text-sm leading-6 text-primary-50">
            Verify partner accounts, review organization profiles, and keep trusted providers visible.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <PrimaryButton variant="ghost" @click="resetFilters">
            Reset Filters
          </PrimaryButton>
          <PrimaryButton :disabled="isLoading" @click="fetchOrgs">
            <ArrowPathIcon :class="['h-4 w-4', isLoading && 'animate-spin']" />
            Refresh
          </PrimaryButton>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <article v-for="metric in metrics" :key="metric.label" class="admin-card">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-accent-100">{{ metric.label }}</p>
            <p class="mt-2 text-3xl font-bold text-white">{{ metric.value }}</p>
            <p class="mt-1 text-xs text-primary-100">{{ metric.caption }}</p>
          </div>
          <div :class="['flex h-11 w-11 items-center justify-center rounded-xl', metric.iconClass]">
            <component :is="metric.icon" class="h-5 w-5 text-white" />
          </div>
        </div>
      </article>
    </section>

    <section class="admin-panel">
      <div class="border-b admin-divider p-4">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="relative flex-1">
            <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-100" />
            <input
              v-model="search"
              type="search"
              placeholder="Search organization, email, website, or country"
              class="admin-input pl-10 pr-4"
            />
          </div>

          <div class="flex rounded-xl border border-primary-400/40 bg-primary-900 p-1">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              type="button"
              :class="[
                'rounded-lg px-4 py-2 text-sm font-semibold transition',
                filterVerified === tab.value ? 'bg-accent text-primary-900' : 'text-primary-100 hover:bg-primary-700 hover:text-white'
              ]"
              @click="setFilter(tab.value)"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 border-b admin-divider px-4 py-3 text-sm text-primary-100 sm:flex-row sm:items-center sm:justify-between">
        <span>{{ pagination.total || filteredOrganizations.length }} organizations found</span>
        <span>Page {{ pagination.page || page }} of {{ pagination.pages || 1 }}</span>
      </div>

      <div v-if="isLoading" class="space-y-4 p-5">
        <LoadingSkeleton v-for="n in 6" :key="n" type="list" />
      </div>

      <EmptyState
        v-else-if="!filteredOrganizations.length"
        title="No organizations found"
        description="Try another verification tab or refresh the directory."
        :icon="BuildingOffice2Icon"
      />

      <div v-else class="divide-y divide-primary-500/40">
        <article v-for="org in filteredOrganizations" :key="org._id" class="p-5 transition hover:bg-primary-700">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div class="flex min-w-0 gap-4">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-500/15 text-lg font-bold text-primary-100">
                <img v-if="org.logo?.url" :src="org.logo.url" :alt="org.organizationName" class="h-full w-full object-cover" />
                <span v-else>{{ (org.organizationName || "O").charAt(0).toUpperCase() }}</span>
              </div>

              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="truncate text-lg font-bold text-white">{{ org.organizationName || "Unnamed organization" }}</h2>
                  <span :class="verifiedClass(org.isVerified)">
                    <CheckBadgeIcon v-if="org.isVerified" class="h-4 w-4" />
                    {{ org.isVerified ? "Verified" : "Pending" }}
                  </span>
                </div>

                <p class="mt-1 text-sm font-medium capitalize text-primary-100">
                  {{ formatLabel(org.type) }}
                </p>

                <div class="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-primary-100">
                  <span v-if="org.user?.email" class="inline-flex items-center gap-2">
                    <EnvelopeIcon class="h-4 w-4 text-accent-100" />
                    {{ org.user.email }}
                  </span>
                  <a v-if="org.website" :href="org.website" target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 text-accent-100 hover:text-white">
                    <GlobeAltIcon class="h-4 w-4 text-accent-100" />
                    {{ org.website }}
                  </a>
                  <span class="inline-flex items-center gap-2">
                    <CalendarDaysIcon class="h-4 w-4 text-accent-100" />
                    Joined {{ formatDate(org.createdAt) }}
                  </span>
                </div>

                <p v-if="org.description" class="mt-3 max-w-4xl text-sm leading-6 text-primary-50 line-clamp-2">
                  {{ org.description }}
                </p>
              </div>
            </div>

            <div class="flex shrink-0 gap-2 lg:justify-end">
              <button
                v-if="!org.isVerified"
                :disabled="processingId === org._id"
                class="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                @click="verify(org, 'verify')"
              >
                <ArrowPathIcon v-if="processingId === org._id" class="h-4 w-4 animate-spin" />
                <CheckCircleIcon v-else class="h-4 w-4" />
                Verify
              </button>

              <button
                v-if="org.isVerified"
                :disabled="processingId === org._id"
                class="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                @click="verify(org, 'unverify')"
              >
                <ArrowPathIcon v-if="processingId === org._id" class="h-4 w-4 animate-spin" />
                <XCircleIcon v-else class="h-4 w-4" />
                Revoke
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <Pagination
      :current-page="page"
      :total-pages="pagination.pages || 1"
      @update:page="pageChanged"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import {
  ArrowPathIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";

import EmptyState from "@/components/ui/EmptyState.vue";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton.vue";
import Pagination from "@/components/ui/Pagination.vue";
import PrimaryButton from "@/components/ui/PrimaryButton.vue";
import { useToast } from "@/composables/useToast";
import { adminService } from "@/services/adminService";

const toast = useToast();

const organizations = ref([]);
const isLoading = ref(true);
const filterVerified = ref("pending");
const processingId = ref(null);
const search = ref("");
const page = ref(1);
const pagination = ref({ page: 1, pages: 1, total: 0 });

const tabs = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "", label: "All" },
];

const filteredOrganizations = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return organizations.value;

  return organizations.value.filter((org) => {
    return [
      org.organizationName,
      org.description,
      org.type,
      org.website,
      org.country,
      org.contactEmail,
      org.user?.email,
      org.user?.fullName,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(term));
  });
});

const metrics = computed(() => [
  {
    label: "Organizations",
    value: pagination.value.total || organizations.value.length,
    caption: "Matching current view",
    icon: BuildingOffice2Icon,
    iconClass: "bg-blue-500/20",
  },
  {
    label: "Verified",
    value: organizations.value.filter((org) => org.isVerified).length,
    caption: "Trusted partner accounts",
    icon: ShieldCheckIcon,
    iconClass: "bg-emerald-500/20",
  },
  {
    label: "Pending",
    value: organizations.value.filter((org) => !org.isVerified).length,
    caption: "Awaiting admin review",
    icon: ClockIcon,
    iconClass: "bg-amber-500/20",
  },
]);

const fetchOrgs = async () => {
  isLoading.value = true;

  try {
    const params = {
      page: page.value,
      limit: 20,
      verified:
        filterVerified.value === "pending"
          ? false
          : filterVerified.value === "verified"
            ? true
            : undefined,
    };
    const { data } = await adminService.getOrganizations(params);
    organizations.value = data.data || [];
    pagination.value = data.meta || { page: page.value, pages: 1, total: organizations.value.length };
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to load organizations");
  } finally {
    isLoading.value = false;
  }
};

const setFilter = (value) => {
  filterVerified.value = value;
  page.value = 1;
  fetchOrgs();
};

const resetFilters = () => {
  filterVerified.value = "pending";
  search.value = "";
  page.value = 1;
  fetchOrgs();
};

const pageChanged = (nextPage) => {
  page.value = nextPage;
  fetchOrgs();
};

const verify = async (org, action) => {
  processingId.value = org._id;

  try {
    await adminService.verifyOrganization(org._id, action);
    org.isVerified = action === "verify";
    toast.success(action === "verify" ? "Organization verified" : "Verification revoked");
    if (filterVerified.value !== "") {
      organizations.value = organizations.value.filter((item) => item._id !== org._id);
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || "Action failed");
  } finally {
    processingId.value = null;
  }
};

const formatLabel = (value) => {
  if (!value) return "Not set";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const verifiedClass = (verified) => {
  return `inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
    verified
      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
      : "border-amber-400/20 bg-amber-500/10 text-amber-100"
  }`;
};

onMounted(fetchOrgs);
</script>
