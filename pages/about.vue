<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import AboutItem from "~/components/animation/AboutItem.vue";
// Управляем показом контента и загрузкой изображения
import AOS from 'aos';
const showContent = ref(false);
const showContent2 = ref(false);
const imageLoaded = ref(false);
const isAnimated = ref(false);
const listRef = ref(null);
const items = ref([
  "<b>Традиционная коллекция:</b> Более 50 000 книг, включая редкие издания, энциклопедии и архивные материалы.",
  "<b>Место для творчества:</b> Уютные залы для чтения, обсуждений и даже проведения лекций.",
  "<b>Современные технологии:</b> Электронные книги, аудиокниги и цифровые ресурсы для учебы и развлечений.",
  "<b>Клубы и мероприятия:</b> Участие в литературных клубах, мастер-классах и встречах с авторами.",
]);
const facts = ref([
  "В нашем архиве хранится первое издание романа, которому уже более 100 лет.",
  "Читальный зал на третьем этаже был восстановлен из руин после пожара в 1990 году.",
  "Ежегодно мы проводим более 30 мероприятий, включая детские чтения и выставки книг.",
]);
const offers = ref([
  "<b>Удобный поиск:</b> Хотите найти любимого автора или жанр? Используйте наш умный поиск!",
  "<b>Онлайн-резервирование:</b> Найдите книгу в приложении и заберите её у нас.",
  "<b>AI-рекомендации:</b> Искусственный интеллект подскажет книги, которые вас заинтересуют.",
  "<b>Рецензии и рейтинги:</b> Узнайте, что думают другие, и поделитесь своими впечатлениями.",
]);
const list = ref([
  "<b>Доступность:</b> У нас тысячи книг в разных жанрах — от классики до новинок.",
  "<b>Технологии:</b> Использование AI и NLP делает наш сервис быстрым и удобным.",
  "<b>Сообщество:</b> Мы — не просто библиотека, а платформа для общения, вдохновения и обмена знаниями."
])
const onTransitionComplete = () => {
  nextTick(() => {
    AOS.refresh(); // Обновляем AOS после завершения анимации
  });
};
onMounted(() => {

  nextTick(() => {
    setTimeout(() => {
      showContent.value = true;
    }, 300);
    setTimeout(() => {
      showContent2.value = true;
    }, 500);
  });
});

// Когда изображение загружается, отмечаем его как загруженное
const onImageLoad = () => {
  imageLoaded.value = true;
};
</script>

<template>
<div class="main">
<h1>О нас</h1>
  <transition name="fade" @after-enter="onTransitionComplete">
    <div class="block1" v-if="showContent">
      <p>
        Добро пожаловать в библиотеку <b>"Эпоха Знаний"</b> — пространство, где каждый может найти что-то вдохновляющее, образовательное и увлекательное.
        Мы стремимся объединить культурное наследие прошлого с современными технологиями, чтобы создать уникальное место для всех, кто ценит литературу.
      </p>
      <img
          class="animated-image"
          :class="{ 'animated-image-loaded': imageLoaded }"
          src="~public/img/img1.jpg"
          alt="Книга"
          @load="onImageLoad"
      >
    </div>
  </transition>
  <div class="block2">
      <div data-aos="fade-down"  class="block2__title">
        <h2>Наша библиотека</h2>
        <p>
          Библиотека "Эпоха Знаний" была основана в 1975 году с целью сохранить культурное наследие
          и обеспечить доступ к знаниям для всех. Сегодня это не просто здание с книжными полками —
          это живой центр культуры и обучения.
        </p>
      </div>

    <about-item
    :title="'Что вас ждёт у нас?'"
    :items="items"
    :style1="'fade-right'"
    :style2="'fade-left'"
    />
    <about-item
        :title="'Интересеные факты о библиотеке:'"
        :items="facts"
        :style1="'fade-up'"
        :style2="'fade-down'"
    />
    <about-item
        :title="'Что мы предлагаем?'"
        :items="offers"
        :style2="'fade-up-left'"
        :style1="'fade-up-right'"
    />
    <div data-aos="fade-up"  class="block2__title">
      <h2>Наша история</h2>
      <div class="history">
        <div data-aos-delay="200" data-aos="fade-right" class="">
          <img src="../public/img/photo1.avif" alt="">
        </div>
        <div data-aos-delay="200" data-aos="fade-left" class="">
          <p>
            "Эпоха Знаний" появилась как идея соединить в одном месте классическую атмосферу библиотек с инновациями цифрового века. Наше приложение создано для того, чтобы читатели могли легко находить книги, делиться впечатлениями и вдохновляться новыми идеями.
          </p>
        </div>
      </div>
    </div>
    <about-item
        :title="'Почему выбирают нас?'"
        :items="offers"
        :style2="'fade-down-left'"
        :style1="'fade-down-right'"
    />
    <div data-aos="fade-up"  class="block2__title">
      <h2>Присоединяйтесь к нам!</h2>
      <p>
        Начните своё путешествие в мир книг вместе с нами. Независимо от того,
        любите ли вы классику, научные труды или художественную литературу —
        у нас найдётся что-то для вас.
      </p>
      <div class="map">
        <div style="position:relative;overflow:hidden;">
          <a href="https://yandex.uz/maps/10335/tashkent/?utm_medium=mapframe&utm_source=maps" style="color:#eee;font-size:12px;position:absolute;top:0px;">Ташкент</a>
          <a href="https://yandex.uz/maps/10335/tashkent/?ll=69.260761%2C41.320659&utm_medium=mapframe&utm_source=maps&z=16.4" style="color:#eee;font-size:12px;position:absolute;top:14px;">Яндекс Карты — транспорт, навигация, поиск мест</a>
          <iframe src="https://yandex.uz/map-widget/v1/?ll=69.260761%2C41.320659&z=16.4&scrollZoom=false" width="560" height="400" frameborder="1" allowfullscreen="true" style="position:relative;"></iframe>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
h1{
  font-size: clamp(2rem, 4vw + 1rem, 2.75rem);
  text-transform: uppercase;
  text-align: center;
  margin-bottom: clamp(2.5rem, 6vw, 5rem);
}
.block1{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(1.75rem, 5vw, 3.125rem);
  p{
    font-size: clamp(1.125rem, 3.5vw, 1.875rem);
    text-align: center;
    line-height: 1.6;
  }
  img{
    max-width: 100%;
    object-fit: contain;
  }
}
.block2{
  margin-top: clamp(3rem, 7vw, 5rem);
  .block2__title{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(1.25rem, 3vw, 2rem);
    margin-bottom: clamp(2rem, 5vw, 3.5rem);
    h2{
      font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    }
    p{
      font-size: clamp(1.0625rem, 2.8vw, 1.5rem);
      text-align: center;
      line-height: 1.7;
    }
    .history{
      width: 80vw;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      align-items: center;
    }

  }


}
.fade-enter-active {
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
/* Стили для изображения */
.animated-image {
  max-width: 100%;
  height: auto;
  margin-top: 15px;
  opacity: 0; /* Скрыто по умолчанию */
  transition: opacity 0.5s ease-in;
}

/* Изображение становится видимым */
.animated-image-loaded {
  opacity: 1;
}
li {
  opacity: 0;
  transform: translateX(100%);
  animation: slide-in 0.5s ease forwards;
}

.animate-slide-in {
  opacity: 1;
  transform: translateX(0);
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.map{
  width: 100%;
}
</style>