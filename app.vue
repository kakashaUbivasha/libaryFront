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
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

const authStore = useGlobalStore();
const isInitialized = ref(false);
let tokenCheckTimeout;

function scheduleTokenCheck() {
  if (tokenCheckTimeout) {
    clearTimeout(tokenCheckTimeout);
    tokenCheckTimeout = null;
  }

  const token = process.client ? localStorage.getItem("token") : null;
  if (!token) return;

  let delay = 30 * 60 * 1000; // по умолчанию раз в 30 минут
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload?.exp) {
      const timeToExpiry = payload.exp * 1000 - Date.now();
      // проверяем токен за 5 минут до истечения срока
      delay = Math.max(timeToExpiry - 5 * 60 * 1000, 5 * 60 * 1000);
    }
  } catch (e) {
    // игнорируем ошибки парсинга и используем интервал по умолчанию
  }

  tokenCheckTimeout = setTimeout(async () => {
    try {
      await authStore.getUser();
    } finally {
      scheduleTokenCheck();
    }
  }, delay);
}

onMounted(async () => {
  await authStore.initialize();
  console.log("App.vue: Initialize complete, currentUser:", authStore.currentUser);
  isInitialized.value = true;
  scheduleTokenCheck();
});

// Перезапускаем проверку при изменении токена (логин/логаут)
watch(() => authStore.token, () => {
  scheduleTokenCheck();
});

onBeforeUnmount(() => {
  if (tokenCheckTimeout) {
    clearTimeout(tokenCheckTimeout);
  }
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