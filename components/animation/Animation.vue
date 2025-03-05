<template>
  <div
      ref="blockRef"
      class="scroll-reveal-block transition-all duration-700 ease-out"
      :class="{
      'opacity-0': !isVisible,
      'opacity-100': isVisible,
      'translate-x-[-50px]': !isVisible && direction === 'left',
      'translate-x-[50px]': !isVisible && direction === 'right',
      'translate-x-0': isVisible
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  direction: {
    type: String,
    validator: (value) => ['left', 'right'].includes(value),
    default: 'right'
  },
  delay: {
    type: Number,
    default: 0
  }
})

const blockRef = ref(null)
const isVisible = ref(false)
const isClientSide = ref(false)

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
}

const handleIntersect = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        isVisible.value = true
      }, props.delay)
    } else {
      isVisible.value = false
    }
  })
}

let observer = null

onMounted(() => {
  // Устанавливаем флаг клиентской стороны
  isClientSide.value = true

  // Создаем Observer только на клиенте
  if (process.client) {
    observer = new IntersectionObserver(handleIntersect, observerOptions)

    if (blockRef.value) {
      observer.observe(blockRef.value)
    }
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>