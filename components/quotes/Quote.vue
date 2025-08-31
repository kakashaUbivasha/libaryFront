<script setup lang="ts">
defineProps({
  title: { type: String, default: '' },
  author: { type: String, default: '' },
  text: { type: String, default: '' }
})
</script>

<template>
  <div class="flex flex-col justify-between p-5 h-40 w-full max-w-md mx-auto rounded-2xl border border-gray-200 shadow">
    <h2 class="text-lg font-bold text-center">{{ title }}</h2>
    <p class="text-base text-center">{{ text }}</p>
    <span class="italic text-sm text-right">{{ author }}</span>
  </div>
</template>
