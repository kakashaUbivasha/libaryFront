<script setup lang="ts">
import { useBookStore } from "~/stores/book";
import { computed, onMounted, watch } from "vue";

const store = useBookStore();
const route = useRoute();

const keyword = computed(() => String(route.params.id ?? ""));
const isAiSearch = computed(() => {
  const aiParam = route.query.ai;
  if (Array.isArray(aiParam)) {
    return aiParam.includes("1") || aiParam.includes("true");
  }
  return aiParam === "1" || aiParam === "true";
});

const searchBooks = async () => {
  const currentKeyword = keyword.value.trim();
  if (!currentKeyword) {
    store.searched_books = [];
    return;
  }

  try {
    if (isAiSearch.value) {
      await store.searchBooksAi(currentKeyword);
    } else {
      await store.searchBooks(currentKeyword);
    }
    console.log('searched books', store.searched_books.length);
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  searchBooks();
});

watch(
  () => [route.params.id, route.query.ai],
  () => {
    searchBooks();
  }
);
</script>

<template>
<h2 class="text-4xl text-center mb-10">Результаты поиска:</h2>
  <div v-if="!store.searched_books.length" class="">
    <h2 class="text-center text-3xl">По запросу <i><b>{{keyword}}</b></i> ничего не найдено</h2>
  </div>
  <div v-else class="results main">
    <div v-for="book in store.searched_books"  class="">
      <books-item
          :title="book.title"
          :author="book.author"
          :image-src="book.image"
          :id ="book.id"
      />
    </div>

  </div>
</template>

<style scoped>
.results{
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}
</style>