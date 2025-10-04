<script setup lang="ts">
  defineProps({
    title: String,
    items: Array,
    style1: String,
    style2: String,
  })
</script>

<template>
  <div class="section1">
    <div data-aos="fade-left" class="">
      <h4>{{title}}</h4>
    </div>
    <div v-for="(item, index) in items" class="">
      <div :data-aos="index % 2 === 0 ? `${style1}` : `${style2}`" class="">
        <p class="list" v-html="item"></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section1{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: clamp(1.25rem, 3vw, 2rem);
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
  .list{
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    margin-bottom: clamp(1rem, 2.5vw, 1.75rem);
    line-height: 1.6;
  }
}
</style>