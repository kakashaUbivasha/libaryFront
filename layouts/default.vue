<script setup lang="ts">

import Header from "~/components/layout/Header.vue";
import Footer from "~/components/layout/Footer.vue";
</script>

<template>
  <div class="layout">
    <Header />
    <main class="layout__content">
      <slot></slot>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout__content {
  flex: 1 0 auto;
  width: 100%;
}
</style>
