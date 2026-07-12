<template>
  <div
    class="w-full overflow-x-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
  >
    <table class="w-full text-left text-sm text-white">
      <!-- HEADER -->
      <thead class="border-b border-white/10 bg-white/5">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider"
          >
            {{ col.label }}
          </th>

          <th v-if="$slots.actions" class="px-4 py-3 text-xs text-white/60">
            Actions
          </th>
        </tr>
      </thead>

      <!-- BODY -->
      <tbody>
        <tr
          v-for="(row, index) in data"
          :key="row.id || index"
          class="border-b border-white/5 hover:bg-white/5 transition"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-white/80"
          >
            <slot :name="col.key" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>

          <td v-if="$slots.actions" class="px-4 py-3">
            <slot name="actions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- EMPTY STATE -->
    <div v-if="!data || data.length === 0" class="p-10">
      <slot name="empty">
        <div class="text-center text-white/50">No data available</div>
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
});
</script>
