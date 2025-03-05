<script setup lang="ts">

import Header from "~/components/layout/Header.vue";
import Footer from "~/components/layout/Footer.vue";
</script>

<template>
<Header/>
  <slot></slot>
  <Footer/>
</template>

<style scoped>

</style>