<script setup>
import { ref, onMounted, nextTick } from "vue";
import NewBooks from "~/components/books/NewBooks.vue";
import EducationBooks from "~/components/books/EducationBooks.vue";
import Quote from "~/components/quotes/Quote.vue";
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
const containerRef = ref(null)
const swiper = useSwiper(containerRef, {

  loop: true,
  autoplay: {
    delay: 3000,
  },
  spaceBetween: 20,
  slidesPerView: 5,
  direction: 'horizontal',
})
const showContent = ref(false);
const listItems = ref([
  "Искать книги по автору, жанру или популярности.",
  "Читать отзывы и делиться своими впечатлениями.",
  "Резервировать книги для чтения в библиотеке или на вынос.",
  "Получать персональные рекомендации благодаря AI."
]);

const itemClass = (index) =>
    index % 2 === 0 ? "from-left" : "from-right";

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      showContent.value = true;
    }, 300); // Показать текст через 300 мс
  });
});
const fallingElements = ref([])

onMounted(() => {
  fallingElements.value = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    size: `${20 + Math.random() * 40}px`
  }))
})
</script>

<template>
  <div class="">
    <div class="background">
      <div class="hero-overlay">
        <h1 class="hero-title">Добро пожаловать в Библиотеку</h1>
        <h1 class="hero-title">"Эпоха Знаний"</h1>
        <p class="hero-slogan">Место, где живут истории и рождаются идеи</p>
      </div>
    </div>

    <section class="about main">
      <div class="falling-elements">
        <div
            v-for="element in fallingElements"
            :key="element.id"
            class="falling-element"
            :style="{
        left: element.left,
        animationDelay: element.delay,
        fontSize: element.size
      }"
        >
          📖
        </div>
      </div>
      <div class="about-text">
        <transition name="fade-bounce">
          <div class="about-header" v-if="showContent">
            <h2>О нашей библиотеке</h2>
            <p>
              Добро пожаловать на платформу "Эпоха Знаний" — ваш личный проводник в мире книг.
              Здесь вы можете:
            </p>
          </div>
        </transition>
<!--        <transition-->
<!--            v-for="(item, index) in listItems"-->
<!--            :key="item"-->
<!--            name="list-item"-->
<!--            appear-->
<!--        >-->
<!--          <p class="list" :class="index % 2 === 0 ? 'from-left' : 'from-right'" v-if="showContent">-->
<!--            {{ item }}-->
<!--          </p>-->
<!--        </transition>-->
        <div v-for="(item,index) in listItems" class="">
          <div :data-aos="index%2==0?'fade-right':'fade-left'" class="">
            <p class="list">{{item}}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="statistic">
      <div class="statistic-header">
        <h2>Сейчас в библиотеке:</h2>
        <span>7231 книги</span> <!--В будущем брать количество с бэка, при бранировании книги количество уменьшается-->
      </div>
      <ClientOnly>
        <swiper-container ref="containerRef" :init="false">
          <swiper-slide
              v-for="(slide, idx) in statistics"
              :key="idx"
              style="background-color: #F0F4F8;"
          >
                    <div class="statistic-item">
                      <img :src="slide.imageSrc" alt="">
                      <h3>{{slide.title}}</h3>
                      <span>{{slide.text}}</span>
                    </div>
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </section>
    <nuxt-link
    to="/"
    >
      <h1 class="text-4xl font-bold">Новинки</h1>
    </nuxt-link>

    <new-books/>
    <quotes />
    <nuxt-link to="/">
      <h1 class="text-4xl fonr-bold">Образовательные книги</h1>
    </nuxt-link>
    <education-books/>
    <quotes />
    <nuxt-link to="/">
      <h1 class="text-4xl font-bold">Случайные книги</h1>
    </nuxt-link>
    <books />
    <div class="">
      <h2 class="text-center mt-20 text-3xl font-bold">Самые активные пользователи</h2>
      <ul class="flex flex-col justify-center items-center mt-10">
        <li>vfbr</li>
        <li>ghghgh</li>
        <li>ghghghgh</li>
        <li>ghghghgh</li>
        <li>ghghghzd</li>
        <li>hhjgjg bnf</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Стиль для заголовка */
h1 {
  text-align: center;
  margin-bottom: 40px;
}

.background {
  background-image: url("../public/img/libary.jpg");
  height: 80vh;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: -1;
  margin-top: -170px;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  background: rgba(0, 0, 0, 0.3);
  animation: fadeIn 2s ease;
  padding: 20px;
  border-radius: 20px;
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  color: white;
  text-align: center;
}

.hero-slogan {
  font-size: 24px;
  margin-top: 10px;
  animation: fadeIn 2.5s ease;
  color: white;
  text-align: center;
}

.about {
  padding: 50px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.about-header {
  margin-bottom: 30px;
}

.about-header h2 {
  font-size: 36px;
  margin-bottom: 20px;
}

.about-header p {
  font-size: 18px;
}

.about-list {
  padding: 0;
  display: grid;
  gap: 10px;
}

.about-list li {
  font-size: 16px;
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.fade-bounce-enter-active {
  animation: fadeBounce 1s ease-out;
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

.list-enter-active {
  animation: slideIn 0.8s ease-in-out;
}

.list-enter-from-left {
  transform: translateX(-100%);
}

.list-enter-from-right {
  transform: translateX(100%);
}

.list-enter-to {
  transform: translateX(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
.list{
  font-size: 24px;
  max-width: 800px;
  margin: 40px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #eaeaea;
  padding: 40px 0;
}
@keyframes bounceEnterLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  70% {
    transform: translateX(10%);
    opacity: 0.7;
  }
  85% {
    transform: translateX(-5%);
    opacity: 0.9;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes bounceEnterRight {
  0% {
    transform: translateX(100%) scale(0.7);
    opacity: 0;
  }
  70% {
    transform: translateX(-10%) scale(1.05);
    opacity: 0.7;
  }
  85% {
    transform: translateX(5%) scale(0.95);
    opacity: 0.9;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

.list-item-enter-active {
  animation:
      bounceEnterLeft 1.5s forwards;
}

.list-item-enter-active.from-right {
  animation-name: bounceEnterRight;
}
.about-text{
  background: #F0F4F8;
  width: 900px;
  margin: 0 auto;
}
.falling-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.falling-element {
  position: absolute;
  top: 20px;
  opacity: 0;
  animation: fall linear infinite;
  animation-duration: 10s;
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
.statistic{
  margin-bottom: 40px;
  .statistic-header{
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    h2{
      font-size: 30px;
      font-weight: 700;
    }
    span{
    font-size: 22px;
      font-style: italic;
    }
  }
  .statistic-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    img{
      width: 50px;
      height: 50px;
    }
    span{
      font-style: italic;
    }
  }
}

</style>

