<template>
  <div>
    <div class="page-header"><div class="page-container"><h1 class="page-header-title">About Opportunity Hub</h1><p class="page-header-sub">Our mission, vision, and the team behind the platform</p></div></div>
    <div class="page-container py-16 max-w-4xl">
      <div class="prose prose-lg text-gray-700 space-y-8">
        <div class="card">
          <h2 class="text-2xl font-bold text-primary mb-3">Our Mission</h2>
          <p>Opportunity Hub exists to break down barriers and create equal access to life-changing opportunities for refugees and underserved communities across East Africa and beyond. We believe every person — regardless of their displacement status — deserves access to quality education, dignified employment, and pathways to self-reliance.</p>
        </div>
        <div class="card">
          <h2 class="text-2xl font-bold text-primary mb-3">What We Do</h2>
          <p>We provide a centralized digital platform where:</p>
          <ul class="space-y-2 mt-4">
            <li class="flex gap-2"><span class="text-primary font-bold">•</span>NGOs, universities, employers, and development organizations can post opportunities</li>
            <li class="flex gap-2"><span class="text-primary font-bold">•</span>Refugees can discover, apply, and track opportunities matching their skills</li>
            <li class="flex gap-2"><span class="text-primary font-bold">•</span>Organizations can connect with qualified, motivated talent from refugee communities</li>
          </ul>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div class="card text-center"><p class="text-4xl font-bold text-primary">500+</p><p class="text-gray-600 mt-1">Active Opportunities</p></div>
          <div class="card text-center"><p class="text-4xl font-bold text-primary">120+</p><p class="text-gray-600 mt-1">Partner Organizations</p></div>
          <div class="card text-center"><p class="text-4xl font-bold text-primary">8,000+</p><p class="text-gray-600 mt-1">Refugees Served</p></div>
        </div>
        <div class="card">
          <h2 class="text-2xl font-bold text-primary mb-3">Our Values</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="v in values" :key="v.title" class="flex gap-3"><span class="text-2xl">{{ v.icon }}</span><div><p class="font-bold text-gray-900">{{ v.title }}</p><p class="text-sm text-gray-600">{{ v.desc }}</p></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const values = [
  { icon: '⚖️', title: 'Equity', desc: 'We believe in equal access regardless of background or status.' },
  { icon: '🤝', title: 'Partnership', desc: 'We work with organizations committed to inclusive hiring.' },
  { icon: '🔒', title: 'Privacy', desc: 'We protect the data and privacy of all our users.' },
  { icon: '🌍', title: 'Impact', desc: 'Every placement creates ripples of positive change in communities.' },
]
</script>
