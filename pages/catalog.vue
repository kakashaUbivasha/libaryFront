<template>
  <div class="catalog">
    <!-- Селектор категорий -->
    <div class="category-selector-wrapper">
      <div class="category-selector">
        <div class="select-container">
          <select
              id="category"
              v-model="selectedCategory"
              class="styled-select"
              :disabled="loading"
          >
            <option value="" selected>Все категории</option>
            <option
                v-for="genre in store.genres"
                :key="genre.id"
                :value="genre.name"
            >
              {{ genre.name }}
            </option>
          </select>

          <div class="select-arrow">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>

          <div v-if="loading" class="loading-overlay">
            Загрузка категорий...
          </div>
        </div>
      </div>
    </div>

    <!-- Список книг -->
    <div class="books">
      <div class="book-card" v-for="book in store.books" :key="book.id">
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

    <!-- Кнопки пагинации -->
    <div class="pagination">
      <button @click="loadMore" :disabled="loading">Загрузить больше</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import {useBookStore} from "~/stores/book";

const store = useBookStore()
const selectedCategory = ref(''); // Категория по умолчанию
const loading = ref(false);
const perPage = 40;
const page = ref(1);

const resolveGenre = (book: Record<string, any>) =>
  book?.genre?.name ||
  book?.genre?.title ||
  book?.genre_name ||
  book?.genre;

const resolvePublicationDate = (book: Record<string, any>) =>
  book?.publication_date ||
  book?.publicationDate ||
  book?.published_at ||
  book?.publishedAt ||
  book?.release_date ||
  book?.releaseDate;

const resolveDescription = (book: Record<string, any>) =>
  book?.description ||
  book?.short_description ||
  book?.shortDescription ||
  book?.summary ||
  book?.annotation;

const fetchBooksByCategory = async () => {
  loading.value = true;
  try {
    await store.get_books(perPage, selectedCategory.value, page.value);
  } finally {
    loading.value = false;
  }
};

watch(selectedCategory, async () => {
  page.value = 1;
  await fetchBooksByCategory();
});

const loadMore = async () => {
  if (loading.value) {
    return;
  }
  page.value += 1;
  await fetchBooksByCategory();
};

onMounted(async () => {
  loading.value = true;
  try {
    await store.get_categories();
    await fetchBooksByCategory();
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.catalog {
  padding: 20px;
  color: #e2e8f0;
}

.category-selector {
  margin-bottom: 24px;
}

.books {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  align-items: stretch;
  align-content: stretch;
  justify-items: stretch;
  grid-auto-rows: 1fr;
}

@media (min-width: 640px) {
  .books {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
  }
}

@media (min-width: 768px) {
  .books {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
}

@media (min-width: 1024px) {
  .books {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 24px;
  }
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination button {
  padding: 10px 24px;
  background: linear-gradient(120deg, rgba(129, 140, 248, 0.9), rgba(56, 189, 248, 0.6));
  color: #0b1120;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 12px 25px rgba(79, 70, 229, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.pagination button:disabled {
  background: rgba(100, 116, 139, 0.4);
  color: rgba(226, 232, 240, 0.6);
  cursor: not-allowed;
  box-shadow: none;
}

.pagination button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 28px rgba(56, 189, 248, 0.28);
}
.category-selector-wrapper {
  margin: 1.5rem 0;
}

.category-selector {
  max-width: 300px;
  position: relative;
}

.select-container {
  position: relative;
}


.styled-select {
  appearance: none;
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  font-size: 16px;
  line-height: 1.5;
  color: #e2e8f0;
  background: linear-gradient(160deg, rgba(15, 23, 42, 0.92), rgba(30, 64, 175, 0.35));
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 20px 35px rgba(49, 46, 129, 0.25);
  backdrop-filter: blur(10px);
}

.styled-select:focus {
  outline: none;
  border-color: rgba(129, 140, 248, 0.8);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.35);
}

.styled-select:hover {
  border-color: rgba(129, 140, 248, 0.8);
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  pointer-events: none;
  color: rgba(165, 180, 252, 0.85);
}

/* Стили для опций */
.styled-select option {
  padding: 8px;
  background: #0f172a;
  color: #e2e8f0;
}

.styled-select option:disabled {
  color: rgba(148, 163, 184, 0.6);
  font-style: italic;
}

/* Адаптивность */
@media (max-width: 768px) {
  .category-selector {
    max-width: 100%;
  }

  .styled-select {
    padding: 10px 14px;
    font-size: 14px;
  }
}
</style>