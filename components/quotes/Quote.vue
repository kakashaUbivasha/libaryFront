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
  <h2 class="text-1xl">{{title}}</h2>
  <p ref="textRef">{{text}}</p>
  <span>{{author}}</span>
</div>
</template>

<style scoped>
.item{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
    border: 1px solid #eaeaea;
    padding: 20px;
    border-radius: 20px;
    width: 100%;
    height: 150px;
    overflow: hidden;
    box-shadow:
        0 4px 8px rgba(0, 0, 0, 0.1);  /* Мягкая тень снизу */
        /* Глубокая тень для объёмности */

    h2{
      font-size: 18px !important;
      font-weight: 700;
      text-align: center;
    }
    p{
      font-size: 16px !important;
      text-align: center;
      overflow-wrap: break-word;
      flex-grow: 1;
    }
    span{
      font-style: italic;
      font-size: 12px;
      text-align: end;
    }
  }
  </style>