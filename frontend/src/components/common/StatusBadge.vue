<template>
  <span :class="['badge', statusClass]">{{ statusLabel }}</span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ status: { type: String, required: true } })
const map = {
  pending: { cls: 'status-pending', label: 'Pending' },
  reviewed: { cls: 'status-reviewed', label: 'Reviewed' },
  accepted: { cls: 'status-accepted', label: 'Accepted' },
  rejected: { cls: 'status-rejected', label: 'Rejected' },
  active: { cls: 'status-active', label: 'Active' },
  closed: { cls: 'status-closed', label: 'Closed' },
  draft: { cls: 'status-draft', label: 'Draft' },
  expired: { cls: 'status-expired', label: 'Expired' },
}
const statusClass = computed(() => map[props.status]?.cls || 'bg-gray-100 text-gray-600')
const statusLabel = computed(() => map[props.status]?.label || props.status)
</script>
