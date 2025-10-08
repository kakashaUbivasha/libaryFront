<template>
  <header
      class="relative z-30 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 shadow-lg shadow-indigo-500/20 backdrop-blur-2xl transition-colors sm:gap-6 sm:px-6"
  >
    <!-- Бургер или логотип -->
    <div class="flex items-center">
      <!-- Бургер на мобиле -->
      <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="mr-2 rounded-full border border-white/10 bg-white/10 p-2 text-slate-100 transition hover:bg-white/20 md:hidden"
          aria-label="Открыть меню"
      >
        <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <!-- Логотип на десктопе -->
      <NuxtLink
          to="/"
          class="hidden select-none bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-400 bg-clip-text text-2xl font-semibold text-transparent md:block"
      >LibraryApp</NuxtLink>
    </div>

    <!-- Навигация (десктоп) -->
    <nav class="hidden flex-1 items-center justify-center space-x-5 text-sm font-medium md:flex">
      <NuxtLink to="/catalog" class="transition hover:text-indigo-200">Каталог</NuxtLink>
      <NuxtLink to="/about" class="transition hover:text-indigo-200">О нас</NuxtLink>
      <div class="relative">
        <button @click="isSearched = true" class="rounded-full bg-white/10 px-3 py-2 transition hover:bg-white/20">🔍</button>
      </div>
      <NuxtLink
          to="/reservations"
          v-if="store.currentUser?.role==='Admin'"
          class="transition hover:text-indigo-200"
      >Бронирования</NuxtLink>
      <NuxtLink to="/my-reservations" v-else class="transition hover:text-indigo-200">Мои бронирования</NuxtLink>
      <NuxtLink to="/recomendation" class="transition hover:text-indigo-200">ИИ Рекомендации</NuxtLink>
      <a href="/random/book" @click.prevent="goToRandom" class="transition hover:text-indigo-200">Случайная книга</a>
      <NuxtLink
          v-if="store.currentUser?.role==='Admin'"
          to="/admin/books/create"
          class="transition hover:text-indigo-200"
      >Добавить книгу</NuxtLink>
      <NuxtLink to="/import-files" v-if="store.currentUser?.role==='Admin'" class="transition hover:text-indigo-200">Импортировать книги</NuxtLink>
    </nav>

    <!-- Мобильное меню -->
    <transition name="fade">
      <nav
          v-if="mobileMenuOpen"
          class="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center space-y-6 bg-slate-950/85 px-0 py-8 text-lg text-slate-100 backdrop-blur-xl md:hidden"
      >
        <NuxtLink @click="closeMobile" to="/" class="transition hover:text-indigo-200">Домой</NuxtLink>
        <NuxtLink @click="closeMobile" to="/catalog" class="transition hover:text-indigo-200">Каталог</NuxtLink>
        <NuxtLink @click="closeMobile" to="/about" class="transition hover:text-indigo-200">О нас</NuxtLink>
        <button @click="showSearchMobile" class="rounded-full bg-white/10 px-4 py-2 transition hover:bg-white/20">🔍 Поиск</button>
        <NuxtLink
            @click="closeMobile"
            to="/reservations"
            v-if="store.currentUser?.role==='Admin'"
            class="transition hover:text-indigo-200"
        >Бронирования</NuxtLink>
        <NuxtLink @click="closeMobile" to="/my-reservations" v-else class="transition hover:text-indigo-200">Мои бронирования</NuxtLink>
        <NuxtLink @click="closeMobile" to="/recomendation" class="transition hover:text-indigo-200">ИИ Рекомендации</NuxtLink>
        <a @click.prevent="goToRandomMobile" href="/random/book" class="transition hover:text-indigo-200">Случайная книга</a>
        <NuxtLink
            v-if="store.currentUser?.role==='Admin'"
            @click="closeMobile"
            to="/admin/books/create"
            class="block w-full rounded-full border border-white/10 bg-white/10 px-4 py-2 text-center text-base transition hover:bg-white/20"
        >Добавить нигу</NuxtLink>
        <NuxtLink
            @click="closeMobile"
            to="/import-files"
            v-if="store.currentUser?.role==='Admin'"
            class="transition hover:text-indigo-200"
        >Импортировать книги</NuxtLink>
        <button @click="closeMobile" class="absolute right-5 top-5 text-4xl text-slate-200">&times;</button>
      </nav>
    </transition>

    <!-- Поиск (оверлей, универсальный) -->
    <transition name="fade">
      <div
          v-if="isSearched"
          class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-10 text-slate-100 backdrop-blur-xl sm:px-0"
      >
        <div class="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl sm:p-6">
          <button @click="closeInput" class="absolute right-4 top-4 text-slate-300 transition hover:text-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div class="flex w-full flex-col space-y-4">
            <!-- Поле поиска с кнопками -->
            <div class="relative flex items-center">
              <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Поиск книг..."
                  class="flex-1 rounded-full border border-white/10 bg-slate-900/60 p-3 pr-20 text-sm text-slate-100 transition placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  @keyup.enter="onSearch"
              />
              <!-- Кнопка очистки -->
              <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute right-12 rounded-full p-1 text-slate-400 transition hover:text-indigo-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <!-- Кнопка поиска -->
              <button
                  @click="onSearch"
                  class="absolute right-3 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/80 text-white transition hover:bg-indigo-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>

            <!-- Нижний блок с настройками -->
            <div class="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between">
              <div class="flex flex-wrap items-center gap-3">
                <!-- Переключатель AI поиска -->
                <label class="inline-flex cursor-pointer items-center gap-2 text-xs sm:text-sm">
                  <input v-model="isNpl" type="checkbox" class="sr-only peer">
                  <div class="relative h-5 w-10 rounded-full bg-slate-700 transition peer-focus:outline-none peer-checked:bg-indigo-500">
                    <span class="absolute left-[3px] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-slate-200 transition peer-checked:translate-x-5 peer-checked:bg-white"></span>
                  </div>
                  <span class="font-medium text-slate-200">AI Поиск</span>
                </label>

                <!-- Иконка с подсказкой -->
                <div class="group relative">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 cursor-help text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div class="absolute bottom-full left-1/2 z-10 w-60 -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-xs text-slate-100 opacity-0 shadow-xl shadow-indigo-500/20 backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:translate-y-[-4px] group-hover:opacity-100 sm:w-64 sm:text-sm">
                    Включает продвинутый поиск. Вы можете написать описание книги, и система подберёт книги с помощью ИИ.
                    <div class="absolute top-full left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 border-r border-b border-white/10 bg-slate-900/90"></div>
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
        <div class="relative" ref="dropdownRef">
          <div @click.stop="toggleDropdown" class="cursor-pointer">
            <img src="/img/products-2.jpg" alt="Profile" class="h-10 w-10 rounded-full border border-white/20 shadow-lg shadow-indigo-500/20" />
          </div>
          <ul
              v-if="isDropdownOpen"
              class="absolute right-0 z-40 mt-3 w-52 rounded-2xl border border-white/10 bg-slate-900/90 p-2 text-sm text-slate-100 shadow-xl shadow-indigo-500/20 backdrop-blur-xl"
          >
            <li class="rounded-xl px-4 py-2 transition hover:bg-white/10">
              <NuxtLink :to="`/user/${store.currentUser.id}`" @click="closeDropdown">Мой профиль</NuxtLink>
            </li>
            <li class="rounded-xl px-4 py-2 transition hover:bg-white/10">
              <NuxtLink to="/history" @click="closeDropdown">История бронирований</NuxtLink>
            </li>
            <li class="rounded-xl px-4 py-2 transition hover:bg-white/10">
              <NuxtLink to="/favorites" @click="closeDropdown">Избранные книги</NuxtLink>
            </li>
            <li class="rounded-xl px-4 py-2 text-rose-300 transition hover:bg-white/10">
              <button @click="handleLogout">Выйти</button>
            </li>
          </ul>
        </div>
      </template>
      <template v-else>
        <NuxtLink
            to="/auth/login"
            class="rounded-full border border-indigo-400/50 bg-indigo-500/80 px-4 py-2 text-sm font-semibold text-white shadow shadow-indigo-500/30 transition hover:bg-indigo-400"
        >Войти</NuxtLink>
        <NuxtLink
            to="/auth/register"
            class="rounded-full border border-sky-400/40 bg-sky-500/70 px-4 py-2 text-sm font-semibold text-white shadow shadow-sky-500/30 transition hover:bg-sky-400"
        >Зарегистрироваться</NuxtLink>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useGlobalStore } from "~/stores/global";
import { navigateTo, useRouter } from "#app";

const store = useGlobalStore();
const searchQuery = ref("");
const isDropdownOpen = ref(false);
const isSearched = ref(false);
const isNpl = ref(false);
const mobileMenuOpen = ref(false);
const dropdownRef = ref(null);
const router = useRouter();

const isAuthenticated = computed(() => store.isAuthenticated);

watch(mobileMenuOpen, (isOpen) => {
  if (!process.client) {
    return;
  }

  document.body.style.overflow = isOpen ? "hidden" : "";
});

const closeInput = () => {
  isSearched.value = false;
};
const closeMobile = () => {
  mobileMenuOpen.value = false;
};
const onSearch = () => {
  const query = searchQuery.value.trim();
  if (!query) {
    isSearched.value = true;
    return;
  }

  isSearched.value = false;
  mobileMenuOpen.value = false;

  if (isNpl.value) {
    if (!store.token) {
      console.warn('Для AI-поиска необходимо авторизоваться. Выполняем обычный поиск.');
      navigateTo(`/search/${encodeURIComponent(query)}`);
    } else {
      navigateTo({
        path: `/search/${encodeURIComponent(query)}`,
        query: { ai: '1' }
      });
    }
  } else {
    navigateTo(`/search/${encodeURIComponent(query)}`);
  }

  searchQuery.value = "";
};
const showSearchMobile = () => {
  closeMobile();
  isSearched.value = true;
};
function goToRandom() {
  if (process.client) {
    window.location.assign('/random/book');
  } else {
    router.push('/random/book');
  }
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

const handleClickOutside = (event) => {
  if (!isDropdownOpen.value) {
    return;
  }

  const container = dropdownRef.value;
  const target = event.target;
  if (container && target && !container.contains(target)) {
    isDropdownOpen.value = false;
  }
};

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    isDropdownOpen.value = false;
    isSearched.value = false;
    mobileMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleKeydown);
  if (process.client) {
    document.body.style.overflow = "";
  }
});
</script>
