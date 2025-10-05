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
  "Искать книги по автору, жанру или популярности.",
  "Читать отзывы и делиться своими впечатлениями.",
  "Резервировать книги для чтения в библиотеке или на вынос.",
  "Получать персональные рекомендации благодаря AI."
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
    <div class="relative h-[80vh] w-full bg-image-my bg-cover bg-center bg-no-repeat -mt-[170px] rounded-b-2xl">
      <div class="absolute top-[35%] sm:top-1/2 left-1/2 transform -translate-x-1/2 sm:-translate-y-1/2 bg-black/30 text-white text-center p-5 rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.7)] animate-fadeIn">
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2">Добро пожаловать в Библиотеку</h1>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">"Эпоха Знаний"</h1>
        <p class="text-base sm:text-xl lg:text-2xl animate-fadeIn delay-500">Место, где живут истории и рождаются идеи</p>
      </div>
    </div>

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

      <div class="bg-gray-50 max-w-4xl mx-auto p-6 sm:p-8 rounded-lg shadow-md">
        <transition
            enter-active-class="animate-fadeBounce"
            appear
        >
          <div v-if="showContent" class="mb-8">
            <h2 class="text-3xl sm:text-4xl font-bold mb-4">О нашей библиотеке</h2>
            <p class="text-lg sm:text-xl">
              Добро пожаловать на платформу "Эпоха Знаний" — ваш личный проводник в мире книг.
              Здесь вы можете:
            </p>
          </div>
        </transition>

        <div v-for="(item, index) in listItems" :key="item" :data-aos="index%2==0?'fade-right':'fade-left'">
          <p class="text-xl sm:text-2xl max-w-3xl mx-auto my-8 sm:my-10 py-8 border border-gray-200 shadow-sm">
            {{ item }}
          </p>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="mb-10 sm:mb-16 px-4">
      <div class="mb-8 sm:mb-12 flex flex-col items-center gap-5">
        <h2 class="text-2xl sm:text-3xl font-bold">Сейчас в библиотеке:</h2>
        <span class="text-xl sm:text-2xl italic">7231 книги</span>
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
          <swiper-slide v-for="(slide, idx) in statistics" :key="idx" class="bg-gray-50">
            <div class="flex flex-col items-center justify-between gap-3 p-4">
              <img :src="slide.imageSrc" alt="" class="w-12 h-12">
              <h3 class="font-medium text-lg">{{ slide.title }}</h3>
              <span class="italic">{{ slide.text }}</span>
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
    <div class="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Топовые пользователи</h2>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
            v-for="user in store.topUsers"
            :key="user.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <NuxtLink
              :to="`/user/${user.id}`"
              class="flex flex-col items-center p-4"
          >
            <div class="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold mb-3">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <div class="text-center">
              <h3 class="font-medium text-gray-900 hover:text-blue-500 transition-colors">
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
.bg-image-my{
  background-image: url("../public/img/libary.jpg");
}
</style>