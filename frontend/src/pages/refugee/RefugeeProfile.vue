<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">My Profile</h1>
      <button @click="saveProfile" :disabled="isSaving" class="btn-primary">
        <span v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        {{ isSaving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <!-- Avatar Section -->
    <div class="card">
      <h2 class="font-bold text-gray-900 mb-4">Profile Picture</h2>
      <div class="flex items-center gap-6">
        <div class="relative">
          <div class="w-20 h-20 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center border-2 border-primary/20">
            <img v-if="form.profilePicturePreview || user?.profilePicture?.url" :src="form.profilePicturePreview || user.profilePicture.url" class="w-full h-full object-cover" alt="Profile" />
            <span v-else class="text-primary font-bold text-2xl">{{ getInitials(form.fullName || user?.fullName || '?') }}</span>
          </div>
        </div>
        <div>
          <input type="file" ref="avatarInput" @change="handleAvatarChange" accept="image/*" class="hidden" />
          <button @click="avatarInput?.click()" class="btn-outline btn-sm">📷 Change Photo</button>
          <p class="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — Max 5MB</p>
        </div>
      </div>
    </div>

    <!-- Personal Information -->
    <div class="card space-y-5">
      <h2 class="font-bold text-gray-900">Personal Information</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label class="label">Full Name</label>
          <input v-model="form.fullName" type="text" class="input-field" placeholder="Your full name" />
        </div>
        <div>
          <label class="label">Gender</label>
          <select v-model="form.gender" class="select-field">
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
        <div>
          <label class="label">Country of Origin</label>
          <input v-model="form.countryOfOrigin" type="text" class="input-field" placeholder="e.g. Somalia" />
        </div>
        <div>
          <label class="label">Current Location</label>
          <input v-model="form.currentLocation" type="text" class="input-field" placeholder="e.g. Kampala, Uganda" />
        </div>
        <div>
          <label class="label">Refugee Status</label>
          <select v-model="form.refugeeStatus" class="select-field">
            <option value="">Select status</option>
            <option value="refugee">Refugee</option>
            <option value="asylum_seeker">Asylum Seeker</option>
            <option value="internally_displaced">Internally Displaced</option>
            <option value="stateless">Stateless</option>
            <option value="returnee">Returnee</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label class="label">Bio <span class="text-gray-400 font-normal">(Max 500 chars)</span></label>
        <textarea v-model="form.bio" rows="4" class="textarea-field" placeholder="Write a brief introduction about yourself, your background, and aspirations..." maxlength="500"></textarea>
        <p class="text-xs text-gray-400 text-right">{{ form.bio?.length || 0 }}/500</p>
      </div>
    </div>

    <!-- Skills -->
    <div class="card space-y-4">
      <h2 class="font-bold text-gray-900">Skills</h2>
      <div class="flex flex-wrap gap-2">
        <span v-for="(skill, i) in form.skills" :key="i" class="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {{ skill }}
          <button @click="removeSkill(i)" class="hover:text-red-500 transition-colors leading-none">×</button>
        </span>
      </div>
      <div class="flex gap-2">
        <input v-model="newSkill" @keydown.enter.prevent="addSkill" type="text" placeholder="Add a skill (press Enter)" class="input-field flex-1" />
        <button @click="addSkill" class="btn-primary px-4">Add</button>
      </div>
    </div>

    <!-- Languages -->
    <div class="card space-y-4">
      <h2 class="font-bold text-gray-900">Languages</h2>
      <div v-for="(lang, i) in form.languages" :key="i" class="flex gap-3 items-center">
        <input v-model="lang.language" type="text" placeholder="Language" class="input-field flex-1" />
        <select v-model="lang.proficiency" class="select-field w-40">
          <option value="basic">Basic</option>
          <option value="conversational">Conversational</option>
          <option value="fluent">Fluent</option>
          <option value="native">Native</option>
        </select>
        <button @click="form.languages.splice(i, 1)" class="text-red-500 hover:text-red-700 p-1">🗑</button>
      </div>
      <button @click="form.languages.push({ language: '', proficiency: 'conversational' })" class="btn-ghost text-sm border border-dashed border-gray-300">+ Add Language</button>
    </div>

    <!-- Save button (bottom) -->
    <div class="flex justify-end">
      <button @click="saveProfile" :disabled="isSaving" class="btn-primary btn-lg">
        <span v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        {{ isSaving ? 'Saving...' : 'Save Profile' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { userService } from '@/services/userService'
import { useToast } from '@/composables/useToast'
import { getInitials, extractErrorMessage } from '@/utils/helpers'

const authStore = useAuthStore()
const toast = useToast()
const user = computed(() => authStore.user)
const isSaving = ref(false)
const avatarInput = ref(null)
const newSkill = ref('')

const form = reactive({
  fullName: '', gender: '', countryOfOrigin: '', currentLocation: '',
  refugeeStatus: '', bio: '', skills: [], languages: [], profilePicturePreview: null, avatarFile: null,
})

const addSkill = () => {
  const s = newSkill.value.trim()
  if (s && !form.skills.includes(s)) { form.skills.push(s) }
  newSkill.value = ''
}
const removeSkill = (i) => form.skills.splice(i, 1)

const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  form.avatarFile = file
  form.profilePicturePreview = URL.createObjectURL(file)
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    if (form.avatarFile) {
      const fd = new FormData(); fd.append('avatar', form.avatarFile)
      const { data } = await userService.uploadAvatar(fd)
      authStore.updateUser({ profilePicture: data.data.profilePicture })
    }
    const { data } = await userService.updateProfile({
      fullName: form.fullName, gender: form.gender, countryOfOrigin: form.countryOfOrigin,
      currentLocation: form.currentLocation, refugeeStatus: form.refugeeStatus,
      bio: form.bio, skills: form.skills, languages: form.languages,
    })
    authStore.updateUser(data.data)
    toast.success('Profile updated successfully!')
  } catch (err) {
    toast.error(extractErrorMessage(err))
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  const u = user.value
  if (u) {
    Object.assign(form, {
      fullName: u.fullName || '', gender: u.gender || '', countryOfOrigin: u.countryOfOrigin || '',
      currentLocation: u.currentLocation || '', refugeeStatus: u.refugeeStatus || '',
      bio: u.bio || '', skills: [...(u.skills || [])], languages: JSON.parse(JSON.stringify(u.languages || [])),
    })
  }
})
</script>
