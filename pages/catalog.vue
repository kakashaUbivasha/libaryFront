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

    <!-- Селектор языка -->
    <div class="language-selector">
      <label for="language">Выберите язык:</label>
      <select id="language" v-model="selectedLanguage" @change="fetchBooksByCategory">
        <option value="ru">Русский</option>
        <option value="en">Английский</option>
        <option value="fr">Французский</option>
        <!-- Добавьте другие языки по необходимости -->
      </select>
    </div>

    <!-- Список книг -->
    <div class="books">
      <div class="book-card" v-for="book in store.books" :key="book.id">
        <books-item
            :title="book.title"
            :author="book.author"
            :image-src="book.image"
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
import { ref } from 'vue';
import {useBookStore} from "~/stores/book";
const store = useBookStore()
const selectedCategory = ref(''); // Категория по умолчанию
const selectedLanguage = ref('ru'); // Язык по умолчанию (русский)
const books = ref<any[]>([]);
const startIndex = ref(40); // Индекс для пагинации
const loading = ref(false);
const fetchBooksByCategory = async () => {
  loading.value = true;
  store.get_books(startIndex.value, selectedCategory.value)
  store.get_categories()
  loading.value = false;
};
fetchBooksByCategory();
watch(selectedCategory, (newVal)=>{
  store.get_books(startIndex.value, selectedCategory.value)
})
const loadMore = () => {
  startIndex.value += 40;
  store.get_books(startIndex.value, selectedCategory.value)
};
</script>

<style scoped>
.catalog {
  padding: 20px;
}

.category-selector, .language-selector {
  margin-bottom: 20px;
}

.category-selector label, .language-selector label {
  margin-right: 10px;
}

.category-selector select, .language-selector select {
  padding: 5px;
  font-size: 16px;
}

.books {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
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
  color: #333;
  background-color: #fff;
  border: 2px solid #6A5ACD;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.styled-select:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(106, 90, 205, 0.2);
}

.styled-select:hover {
  border-color: #4F46E5;
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6A5ACD;
}

/* Стили для опций */
.styled-select option {
  padding: 8px;
  background: white;
  color: #333;
}

.styled-select option:disabled {
  color: #999;
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