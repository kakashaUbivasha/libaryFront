<script setup>
import { Dialog, DialogOverlay, DialogTitle } from '@headlessui/vue'

defineProps({
  isOpen: Boolean,
  onClose: Function,
  errorText: String
})
</script>

<template>
  <Dialog :open="isOpen" @close="onClose" class="fixed inset-0 z-50 flex items-center justify-center">
    <DialogOverlay class="fixed inset-0 bg-black/40" />
    <div class="bg-white w-full max-w-md mx-auto p-6 z-50 rounded-lg shadow-lg">
      <DialogTitle class="text-xl font-semibold text-red-600">Уведомление</DialogTitle>
      <p class="mt-2 text-gray-700">
        {{errorText}}
      </p>
      <div class="mt-4 text-right">
        <button
            @click="onClose"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Понятно
        </button>
      </div>
    </div>
  </Dialog>
</template>
