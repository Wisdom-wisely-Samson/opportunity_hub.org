<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="text-center max-w-md">
      <div class="text-8xl font-black text-primary/10 leading-none select-none">404</div>
      <div class="text-5xl mt-2 mb-4">🗺️</div>
      <h1 class="text-2xl font-bold text-gray-900">Page Not Found</h1>
      <p class="text-gray-500 text-sm mt-2 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button @click="router.back()" class="btn-outline">← Go Back</button>
        <router-link to="/" class="btn-primary">Go to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
