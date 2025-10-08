<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

defineProps({
  title: '',
  author: '',
  text: ''
})

const containerRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)

const fitText = () => {
  const container = containerRef.value
  const textEl = textRef.value
  if (!container || !textEl) return
  let fontSize = parseFloat(getComputedStyle(textEl).fontSize)
  while (container.scrollHeight > container.clientHeight && fontSize > 12) {
    fontSize -= 1
    textEl.style.fontSize = `${fontSize}px`
  }
}

onMounted(async () => {
  await nextTick()
  fitText()
})
</script>

<template>
<div class="item" ref="containerRef">
  <h2>{{title}}</h2>
  <p ref="textRef">{{text}}</p>
  <span>{{author}}</span>
</div>
</template>

<style scoped>
.item{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  border-radius: 20px;
  width: 100%;
  height: 150px;
  overflow: hidden;
  color: #e2e8f0;
  text-shadow: 0 6px 18px rgba(15, 23, 42, 0.6);

  h2{
    font-size: clamp(1.125rem, 2.2vw, 1.5rem);
    font-weight: 700;
    text-align: center;
  }
  p{
    font-size: clamp(1rem, 2vw, 1.25rem);
    text-align: center;
    overflow-wrap: break-word;
    flex-grow: 1;
    color: rgba(226, 232, 240, 0.9);
  }
  span{
    font-style: italic;
    font-size: clamp(0.875rem, 1.8vw, 1rem);
    text-align: end;
    color: rgba(165, 180, 252, 0.9);
  }
}
  </style>