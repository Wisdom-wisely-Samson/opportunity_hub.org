<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-primary overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div
          class="absolute top-10 right-10 w-72 h-72 bg-accent rounded-full blur-3xl"
        ></div>
        <div
          class="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"
        ></div>
      </div>
      <div class="relative page-container py-16 sm:py-24 lg:py-28">
        <div class="max-w-3xl">
          <div
            class="inline-flex items-center gap-2 bg-white/10 text-accent text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/20"
          >
            <Globe2 class="w-4 h-4" />
            Serving East Africa & Beyond
          </div>
          <h1
            class="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
          >
            Opening Doors to
            <span class="text-accent">Equal Opportunities</span>
          </h1>
          <p
            class="text-primary-200 text-base sm:text-xl mt-6 leading-relaxed max-w-2xl"
          >
            Opportunity Hub connects refugees and underserved communities to
            jobs, scholarships, grants, training programs, fellowships, and
            internships posted by leading NGOs, employers, and universities.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 mt-8">
            <router-link
              to="/opportunities"
              class="btn-accent btn-lg text-center inline-flex items-center justify-center gap-2"
            >
              <Search class="w-5 h-5" />
              Browse Opportunities
            </router-link>
            <router-link
              to="/register"
              class="btn-outline-white btn-lg text-center inline-flex items-center justify-center gap-2"
            >
              <Sparkles class="w-5 h-5" />
              Join Free Today
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="relative -mt-8 sm:-mt-10 z-20">
      <div class="page-container">
        <div
          class="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center px-6 py-8 sm:px-10 sm:py-10"
        >
          <div v-for="stat in stats" :key="stat.label">
            <p class="text-2xl sm:text-4xl font-bold text-primary">
              {{ stat.value }}
            </p>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="pt-16 pb-16 sm:pt-20 bg-gray-50">
      <div class="page-container">
        <div class="text-center mb-10">
          <h2 class="section-title">Explore by Category</h2>
          <p class="section-subtitle">Find exactly what you're looking for</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <router-link
            v-for="cat in categories"
            :key="cat.slug"
            :to="`/opportunities?category=${cat.slug}`"
            class="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:border-primary hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
          >
            <div
              class="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-primary transition-colors duration-200"
            >
              <component :is="cat.icon" class="w-6 h-6" />
            </div>
            <span
              class="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors text-center"
              >{{ cat.label }}</span
            >
            <span v-if="categoryStats[cat.slug]" class="text-xs text-gray-400"
              >{{ categoryStats[cat.slug] }} open</span
            >
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Opportunities -->
    <section class="py-16 bg-white">
      <div class="page-container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="section-title">Latest Opportunities</h2>
            <p class="section-subtitle">Fresh opportunities posted this week</p>
          </div>
          <router-link
            to="/opportunities"
            class="btn-outline hidden sm:inline-flex items-center gap-1.5"
          >
            View All
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>

        <div
          v-if="loadingFeatured"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="n in 6"
            :key="n"
            class="bg-white rounded-xl border border-gray-100 p-5 space-y-3"
          >
            <div class="skeleton h-4 w-3/4"></div>
            <div class="skeleton h-4 w-1/2"></div>
            <div class="skeleton h-16 w-full mt-2"></div>
          </div>
        </div>
        <div
          v-else-if="featured.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <OpportunityCard
            v-for="opp in featured"
            :key="opp._id"
            :opportunity="opp"
          />
        </div>
        <router-link
          to="/opportunities"
          class="btn-primary mt-6 w-full sm:hidden text-center flex items-center justify-center gap-1.5"
        >
          View All Opportunities
          <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-16 bg-gray-50">
      <div class="page-container">
        <div class="text-center mb-12">
          <h2 class="section-title">How It Works</h2>
          <p class="section-subtitle">Simple steps to start your journey</p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <!-- For Refugees -->
          <div
            class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm"
          >
            <h3
              class="text-lg font-bold text-primary mb-6 flex items-center gap-2"
            >
              <span
                class="w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <User class="w-4 h-4" />
              </span>
              For Refugees & Applicants
            </h3>
            <div class="space-y-4">
              <div
                v-for="(step, i) in refugeeSteps"
                :key="i"
                class="flex gap-4"
              >
                <div
                  class="w-9 h-9 bg-accent text-primary-900 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                >
                  {{ i + 1 }}
                </div>
                <div>
                  <p class="font-semibold text-gray-900 text-sm">
                    {{ step.title }}
                  </p>
                  <p class="text-sm text-gray-500 mt-0.5">{{ step.desc }}</p>
                </div>
              </div>
            </div>
            <router-link to="/register" class="btn-primary mt-6 inline-flex"
              >Register as Refugee</router-link
            >
          </div>
          <!-- For Organizations -->
          <div
            class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm"
          >
            <h3
              class="text-lg font-bold text-primary mb-6 flex items-center gap-2"
            >
              <span
                class="w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <Building2 class="w-4 h-4" />
              </span>
              For Organizations
            </h3>
            <div class="space-y-4">
              <div v-for="(step, i) in orgSteps" :key="i" class="flex gap-4">
                <div
                  class="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                >
                  {{ i + 1 }}
                </div>
                <div>
                  <p class="font-semibold text-gray-900 text-sm">
                    {{ step.title }}
                  </p>
                  <p class="text-sm text-gray-500 mt-0.5">{{ step.desc }}</p>
                </div>
              </div>
            </div>
            <router-link
              to="/register?role=organization"
              class="btn-outline mt-6 inline-flex"
              >Register Organization</router-link
            >
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="bg-accent py-14">
      <div class="page-container text-center">
        <h2 class="text-2xl sm:text-4xl font-bold text-primary-900">
          Ready to Find Your Next Opportunity?
        </h2>
        <p class="text-primary-700 mt-3 text-base sm:text-lg max-w-xl mx-auto">
          Join thousands of refugees who have found jobs, scholarships, and
          opportunities through our platform.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <router-link to="/register" class="btn-primary btn-lg"
            >Create Free Account</router-link
          >
          <router-link
            to="/opportunities"
            class="bg-primary-900 text-white px-7 py-3.5 rounded-lg font-bold hover:bg-primary-800 transition-colors inline-flex items-center justify-center"
            >Browse Opportunities</router-link
          >
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import OpportunityCard from "@/components/opportunity/OpportunityCard.vue";
import { opportunityService } from "@/services/opportunityService";
import {
  Globe2,
  Search,
  Sparkles,
  ArrowRight,
  User,
  Building2,
  BriefcaseBusiness,
  GraduationCap,
  HandCoins,
  BookOpen,
  Trophy,
  FlaskConical,
} from "lucide-vue-next";

const featured = ref([]);
const loadingFeatured = ref(true);
const categoryStats = ref({});

const stats = [
  { value: "500+", label: "Opportunities" },
  { value: "120+", label: "Organizations" },
  { value: "8,000+", label: "Refugees Helped" },
  { value: "15+", label: "Countries" },
];

const categories = [
  { slug: "job", label: "Jobs", icon: BriefcaseBusiness },
  { slug: "scholarship", label: "Scholarships", icon: GraduationCap },
  { slug: "grant", label: "Grants", icon: HandCoins },
  { slug: "training", label: "Training", icon: BookOpen },
  { slug: "fellowship", label: "Fellowships", icon: Trophy },
  { slug: "internship", label: "Internships", icon: FlaskConical },
];

const refugeeSteps = [
  {
    title: "Create Your Profile",
    desc: "Register and build your refugee profile with skills, education, and languages.",
  },
  {
    title: "Browse Opportunities",
    desc: "Search and filter hundreds of jobs, scholarships, and grants.",
  },
  {
    title: "Apply with One Click",
    desc: "Submit applications with your CV and cover letter easily.",
  },
  {
    title: "Track Your Progress",
    desc: "Monitor application statuses and receive email notifications.",
  },
];

const orgSteps = [
  {
    title: "Register Your Organization",
    desc: "Create your organization profile and submit for verification.",
  },
  {
    title: "Get Verified",
    desc: "Our team reviews and verifies your organization within 48 hours.",
  },
  {
    title: "Post Opportunities",
    desc: "Create detailed opportunity listings targeting the right candidates.",
  },
  {
    title: "Manage Applications",
    desc: "Review applicants, accept, or reject with automatic notifications.",
  },
];

onMounted(async () => {
  try {
    const [featuredRes, statsRes] = await Promise.all([
      opportunityService.getFeatured(),
      opportunityService.getCategoryStats(),
    ]);
    featured.value = featuredRes.data.data;
    statsRes.data.data.forEach((s) => {
      categoryStats.value[s._id] = s.count;
    });
  } catch {
    // silently fail
  } finally {
    loadingFeatured.value = false;
  }
});
</script>
