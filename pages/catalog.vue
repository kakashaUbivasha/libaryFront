<template>
  <div class="catalog">
    <!-- Селектор категорий -->
    <div class="category-selector">
      <label for="category">Выберите категорию:</label>
      <select id="category" v-model="selectedCategory" @change="fetchBooksByCategory">
        <option value="fiction">Фантастика</option>
        <option value="non-fiction">Нон-фикшн</option>
        <option value="mystery">Детективы</option>
        <option value="history">История</option>
        <!-- Добавьте другие категории по необходимости -->
      </select>
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
      <div class="book-card" v-for="book in books" :key="book.id">
        <books-item
            :title="book.title"
            :author="book.author"
            :image-src="book.imageLink"
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

const selectedCategory = ref('fiction'); // Категория по умолчанию
const selectedLanguage = ref('ru'); // Язык по умолчанию (русский)
const books = ref<any[]>([]);
const startIndex = ref(0); // Индекс для пагинации
const loading = ref(false);

// Функция для получения книг по выбранной категории, языку и пагинации
const fetchBooksByCategory = async () => {
  loading.value = true;
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${selectedCategory.value}&langRestrict=${selectedLanguage.value}&startIndex=${startIndex.value}&maxResults=40`);
  const data = await response.json();
  books.value = data.items.map((item: any) => ({
    id: item.id,
    title: item.volumeInfo.title,
    author: item.volumeInfo.authors?.join(', ') || 'Неизвестен',
    description: item.volumeInfo.description || 'Нет описания',
    imageLink: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'
  }));
  loading.value = false;
};

// Загружаем книги при загрузке страницы
fetchBooksByCategory();

// Функция для загрузки следующих книг
const loadMore = () => {
  startIndex.value += 40; // Увеличиваем индекс на 40 для загрузки следующей порции книг
  fetchBooksByCategory();
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
</style>