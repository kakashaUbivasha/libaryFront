<template>
  <div class="favorites-page">
    <h1 class="title">Избранные книги</h1>

    <div v-if="loading" class="loading">
      <div class="loader"></div>
      <p>Загрузка избранных книг...</p>
    </div>

    <div v-else-if="books.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <h3>У вас пока нет избранных книг</h3>
      <p>Добавляйте книги в избранное, чтобы они отображались здесь</p>
      <NuxtLink to="/books" class="button">Перейти к книгам</NuxtLink>
    </div>

    <div v-else class="books-grid">
      <div v-for="book in books" :key="book.id" class="book-card">
        <div class="book-image-container">
          <img :src="book.image || '/placeholder-book.jpg'" :alt="book.title" class="book-image" />
          <button
              @click="toggleFavorite(book.id)"
              class="favorite-button"
              :class="{ 'is-favorite': true }"
              aria-label="Удалить из избранного"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
        <div class="book-details">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
          <p class="book-genre">{{ book.genre }}</p>
          <p class="book-description" v-if="book.description">{{ truncateDescription(book.description) }}</p>
          <div class="book-meta">
            <span class="book-language">{{ book.language }}</span>
            <span class="book-date">{{ formatDate(book.publication_date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

const books = ref([])
const loading = ref(true)
const error = ref(null)

// Получаем избранные книги при загрузке страницы
onMounted(async () => {
  try {
    const { data } = await useFetch('http://127.0.0.1:8000/api/favorites', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    books.value = data.value || []
  } catch (err) {
    error.value = 'Не удалось загрузить избранные книги'
    console.error(err)
  } finally {
    loading.value = false
  }
})

// Удаление книги из избранного
const toggleFavorite = async (bookId) => {
  try {
    await useFetch(`http://127.0.0.1:8000/api/favorites/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    // Удаляем книгу из локального списка
    books.value = books.value.filter(book => book.id !== bookId)

    // Можно добавить уведомление об успешном удалении
  } catch (err) {
    console.error('Ошибка при удалении из избранного:', err)
    // Можно добавить уведомление об ошибке
  }
}

// Форматирование даты
const formatDate = (dateString) => {
  return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru })
}

// Обрезаем длинное описание
const truncateDescription = (text, length = 100) => {
  return text.length > length ? text.substring(0, length) + '...' : text
}
</script>

<style scoped>
.favorites-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #2d3748;
  text-align: center;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 0;
}

.loader {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e2e8f0;
  border-top-color: #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 0;
  text-align: center;
  color: #4a5568;
}

.empty-state svg {
  color: #cbd5e0;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.empty-state p {
  max-width: 400px;
  margin-bottom: 1rem;
}

.button {
  background-color: #4299e1;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;
}

.button:hover {
  background-color: #3182ce;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.book-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.book-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.book-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.book-card:hover .book-image {
  transform: scale(1.05);
}

.favorite-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.favorite-button svg {
  color: #e53e3e;
  width: 1.25rem;
  height: 1.25rem;
}

.favorite-button:hover {
  background: white;
  transform: scale(1.1);
}

.book-details {
  padding: 1.25rem;
}

.book-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.book-author {
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.25rem;
}

.book-genre {
  font-size: 0.75rem;
  color: white;
  background-color: #4299e1;
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.75rem;
}

.book-description {
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #718096;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.5rem;
  }

  .books-grid {
    grid-template-columns: 1fr;
  }
}
</style>