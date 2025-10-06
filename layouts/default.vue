<script setup lang="ts">

import Header from "~/components/layout/Header.vue";
import Footer from "~/components/layout/Footer.vue";
</script>

<template>
  <div class="relative min-h-screen overflow-hidden text-slate-100">
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-32 -top-40 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl sm:h-80 sm:w-80"></div>
      <div class="absolute bottom-[-180px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"></div>
      <div class="absolute right-[-120px] top-1/3 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl"></div>
      <div class="absolute left-[20%] top-[60%] h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl"></div>
    </div>

    <div class="relative flex min-h-screen flex-col">
      <div class="px-3 pt-4 sm:px-6 lg:px-10">
        <Header />
      </div>
      <main class="relative z-10 flex-1 px-3 pb-12 pt-6 sm:px-6 lg:px-10">
        <div class="mx-auto w-full max-w-7xl">
          <slot></slot>
        </div>
      </main>
      <div class="px-3 pb-6 sm:px-6 lg:px-10">
        <Footer />
      </div>
    </div>
  </div>
</template>
