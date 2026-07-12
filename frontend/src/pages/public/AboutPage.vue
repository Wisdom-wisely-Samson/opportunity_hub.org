<template>
  <div>
    <div class="page-header">
      <div class="page-container">
        <h1 class="page-header-title">About Opportunity Hub</h1>
        <p class="page-header-sub">
          Our mission, vision, and the team behind the platform
        </p>
      </div>
    </div>
    <div class="page-container py-12 sm:py-16 max-w-4xl">
      <div class="space-y-6 sm:space-y-8">
        <div class="card">
          <h2 class="text-xl sm:text-2xl font-bold text-primary mb-3">
            Our Mission
          </h2>
          <p class="text-gray-700 leading-relaxed">
            Opportunity Hub exists to break down barriers and create equal
            access to life-changing opportunities for refugees and underserved
            communities across East Africa and beyond. We believe every person —
            regardless of their displacement status — deserves access to quality
            education, dignified employment, and pathways to self-reliance.
          </p>
        </div>
        <div class="card">
          <h2 class="text-xl sm:text-2xl font-bold text-primary mb-3">
            What We Do
          </h2>
          <p class="text-gray-700">
            We provide a centralized digital platform where:
          </p>
          <ul class="space-y-3 mt-4">
            <li class="flex gap-3">
              <CheckCircle2 class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span class="text-gray-700"
                >NGOs, universities, employers, and development organizations
                can post opportunities</span
              >
            </li>
            <li class="flex gap-3">
              <CheckCircle2 class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span class="text-gray-700"
                >Refugees can discover, apply, and track opportunities matching
                their skills</span
              >
            </li>
            <li class="flex gap-3">
              <CheckCircle2 class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span class="text-gray-700"
                >Organizations can connect with qualified, motivated talent from
                refugee communities</span
              >
            </li>
          </ul>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div
            class="card text-center hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          >
            <p class="text-3xl sm:text-4xl font-bold text-primary">500+</p>
            <p class="text-gray-600 mt-1 text-sm sm:text-base">
              Active Opportunities
            </p>
          </div>
          <div
            class="card text-center hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          >
            <p class="text-3xl sm:text-4xl font-bold text-primary">120+</p>
            <p class="text-gray-600 mt-1 text-sm sm:text-base">
              Partner Organizations
            </p>
          </div>
          <div
            class="card text-center hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          >
            <p class="text-3xl sm:text-4xl font-bold text-primary">8,000+</p>
            <p class="text-gray-600 mt-1 text-sm sm:text-base">
              Refugees Served
            </p>
          </div>
        </div>
        <div class="card">
          <h2 class="text-xl sm:text-2xl font-bold text-primary mb-4">
            Our Values
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div v-for="v in values" :key="v.title" class="flex gap-4">
              <div
                class="w-11 h-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0"
              >
                <component :is="v.icon" class="w-5 h-5" />
              </div>
              <div>
                <p class="font-bold text-gray-900">{{ v.title }}</p>
                <p class="text-sm text-gray-600 mt-0.5">{{ v.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckCircle2, Scale, Handshake, Lock, Globe2 } from "lucide-vue-next";

const values = [
  {
    icon: Scale,
    title: "Equity",
    desc: "We believe in equal access regardless of background or status.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    desc: "We work with organizations committed to inclusive hiring.",
  },
  {
    icon: Lock,
    title: "Privacy",
    desc: "We protect the data and privacy of all our users.",
  },
  {
    icon: Globe2,
    title: "Impact",
    desc: "Every placement creates ripples of positive change in communities.",
  },
];
</script>
