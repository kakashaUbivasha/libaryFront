<template>
  <div>
    <div v-if="isInitialLoading">
      <p class="load">Загрузка...</p>
    </div>
    <div v-else>
      <div class="books">
        <div v-for="book in books" :key="book.title">
          <books-item
              :title="book.title"
              :author="book.author"
              :image-src="book.image"
              :genre="resolveGenre(book)"
              :publication-date="resolvePublicationDate(book)"
              :description="resolveDescription(book)"
              :id ="book.id"
          />
        </div>
      </div>
      <div class="button-container" v-if="hasMore">
        <button type="button" @click="loadMoreBooks" :disabled="isLoadingMore">
          <span v-if="isLoadingMore">Загрузка...</span>
          <span v-else>Загрузить еще</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNewBook } from '~/composables/useBooks.js';

const books = ref([]);
const isInitialLoading = ref(true);
const isLoadingMore = ref(false);
const hasMore = ref(true);
const page = ref(1);
const perPage = 12;

const { fetchRandomBooks } = useNewBook();

const resolveGenre = (book) =>
  book?.genre?.name ||
  book?.genre?.title ||
  book?.genre_name ||
  book?.genre;

const resolvePublicationDate = (book) =>
  book?.publication_date ||
  book?.publicationDate ||
  book?.published_at ||
  book?.publishedAt ||
  book?.release_date ||
  book?.releaseDate;

const resolveDescription = (book) =>
  book?.description ||
  book?.short_description ||
  book?.shortDescription ||
  book?.summary ||
  book?.annotation;

const loadInitialBooks = async () => {
  isInitialLoading.value = true;
  try {
    const data = await fetchRandomBooks({ perPage, page: page.value });
    books.value = data;
    if (data.length < perPage) {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('Ошибка при загрузке новых книг:', error);
    hasMore.value = false;
  } finally {
    isInitialLoading.value = false;
  }
};

const loadMoreBooks = async () => {
  if (!hasMore.value || isLoadingMore.value) {
    return;
  }
  isLoadingMore.value = true;
  const nextPage = page.value + 1;
  try {
    const data = await fetchRandomBooks({ perPage, page: nextPage });
    if (data.length === 0) {
      hasMore.value = false;
      return;
    }
    books.value = [...books.value, ...data];
    page.value = nextPage;
    if (data.length < perPage) {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('Ошибка при догрузке новых книг:', error);
  } finally {
    isLoadingMore.value = false;
  }
};

onMounted(() => {
  loadInitialBooks();
});
</script>

<style lang="scss" scoped>

</style>