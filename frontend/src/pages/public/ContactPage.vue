<template>
  <div>
    <div class="page-header"><div class="page-container"><h1 class="page-header-title">Contact Us</h1><p class="page-header-sub">We'd love to hear from you</p></div></div>
    <div class="page-container py-16 max-w-4xl">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label class="label">Full Name</label>
              <input v-model="form.name" type="text" required class="input-field" placeholder="Your name" />
            </div>
            <div>
              <label class="label">Email Address</label>
              <input v-model="form.email" type="email" required class="input-field" placeholder="your@email.com" />
            </div>
            <div>
              <label class="label">Subject</label>
              <select v-model="form.subject" class="select-field">
                <option value="">Select a subject</option>
                <option>General Inquiry</option>
                <option>Organization Partnership</option>
                <option>Technical Support</option>
                <option>Report an Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label class="label">Message</label>
              <textarea v-model="form.message" rows="5" required class="textarea-field" placeholder="Tell us how we can help..."></textarea>
            </div>
            <div v-if="submitted" class="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium">✅ Thank you! Your message has been sent. We'll respond within 48 hours.</div>
            <button type="submit" :disabled="isLoading" class="btn-primary w-full">{{ isLoading ? 'Sending...' : 'Send Message' }}</button>
          </form>
        </div>
        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Other Ways to Reach Us</h2>
          <div v-for="c in contacts" :key="c.label" class="card flex gap-4">
            <span class="text-2xl">{{ c.icon }}</span>
            <div><p class="font-bold text-gray-900">{{ c.label }}</p><p class="text-sm text-gray-600 mt-1">{{ c.value }}</p></div>
          </div>
          <div class="card bg-primary text-white">
            <p class="font-bold text-accent mb-2">For Organizations</p>
            <p class="text-primary-200 text-sm">Want to partner with us and reach qualified refugee talent? We'd love to onboard your organization.</p>
            <router-link to="/register?role=organization" class="btn-accent mt-4 inline-flex btn-sm">Partner With Us →</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const form = reactive({ name: '', email: '', subject: '', message: '' })
const isLoading = ref(false)
const submitted = ref(false)
const handleSubmit = async () => {
  isLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  submitted.value = true
  isLoading.value = false
  Object.assign(form, { name: '', email: '', subject: '', message: '' })
}
const contacts = [
  { icon: '📧', label: 'Email', value: 'info@opportunityhub.org' },
  { icon: '📍', label: 'Address', value: 'Kampala, Uganda — East Africa' },
  { icon: '⏰', label: 'Response Time', value: 'We respond within 24–48 hours' },
]
</script>
