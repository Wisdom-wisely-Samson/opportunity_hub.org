<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="py-4 px-6">
      <router-link to="/" class="flex items-center gap-2.5 w-fit">
        <img src="/logo.svg" alt="Opportunity Hub" class="w-10 h-10 object-contain" />
        <span class="font-bold text-primary text-xl hidden sm:block">Opportunity Hub</span>
      </router-link>
    </div>
    <div class="flex-1 flex items-start justify-center py-6 px-4">
      <slot />
    </div>
    <div class="text-center py-4 text-sm text-gray-500">
      © {{ new Date().getFullYear() }} Opportunity Hub — Connecting Refugees to Opportunities
    </div>
  </div>
</template>
