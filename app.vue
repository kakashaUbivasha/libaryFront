<template>
  <div>
    <!-- Показываем загрузку, пока инициализация не завершена -->
    <div v-if="!isInitialized" class="loading">
      <span class="loading__spinner"></span>
      <p class="loading__text">Загружаем библиотеку будущего...</p>
    </div>
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 18px;
  height: 100vh;
  color: #e2e8f0;
  background:
    radial-gradient(120% 120% at 0% 0%, rgba(99, 102, 241, 0.4) 0%, rgba(15, 23, 42, 0) 60%),
    radial-gradient(80% 80% at 100% 0%, rgba(244, 114, 182, 0.25) 0%, rgba(4, 8, 21, 0) 65%),
    radial-gradient(120% 120% at 50% 100%, rgba(56, 189, 248, 0.18) 0%, rgba(4, 8, 21, 0) 70%),
    linear-gradient(180deg, #020617 0%, #050b19 45%, #030617 100%);
}

.loading__spinner {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 4px solid rgba(148, 163, 184, 0.25);
  border-top-color: rgba(129, 140, 248, 0.9);
  animation: spin 0.9s linear infinite;
}

.loading__text {
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.85);
  text-align: center;
  line-height: 1.6;
  max-width: min(90vw, 420px);
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .loading__text {
    font-size: 1rem;
    letter-spacing: 0.06em;
    padding: 0 1.5rem;
  }
}

@media (max-width: 480px) {
  .loading__text {
    font-size: 0.9rem;
    letter-spacing: 0.04em;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
