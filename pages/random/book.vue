<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRandom} from "~/composables/useRandom";

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
const book = ref(null);
const loadBook = async () => {
  console.log(1)
  book.value = await useRandom();
  console.log(book.value)
  console.log(book.value.title)
};
onMounted(() => {
  loadBook();
});
</script>

<template>
  <books-page-item
      :title="book.title"
      :authors="book.authors"
      :categories="book.categories"
      :pages="book.printedPageCount"
      :language="book.language"
      :description="book.description"
      :published-date="book.publishedDate"
      :image-src="book.imageLinks.thumbnail"
      :reviews="reviews"

  />
</template>

<style scoped>

</style>