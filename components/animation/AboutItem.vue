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
  margin-bottom: 40px;
  .list{
    font-size: 24px;
    margin-bottom: 20px;
  }
}
</style>