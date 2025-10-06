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
  <section class="main flex flex-col gap-6 sm:gap-8">
    <h2 class="text-center text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2 sm:mb-4 lg:mb-6">
      Результаты поиска:
    </h2>
    <div v-if="!store.searched_books.length" class="flex justify-center">
      <h2 class="max-w-3xl text-center text-lg sm:text-xl md:text-2xl">
        По запросу <i><b>{{ keyword }}</b></i> ничего не найдено
      </h2>
    </div>
    <div
      v-else
      class="grid gap-5 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    >
      <div v-for="book in store.searched_books" :key="book.id" class="h-full">
        <books-item
          :title="book.title"
          :author="book.author"
          :image-src="book.image"
          :id="book.id"
          class="h-full"
        />
      </div>
    </div>
  </section>
</template>
