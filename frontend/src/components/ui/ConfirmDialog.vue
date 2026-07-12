<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog
      as="div"
      class="relative z-50"
      @close="$emit('update:modelValue', false)"
    >
      <!-- Overlay -->
      <TransitionChild
        enter="ease-out duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-150"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          enter="ease-out duration-200"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-150"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
          >
            <div class="flex items-center gap-4">

              <div
                class="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10"
              >
                <ExclamationTriangleIcon
                  class="h-8 w-8 text-red-400"
                />
              </div>

              <div>
                <DialogTitle class="text-lg font-bold text-white">
                  {{ title }}
                </DialogTitle>

                <p class="mt-1 text-sm text-white/60">
                  {{ message }}
                </p>
              </div>

            </div>

            <div class="mt-8 flex justify-end gap-3">

              <PrimaryButton
                variant="ghost"
                @click="$emit('update:modelValue', false)"
              >
                Cancel
              </PrimaryButton>

              <PrimaryButton
                variant="danger"
                @click="confirm"
              >
                {{ confirmText }}
              </PrimaryButton>

            </div>

          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import PrimaryButton from './PrimaryButton.vue'

const props = defineProps({
  modelValue: Boolean,

  title: {
    type: String,
    default: 'Confirm'
  },

  message: {
    type: String,
    default: ''
  },

  confirmText: {
    type: String,
    default: 'Confirm'
  }
})

const emit = defineEmits([
  'update:modelValue',
  'confirm'
])

const confirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>