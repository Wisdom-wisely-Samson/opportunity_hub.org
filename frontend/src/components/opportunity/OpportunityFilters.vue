<template>
  <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
    <h3 class="font-bold text-gray-900 text-sm uppercase tracking-wider">Filter Opportunities</h3>

    <!-- Category -->
    <div>
      <label class="label">Category</label>
      <select :value="filters.category" @change="update('category', $event.target.value)" class="select-field">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
      </select>
    </div>

    <!-- Location -->
    <div>
      <label class="label">Location</label>
      <input :value="filters.location" @input="update('location', $event.target.value)" type="text" placeholder="e.g. Kampala, Uganda" class="input-field" />
    </div>

    <!-- Remote -->
    <div class="flex items-center gap-3">
      <input :checked="filters.remote === 'true'" @change="update('remote', $event.target.checked ? 'true' : '')" type="checkbox" id="remote" class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer" />
      <label for="remote" class="text-sm text-gray-700 cursor-pointer font-medium">Remote / Online only</label>
    </div>

    <!-- Sort -->
    <div>
      <label class="label">Sort By</label>
      <select :value="filters.sort" @change="update('sort', $event.target.value)" class="select-field">
        <option value="-createdAt">Newest First</option>
        <option value="deadline">Deadline (Soonest)</option>
        <option value="-applicationCount">Most Applied</option>
      </select>
    </div>

    <button @click="$emit('reset')" class="btn-ghost w-full text-sm border border-gray-200">Reset Filters</button>
  </div>
</template>

<script setup>
defineProps({ filters: { type: Object, required: true } })
const emit = defineEmits(['update:filters', 'reset'])

const categories = [
  { value: 'job', label: '💼 Jobs' },
  { value: 'scholarship', label: '🎓 Scholarships' },
  { value: 'grant', label: '💰 Grants' },
  { value: 'training', label: '📚 Training' },
  { value: 'internship', label: '🔬 Internships' },
  { value: 'fellowship', label: '🏆 Fellowships' },
  { value: 'entrepreneurship', label: '🚀 Entrepreneurship' },
]

const update = (key, value) => emit('update:filters', { [key]: value })
</script>
