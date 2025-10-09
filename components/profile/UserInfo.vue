<script setup lang="ts">
import { toRefs } from "vue";
import { useRouter } from "nuxt/app";
import Reviews from "~/components/profile/Reviews.vue";
import { useGlobalStore } from "~/stores/global";

const props = defineProps({
  name: String,
  level: String,
  totalBooks: String,
  registerDate: String,
  isCurrentUser: Boolean,
  array: [],
});

const { name, level, totalBooks, registerDate, isCurrentUser, array } = toRefs(props);

const store = useGlobalStore();
const router = useRouter();

const handleLogout = async () => {
  await store.logout();
  if (isCurrentUser.value) {
    await router.push("/auth/login");
  }
};

// Функция для форматирования даты
const formatDate = (isoDate: string) => {
  if (!isoDate) return "Не указано"; // Обработка пустого значения
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
  ];

  return `${day} ${months[month]} ${year}`;
};

// Функция для стиля фона
const getBackgroundStyle = () => {
  const imageUrl = '/img/back_user.jpg';
  const currentHour = new Date().getHours();
  if (currentHour >= 21 && currentHour < 24) { // Исправил 25 на 24 для корректного диапазона
    return {
      backgroundImage: `url(/img/back_user_dark.jpg)`,
    };
  }
  return {
    backgroundImage: `url(${imageUrl})`,
  };
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-3xl bg-user-main p-6 sm:p-10"
    :style="getBackgroundStyle()"
  >
    <div class="bg-user w-full max-w-xs px-6 py-8 text-gray-900 sm:max-w-2xl sm:px-20 sm:py-10">
      <div class="text-center flex flex-col justify-center items-center">
        <img src="/img/img1.jpg" alt="User avatar" class="mb-5" /> <!-- Обновил путь и добавил alt -->
        <p class="text-xl font-bold text-gray-900">{{ name }}</p>
        <span class="text-gray-700">Уровень: 1</span>
      </div>
      <div class="text-center text-gray-800">
        <p>Количество прочитанных книг: {{ totalBooks }}</p>
        <p :class="['text-gray-800', isCurrentUser ? 'mb-10' : '']">С нами с: {{ formatDate(registerDate) }}</p>
        <button
          v-if="isCurrentUser"
          type="button"
          class="bg-red-500 hover:bg-red-600 py-2 px-5 rounded-md text-white cursor-pointer transition"
          @click="handleLogout"
        >
          Выйти
        </button>
      </div>
    </div>
  </div>
  <div class="my-20">
    <h2 class="text-center text-2xl mb-10">Рецензии пользователя</h2>
    <reviews v-if="array && array.length" :array="array" />
    <h2 v-else class="text-center text-xl mb-10">У пользователя нет рецензий(</h2>
  </div>
</template>

<style scoped>
img {
  max-width: 200px;
}
.bg-user-main {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
}
.bg-user {
  background: rgba(255, 255, 255, 0.8); /* Исправил 256 на 255, максимальное значение RGB */
}
</style>