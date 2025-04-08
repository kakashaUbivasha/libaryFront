<script setup>
defineProps({
  title: String,
  imageSrc: String,
  publishedDate: String,
  description: String,
  categories: String,  // Изменилось с Array на String
  authors: String,    // Изменилось с Array на String
  pages: [String, Number],
  language: String,
  reviews: Array,
  publisher: String,
  genre: String,
  isbn: [String, Number],
  id: [String, Number],
  count: Number       // Добавлено новое поле
})

const deleteTag = (desc) => {
  return desc?.replace(/<\/?[^>]+(>|$)/g, "") || 'Нет описания'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Не указана'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('ru-RU', options)
}

// Преобразуем строку категорий/авторов в массив
const parseStringToList = (str) => {
  if (!str) return []
  // Предполагаем, что значения разделены запятыми
  return str.split(',').map(item => item.trim()).filter(item => item)
}
const formatReviewDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ru-RU')
}
</script>

<template>
  <div class="book-container">
    <!-- Основная информация о книге -->
    <div class="book-main">
      <div class="book-cover">
        <img
            :src="imageSrc || '/images/book-placeholder.jpg'"
            :alt="title"
            class="cover-image"
            @error="$event.target.src = '/images/book-placeholder.jpg'"
        >
      </div>

      <div class="book-details">
        <h1 class="book-title">{{ title }}</h1>

        <div class="book-meta">
          <div class="meta-item" v-if="authors">
            <span class="meta-label">Автор(ы):</span>
            <span class="meta-value">{{ authors }}</span>
          </div>

          <div class="meta-item">
            <span class="meta-label">Дата публикации:</span>
            <span class="meta-value">{{ formatDate(publishedDate) }}</span>
          </div>

          <div class="meta-item" v-if="publisher">
            <span class="meta-label">Издатель:</span>
            <span class="meta-value">{{ publisher }}</span>
          </div>

          <div class="meta-item">
            <span class="meta-label">Жанр:</span>
            <span class="meta-value">{{ genre || 'Не указан' }}</span>
          </div>

          <div class="meta-item">
            <span class="meta-label">ISBN:</span>
            <span class="meta-value">{{ isbn || 'Не указан' }}</span>
          </div>

          <div class="meta-item">
            <span class="meta-label">Язык:</span>
            <span class="meta-value">{{ language ? language.toUpperCase() : 'Не указан' }}</span>
          </div>

          <div class="meta-item" v-if="pages">
            <span class="meta-label">Страниц:</span>
            <span class="meta-value">{{ pages }}</span>
          </div>

          <div class="meta-item" v-if="count !== undefined">
            <span class="meta-label">Доступно экземпляров:</span>
            <span class="meta-value">{{ count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Описание книги -->
    <div class="book-description">
      <h3 class="section-title">Описание</h3>
      <p>{{ deleteTag(description) }}</p>
    </div>

    <!-- Категории -->
    <div class="book-categories" v-if="categories">
      <h3 class="section-title">Категории</h3>
      <div class="tags">
        <span class="tag" v-for="(category, index) in parseStringToList(categories)" :key="index">
          {{ category }}
        </span>
      </div>
    </div>

    <!-- Кнопка бронирования -->
    <div class="book-actions">
      <button class="reserve-btn" :disabled="count === 0">
        {{ count > 0 ? 'Забронировать книгу' : 'Нет в наличии' }}
      </button>
    </div>

    <!-- Рецензии -->
    <div class="book-reviews" v-if="reviews?.length">
      <h3 class="section-title">Комментарии ({{ reviews.length }})</h3>
      <div class="reviews-grid">
        <div class="review-card" v-for="review in reviews" :key="review.id">
          <div class="review-header">
            <h4 class="review-title">{{ review.book_title || title }}</h4>
            <div class="review-rating">
              <span class="likes" title="Лайки">👍 {{ review.likes || 0 }}</span>
              <span class="dislikes" title="Дизлайки">👎 {{ review.dislikes || 0 }}</span>
            </div>
          </div>

          <p class="review-content">{{ review.content }}</p>

          <div class="review-footer">
            <span class="review-author">
              <NuxtLink :to="`/user/${review.user_id}`" class="user-link">
                {{ review.user_name || 'Аноним' }}
              </NuxtLink>
            </span>
            <span class="review-date">{{ formatReviewDate(review.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.book-main {
  display: flex;
  gap: 3rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.book-cover {
  flex: 0 0 300px;
}

.cover-image {
  width: 100%;
  height: auto;
  max-height: 450px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.book-details {
  flex: 1;
  min-width: 300px;
}

.book-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-weight: 700;
}

.book-meta {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.meta-item {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.meta-label {
  font-weight: 600;
  color: #6A5ACD;
}

.meta-value {
  color: #555;
}

.section-title {
  font-size: 1.5rem;
  margin: 1.5rem 0 1rem;
  color: #2c3e50;
  border-bottom: 2px solid #6A5ACD;
  padding-bottom: 0.5rem;
}

.book-description {
  line-height: 1.6;
  margin-bottom: 2rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tag {
  background-color: #e0e0ff;
  color: #6A5ACD;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.book-actions {
  text-align: center;
  margin: 2rem 0;
}

.reserve-btn {
  background-color: #6A5ACD;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(106, 90, 205, 0.2);
}

.reserve-btn:hover:not(:disabled) {
  background-color: #5a4acd;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(106, 90, 205, 0.3);
}

.reserve-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.review-card {
  background: #f9f9ff;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e0e0ff;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.review-title {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.review-rating {
  display: flex;
  gap: 1rem;
}

.review-rating span {
  font-size: 0.9rem;
  opacity: 0.8;
}

.likes {
  color: #4CAF50;
}

.dislikes {
  color: #F44336;
}

.review-content {
  color: #555;
  line-height: 1.5;
  margin: 0.5rem 0;
  white-space: pre-line;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #777;
  margin-top: auto;
}

.user-link {
  color: #6A5ACD;
  text-decoration: none;
  font-weight: 500;
}

.user-link:hover {
  text-decoration: underline;
}

.review-date {
  opacity: 0.7;
}

@media (max-width: 768px) {
  .review-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .review-rating {
    margin-top: 0.3rem;
  }
}
</style>