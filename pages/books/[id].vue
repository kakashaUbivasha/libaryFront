<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {useBookStore} from "~/stores/book";
import { useRoute } from 'vue-router';
import {fetchBookById} from "~/composables/useBook";
const book = ref(null);
const reviews = [
  {
    title: "Отличная книга!",
    text: "Эта книга оставила глубокое впечатление. Очень интересный сюжет, отлично проработанные персонажи и неожиданные повороты событий. Однозначно рекомендую к прочтению! Эта книга оставила глубокое впечатление. Очень интересный сюжет, отлично проработанные персонажи и неожиданные повороты событий.",
    user: "Алексей",
    expanded: false
  },
  {
    title: "Не понравилась",
    text: "Книга затянута, слишком много описаний и мало действия. Прочитал до конца только потому, что не люблю бросать начатые книги, но второй раз читать точно не буду.",
    user: "Марина",
    expanded: false
  },
  {
    title: "Хорошая, но могла быть лучше",
    text: "Интересная концепция, но развитие сюжета местами слишком предсказуемо. Тем не менее, книга оставляет положительные впечатления, особенно для любителей этого жанра.",
    user: "Иван",
    expanded: false
  },
  {
    title: "Шедевр",
    text: "Книга потрясающая! Захватывающий сюжет, эмоционально насыщенные моменты, глубокие мысли. Это произведение оставляет след в душе на долгое время.",
    user: "Екатерина",
    expanded: false
  },
  {
    title: "Средне",
    text: "Мне было скучно читать. Есть интересные моменты, но в целом книга не произвела должного впечатления. Возможно, не мой жанр.",
    user: "Ольга",
    expanded: false
  }
];
const route = useRoute(); // Получаем объект маршрута
const id = ref(route.params.id); // Извлекаем ID из параметров маршрута
const store = useBookStore()
// const loadBook = async () => {
//   book.value = await fetchBookById(id.value)
//   console.log(book.value)
//   console.log(book.value.title)
// };
onMounted(() => {
  store.getBook(id.value)
  store.getComments(id.value)
  console.log('ID из маршрута:', id.value); // Проверяем, что ID правильно извлечён
});
</script>

<template>
  <h1
  v-if="!store.book"
  >Загрузка...</h1>
  <div v-else class="">
    <books-page-item
        :title="store.book.title"
        :authors="store.book.author"
        :genre="store.book.genre"
        :isbn="store.book.isbn"
        :language="store.book.language"
        :description="store.book.description"
        :published-date="store.book.publication_date"
        :publisher="store.book.publisher"
        :reviews="store.comments"
        :count="store.book.count"
        :id="store.book.id"
 й
    />
  </div>

</template>

<style scoped>

</style>