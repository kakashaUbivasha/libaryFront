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
let tokenExpiry = 0;

function updateTokenInfo() {
  tokenExpiry = 0;
  const token = authStore.token;
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload?.exp) {
      tokenExpiry = payload.exp * 1000;
    }
  } catch (e) {
    // ignore parsing errors
  }
}

function scheduleTokenCheck() {
  if (tokenCheckTimeout) {
    clearTimeout(tokenCheckTimeout);
    tokenCheckTimeout = null;
  }

  if (!authStore.token || !tokenExpiry) return;

  const timeToExpiry = tokenExpiry - Date.now();
  const delay = Math.max(timeToExpiry - 5 * 60 * 1000, 5 * 60 * 1000);

  tokenCheckTimeout = setTimeout(async () => {
    try {
      await authStore.getUser();
    } finally {
      updateTokenInfo();
      scheduleTokenCheck();
    }
  }, delay);
}

onMounted(async () => {
  await authStore.initialize();
  isInitialized.value = true;
  updateTokenInfo();
  scheduleTokenCheck();
});

// Перезапускаем проверку при изменении токена (логин/логаут)
watch(() => authStore.token, () => {
  updateTokenInfo();
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