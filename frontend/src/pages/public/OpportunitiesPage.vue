<template>
  <div class="min-h-screen bg-slate-50">
    <!-- ================= HERO ================= -->
    <section
      class="relative overflow-hidden bg-gradient-to-r from-[#01596D] via-[#01778F] to-[#0294A5]"
    >
      <!-- Background decoration -->
      <div
        class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F3D646]/10 blur-3xl"
      ></div>

      <div
        class="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 blur-3xl"
      ></div>

      <div class="relative page-container py-14 sm:py-20">
        <div class="max-w-4xl">
          <div
            class="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm text-white mb-6"
          >
            <Compass class="w-4 h-4 text-[#F3D646]" />

            <span> Discover verified opportunities across Africa </span>
          </div>

          <h1
            class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
          >
            Find Your Next
            <span class="text-[#F3D646]"> Opportunity </span>
          </h1>

          <p
            class="mt-5 sm:mt-6 text-base sm:text-xl text-slate-200 max-w-3xl leading-relaxed"
          >
            Explore jobs, scholarships, grants, fellowships, internships and
            entrepreneurship programmes from trusted organizations.
          </p>

          <!-- Search -->
          <div
            class="mt-8 sm:mt-10 bg-white rounded-2xl shadow-2xl p-2 sm:p-3 max-w-3xl"
          >
            <SearchBar
              v-model="filters.search"
              placeholder="Search opportunities, organizations or keywords..."
              @search="applyFilters"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ================= STATS ================= -->

    <section class="-mt-8 sm:-mt-12 relative z-20">
      <div class="page-container">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <!-- Total Opportunities -->

          <div
            class="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-100 p-4 sm:p-6 hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            <div class="flex justify-between">
              <div>
                <p class="text-xs sm:text-sm text-slate-500">Opportunities</p>

                <h2
                  class="text-2xl sm:text-4xl font-bold text-[#01596D] mt-1 sm:mt-2"
                >
                  {{ pagination.total }}
                </h2>
              </div>

              <div
                class="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-[#01596D]/10 flex items-center justify-center flex-shrink-0"
              >
                <BriefcaseBusiness
                  class="w-5 h-5 sm:w-7 sm:h-7 text-[#01596D]"
                />
              </div>
            </div>
          </div>

          <!-- Categories -->

          <div
            class="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-100 p-4 sm:p-6 hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            <div class="flex justify-between">
              <div>
                <p class="text-xs sm:text-sm text-slate-500">Categories</p>

                <h2
                  class="text-2xl sm:text-4xl font-bold text-[#01596D] mt-1 sm:mt-2"
                >
                  {{ categories.length }}
                </h2>
              </div>

              <div
                class="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-yellow-100 flex items-center justify-center flex-shrink-0"
              >
                <Layers3 class="w-5 h-5 sm:w-7 sm:h-7 text-[#F3D646]" />
              </div>
            </div>
          </div>

          <!-- Organizations -->

          <div
            class="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-100 p-4 sm:p-6 hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            <div class="flex justify-between">
              <div>
                <p class="text-xs sm:text-sm text-slate-500">Organizations</p>

                <h2
                  class="text-2xl sm:text-4xl font-bold text-[#01596D] mt-1 sm:mt-2"
                >
                  {{ organizationCount }}
                </h2>
              </div>

              <div
                class="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0"
              >
                <Building2 class="w-5 h-5 sm:w-7 sm:h-7 text-green-600" />
              </div>
            </div>
          </div>

          <!-- Active -->

          <div
            class="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-100 p-4 sm:p-6 hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            <div class="flex justify-between">
              <div>
                <p class="text-xs sm:text-sm text-slate-500">Active Listings</p>

                <h2
                  class="text-2xl sm:text-4xl font-bold text-[#01596D] mt-1 sm:mt-2"
                >
                  {{ opportunities.length }}
                </h2>
              </div>

              <div
                class="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0"
              >
                <TrendingUp class="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= CATEGORY FILTERS ================= -->

    <section class="py-10">
      <div class="page-container">
        <div class="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-slate-800">
                Browse Categories
              </h2>

              <p class="text-slate-500 mt-1">
                Filter opportunities by category
              </p>
            </div>
          </div>

          <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              @click="setCategory('')"
              :class="[
                'flex items-center gap-2 px-5 py-3 rounded-2xl transition-all whitespace-nowrap font-medium',
                !filters.category
                  ? 'bg-[#01596D] text-white shadow-lg'
                  : 'bg-slate-100 hover:bg-[#01596D] hover:text-white',
              ]"
            >
              <Grid2x2 class="w-5 h-5" />

              All
            </button>

            <button
              v-for="cat in categories"
              :key="cat.value"
              @click="setCategory(cat.value)"
              :class="[
                'flex items-center gap-2 px-5 py-3 rounded-2xl transition-all whitespace-nowrap font-medium',
                filters.category === cat.value
                  ? 'bg-[#01596D] text-white shadow-lg'
                  : 'bg-slate-100 hover:bg-[#01596D] hover:text-white',
              ]"
            >
              <component :is="cat.icon" class="w-5 h-5" />

              {{ cat.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CONTINUE IN PART 2 ===== -->
    <!-- ================= CONTENT ================= -->

    <section class="pb-16">
      <div class="page-container">
        <div class="grid lg:grid-cols-12 gap-8">
          <!-- ================= FILTERS ================= -->

          <aside class="lg:col-span-3">
            <div
              class="sticky top-24 bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden"
            >
              <!-- Header -->

              <div
                class="bg-gradient-to-r from-[#01596D] to-[#027B8C] p-5 text-white"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <SlidersHorizontal class="w-5 h-5" />

                    <h3 class="font-semibold">Filters</h3>
                  </div>

                  <button
                    @click="resetFilters"
                    class="text-sm text-[#F3D646] hover:underline"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div class="p-5">
                <OpportunityFilters
                  v-model:filters="filters"
                  @update:filters="updateFilter"
                  @reset="resetFilters"
                />
              </div>
            </div>
          </aside>

          <!-- ================= RESULTS ================= -->

          <main class="lg:col-span-9">
            <!-- Toolbar -->

            <div
              class="bg-white rounded-3xl border border-slate-200 shadow-md p-5 mb-6"
            >
              <div
                class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
              >
                <!-- Left -->

                <div>
                  <h2 class="text-2xl font-bold text-slate-800">
                    {{ pagination.total }}

                    Opportunities Found
                  </h2>

                  <p class="text-slate-500 mt-1">
                    Browse verified opportunities from trusted organizations.
                  </p>
                </div>

                <!-- Right -->

                <div class="flex items-center gap-3 flex-wrap">
                  <button
                    @click="showFilters = !showFilters"
                    class="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:border-[#01596D]"
                  >
                    <Filter class="w-4 h-4" />

                    Filters
                  </button>

                  <select
                    v-model="filters.sort"
                    @change="applyFilters"
                    class="rounded-xl border border-slate-200 px-4 py-3 bg-white focus:ring-2 focus:ring-[#01596D]"
                  >
                    <option value="-createdAt">Newest</option>

                    <option value="deadline">Closing Soon</option>

                    <option value="title">A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Mobile Filters -->

            <div v-if="showFilters" class="lg:hidden mb-6">
              <div
                class="bg-white rounded-3xl shadow-md border border-slate-200 p-5"
              >
                <OpportunityFilters
                  v-model:filters="filters"
                  @update:filters="updateFilter"
                  @reset="resetFilters"
                />
              </div>
            </div>

            <!-- ================= LOADING ================= -->

            <div
              v-if="isLoading"
              class="grid md:grid-cols-2 xl:grid-cols-2 gap-6"
            >
              <div
                v-for="n in 8"
                :key="n"
                class="bg-white rounded-3xl shadow-md border border-slate-200 p-6"
              >
                <div class="animate-pulse">
                  <div class="flex gap-4">
                    <div class="w-16 h-16 rounded-2xl bg-slate-200"></div>

                    <div class="flex-1">
                      <div class="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>

                      <div class="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>

                  <div class="h-4 bg-slate-200 rounded mt-6"></div>

                  <div class="h-4 bg-slate-200 rounded mt-3 w-5/6"></div>

                  <div class="flex gap-2 mt-6">
                    <div class="w-20 h-8 rounded-full bg-slate-200"></div>

                    <div class="w-24 h-8 rounded-full bg-slate-200"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= OPPORTUNITIES ================= -->

            <div
              v-else-if="opportunities.length"
              class="grid xl:grid-cols-2 gap-6"
            >
              <OpportunityCard
                v-for="opp in opportunities"
                :key="opp._id"
                :opportunity="opp"
                class="transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              />
            </div>

            <!-- ================= EMPTY ================= -->

            <div
              v-else
              class="bg-white rounded-3xl border border-slate-200 shadow-md p-16 text-center"
            >
              <div
                class="mx-auto w-24 h-24 rounded-full bg-[#01596D]/10 flex items-center justify-center"
              >
                <SearchX class="w-10 h-10 text-[#01596D]" />
              </div>

              <h3 class="text-3xl font-bold text-slate-800 mt-8">
                No Opportunities Found
              </h3>

              <p class="text-slate-500 mt-3 max-w-xl mx-auto">
                We couldn't find opportunities matching your current search. Try
                changing your filters.
              </p>

              <button
                @click="resetFilters"
                class="mt-8 bg-[#01596D] hover:bg-[#027B8C] text-white px-8 py-4 rounded-2xl font-semibold transition"
              >
                Clear Filters
              </button>
            </div>

            <!-- ================= PAGINATION ================= -->

            <div
              v-if="!isLoading && opportunities.length"
              class="mt-10 flex justify-center"
            >
              <Pagination
                :page="pagination.page"
                :pages="pagination.pages"
                :has-next="pagination.hasNext"
                :has-prev="pagination.hasPrev"
                @change="changePage"
              />
            </div>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";

import SearchBar from "@/components/common/SearchBar.vue";
import Pagination from "@/components/common/Pagination.vue";
import EmptyState from "@/components/common/EmptyState.vue";

import OpportunityCard from "@/components/opportunity/OpportunityCard.vue";
import OpportunityFilters from "@/components/opportunity/OpportunityFilters.vue";

import { opportunityService } from "@/services/opportunityService";
import { organizationService } from "@/services/organizationService";

import {
  Compass,
  Grid2x2,
  Filter,
  SearchX,
  Layers3,
  Building2,
  TrendingUp,
  BriefcaseBusiness,
  GraduationCap,
  HandCoins,
  BookOpen,
  Trophy,
  Rocket,
  FlaskConical,
  SlidersHorizontal,
} from "lucide-vue-next";

const route = useRoute();

const opportunities = ref([]);

const isLoading = ref(true);

const showFilters = ref(false);

const filters = reactive({
  search: route.query.search || "",
  category: route.query.category || "",
  location: route.query.location || "",
  sort: "-createdAt",
  remote: "",
});

const pagination = reactive({
  page: 1,
  pages: 1,
  total: 0,
  limit: 12,
  hasNext: false,
  hasPrev: false,
});

const organizationCount = ref(0);

const categories = [
  {
    value: "job",
    label: "Jobs",
    icon: BriefcaseBusiness,
  },

  {
    value: "scholarship",
    label: "Scholarships",
    icon: GraduationCap,
  },

  {
    value: "grant",
    label: "Grants",
    icon: HandCoins,
  },

  {
    value: "training",
    label: "Training",
    icon: BookOpen,
  },

  {
    value: "fellowship",
    label: "Fellowships",
    icon: Trophy,
  },

  {
    value: "internship",
    label: "Internships",
    icon: FlaskConical,
  },

  {
    value: "entrepreneurship",
    label: "Entrepreneurship",
    icon: Rocket,
  },
];

const fetchOpportunities = async () => {
  isLoading.value = true;

  try {
    const params = {
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
    };

    const { data } = await opportunityService.getOpportunities(params);

    opportunities.value = data.data;

    Object.assign(pagination, data.meta);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const fetchOrganizationCount = async () => {
  try {
    const { data } = await organizationService.getAll({ limit: 1 });
    organizationCount.value = data.meta?.total || 0;
  } catch (error) {
    console.error("Failed to load organization count:", error);
  }
};

const applyFilters = () => {
  pagination.page = 1;

  fetchOpportunities();
};

const updateFilter = (update) => {
  Object.assign(filters, update);

  pagination.page = 1;

  fetchOpportunities();
};

const setCategory = (category) => {
  filters.category = category;

  pagination.page = 1;

  fetchOpportunities();
};

const resetFilters = () => {
  Object.assign(filters, {
    search: "",

    category: "",

    location: "",

    sort: "-createdAt",

    remote: "",
  });

  pagination.page = 1;

  fetchOpportunities();
};

const changePage = (page) => {
  pagination.page = page;

  fetchOpportunities();

  window.scrollTo({
    top: 0,

    behavior: "smooth",
  });
};

onMounted(() => {
  fetchOpportunities();
  fetchOrganizationCount();
});
</script>
