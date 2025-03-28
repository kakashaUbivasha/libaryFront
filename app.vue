<template>
  <div>
    <!-- Показываем загрузку, пока инициализация не завершена -->
    <div v-if="!isInitialized" class="loading">Загрузка...</div>
    <!-- Рендерим содержимое только после инициализации -->
    <nuxt-layout v-else>
      <nuxt-page />
    </nuxt-layout>
  </div>
</template>

<script setup>
import { useGlobalStore } from "~/stores/global";
import { ref, onMounted } from "vue";

const authStore = useGlobalStore();
const isInitialized = ref(false);

onMounted(async () => {
  // Выполняем инициализацию
  await authStore.initialize();
  console.log("App.vue: Initialize complete, currentUser:", authStore.currentUser);
  isInitialized.value = true; // Устанавливаем флаг после завершения

  // Периодическая проверка (раз в 30 минут)
  setInterval(async () => {
    console.log("Periodic check");
    if (localStorage.getItem("token") && !authStore.currentUser) {
      await authStore.getUser();
    }
  }, 30 * 60 * 1000);
});
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #333;
}
</style>