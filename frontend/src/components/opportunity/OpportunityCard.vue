<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col">
    <!-- Card Header -->
    <div class="p-5 flex-1">
      <div class="flex items-start justify-between gap-3">
        <!-- Org Logo -->
        <div class="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
          <img v-if="opportunity.organization?.logo?.url" :src="opportunity.organization.logo.url" :alt="opportunity.organization.organizationName" class="w-full h-full object-cover" loading="lazy" />
          <span v-else class="text-primary font-bold text-lg">{{ orgInitial }}</span>
        </div>
        <!-- Category + Save -->
        <div class="flex items-center gap-2 flex-shrink-0 ml-auto">
          <span :class="['badge', categoryBadgeClass]">{{ categoryLabel }}</span>
          <button @click.prevent="toggleSave" v-if="isAuthenticated && isRefugee" :class="['p-1.5 rounded-lg transition-colors', opportunity.isSaved ? 'text-accent-600 bg-accent/10' : 'text-gray-400 hover:text-primary hover:bg-gray-100']" :aria-label="opportunity.isSaved ? 'Remove from saved' : 'Save opportunity'">
            <svg class="w-4 h-4" :fill="opportunity.isSaved ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </button>
        </div>
      </div>

      <!-- Title -->
      <h3 class="font-bold text-gray-900 mt-3 text-base leading-snug line-clamp-2">{{ opportunity.title }}</h3>
      <p class="text-sm text-primary font-medium mt-1">{{ opportunity.organization?.organizationName }}</p>
      <div v-if="opportunity.organization?.isVerified" class="inline-flex items-center gap-1 text-xs text-green-600 mt-0.5"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>Verified</div>

      <!-- Description -->
      <p class="text-sm text-gray-500 mt-3 leading-relaxed line-clamp-2">{{ opportunity.description }}</p>

      <!-- Meta -->
      <div class="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
        <span class="flex items-center gap-1">📍 {{ opportunity.location }}</span>
        <span v-if="opportunity.isRemote" class="flex items-center gap-1 text-green-600 font-medium">🌐 Remote</span>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="px-5 pb-5 border-t border-gray-50 pt-4 flex items-center justify-between">
      <div :class="['text-xs font-medium', deadlineUrgencyClass]">
        <span>⏰ </span>{{ deadlineText }}
      </div>
      <router-link :to="`/opportunities/${opportunity._id}`" class="btn-primary btn-sm">View Details</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { userService } from '@/services/userService'
import { useToast } from '@/composables/useToast'
import { categoryLabel as getCategoryLabel, deadlineLabel, deadlineUrgency, getInitials } from '@/utils/helpers'

const props = defineProps({ opportunity: { type: Object, required: true } })
const emit = defineEmits(['saved', 'unsaved'])

const authStore = useAuthStore()
const toast = useToast()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isRefugee = computed(() => authStore.isRefugee)

const orgInitial = computed(() => getInitials(props.opportunity.organization?.organizationName || '?'))
const categoryLabel = computed(() => getCategoryLabel(props.opportunity.category))
const categoryBadgeClass = computed(() => `badge-${props.opportunity.category}`)
const deadlineText = computed(() => deadlineLabel(props.opportunity.deadline))
const deadlineUrgencyClass = computed(() => ({
  expired: 'text-red-600', urgent: 'text-orange-600', soon: 'text-yellow-600', normal: 'text-gray-500'
}[deadlineUrgency(props.opportunity.deadline)] || 'text-gray-500'))

const toggleSave = async () => {
  try {
    if (props.opportunity.isSaved) {
      await userService.unsaveOpportunity(props.opportunity._id)
      props.opportunity.isSaved = false
      toast.success('Removed from saved')
      emit('unsaved', props.opportunity._id)
    } else {
      await userService.saveOpportunity(props.opportunity._id)
      props.opportunity.isSaved = true
      toast.success('Opportunity saved!')
      emit('saved', props.opportunity._id)
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to update saved status')
  }
}
</script>
