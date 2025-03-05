<script setup lang="ts">
import {ref} from "vue";
defineProps({
  array: []
})
const containerRef = ref(null)
const swiper = useSwiper(containerRef, {

  loop: true,
  autoplay: {
    delay: 3000,
  },
  spaceBetween: 20,
  slidesPerView: 3,
  direction: 'horizontal',
})
const wordCut = (string: string) => {
  if(string.length > 200){
    return string.substr(0, 200) + '...';
  }
  return string
}
</script>

<template>
  <ClientOnly>
    <swiper-container ref="containerRef" :init="false">
      <swiper-slide
          v-for="(slide, idx) in array"
          :key="idx"
          style="background-color: #F0F4F8;"
      >
        <div class="reviews">
          <h3>{{slide.title}}</h3>
          <span>{{wordCut(slide.text)}}</span>
        </div>
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<style scoped>
.reviews{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border: 1px solid #6A5ACD;
  padding: 20px;
  height: 150px;
}
</style>