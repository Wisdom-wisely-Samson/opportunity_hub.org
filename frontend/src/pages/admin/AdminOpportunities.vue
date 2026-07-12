<template>
  <div class="admin-page space-y-6 animate-fade-in">
    <section class="admin-hero">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div class="max-w-2xl">
          <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-400/20 bg-primary-400/10 px-3 py-1 text-xs font-semibold text-primary-100">
            <BriefcaseIcon class="h-4 w-4" />
            Opportunity Operations
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Opportunities
          </h1>
          <p class="mt-2 text-sm leading-6 text-primary-50">
            Review listings, monitor performance, and keep marketplace content accurate and current.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <PrimaryButton variant="ghost" @click="resetFilters">
            Reset Filters
          </PrimaryButton>
          <PrimaryButton :disabled="isLoading" @click="fetchOpps">
            <ArrowPathIcon :class="['h-4 w-4', isLoading && 'animate-spin']" />
            Refresh
          </PrimaryButton>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div class="relative flex-1">
            <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-100" />
            <input
              v-model="search"
              type="search"
              placeholder="Search title, organization, or location"
              class="admin-input pl-10 pr-4"
            />
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:w-[420px]">
            <select v-model="filterCategory" class="admin-select" @change="resetAndFetch">
              <option value="" class="text-gray-900">All categories</option>
              <option v-for="category in categories" :key="category" :value="category" class="text-gray-900">
                {{ formatLabel(category) }}
              </option>
            </select>

            <select v-model="filterStatus" class="admin-select" @change="resetAndFetch">
              <option value="" class="text-gray-900">All status</option>
              <option v-for="status in statuses" :key="status" :value="status" class="text-gray-900">
                {{ formatLabel(status) }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 border-b admin-divider px-4 py-3 text-sm text-primary-100 sm:flex-row sm:items-center sm:justify-between">
        <span>{{ pagination.total || filteredOpportunities.length }} opportunities found</span>
        <span>Page {{ pagination.page || page }} of {{ pagination.pages || 1 }}</span>
      </div>

      <div v-if="isLoading" class="space-y-4 p-5">
        <LoadingSkeleton v-for="n in 6" :key="n" type="list" />
      </div>

      <EmptyState
        v-else-if="!filteredOpportunities.length"
        title="No opportunities found"
        description="Try adjusting filters or refreshing the opportunity list."
        :icon="BriefcaseIcon"
      />

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[920px] text-left">
          <thead class="admin-table-head">
            <tr>
              <th class="px-5 py-3 font-semibold">Opportunity</th>
              <th class="px-5 py-3 font-semibold">Category</th>
              <th class="px-5 py-3 font-semibold">Status</th>
              <th class="px-5 py-3 font-semibold">Performance</th>
              <th class="px-5 py-3 font-semibold">Deadline</th>
              <th class="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="opportunity in filteredOpportunities" :key="opportunity._id" class="admin-row">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-500/15 text-primary-100">
                    <img
                      v-if="opportunity.coverImage?.url"
                      :src="opportunity.coverImage.url"
                      :alt="opportunity.title"
                      class="h-full w-full object-cover"
                    />
                    <BriefcaseIcon v-else class="h-5 w-5" />
                  </div>
                  <div class="min-w-0">
                    <router-link :to="`/opportunities/${opportunity._id}`" class="block truncate font-semibold text-white hover:text-primary-100">
                      {{ opportunity.title }}
                    </router-link>
                    <p class="truncate text-xs text-primary-100">
                      {{ opportunity.organization?.organizationName || "Unknown organization" }} • {{ opportunity.location || "No location" }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4">
                <span class="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-100">
                  {{ formatLabel(opportunity.category) }}
                </span>
              </td>
              <td class="px-5 py-4">
                <span :class="statusClass(opportunity.status)">
                  {{ formatLabel(opportunity.status) }}
                </span>
              </td>
              <td class="px-5 py-4">
                <div class="flex flex-col gap-1 text-sm text-primary-50">
                  <span class="inline-flex items-center gap-2">
                    <UsersIcon class="h-4 w-4 text-accent-100" />
                    {{ opportunity.applicationCount || 0 }} applicants
                  </span>
                  <span class="inline-flex items-center gap-2 text-primary-100">
                    <EyeIcon class="h-4 w-4 text-accent-100" />
                    {{ opportunity.views || 0 }} views
                  </span>
                </div>
              </td>
              <td class="px-5 py-4">
                <p class="text-sm font-medium text-white">{{ formatDate(opportunity.deadline) }}</p>
                <p :class="['text-xs', isExpired(opportunity.deadline) ? 'text-red-200' : 'text-primary-100']">
                  {{ deadlineLabel(opportunity.deadline) }}
                </p>
              </td>
              <td class="px-5 py-4">
                <div class="flex justify-end gap-2">
                  <button
                    v-if="opportunity.status !== 'active'"
                    class="rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                    @click="changeStatus(opportunity, 'active')"
                  >
                    Activate
                  </button>
                  <button
                    v-if="opportunity.status === 'active'"
                    class="rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/20"
                    @click="changeStatus(opportunity, 'closed')"
                  >
                    Close
                  </button>
                  <button
                    class="rounded-lg border border-red-400/20 bg-red-500/10 p-2 text-red-200 transition hover:bg-red-500/20"
                    title="Delete opportunity"
                    @click="deleteOpportunity(opportunity)"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
import { computed, onMounted, ref, watch } from "vue";
import {
  ArrowPathIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  UsersIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";

import EmptyState from "@/components/ui/EmptyState.vue";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton.vue";
import Pagination from "@/components/ui/Pagination.vue";
import PrimaryButton from "@/components/ui/PrimaryButton.vue";
import { useToast } from "@/composables/useToast";
import { adminService } from "@/services/adminService";

const toast = useToast();

const opportunities = ref([]);
const isLoading = ref(true);
const search = ref("");
const filterCategory = ref("");
const filterStatus = ref("");
const page = ref(1);
const pagination = ref({ page: 1, pages: 1, total: 0 });

const categories = ["job", "scholarship", "grant", "training", "internship", "fellowship", "entrepreneurship"];
const statuses = ["active", "closed", "draft", "expired"];

const filteredOpportunities = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return opportunities.value;

  return opportunities.value.filter((item) => {
    return [
      item.title,
      item.location,
      item.category,
      item.organization?.organizationName,
      item.postedBy?.fullName,
      item.postedBy?.email,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(term));
  });
});

const metrics = computed(() => {
  const source = opportunities.value;
  return [
    {
      label: "Total Listings",
      value: pagination.value.total || source.length,
      caption: "Matching current filters",
      icon: BriefcaseIcon,
      iconClass: "bg-blue-500/20",
    },
    {
      label: "Active",
      value: source.filter((item) => item.status === "active").length,
      caption: "Open to applicants",
      icon: CheckCircleIcon,
      iconClass: "bg-emerald-500/20",
    },
    {
      label: "Draft or Closed",
      value: source.filter((item) => ["draft", "closed"].includes(item.status)).length,
      caption: "Not currently accepting",
      icon: XCircleIcon,
      iconClass: "bg-amber-500/20",
    },
    {
      label: "Expired",
      value: source.filter((item) => item.status === "expired" || isExpired(item.deadline)).length,
      caption: "Past deadline",
      icon: ClockIcon,
      iconClass: "bg-red-500/20",
    },
  ];
});

let timeout = null;

watch(search, () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    page.value = 1;
  }, 250);
});

const fetchOpps = async () => {
  isLoading.value = true;

  try {
    const { data } = await adminService.getOpportunities({
      category: filterCategory.value || undefined,
      status: filterStatus.value || undefined,
      page: page.value,
      limit: 20,
    });

    opportunities.value = data.data || [];
    pagination.value = data.meta || { page: page.value, pages: 1, total: opportunities.value.length };
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to load opportunities");
  } finally {
    isLoading.value = false;
  }
};

const resetAndFetch = () => {
  page.value = 1;
  fetchOpps();
};

const resetFilters = () => {
  search.value = "";
  filterCategory.value = "";
  filterStatus.value = "";
  page.value = 1;
  fetchOpps();
};

const pageChanged = (p) => {
  page.value = p;
  fetchOpps();
};

const changeStatus = async (row, status) => {
  try {
    const { data } = await adminService.updateOpportunityStatus(row._id, status);
    Object.assign(row, data.data || { status });
    toast.success(`Opportunity ${status}`);
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to update opportunity");
  }
};

const deleteOpportunity = async (row) => {
  if (!window.confirm(`Delete "${row.title}"?`)) return;

  try {
    await adminService.deleteOpportunity(row._id);
    opportunities.value = opportunities.value.filter((item) => item._id !== row._id);
    toast.success("Opportunity deleted");
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to delete opportunity");
  }
};

const formatLabel = (value) => {
  if (!value) return "Not set";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (value) => {
  if (!value) return "No deadline";
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const isExpired = (value) => {
  if (!value) return false;
  return new Date(value).getTime() < Date.now();
};

const deadlineLabel = (value) => {
  if (!value) return "Not scheduled";
  if (isExpired(value)) return "Deadline passed";
  return "Upcoming deadline";
};

const statusClass = (status) => {
  const classes = {
    active: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
    closed: "border-primary-300/40 bg-primary-900 text-primary-50",
    draft: "border-amber-400/20 bg-amber-500/10 text-amber-100",
    expired: "border-red-400/20 bg-red-500/10 text-red-100",
  };

  return `inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${classes[status] || "border-primary-400/40 bg-primary-900 text-primary-50"}`;
};

onMounted(fetchOpps);
</script>

<style scoped>
.admin-select {
  height: 2.75rem;
  border-radius: 0.75rem;
  border: 1px solid rgb(77 172 190 / 0.4);
  background: #002b39;
  padding: 0 0.75rem;
  color: white;
  font-size: 0.875rem;
  outline: none;
}

.admin-select:focus {
  border-color: rgb(96 165 250 / 0.85);
  box-shadow: 0 0 0 2px rgb(96 165 250 / 0.2);
}
</style>
