<template>
  <div>
    <!-- ============ HERO ============ -->
    <section class="hero">
      <!-- Ambient background layers -->
      <div class="hero-bg" aria-hidden="true">
        <div class="hero-grid"></div>
        <div class="hero-blob hero-blob--accent"></div>
        <div class="hero-blob hero-blob--soft"></div>
      </div>

      <div
        class="relative page-container pt-14 pb-20 sm:pt-24 sm:pb-28 lg:pb-32"
      >
        <div
          class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center"
        >
          <!-- Copy column -->
          <div class="max-w-3xl">
            <div class="reveal-load" style="--d: 0ms">
              <div
                class="inline-flex items-center gap-2 bg-white/10 text-accent text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/20 backdrop-blur-sm"
              >
                <Globe2 class="w-4 h-4" />
                Serving East Africa & Beyond
              </div>
            </div>

            <h1
              class="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              <span class="block reveal-load" style="--d: 90ms"
                >Opening Doors to</span
              >
              <span class="block text-accent reveal-load" style="--d: 200ms"
                >Equal Opportunities</span
              >
            </h1>

            <p
              class="reveal-load text-primary-200 text-base sm:text-xl mt-6 leading-relaxed max-w-2xl"
              style="--d: 320ms"
            >
              Opportunity Hub connects refugees and underserved communities to
              jobs, scholarships, grants, training programs, fellowships, and
              internships posted by leading NGOs, employers, and universities.
            </p>

            <div
              class="reveal-load flex flex-col sm:flex-row gap-4 mt-9"
              style="--d: 420ms"
            >
              <router-link
                to="/opportunities"
                class="btn-accent btn-lg text-center inline-flex items-center justify-center gap-2 btn-glow group"
              >
                <Search class="w-5 h-5" />
                Browse Opportunities
                <ArrowRight
                  class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </router-link>
              <router-link
                to="/register"
                class="btn-outline-white btn-lg text-center inline-flex items-center justify-center gap-2"
              >
                <Sparkles class="w-5 h-5" />
                Join Free Today
              </router-link>
            </div>

            <!-- Trust strip -->
            <div
              class="reveal-load flex flex-wrap items-center gap-x-6 gap-y-2 mt-9 text-primary-200 text-xs sm:text-sm"
              style="--d: 520ms"
            >
              <span class="inline-flex items-center gap-1.5"
                ><CircleCheck class="w-4 h-4 text-accent" />Verified NGOs</span
              >
              <span class="inline-flex items-center gap-1.5"
                ><CircleCheck class="w-4 h-4 text-accent" />Universities</span
              >
              <span class="inline-flex items-center gap-1.5"
                ><CircleCheck class="w-4 h-4 text-accent" />Employers</span
              >
              <span class="hidden sm:inline-flex items-center gap-1.5"
                ><CircleCheck class="w-4 h-4 text-accent" />Government
                Agencies</span
              >
            </div>
          </div>

          <!-- Floating live-opportunity card stack (signature element) -->
          <div
            class="reveal-load relative hidden lg:block h-[420px]"
            style="--d: 300ms"
            aria-hidden="true"
          >
            <div class="card-stack">
              <div class="stack-card stack-card--back">
                <div
                  class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
                >
                  <component :is="ghostIconA" class="w-5 h-5 text-gray-300" />
                </div>
                <div class="mt-4 h-3 w-3/4 rounded bg-gray-100"></div>
                <div class="mt-2 h-3 w-1/2 rounded bg-gray-100"></div>
              </div>
              <div class="stack-card stack-card--mid">
                <div
                  class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
                >
                  <component :is="ghostIconB" class="w-5 h-5 text-gray-300" />
                </div>
                <div class="mt-4 h-3 w-2/3 rounded bg-gray-100"></div>
                <div class="mt-2 h-3 w-1/3 rounded bg-gray-100"></div>
              </div>

              <transition name="cardswap" mode="out-in">
                <div class="stack-card stack-card--front" :key="liveIndex">
                  <div class="flex items-start justify-between">
                    <div
                      class="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
                    >
                      <component :is="liveOpportunity.icon" class="w-5 h-5" />
                    </div>
                    <span
                      class="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot"
                      ></span>
                      New
                    </span>
                  </div>
                  <p class="mt-4 font-bold text-gray-900 text-sm leading-snug">
                    {{ liveOpportunity.title }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ liveOpportunity.org }}
                  </p>
                  <div
                    class="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400"
                  >
                    <span class="inline-flex items-center gap-1"
                      ><MapPin class="w-3.5 h-3.5" />{{
                        liveOpportunity.location
                      }}</span
                    >
                    <span :class="['badge', liveOpportunity.badgeClass]">{{
                      liveOpportunity.category
                    }}</span>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Floating micro-badge -->
            <div class="float-badge">
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center flex-shrink-0"
                >
                  <TrendingUp class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-900 leading-none">
                    500+
                  </p>
                  <p class="text-[11px] text-gray-500 mt-0.5">
                    live opportunities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wave divider -->
      <svg
        class="hero-wave"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,32 C240,60 480,0 720,16 C960,32 1200,60 1440,28 L1440,60 L0,60 Z"
          fill="#f9fafb"
        />
      </svg>
    </section>

    <!-- ============ STATS BAR ============ -->
    <section class="relative -mt-8 sm:-mt-12 z-20">
      <div class="page-container">
        <div
          ref="statsRef"
          class="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center px-6 py-8 sm:px-10 sm:py-10"
        >
          <div
            v-for="(stat, i) in stats"
            :key="stat.label"
            class="reveal"
            :style="{ '--d': `${i * 80}ms` }"
          >
            <p class="text-2xl sm:text-4xl font-bold text-primary tabular-nums">
              {{ displayedStats[i] }}
            </p>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ CATEGORIES ============ -->
    <section class="pt-16 pb-16 sm:pt-20 bg-gray-50">
      <div class="page-container">
        <div class="text-center mb-10 reveal">
          <h2 class="section-title">Explore by Category</h2>
          <p class="section-subtitle">Find exactly what you're looking for</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <router-link
            v-for="(cat, i) in categories"
            :key="cat.slug"
            :to="`/opportunities?category=${cat.slug}`"
            class="reveal flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:border-primary hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
            :style="{ '--d': `${i * 60}ms` }"
          >
            <div
              class="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-primary transition-colors duration-200 group-hover:rotate-6"
            >
              <component
                :is="cat.icon"
                class="w-6 h-6 transition-transform duration-200"
              />
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

    <!-- ============ FEATURED OPPORTUNITIES ============ -->
    <section class="py-16 bg-white">
      <div class="page-container">
        <div class="reveal flex items-center justify-between mb-8">
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
          <div
            v-for="(opp, i) in featured"
            :key="opp._id"
            class="reveal"
            :style="{ '--d': `${i * 70}ms` }"
          >
            <OpportunityCard :opportunity="opp" />
          </div>
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

    <!-- ============ HOW IT WORKS ============ -->
    <section class="py-16 bg-gray-50">
      <div class="page-container">
        <div class="text-center mb-12 reveal">
          <h2 class="section-title">How It Works</h2>
          <p class="section-subtitle">Simple steps to start your journey</p>
        </div>
        <div
          class="how-it-works-grid grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          <!-- For Refugees -->
          <div
            class="reveal-left bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm"
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
            class="reveal-right bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm"
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

    <!-- ============ CTA BANNER ============ -->
    <section class="cta-banner py-14">
      <div class="page-container text-center relative">
        <h2 class="reveal text-2xl sm:text-4xl font-bold text-primary-900">
          Ready to Find Your Next Opportunity?
        </h2>
        <p
          class="reveal text-primary-700 mt-3 text-base sm:text-lg max-w-xl mx-auto"
        >
          Join thousands of refugees who have found jobs, scholarships, and
          opportunities through our platform.
        </p>
        <div class="reveal flex flex-col sm:flex-row gap-4 justify-center mt-8">
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
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
  CircleCheck,
  MapPin,
  TrendingUp,
} from "lucide-vue-next";

const featured = ref([]);
const loadingFeatured = ref(true);
const categoryStats = ref({});

const stats = [
  { value: 500, suffix: "+", label: "Opportunities" },
  { value: 120, suffix: "+", label: "Organizations" },
  { value: 8000, suffix: "+", label: "Refugees Helped" },
  { value: 15, suffix: "+", label: "Countries" },
];
const displayedStats = ref(stats.map(() => "0"));

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

// ---- Floating card stack (hero signature element) ----
const liveFeed = [
  {
    title: "Community Health Officer",
    org: "UNHCR Field Office",
    location: "Kampala, UG",
    category: "job",
    badgeClass: "badge-job",
    icon: BriefcaseBusiness,
  },
  {
    title: "STEM Scholarship 2026",
    org: "Mastercard Foundation",
    location: "Regional",
    category: "scholarship",
    badgeClass: "badge-scholarship",
    icon: GraduationCap,
  },
  {
    title: "Small Business Grant",
    org: "Danish Refugee Council",
    location: "Nakivale, UG",
    category: "grant",
    badgeClass: "badge-grant",
    icon: HandCoins,
  },
  {
    title: "Digital Skills Fellowship",
    org: "AIESEC East Africa",
    location: "Remote",
    category: "fellowship",
    badgeClass: "badge-fellowship",
    icon: Trophy,
  },
];
const liveIndex = ref(0);
const liveOpportunity = computed(() => liveFeed[liveIndex.value]);
const ghostIconA = GraduationCap;
const ghostIconB = HandCoins;
let liveTimer = null;

// ---- Scroll reveal ----
const statsRef = ref(null);
let observer = null;
let statsAnimated = false;
const observedEls = new WeakSet();

// Re-scans the DOM for .reveal / .reveal-left / .reveal-right elements and
// observes any that aren't already being watched. Safe to call multiple
// times — needed because content like the featured opportunity cards
// mounts asynchronously (after the API call resolves), so a single
// querySelectorAll at onMounted time would miss them entirely.
const observeReveals = () => {
  if (!observer) return;
  document
    .querySelectorAll(".reveal, .reveal-left, .reveal-right")
    .forEach((el) => {
      if (!observedEls.has(el)) {
        observedEls.add(el);
        observer.observe(el);
      }
    });
};

const animateStats = () => {
  if (statsAnimated) return;
  statsAnimated = true;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  stats.forEach((stat, i) => {
    if (prefersReduced) {
      displayedStats.value[i] = stat.value.toLocaleString() + stat.suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * stat.value);
      displayedStats.value[i] =
        current.toLocaleString() + (progress >= 1 ? stat.suffix : "");
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
};

onMounted(async () => {
  // Live card cycling
  liveTimer = setInterval(() => {
    liveIndex.value = (liveIndex.value + 1) % liveFeed.length;
  }, 3200);

  const isMobile = window.matchMedia("(max-width: 640px)").matches;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: isMobile ? 0.05 : 0.15, rootMargin: "0px 0px -10% 0px" },
  );
  observeReveals();

  if (statsRef.value) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats();
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    statsObserver.observe(statsRef.value);
  }

  try {
    const { data } = await opportunityService.getFeatured();
    featured.value = data.data;
  } catch (err) {
    console.error("Failed to load featured opportunities:", err);
  } finally {
    loadingFeatured.value = false;
  }

  // The v-else-if block (and its .reveal-wrapped cards) only exists in the
  // DOM after loadingFeatured flips to false and Vue patches — wait a tick,
  // then pick up anything the initial scan missed.
  await nextTick();
  observeReveals();

  try {
    const { data } = await opportunityService.getCategoryStats();
    data.data.forEach((s) => {
      categoryStats.value[s._id] = s.count;
    });
  } catch (err) {
    console.error("Failed to load category stats:", err);
  }
});

onBeforeUnmount(() => {
  if (liveTimer) clearInterval(liveTimer);
  if (observer) observer.disconnect();
});
</script>

<style scoped>
/* ============ Hero ============ */
.hero {
  position: relative;
  background: var(--color-primary, #01596d);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.hero-grid {
  position: absolute;
  inset: -1px;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(
    ellipse 80% 60% at 30% 20%,
    black 40%,
    transparent 90%
  );
  mask-image: radial-gradient(
    ellipse 80% 60% at 30% 20%,
    black 40%,
    transparent 90%
  );
}

.hero-blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(70px);
  opacity: 0.35;
}
.hero-blob--accent {
  top: -10%;
  right: -5%;
  width: 420px;
  height: 420px;
  background: #f3d646;
  animation: drift-a 16s ease-in-out infinite;
}
.hero-blob--soft {
  bottom: -20%;
  left: -10%;
  width: 480px;
  height: 480px;
  background: #ffffff;
  opacity: 0.12;
  animation: drift-b 20s ease-in-out infinite;
}

/* Smaller, lighter blur on mobile — keeps the blobs from overwhelming a
   single-column layout and avoids taxing GPU-limited devices. */
@media (max-width: 640px) {
  .hero-blob {
    filter: blur(40px);
  }
  .hero-blob--accent {
    width: 220px;
    height: 220px;
  }
  .hero-blob--soft {
    width: 260px;
    height: 260px;
  }
}

@keyframes drift-a {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-30px, 30px) scale(1.08);
  }
}
@keyframes drift-b {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -20px) scale(1.05);
  }
}

.hero-wave {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 40px;
  display: block;
}

/* Page-load orchestrated reveal */
.reveal-load {
  opacity: 0;
  transform: translateY(16px);
  animation: fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: var(--d, 0ms);
}
@keyframes fade-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scroll reveal */
.reveal,
.reveal-left,
.reveal-right {
  opacity: 0;
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--d, 0ms);
  will-change: opacity, transform;
}
.reveal {
  transform: translateY(20px);
}
.reveal-left {
  transform: translateX(-24px);
}
.reveal-right {
  transform: translateX(24px);
}
.reveal.is-visible,
.reveal-left.is-visible,
.reveal-right.is-visible {
  opacity: 1;
  transform: translate(0, 0);
}

/* On small screens, shorten travel distance and duration so reveals feel
   snappy rather than sluggish, and can't contribute to horizontal scroll. */
@media (max-width: 640px) {
  .reveal,
  .reveal-left,
  .reveal-right {
    transition-duration: 0.5s;
  }
  .reveal {
    transform: translateY(12px);
  }
  .reveal-left {
    transform: translateX(-14px);
  }
  .reveal-right {
    transform: translateX(14px);
  }
}

/* Prevent the slide-in reveals from ever creating a horizontal scrollbar
   on narrow viewports while their transform is mid-transition. */
.how-it-works-grid {
  overflow-x: hidden;
}

/* CTA button glow */
.btn-glow {
  position: relative;
  transition:
    transform 0.2s ease,
    box-shadow 0.3s ease;
}
.btn-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px -8px rgba(243, 214, 70, 0.55);
}

/* ============ Floating card stack ============ */
.card-stack {
  position: relative;
  width: 100%;
  height: 100%;
}
.stack-card {
  position: absolute;
  width: 280px;
  border-radius: 20px;
  background: white;
  padding: 20px;
  box-shadow: 0 20px 45px -15px rgba(1, 89, 109, 0.35);
}
.stack-card--back {
  top: 60px;
  right: 10px;
  transform: rotate(8deg);
  opacity: 0.55;
  z-index: 1;
}
.stack-card--mid {
  top: 30px;
  right: 40px;
  transform: rotate(-5deg);
  opacity: 0.8;
  z-index: 2;
}
.stack-card--front {
  top: 0;
  right: 70px;
  z-index: 3;
  animation: float-front 5s ease-in-out infinite;
}
@keyframes float-front {
  0%,
  100% {
    transform: translateY(0) rotate(-1.5deg);
  }
  50% {
    transform: translateY(-10px) rotate(1deg);
  }
}

.cardswap-enter-active,
.cardswap-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.cardswap-enter-from {
  opacity: 0;
  transform: translateY(10px) rotate(-1.5deg);
}
.cardswap-leave-to {
  opacity: 0;
  transform: translateY(-10px) rotate(-1.5deg);
}

.pulse-dot {
  display: inline-block;
  animation: pulse-scale 1.6s ease-in-out infinite;
}
@keyframes pulse-scale {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}

.float-badge {
  position: absolute;
  left: -10px;
  bottom: 30px;
  background: white;
  border-radius: 16px;
  padding: 12px 16px;
  box-shadow: 0 15px 35px -10px rgba(1, 89, 109, 0.35);
  z-index: 4;
  animation: float-badge 6s ease-in-out infinite;
}
@keyframes float-badge {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* ============ CTA banner shimmer ============ */
.cta-banner {
  position: relative;
  background: #f3d646;
  overflow: hidden;
}
.cta-banner::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    transparent 40%,
    rgba(255, 255, 255, 0.35) 50%,
    transparent 60%
  );
  background-size: 200% 200%;
  animation: shimmer-sweep 6s ease-in-out infinite;
  pointer-events: none;
}
@keyframes shimmer-sweep {
  0% {
    background-position: 200% 0;
  }
  60%,
  100% {
    background-position: -50% 0;
  }
}

/* ============ Reduced motion ============ */
@media (prefers-reduced-motion: reduce) {
  .reveal-load,
  .reveal,
  .reveal-left,
  .reveal-right {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .hero-blob,
  .stack-card--front,
  .float-badge,
  .pulse-dot,
  .cta-banner::before {
    animation: none !important;
  }
}
</style>
