<template>
  <Menu as="div" class="relative inline-block text-left">

    <!-- Trigger -->
    <MenuButton
      class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
    >
      <EllipsisVerticalIcon class="h-5 w-5" />
    </MenuButton>

    <!-- Dropdown -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl focus:outline-none"
      >

        <MenuItem
          v-for="item in items"
          :key="item.label"
          v-slot="{ active }"
        >
          <button
            @click="item.action"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition"
            :class="[
              active ? 'bg-white/10' : '',
              item.danger
                ? 'text-red-400'
                : 'text-white'
            ]"
          >
            <component
              :is="item.icon"
              class="h-5 w-5"
            />

            {{ item.label }}
          </button>
        </MenuItem>

      </MenuItems>
    </transition>

  </Menu>
</template>

<script setup>
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem
} from '@headlessui/vue'

import {
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>