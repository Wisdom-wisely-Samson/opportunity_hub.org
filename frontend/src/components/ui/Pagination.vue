<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-2 mt-6"
  >
    <!-- Prev -->
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
    >
      ‹
    </button>

    <!-- Pages -->
    <button
      v-for="page in pages"
      :key="page"
      @click="changePage(page)"
      class="px-3 py-2 rounded-xl border transition"
      :class="
        page === currentPage
          ? 'bg-primary text-white border-primary'
          : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
      "
    >
      {{ page }}
    </button>

    <!-- Next -->
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
    >
      ›
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["update:page"]);

const changePage = (page) => {
  if (page < 1 || page > props.totalPages) return;
  emit("update:page", page);
};

const pages = computed(() => {
  const range = [];
  for (let i = 1; i <= props.totalPages; i++) {
    range.push(i);
  }
  return range;
});
</script>
