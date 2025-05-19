<template>
  <div class="p-6">
    <h1 class="text-3xl font-semibold mb-6 text-center">Рекомендованные книги</h1>

    <button
        @click="fetchBooks"
        class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Обновить рекомендации
    </button>

    <div class="text-center text-gray-500">
      <div class="books">
        <div class="book-card" v-for="book in store.books" :key="book.id">
          <books-item
              :title="book.title"
              :author="book.author"
              :image-src="book.imageLink"
              :id ="book.id"
          />
        </div>
      </div>
    </div>

    <div v-if="books.length === 0" class="text-center text-gray-400">
      Пока что ничего не найдено
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
          v-for="book in books"
          :key="book.id"
          class="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
      >
        <img
            :src="book.imageLink"
            alt="Обложка книги"
            class="w-full h-60 object-cover"
        />
        <div class="p-4">
          <h2 class="text-lg font-bold">{{ book.title }}</h2>
          <p class="text-gray-600">{{ book.author }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {useBookStore} from "~/stores/book";

const store = useBookStore()
const books = ref([])
const loading = ref(true)

const fetchBooks = async () => {
  loading.value = true
  await store.fetchRecommendedBooks()
  books.value = store.books
  loading.value = false
}

onMounted(fetchBooks)
</script>
<style scoped>
.books {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}
</style>
