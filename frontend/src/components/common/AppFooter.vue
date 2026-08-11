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
            <a href="https://x.com/WWisely75090" target="_blank" rel="noopener noreferrer" aria-label="X" class="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
              <Twitter class="w-4 h-4" />
            </a>
            <a href="https://www.facebook.com/wisdom.wisely.71/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
              <Facebook class="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/wisdom-wisley-1629b7417/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
              <Linkedin class="w-4 h-4" />
            </a>
          </div>
          <div class="flex gap-3 mt-4">
            <a href="https://wa.me/256770658534" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-4 h-4 text-white fill-current" aria-hidden="true">
                <path d="M380.9 97.1C339 55.2 283.2 32 223.9 32 100.3 32 0 132.3 0 255.9c0 45 11.3 88.9 32.9 127.6L3.7 480l100.4-29.9c36.8 19.9 78.5 30.3 121.8 30.3h.1c123.6 0 224-100.3 224-223.9 0-59.4-23.1-115.1-64.1-156.1zm-157 337.4c-37.4 0-74.8-10-106.9-28.9l-7.7-4.5-59.6 17.8 16.3-58.1-5-8.1c-20.2-32.3-30.8-69.9-30.8-108.2 0-113.9 92.7-206.6 206.6-206.6 55.2 0 107 21.5 146.3 60.8s60.8 91.1 60.8 146.3c0 113.9-92.7 206.6-206.5 206.6zm112.8-147.9c-5.6-2.8-33.4-16.5-38.5-18.4-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.4 18.4-17.6 22.2-3.2 3.7-6.4 4.2-11.9 1.4-32.3-16.1-53.4-28.7-74.8-65-5.7-9.8 5.7-9.1 16.4-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.2-41.3-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.5-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.4s19.9 53.8 22.7 57.5c2.8 3.7 39.3 60 95.2 84.1 13.3 5.7 23.7 9.1 31.8 11.7 13.3 4.3 25.4 3.7 35 2.2 10.7-1.5 33.4-13.6 38-26.7 4.6-13.1 4.6-24.3 3.2-26.7-1.4-2.3-5.1-3.7-10.7-6.5z" />
              </svg>
            </a>
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
            <li class="flex items-start gap-2"><Mail class="w-4 h-4 flex-shrink-0 mt-0.5" /><span><a href="mailto:wiselywisdom4@gmail.com" class="hover:text-accent transition-colors">wiselywisdom4@gmail.com</a></span></li>
            <li class="flex items-start gap-2"><MapPin class="w-4 h-4 flex-shrink-0 mt-0.5" /><span>Kampala, Uganda<br>East Africa</span></li>
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
          <router-link to="/privacy-policy" class="hover:text-accent transition-colors">Privacy Policy</router-link>
          <router-link to="/terms-of-service" class="hover:text-accent transition-colors">Terms of Service</router-link>
          <router-link to="/cookie-policy" class="hover:text-accent transition-colors">Cookie Policy</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Twitter, Facebook, Linkedin, MessageCircle, Mail, MapPin } from 'lucide-vue-next'

const categories = [
  { slug: 'job', label: 'Jobs' },
  { slug: 'scholarship', label: 'Scholarships' },
  { slug: 'grant', label: 'Grants' },
  { slug: 'training', label: 'Training Programs' },
  { slug: 'fellowship', label: 'Fellowships' },
  { slug: 'internship', label: 'Internships' },
]
</script>
