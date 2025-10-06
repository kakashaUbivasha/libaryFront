<script setup>
import { ref, onMounted, nextTick } from "vue";
import NewBooks from "~/components/books/NewBooks.vue";
import EducationBooks from "~/components/books/EducationBooks.vue";
import {useGlobalStore} from "~/stores/global";
import Quotes from "~/components/quotes/Quotes.vue";

const store = useGlobalStore()
const statistics = ref([
  { imageSrc: 'https://openlibrary.org/static/images/categories/recipes.svg', title: 'Рецепты', text: '1500 книг' },
  { imageSrc: 'https://openlibrary.org/static/images/categories/romance.svg', title: 'Романтика', text: '3100 книг' },
  { imageSrc: 'https://openlibrary.org/static/images/categories/biographies.svg', title: 'Биографии', text: '2000 книг' },
  { imageSrc: 'https://openlibrary.org/static/images/categories/fantasy.svg', title: 'Фэнтези', text: '4700 книг' },
  { imageSrc: 'https://openlibrary.org/static/images/categories/science.svg', title: 'Наука', text: '3400 книг' },
  { imageSrc: 'https://openlibrary.org/static/images/categories/history.svg', title: 'История', text: '2800 книг' },
  { imageSrc: 'https://openlibrary.org/static/images/categories/art.svg', title: 'Поэзия', text: '1200 книг' },
  { imageSrc: 'https://openlibrary.org/static/images/categories/classics.svg', title: 'Классика', text: '3900 книг' },
  { imageSrc: 'https://openlibrary.org/static/images/categories/science_fiction.svg', title: 'Научная фантастика', text: '4100 книг' },
])

const showContent = ref(false);
const listItems = ref([
  "Находите книги по жанрам, авторам и коллекциям в пару кликов.",
  "Бронируйте экземпляры заранее и забирайте их в удобное время.",
  "Получайте персональные AI-рекомендации на основе ваших интересов.",
  "Обменивайтесь отзывами с другими читателями и ведите историю чтения."
]);

const fallingElements = ref([])

onMounted(() => {
  fallingElements.value = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    size: `${20 + Math.random() * 40}px`
  }))

  nextTick(() => {
    setTimeout(() => {
      showContent.value = true;
    }, 300);
  });

  store.getTopUsers()
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative -mt-[170px] pb-12 pt-32">
      <div class="mx-auto max-w-6xl">
        <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/90 via-indigo-900/70 to-slate-950/80 px-6 py-16 text-center shadow-2xl shadow-indigo-500/20 sm:px-10 lg:px-16">
          <div class="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl"></div>
          <div class="pointer-events-none absolute -right-16 bottom-10 h-44 w-44 rounded-full bg-sky-500/30 blur-3xl"></div>
          <div class="relative z-10 space-y-4">
            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200/90">Библиотечный портал нового поколения</p>
            <h1 class="text-3xl font-bold text-slate-100 sm:text-4xl lg:text-5xl">Добро пожаловать в Библиотеку</h1>
            <h2 class="text-3xl font-bold text-slate-100 sm:text-4xl lg:text-5xl">«Эпоха Знаний»</h2>
            <p class="mx-auto max-w-3xl text-base text-slate-200/90 sm:text-lg lg:text-xl">
              Здесь вы бронируете любимые книги и получаете точные рекомендации от искусственного интеллекта, настроенного на ваши литературные предпочтения.
            </p>
            <div class="flex flex-wrap justify-center gap-3 pt-4 text-sm text-slate-200/80 sm:text-base">
              <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">Быстрая бронь книг</span>
              <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">Умные подборки</span>
              <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">Комьюнити читателей</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="relative py-12 sm:py-16 text-center overflow-hidden">
      <div class="absolute inset-0 pointer-events-none -z-10">
        <div
            v-for="element in fallingElements"
            :key="element.id"
            class="absolute top-5 opacity-0 animate-fall"
            :style="{
              left: element.left,
              animationDelay: element.delay,
              fontSize: element.size
            }"
        >
          📖
        </div>
      </div>

      <div class="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-indigo-500/20 backdrop-blur">
        <transition
            enter-active-class="animate-fadeBounce"
            appear
        >
          <div v-if="showContent" class="mb-8">
            <h2 class="text-3xl sm:text-4xl font-bold mb-4 text-slate-100">О нашей библиотеке</h2>
            <p class="text-lg sm:text-xl text-slate-200/90">
              Добро пожаловать на платформу "Эпоха Знаний" — ваш личный проводник в мире книг.
              Здесь вы можете:
            </p>
          </div>
        </transition>

        <div v-for="(item, index) in listItems" :key="item" :data-aos="index%2==0?'fade-right':'fade-left'">
          <p class="text-xl sm:text-2xl text-slate-100 max-w-3xl mx-auto my-8 sm:my-10 rounded-2xl border border-white/5 bg-white/5 px-6 py-8 shadow-md shadow-indigo-500/10 backdrop-blur">
            {{ item }}
          </p>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="mb-10 sm:mb-16 px-4">
      <div class="mb-8 sm:mb-12 flex flex-col items-center gap-5">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-100">Сейчас в библиотеке:</h2>
        <span class="text-xl sm:text-2xl italic text-indigo-200">7231 книги</span>
      </div>

      <ClientOnly>
        <swiper-container
            init="false"
            loop="true"
            autoplay-delay="3000"
            space-between="20"
            slides-per-view="2"
            breakpoints='{
            "640": {"slidesPerView": 3},
            "768": {"slidesPerView": 4},
            "1024": {"slidesPerView": 5}
          }'
        >
          <swiper-slide v-for="(slide, idx) in statistics" :key="idx" class="rounded-2xl border border-white/10 bg-slate-950/60">
            <div class="flex flex-col items-center justify-between gap-3 p-5 text-slate-100">
              <img :src="slide.imageSrc" alt="" class="h-12 w-12 opacity-90">
              <h3 class="text-lg font-semibold text-indigo-100">{{ slide.title }}</h3>
              <span class="italic text-slate-200/80">{{ slide.text }}</span>
            </div>
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </section>

    <!-- Sections with Books -->
    <div class="container mx-auto px-4 sm:px-6">
      <NuxtLink to="/" class="block mb-6">
        <h1 class="text-3xl sm:text-4xl font-bold text-center">Новинки</h1>
      </NuxtLink>
      <NewBooks />

      <Quotes />

      <NuxtLink to="/" class="block my-6 sm:my-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-center">Образовательные книги</h1>
      </NuxtLink>
      <EducationBooks />

      <Quotes />

      <NuxtLink to="/" class="block my-6 sm:my-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-center">Случайные книги</h1>
      </NuxtLink>
      <Books />
    </div>

    <!-- Top Users Section -->
    <div
        v-if="store.topUsers && store.topUsers.length"
        class="max-w-7xl mx-auto px-4 py-6 sm:py-8"
    >
      <h2 class="mb-6 text-center text-2xl font-bold text-slate-100">Топовые пользователи</h2>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <div
            v-for="user in store.topUsers"
            :key="user.id"
            class="rounded-2xl border border-white/10 bg-slate-950/60 shadow-lg shadow-indigo-500/10 transition-transform hover:-translate-y-1 hover:shadow-indigo-500/20"
        >
          <NuxtLink
              :to="`/user/${user.id}`"
              class="flex flex-col items-center gap-3 p-5 text-slate-100"
          >
            <div class="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-indigo-500/80 text-lg font-bold text-white shadow-lg shadow-indigo-500/30">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <div class="text-center">
              <h3 class="font-medium text-slate-100 transition-colors hover:text-indigo-200">
                {{ user.name }}
              </h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeBounce {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  50% {
    transform: translateY(20%);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fall {
  0% {
    transform: translateY(-50px) rotate(0deg);
    opacity: 0.4;
  }
  100% {
    transform: translateY(80vh) rotate(360deg);
  }
}

.animate-fadeIn {
  animation: fadeIn 2s ease;
}

.animate-fadeBounce {
  animation: fadeBounce 1s ease-out;
}

.animate-fall {
  animation: fall 10s linear infinite;
}
</style>