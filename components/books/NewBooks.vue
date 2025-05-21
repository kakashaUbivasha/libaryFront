<template>
  <div v-if="books.length === 0">
    <p class="load">Загрузка...</p>
  </div>
  <div v-else>
    <div class="books">
      <div v-for="book in books" :key="book.title">
        <books-item
            :title="book.title"
            :author="book.author"
            :image-src="book.image"
            :id ="book.id"
        />
      </div>
    </div>
    <div class="button-container">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {useNewBook} from '~/composables/useBooks.js';

const books = ref([]);

const { fetchRandomBooks } = useNewBook();
// Загружаем книги при монтировании компонента
const loadBooks = async () => {
  try {
    const data = await fetchRandomBooks();
    console.log('Полученные данные:', data); // Для отладки
    books.value = data;
  } catch (error) {
    console.error('Ошибка при загрузке книг:', error);
  }
};
onMounted(() => {
  loadBooks();
});
</script>

<style lang="scss" scoped>

</style>