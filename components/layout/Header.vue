<template>
  <header class="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200 relative z-10">
    <!-- Бургер или логотип -->
    <div class="flex items-center">
      <!-- Бургер на мобиле -->
      <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden focus:outline-none mr-2"
          aria-label="Открыть меню"
      >
        <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <!-- Логотип на десктопе -->
      <NuxtLink to="/" class="hidden md:block text-2xl font-bold text-indigo-600 select-none">LibraryApp</NuxtLink>
    </div>

    <!-- Навигация (десктоп) -->
    <nav class="hidden md:flex flex-1 justify-center items-center space-x-6">
      <NuxtLink to="/catalog" class="text-indigo-600 hover:text-indigo-700">Каталог</NuxtLink>
      <NuxtLink to="/about" class="text-indigo-600 hover:text-indigo-700">О нас</NuxtLink>
      <div class="relative">
        <button @click="isSearched = true" class="px-2 py-1 rounded hover:bg-indigo-100">🔍</button>
      </div>
      <NuxtLink to="/reservations" v-if="store.currentUser?.role==='Admin'" class="text-indigo-600 hover:text-indigo-700">Бронирования</NuxtLink>
      <NuxtLink to="/my-reservations" v-else class="text-indigo-600 hover:text-indigo-700">Мои бронирования</NuxtLink>
      <NuxtLink to="/recomendation" class="text-indigo-600 hover:text-indigo-700">ИИ Рекомендации</NuxtLink>
      <a href="/random/book" @click.prevent="goToRandom" class="text-indigo-600 hover:text-indigo-700">Случайная книга</a>
      <NuxtLink
          v-if="store.currentUser?.role==='Admin'"
          to="/admin/books/create"
          class="text-indigo-600 hover:text-indigo-700"
      >Добавить книгу</NuxtLink>
      <NuxtLink to="/import-files" v-if="store.currentUser?.role==='Admin'" class="text-indigo-600 hover:text-indigo-700">Импортировать книги</NuxtLink>
    </nav>

    <!-- Мобильное меню -->
    <transition name="fade">
      <nav
          v-if="mobileMenuOpen"
          class="fixed inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-stretch justify-start overflow-y-auto max-h-screen z-50 md:hidden"
      >
        <div class="w-full max-w-xs sm:max-w-sm mx-auto my-8 p-6 bg-gray-800 rounded-lg flex flex-col space-y-6 relative">
          <div class="flex justify-end">
            <button @click="closeMobile" class="text-white text-3xl leading-none focus:outline-none">&times;</button>
          </div>
          <div class="flex flex-col space-y-4">
            <NuxtLink @click="closeMobile" to="/catalog" class="block w-full text-left text-lg text-white px-3 py-2 rounded-md hover:bg-gray-700 transition">Каталог</NuxtLink>
            <NuxtLink @click="closeMobile" to="/about" class="block w-full text-left text-lg text-white px-3 py-2 rounded-md hover:bg-gray-700 transition">О нас</NuxtLink>
            <button @click="showSearchMobile" class="w-full text-left text-lg text-white px-3 py-2 rounded-md hover:bg-gray-700 transition">🔍 Поиск</button>
            <NuxtLink @click="closeMobile" to="/reservations" v-if="store.currentUser?.role==='Admin'" class="block w-full text-left text-lg text-white px-3 py-2 rounded-md hover:bg-gray-700 transition">Бронирования</NuxtLink>
            <NuxtLink @click="closeMobile" to="/my-reservations" v-else class="block w-full text-left text-lg text-white px-3 py-2 rounded-md hover:bg-gray-700 transition">Мои бронирования</NuxtLink>
            <NuxtLink @click="closeMobile" to="/recomendation" class="block w-full text-left text-lg text-white px-3 py-2 rounded-md hover:bg-gray-700 transition">ИИ Рекомендации</NuxtLink>
            <a @click.prevent="goToRandomMobile" href="/random/book" class="block w-full text-left text-lg text-white px-3 py-2 rounded-md hover:bg-gray-700 transition">Случайная книга</a>
            <NuxtLink
                v-if="store.currentUser?.role==='Admin'"
                @click="closeMobile"
                to="/admin/books/create"
                class="block w-full text-left text-lg text-white px-3 py-2 rounded-md hover:bg-gray-700 transition"
            >Добавить книгу</NuxtLink>
            <NuxtLink @click="closeMobile" to="/import-files" v-if="store.currentUser?.role==='Admin'" class="block w-full text-left text-lg text-white px-3 py-2 rounded-md hover:bg-gray-700 transition">Импортировать книги</NuxtLink>
          </div>
        </div>
      </nav>
    </transition>

    <!-- Поиск (оверлей, универсальный) -->
    <transition name="fade">
      <div v-if="isSearched" class="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-4 mt-12 rounded-lg shadow-lg w-full max-w-md relative">
          <button @click="closeInput" class="absolute top-2 right-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div class="flex flex-col space-y-3 w-full max-w-xs">
            <!-- Поле поиска с кнопками -->
            <div class="relative flex items-center">
              <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Поиск книг..."
                  class="flex-1 p-2 pr-16 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                  @keyup.enter="onSearch"
              />
              <!-- Кнопка очистки -->
              <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute right-10 p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <!-- Кнопка поиска -->
              <button
                  @click="onSearch"
                  class="absolute right-2 p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>

            <!-- Нижний блок с настройками -->
            <div class="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
              <div class="flex items-center space-x-2 sm:space-x-3">
                <!-- Переключатель AI поиска -->
                <label class="inline-flex items-center cursor-pointer">
                  <input v-model="isNpl" type="checkbox" class="sr-only peer">
                  <div class="relative w-8 h-4 sm:w-10 sm:h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] sm:after:top-[2px] sm:after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 sm:after:h-4 sm:after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span class="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-700">AI Поиск</span>
                </label>

                <!-- Иконка с подсказкой -->
                <div class="relative group">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div class="absolute z-10 left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-48 sm:w-64 bg-gray-800 text-white text-xs sm:text-sm rounded-lg py-1 px-2 sm:py-2 sm:px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg whitespace-normal">
                    Включает продвинутый поиск. Вы можете написать описание книги, и система подберёт книги с помощью ИИ.
                    <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-gray-800 border-solid"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Профиль/авторизация (справа) -->
    <div class="flex items-center space-x-2">
      <template v-if="isAuthenticated">
        <div class="relative">
          <div @click="toggleDropdown" class="cursor-pointer">
            <img src="/img/products-2.jpg" alt="Profile" class="w-10 h-10 rounded-full" />
          </div>
          <ul v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <li class="px-4 py-2 hover:bg-gray-100"><NuxtLink :to="`/user/${store.currentUser.id}`" @click="closeDropdown">Мой профиль</NuxtLink></li>
            <li class="px-4 py-2 hover:bg-gray-100"><NuxtLink to="/history" @click="closeDropdown">История бронирований</NuxtLink></li>
            <li class="px-4 py-2 hover:bg-gray-100"><NuxtLink to="/favorites" @click="closeDropdown">Избранные книги</NuxtLink></li>
            <li class="px-4 py-2 text-red-500 hover:bg-gray-100"><button @click="handleLogout">Выйти</button></li>
          </ul>
        </div>
      </template>
      <template v-else>
        <NuxtLink to="/auth/login" class="px-3 py-1 bg-indigo-600 text-white rounded-md">Войти</NuxtLink>
        <NuxtLink to="/auth/register" class="px-3 py-1 bg-indigo-600 text-white rounded-md">Зарегистрироваться</NuxtLink>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useGlobalStore } from "~/stores/global";
import { navigateTo, useRouter } from "#app";

const store = useGlobalStore();
const searchQuery = ref("");
const isDropdownOpen = ref(false);
const isSearched = ref(false);
const isNpl = ref(false);
const mobileMenuOpen = ref(false);
const router = useRouter();

const isAuthenticated = computed(() => store.isAuthenticated);

const closeInput = () => {
  isSearched.value = false;
};
const closeMobile = () => {
  mobileMenuOpen.value = false;
};
const onSearch = () => {
  if (searchQuery.value.trim()) {
    isSearched.value = false;
    navigateTo(`/search/${encodeURIComponent(searchQuery.value.trim())}`);
    searchQuery.value = "";
    mobileMenuOpen.value = false;
  } else {
    isSearched.value = true;
  }
};
const showSearchMobile = () => {
  closeMobile();
  isSearched.value = true;
};
function goToRandom() {
  router.push({ path: '/random/book', force: true });
}
function goToRandomMobile() {
  closeMobile();
  goToRandom();
}
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
const closeDropdown = () => {
  isDropdownOpen.value = false;
};
const handleLogout = () => {
  store.logout();
  closeDropdown();
};
</script>
