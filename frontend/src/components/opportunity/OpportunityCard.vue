<template>
  <div
    class="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#01596D]/20 hover:shadow-2xl"
  >
    <!-- ========================================= -->
    <!-- Cover Image -->
    <!-- ========================================= -->

    <div class="relative h-56 overflow-hidden">
      <img
        v-if="opportunity.coverImage?.url"
        :src="opportunity.coverImage.url"
        :alt="opportunity.title"
        class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        loading="lazy"
      />

      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#01596D]/15 via-[#027B8C]/10 to-[#F3D646]/20"
      >
        <span class="text-6xl font-bold text-[#01596D]/20">
          {{ orgInitial }}
        </span>
      </div>

      <!-- Dark Gradient -->

      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
      ></div>

      <!-- Category Badge -->

      <div class="absolute left-5 top-5">
        <span
          :class="[
            'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-lg backdrop-blur-md',
            categoryBadgeClass,
          ]"
        >
          {{ categoryLabel }}
        </span>
      </div>

      <!-- Save Button -->

      <div v-if="isAuthenticated && isRefugee" class="absolute right-5 top-5">
        <button
          @click.prevent="toggleSave"
          :aria-label="
            opportunity.isSaved ? 'Remove from saved' : 'Save opportunity'
          "
          class="rounded-2xl bg-white/80 p-2 backdrop-blur-md transition hover:scale-110 hover:bg-white"
        >
          <svg
            class="h-5 w-5"
            :fill="opportunity.isSaved ? 'currentColor' : 'none'"
            :class="opportunity.isSaved ? 'text-[#F3D646]' : 'text-slate-600'"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- ========================================= -->
    <!-- Body -->
    <!-- ========================================= -->

    <div class="flex flex-1 flex-col p-6">
      <!-- Organization -->

      <div class="flex items-center gap-4">
        <div
          class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
        >
          <img
            v-if="opportunity.organization?.logo?.url"
            :src="opportunity.organization.logo.url"
            :alt="opportunity.organization.organizationName"
            class="h-full w-full object-cover"
            loading="lazy"
          />

          <span v-else class="text-lg font-bold text-[#01596D]">
            {{ orgInitial }}
          </span>
        </div>

        <div class="min-w-0 flex-1">
          <h4 class="truncate text-sm font-semibold text-[#01596D]">
            {{ opportunity.organization?.organizationName }}
          </h4>

          <div
            v-if="opportunity.organization?.isVerified"
            class="mt-1 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
          >
            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z"
                clip-rule="evenodd"
              />
            </svg>

            Verified Organization
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- Opportunity Title -->
      <!-- ========================================= -->

      <div class="mt-6">
        <h3
          class="text-xl font-bold leading-snug text-slate-900 line-clamp-2 transition-colors duration-300 group-hover:text-[#01596D]"
        >
          {{ opportunity.title }}
        </h3>

        <p class="mt-3 text-sm leading-7 text-slate-500 line-clamp-3">
          {{ opportunity.description }}
        </p>
      </div>

      <!-- ========================================= -->
      <!-- Opportunity Information -->
      <!-- ========================================= -->

      <div class="mt-6 space-y-3">
        <!-- Location -->

        <div class="flex items-center gap-3 text-sm text-slate-600">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#01596D]/10"
          >
            <svg
              class="h-5 w-5 text-[#01596D]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
              />

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          <span class="truncate">
            {{ opportunity.location }}
          </span>
        </div>

        <!-- Remote -->

        <div
          v-if="opportunity.isRemote"
          class="flex items-center gap-3 text-sm font-medium text-green-600"
        >
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 15a4 4 0 014-4h1a5 5 0 019.584-1.879A3.5 3.5 0 1118.5 16H7a4 4 0 01-4-1z"
              />
            </svg>
          </div>

          <span> Remote Opportunity </span>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- Spacer -->
      <!-- ========================================= -->

      <div class="flex-1"></div>

      <!-- ========================================= -->
      <!-- Footer -->
      <!-- ========================================= -->

      <div class="mt-8 border-t border-slate-100 pt-5">
        <div class="flex items-center justify-between gap-4">
          <!-- Deadline -->

          <div>
            <p class="text-xs uppercase tracking-wider text-slate-400">
              Application Deadline
            </p>

            <div class="mt-1 flex items-center gap-2">
              <svg
                class="h-4 w-4 text-[#01596D]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3"
                />

                <circle cx="12" cy="12" r="9" stroke-width="2" />
              </svg>

              <span :class="['text-sm font-semibold', deadlineUrgencyClass]">
                {{ deadlineText }}
              </span>
            </div>
          </div>

          <!-- Button -->

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              @click="shareOpportunity"
              class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Share2 class="w-4 h-4" />
              Share
            </button>
            <router-link
              :to="`/opportunities/${opportunity._id}`"
              class="inline-flex items-center gap-2 rounded-2xl bg-[#01596D] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#027B8C] hover:shadow-xl"
            >
              View Details

              <svg
                class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Accent -->

    <div
      class="h-1 w-full bg-gradient-to-r from-[#01596D] via-[#027B8C] to-[#F3D646]"
    ></div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { userService } from "@/services/userService";
import { useToast } from "@/composables/useToast";

import {
  categoryLabel as getCategoryLabel,
  deadlineLabel,
  deadlineUrgency,
  getInitials,
} from "@/utils/helpers";
import { Share2 } from "lucide-vue-next";

const props = defineProps({
  opportunity: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["saved", "unsaved"]);

const authStore = useAuthStore();
const toast = useToast();

/* --------------------------------------------
 * Authentication
 * ------------------------------------------ */

const isAuthenticated = computed(() => authStore.isAuthenticated);

const isRefugee = computed(() => authStore.isRefugee);

/* --------------------------------------------
 * Computed Data
 * ------------------------------------------ */

const orgInitial = computed(() =>
  getInitials(props.opportunity.organization?.organizationName || "?"),
);

const categoryLabel = computed(() =>
  getCategoryLabel(props.opportunity.category),
);

const categoryBadgeClass = computed(
  () => `badge-${props.opportunity.category}`,
);

const deadlineText = computed(() => deadlineLabel(props.opportunity.deadline));

const deadlineUrgencyClass = computed(() => {
  const urgency = deadlineUrgency(props.opportunity.deadline);

  return (
    {
      expired: "text-red-600",

      urgent: "text-orange-600",

      soon: "text-amber-500",

      normal: "text-slate-500",
    }[urgency] || "text-slate-500"
  );
});

/* --------------------------------------------
 * Save / Unsave Opportunity
 * ------------------------------------------ */

const shareOpportunity = async () => {
  const url = `${window.location.origin}/opportunities/${props.opportunity._id}`;
  const title = props.opportunity.title;
  const text = `${title} at ${props.opportunity.organization?.organizationName || "Opportunity Hub"}`;

  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      toast.success("Share dialog opened.");
      return;
    }

    await navigator.clipboard.writeText(url);
    toast.success("Opportunity link copied. Paste it into any social media platform.");
  } catch (err) {
    toast.error(
      err?.response?.data?.message ||
        "Unable to share opportunity. Please try again.",
    );
  }
};

const toggleSave = async () => {
  try {
    if (props.opportunity.isSaved) {
      await userService.unsaveOpportunity(props.opportunity._id);

      props.opportunity.isSaved = false;

      toast.success("Removed from saved opportunities");

      emit("unsaved", props.opportunity._id);
    } else {
      await userService.saveOpportunity(props.opportunity._id);

      props.opportunity.isSaved = true;

      toast.success("Opportunity saved successfully");

      emit("saved", props.opportunity._id);
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Failed to update saved opportunities.",
    );
  }
};
</script>
