<template>
  <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
    <StatsCard
      v-for="card in cards"
      :key="card.title"
      :title="card.title"
      :value="card.value"
      :trend="card.trend"
      :icon="card.icon"
      :color="card.color"
    />
  </div>
</template>

<script setup>
import StatsCard from "./StatsCard.vue";

defineProps({
  cards: {
    type: Array,
    default: () => [],
  },
});
</script>
