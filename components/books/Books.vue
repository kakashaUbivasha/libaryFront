<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBooks } from '~/composables/useBooks.js';

const books = ref([]);
const { fetchRandomBooks } = useBooks();

// Загружаем книги при монтировании компонента
const loadBooks = async () => {
  books.value = await fetchRandomBooks();
};
onMounted(() => {
  loadBooks();
});
</script>

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
            :image-src="book.coverUrl"
            :id ="book.id"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>