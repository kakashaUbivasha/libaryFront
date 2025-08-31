<script setup lang="ts">

import Header from "~/components/layout/Header.vue";
import Footer from "~/components/layout/Footer.vue";
</script>

<template>
  <Header />
  <div class="container mx-auto px-4 sm:px-6">
    <slot />
  </div>
  <Footer />
</template>

<style scoped>

</style>