<template>
  <footer class="bg-primary text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="sm:col-span-2 lg:col-span-1">
          <div class="flex items-center gap-2.5 mb-4">
            <img src="/logo.svg" alt="Opportunity Hub" class="w-10 h-10 object-contain bg-white rounded-lg p-1" />
            <span class="font-bold text-white text-xl">Opportunity Hub</span>
          </div>
          <p class="text-primary-200 text-sm leading-relaxed">Connecting refugees and underserved communities to life-changing opportunities across Uganda, East Africa and beyond.</p>
          <div class="flex gap-3 mt-4">
            <a href="#" aria-label="Twitter" class="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center hover:bg-accent hover:text-primary transition-colors text-sm">𝕏</a>
            <a href="#" aria-label="Facebook" class="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center hover:bg-accent hover:text-primary transition-colors text-sm">f</a>
            <a href="#" aria-label="LinkedIn" class="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center hover:bg-accent hover:text-primary transition-colors text-sm">in</a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-bold text-white mb-4 text-sm uppercase tracking-wider">Opportunities</h4>
          <ul class="space-y-2.5">
            <li v-for="cat in categories" :key="cat.slug">
              <router-link :to="`/opportunities?category=${cat.slug}`" class="text-primary-200 text-sm hover:text-accent transition-colors">{{ cat.label }}</router-link>
            </li>
          </ul>
        </div>

        <!-- For Organizations -->
        <div>
          <h4 class="font-bold text-white mb-4 text-sm uppercase tracking-wider">For Organizations</h4>
          <ul class="space-y-2.5">
            <li><router-link to="/register?role=organization" class="text-primary-200 text-sm hover:text-accent transition-colors">Register Organization</router-link></li>
            <li><router-link to="/org/opportunities/create" class="text-primary-200 text-sm hover:text-accent transition-colors">Post Opportunity</router-link></li>
            <li><router-link to="/about" class="text-primary-200 text-sm hover:text-accent transition-colors">Why Partner With Us</router-link></li>
            <li><router-link to="/contact" class="text-primary-200 text-sm hover:text-accent transition-colors">Contact Us</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul class="space-y-2.5 text-primary-200 text-sm">
            <li class="flex items-start gap-2"><span>📧</span><span>info@opportunityhub.org</span></li>
            <li class="flex items-start gap-2"><span>📍</span><span>Kampala, Uganda<br>East Africa</span></li>
            <li><router-link to="/about" class="hover:text-accent transition-colors">About Us</router-link></li>
            <li><router-link to="/contact" class="hover:text-accent transition-colors">Help & Support</router-link></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="border-t border-primary-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-primary-300">
        <p>© {{ new Date().getFullYear() }} Opportunity Hub. All rights reserved.</p>
        <div class="flex gap-4">
          <a href="#" class="hover:text-accent transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-accent transition-colors">Terms of Service</a>
          <a href="#" class="hover:text-accent transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const categories = [
  { slug: 'job', label: 'Jobs' },
  { slug: 'scholarship', label: 'Scholarships' },
  { slug: 'grant', label: 'Grants' },
  { slug: 'training', label: 'Training Programs' },
  { slug: 'fellowship', label: 'Fellowships' },
  { slug: 'internship', label: 'Internships' },
]
</script>
