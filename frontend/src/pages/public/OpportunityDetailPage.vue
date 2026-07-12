<template>
  <div>
    <LoadingSpinner v-if="isLoading" text="Loading opportunity..." />
    <div v-else-if="opportunity" class="page-container py-6 sm:py-8">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <router-link to="/opportunities" class="hover:text-primary"
          >Opportunities</router-link
        >
        <ChevronRight class="w-4 h-4 flex-shrink-0" />
        <span class="text-gray-700 truncate max-w-xs">{{
          opportunity.title
        }}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Header Card -->
          <div class="card">
            <div class="flex items-start gap-4">
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0"
              >
                <img
                  v-if="opportunity.organization?.logo?.url"
                  :src="opportunity.organization.logo.url"
                  :alt="opportunity.organization.organizationName"
                  class="w-full h-full object-cover"
                />
                <span
                  v-else
                  class="text-primary font-bold text-xl sm:text-2xl"
                  >{{ orgInitial }}</span
                >
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-start gap-2 mb-2">
                  <span :class="['badge', `badge-${opportunity.category}`]">{{
                    categoryLabel
                  }}</span>
                  <StatusBadge :status="opportunity.status" />
                </div>
                <h1
                  class="text-lg sm:text-2xl font-bold text-gray-900 leading-snug"
                >
                  {{ opportunity.title }}
                </h1>
                <p class="text-primary font-semibold mt-1">
                  {{ opportunity.organization?.organizationName }}
                </p>
                <div
                  v-if="opportunity.organization?.isVerified"
                  class="inline-flex items-center gap-1 text-xs text-green-600 mt-1"
                >
                  <BadgeCheck class="w-3.5 h-3.5" />
                  Verified Organization
                </div>
              </div>
            </div>

            <div
              class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100"
            >
              <div class="text-center">
                <p class="text-xs text-gray-400 uppercase tracking-wide">
                  Location
                </p>
                <p class="text-sm font-semibold text-gray-800 mt-1">
                  {{ opportunity.location }}
                </p>
                <p
                  v-if="opportunity.isRemote"
                  class="text-xs text-green-600 font-medium inline-flex items-center gap-1 mt-0.5"
                >
                  <Globe2 class="w-3 h-3" />
                  Remote OK
                </p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-400 uppercase tracking-wide">
                  Deadline
                </p>
                <p
                  :class="['text-sm font-semibold mt-1', deadlineUrgencyClass]"
                >
                  {{ deadlineText }}
                </p>
              </div>
              <div
                v-if="opportunity.salary || opportunity.fundingAmount"
                class="text-center"
              >
                <p class="text-xs text-gray-400 uppercase tracking-wide">
                  {{ opportunity.category === "job" ? "Salary" : "Funding" }}
                </p>
                <p class="text-sm font-semibold text-gray-800 mt-1">
                  {{ opportunity.salary || opportunity.fundingAmount }}
                </p>
              </div>
              <div v-if="opportunity.duration" class="text-center">
                <p class="text-xs text-gray-400 uppercase tracking-wide">
                  Duration
                </p>
                <p class="text-sm font-semibold text-gray-800 mt-1">
                  {{ opportunity.duration }}
                </p>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <div class="flex gap-6 w-max min-w-full">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                ]"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="card">
            <div v-if="activeTab === 'overview'">
              <h3 class="font-bold text-gray-900 mb-4">
                About This Opportunity
              </h3>
              <p
                class="text-gray-700 text-sm leading-relaxed whitespace-pre-line"
              >
                {{ opportunity.description }}
              </p>
              <div v-if="opportunity.eligibility" class="mt-6">
                <h4 class="font-bold text-gray-900 mb-2">Eligibility</h4>
                <p class="text-sm text-gray-700">
                  {{ opportunity.eligibility }}
                </p>
              </div>
              <div v-if="opportunity.benefits?.length" class="mt-6">
                <h4 class="font-bold text-gray-900 mb-3">Benefits</h4>
                <ul class="space-y-2">
                  <li
                    v-for="b in opportunity.benefits"
                    :key="b"
                    class="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <Check
                      class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                    />{{ b }}
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="activeTab === 'requirements'">
              <h3 class="font-bold text-gray-900 mb-4">Requirements</h3>
              <ul v-if="opportunity.requirements?.length" class="space-y-3">
                <li
                  v-for="r in opportunity.requirements"
                  :key="r"
                  class="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span
                    class="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <Check class="w-3 h-3" /> </span
                  >{{ r }}
                </li>
              </ul>
              <p v-else class="text-sm text-gray-500">
                No specific requirements listed.
              </p>
            </div>
            <div v-if="activeTab === 'apply'">
              <h3 class="font-bold text-gray-900 mb-4">How to Apply</h3>
              <p
                v-if="opportunity.howToApply"
                class="text-sm text-gray-700 leading-relaxed"
              >
                {{ opportunity.howToApply }}
              </p>
              <p v-else class="text-sm text-gray-700">
                Apply directly through the platform by clicking the "Apply Now"
                button.
              </p>
              <a
                v-if="opportunity.externalLink"
                :href="opportunity.externalLink"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-outline mt-4 inline-flex items-center gap-1.5"
              >
                <ExternalLink class="w-4 h-4" />
                Visit External Application Page
              </a>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="opportunity.tags?.length" class="flex flex-wrap gap-2">
            <span
              v-for="tag in opportunity.tags"
              :key="tag"
              class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
              >#{{ tag }}</span
            >
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-4">
          <!-- Apply Card -->
          <div class="card lg:sticky lg:top-20">
            <h3 class="font-bold text-gray-900 mb-4">
              Apply for This Opportunity
            </h3>
            <div
              v-if="opportunity.hasApplied"
              class="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium text-center mb-4 flex items-center justify-center gap-2"
            >
              <CheckCircle2 class="w-4 h-4" />
              You've already applied
            </div>
            <div
              v-else-if="isExpired"
              class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center mb-4 flex items-center justify-center gap-2"
            >
              <XCircle class="w-4 h-4" />
              This opportunity has expired
            </div>

            <template
              v-if="
                isAuthenticated &&
                isRefugee &&
                !opportunity.hasApplied &&
                !isExpired
              "
            >
              <button
                @click="showApplyModal = true"
                class="btn-primary w-full btn-lg"
              >
                Apply Now
              </button>
            </template>
            <template v-else-if="!isAuthenticated">
              <router-link
                to="/register"
                class="btn-primary w-full btn-lg text-center block"
                >Register to Apply</router-link
              >
              <router-link
                to="/login"
                class="btn-ghost w-full text-center mt-2 block text-sm"
                >Already have an account? Sign in</router-link
              >
            </template>

            <div
              class="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm text-gray-600"
            >
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Applications</span
                ><span class="font-semibold">{{
                  opportunity.applicationCount
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Views</span
                ><span class="font-semibold">{{ opportunity.views }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Posted</span
                ><span class="font-semibold">{{
                  formatDate(opportunity.createdAt)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Organization Card -->
          <div class="card">
            <h4 class="font-bold text-gray-900 mb-3 text-sm">
              About the Organization
            </h4>
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border flex-shrink-0"
              >
                <img
                  v-if="opportunity.organization?.logo?.url"
                  :src="opportunity.organization.logo.url"
                  class="w-full h-full object-cover"
                  :alt="opportunity.organization.organizationName"
                />
                <span v-else class="text-primary font-bold text-sm">{{
                  orgInitial
                }}</span>
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-gray-900 text-sm truncate">
                  {{ opportunity.organization?.organizationName }}
                </p>
                <p
                  v-if="opportunity.organization?.country"
                  class="text-xs text-gray-500 flex items-center gap-1"
                >
                  <MapPin class="w-3 h-3 flex-shrink-0" />
                  {{ opportunity.organization.country }}
                </p>
              </div>
            </div>
            <a
              v-if="opportunity.organization?.website"
              :href="opportunity.organization.website"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-primary hover:underline flex items-center gap-1.5"
            >
              <Globe2 class="w-4 h-4" />
              Visit Website
            </a>
          </div>
        </div>
      </div>
    </div>
    <EmptyState
      v-else
      title="Opportunity Not Found"
      description="This opportunity may have been removed or doesn't exist."
    >
      <template #icon>
        <SearchX class="w-10 h-10" />
      </template>
      <router-link to="/opportunities" class="btn-primary"
        >Browse All Opportunities</router-link
      >
    </EmptyState>

    <!-- Apply Modal -->
    <AppModal v-model="showApplyModal" title="Submit Application" size="md">
      <ApplicationForm
        :opportunity="opportunity"
        @close="showApplyModal = false"
        @submitted="
          opportunity.hasApplied = true;
          showApplyModal = false;
        "
      />
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import StatusBadge from "@/components/common/StatusBadge.vue";
import AppModal from "@/components/common/AppModal.vue";
import ApplicationForm from "@/components/application/ApplicationForm.vue";
import { opportunityService } from "@/services/opportunityService";
import { useAuthStore } from "@/stores/authStore";
import {
  categoryLabel as getCategoryLabel,
  deadlineLabel,
  deadlineUrgency,
  formatDate,
  getInitials,
} from "@/utils/helpers";
import {
  ChevronRight,
  BadgeCheck,
  Globe2,
  Check,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MapPin,
  SearchX,
} from "lucide-vue-next";

const route = useRoute();
const authStore = useAuthStore();
const opportunity = ref(null);
const isLoading = ref(true);
const showApplyModal = ref(false);
const activeTab = ref("overview");

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isRefugee = computed(() => authStore.isRefugee);
const orgInitial = computed(() =>
  getInitials(opportunity.value?.organization?.organizationName || "?"),
);
const categoryLabel = computed(() =>
  getCategoryLabel(opportunity.value?.category),
);
const deadlineText = computed(() => deadlineLabel(opportunity.value?.deadline));
const isExpired = computed(
  () =>
    opportunity.value?.deadline &&
    new Date(opportunity.value.deadline) < new Date(),
);
const deadlineUrgencyClass = computed(
  () =>
    ({
      expired: "text-red-600",
      urgent: "text-orange-600",
      soon: "text-yellow-600",
      normal: "text-gray-800",
    })[deadlineUrgency(opportunity.value?.deadline)] || "text-gray-800",
);

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "requirements", label: "Requirements" },
  { id: "apply", label: "How to Apply" },
];

onMounted(async () => {
  try {
    const { data } = await opportunityService.getOpportunityById(
      route.params.id,
    );
    opportunity.value = data.data;
  } catch {
    /* silent */
  } finally {
    isLoading.value = false;
  }
});
</script>
