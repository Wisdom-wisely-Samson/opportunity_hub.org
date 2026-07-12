<template>
  <div class="admin-page space-y-6 animate-fade-in">
    <section class="admin-hero">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div class="max-w-2xl">
          <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-400/20 bg-primary-400/10 px-3 py-1 text-xs font-semibold text-primary-100">
            <ChartBarIcon class="h-4 w-4" />
            Analytics
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Reports
          </h1>
          <p class="mt-2 text-sm leading-6 text-primary-50">
            Track application flow, user growth, and the strongest content across the platform.
          </p>
        </div>

        <PrimaryButton :disabled="isLoading" @click="fetchReports">
          <ArrowPathIcon :class="['h-4 w-4', isLoading && 'animate-spin']" />
          Refresh
        </PrimaryButton>
      </div>
    </section>

    <div v-if="isLoading" class="grid gap-4 lg:grid-cols-2">
      <LoadingSkeleton v-for="n in 4" :key="n" type="card" />
    </div>

    <template v-else>
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article v-for="metric in summaryMetrics" :key="metric.label" class="admin-card">
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

      <section class="grid gap-6 xl:grid-cols-2">
        <article class="admin-card">
          <div class="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-white">Applications by Status</h2>
              <p class="mt-1 text-sm text-primary-100">Current distribution of submitted applications.</p>
            </div>
            <ClipboardDocumentListIcon class="h-6 w-6 text-primary-100" />
          </div>

          <EmptyState
            v-if="!applicationsByStatus.length"
            title="No application data"
            description="Application status totals will appear once users start applying."
            :icon="ClipboardDocumentListIcon"
          />

          <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div v-for="item in applicationsByStatus" :key="item._id" class="admin-inner p-4">
              <p class="text-2xl font-bold text-white">{{ item.count }}</p>
              <p :class="['mt-1 text-xs font-semibold capitalize', statusTextClass(item._id)]">
                {{ formatLabel(item._id) }}
              </p>
            </div>
          </div>
        </article>

        <article class="admin-card">
          <div class="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-white">User Growth</h2>
              <p class="mt-1 text-sm text-primary-100">New active users over the latest reporting months.</p>
            </div>
            <UsersIcon class="h-6 w-6 text-primary-100" />
          </div>

          <EmptyState
            v-if="!growthSeries.length"
            title="No growth data"
            description="Monthly user growth will appear here after signups are recorded."
            :icon="UsersIcon"
          />

          <div v-else class="space-y-4">
            <div v-for="item in growthSeries" :key="`${item._id.year}-${item._id.month}`" class="grid grid-cols-[5rem_1fr_3rem] items-center gap-3">
              <span class="text-sm font-medium text-primary-50">{{ formatMonth(item._id) }}</span>
              <div class="h-3 overflow-hidden rounded-full bg-primary-900">
                <div
                  class="h-full rounded-full bg-accent"
                  :style="{ width: maxGrowth ? `${Math.max((item.count / maxGrowth) * 100, 6)}%` : '0%' }"
                />
              </div>
              <span class="text-right text-sm font-bold text-white">{{ item.count }}</span>
            </div>
          </div>
        </article>
      </section>

      <section class="grid gap-6 xl:grid-cols-2">
        <article class="admin-card">
          <div class="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-white">Top Opportunities</h2>
              <p class="mt-1 text-sm text-primary-100">Listings ranked by application volume.</p>
            </div>
            <BriefcaseIcon class="h-6 w-6 text-primary-100" />
          </div>

          <EmptyState
            v-if="!topOpportunities.length"
            title="No opportunity data"
            description="Top listings will appear once applications are connected to opportunities."
            :icon="BriefcaseIcon"
          />

          <div v-else class="divide-y divide-primary-500/40">
            <div v-for="(opp, index) in topOpportunities" :key="opp._id" class="flex items-center gap-4 py-3">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-900 text-sm font-bold text-accent-100">
                {{ index + 1 }}
              </span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-white">{{ opp.title }}</p>
                <p class="truncate text-xs text-primary-100">
                  {{ opp.organization?.organizationName || "Unknown organization" }} • {{ formatLabel(opp.category) }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-primary-100">{{ opp.applicationCount || 0 }}</p>
                <p class="text-xs text-primary-100">apps</p>
              </div>
            </div>
          </div>
        </article>

        <article class="admin-card">
          <div class="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-white">Top Organizations</h2>
              <p class="mt-1 text-sm text-primary-100">Partners ranked by published opportunities.</p>
            </div>
            <BuildingOffice2Icon class="h-6 w-6 text-primary-100" />
          </div>

          <EmptyState
            v-if="!topOrganizations.length"
            title="No organization data"
            description="Organization posting totals will appear after opportunities are published."
            :icon="BuildingOffice2Icon"
          />

          <div v-else class="divide-y divide-primary-500/40">
            <div v-for="(org, index) in topOrganizations" :key="org._id" class="flex items-center gap-4 py-3">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-900 text-sm font-bold text-accent-100">
                {{ index + 1 }}
              </span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-white">{{ org.organizationName || "Unnamed organization" }}</p>
                <p class="text-xs text-primary-100">Publishing partner</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-primary-100">{{ org.opportunityCount || 0 }}</p>
                <p class="text-xs text-primary-100">posts</p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import {
  ArrowPathIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  UsersIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";

import EmptyState from "@/components/ui/EmptyState.vue";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton.vue";
import PrimaryButton from "@/components/ui/PrimaryButton.vue";
import { useToast } from "@/composables/useToast";
import { adminService } from "@/services/adminService";

const toast = useToast();

const reports = ref({});
const isLoading = ref(true);

const applicationsByStatus = computed(() => reports.value.applicationsByStatus || []);
const growthSeries = computed(() => [...(reports.value.userGrowth || [])].reverse().slice(-6));
const topOpportunities = computed(() => (reports.value.topOpportunities || []).slice(0, 10));
const topOrganizations = computed(() => (reports.value.topOrganizations || []).slice(0, 8));

const totalApplications = computed(() => {
  return applicationsByStatus.value.reduce((sum, item) => sum + (item.count || 0), 0);
});

const acceptedApplications = computed(() => {
  return applicationsByStatus.value.find((item) => item._id === "accepted")?.count || 0;
});

const maxGrowth = computed(() => {
  return Math.max(...growthSeries.value.map((item) => item.count), 1);
});

const summaryMetrics = computed(() => [
  {
    label: "Applications",
    value: totalApplications.value,
    caption: "Total tracked submissions",
    icon: ClipboardDocumentListIcon,
    iconClass: "bg-blue-500/20",
  },
  {
    label: "Accepted",
    value: acceptedApplications.value,
    caption: "Successful application outcomes",
    icon: CheckCircleIcon,
    iconClass: "bg-emerald-500/20",
  },
  {
    label: "Top Listings",
    value: topOpportunities.value.length,
    caption: "Ranked active opportunities",
    icon: BriefcaseIcon,
    iconClass: "bg-violet-500/20",
  },
  {
    label: "Top Partners",
    value: topOrganizations.value.length,
    caption: "Organizations with postings",
    icon: BuildingOffice2Icon,
    iconClass: "bg-amber-500/20",
  },
]);

const fetchReports = async () => {
  isLoading.value = true;

  try {
    const { data } = await adminService.getReports();
    reports.value = data.data || {};
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to load reports");
  } finally {
    isLoading.value = false;
  }
};

const statusTextClass = (status) => {
  return {
    pending: "text-amber-100",
    reviewed: "text-blue-100",
    accepted: "text-emerald-100",
    rejected: "text-red-100",
  }[status] || "text-primary-50";
};

const formatLabel = (value) => {
  if (!value) return "Not set";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatMonth = (id) => {
  if (!id?.year) return "Unknown";
  const date = new Date(id.year, (id.month || 1) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
};

onMounted(fetchReports);
</script>
