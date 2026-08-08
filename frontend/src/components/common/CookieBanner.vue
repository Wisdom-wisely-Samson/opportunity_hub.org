<template>
  <div v-if="showBanner" class="fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-200 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="space-y-2 text-sm text-gray-700">
        <p class="font-semibold text-gray-900">We use cookies to improve your experience.</p>
        <p>
          By accepting cookies, you help us keep Opportunity Hub running smoothly and track visitor metrics.
          <router-link to="/cookie-policy" class="text-primary font-semibold hover:underline">Learn more</router-link>.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <router-link to="/cookie-policy" class="btn-ghost btn-sm text-sm">Cookie Policy</router-link>
        <button @click="acceptCookies" class="btn-primary btn-sm text-sm">Accept Cookies</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { siteService } from '@/services/siteService';

const localStorageKey = 'hub_cookie_consent';
const visitTrackedKey = 'hub_visitor_tracked';
const showBanner = ref(false);

const acceptCookies = async () => {
  localStorage.setItem(localStorageKey, 'accepted');
  showBanner.value = false;
  await trackVisitIfNeeded();
};

const trackVisitIfNeeded = async () => {
  const consent = localStorage.getItem(localStorageKey);
  const tracked = localStorage.getItem(visitTrackedKey);

  if (consent === 'accepted' && tracked !== 'true') {
    try {
      await siteService.recordVisit();
      localStorage.setItem(visitTrackedKey, 'true');
    } catch {
      // ignore errors silently
    }
  }
};

onMounted(() => {
  const consent = localStorage.getItem(localStorageKey);
  const tracked = localStorage.getItem(visitTrackedKey);
  showBanner.value = consent !== 'accepted';
  if (consent === 'accepted' && tracked !== 'true') {
    trackVisitIfNeeded();
  }
});
</script>
