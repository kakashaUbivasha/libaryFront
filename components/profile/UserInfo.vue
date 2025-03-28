<script setup lang="ts">
import Reviews from "~/components/profile/Reviews.vue";

defineProps({
  name: String,
  level: String,
  totalBooks: String,
  registerDate: String,
  isCurrentUser: Boolean,
  array: [],
});

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
  <div class="flex flex-col items-center justify-center p-10 rounded-3xl bg-user-main" :style="getBackgroundStyle()">
    <div class="bg-user px-20 py-10">
      <div class="text-center flex flex-col justify-center items-center">
        <img src="/img/img1.jpg" alt="User avatar" class="mb-5" /> <!-- Обновил путь и добавил alt -->
        <p class="text-xl font-bold">{{ name }}</p>
        <span>Уровень: {{ level }}</span>
      </div>
      <div class="text-center">
        <p>Количество прочитанных книг: {{ totalBooks }}</p>
        <p :class="isCurrentUser ? 'mb-10' : ''">С нами с: {{ formatDate(registerDate) }}</p>
        <span class="bg-red-500 hover:bg-red-600 py-2 px-5 rounded-md text-white cursor-pointer" v-if="isCurrentUser">Выйти</span>
      </div>
    </div>
  </div>
  <div class="my-20">
    <h2 class="text-center text-2xl mb-10">Рецензии пользователя</h2>
    <reviews :array="array" />
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