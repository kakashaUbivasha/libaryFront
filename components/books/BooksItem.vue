<script setup>
defineProps({
  title: String,
  author: String,
  imageSrc: String,
  id: {
    type: [Number, String],
    required: true
  },
  genre: String,
  publication_date: String,
  description: String
})

const truncateText = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.slice(0, length) + '...' : text;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};
</script>

<template>
  <NuxtLink :to="`/books/${id}`" class="book-link">
    <div class="book-card">
      <div class="book-cover">
        <img
            v-if="imageSrc"
            :src="imageSrc || `/img/img1.jpg`"
            loading="lazy"
            class="cover-image"
        />
        <div v-else class="cover-placeholder">
          <span>No Cover</span>
        </div>
      </div>

      <div class="book-details">
        <div class="book-genre" v-if="genre">{{ genre }}</div>
        <h3 class="book-title">{{ truncateText(title, 30) }}</h3>
        <div class="book-author">{{ author || 'Неизвестный автор' }}</div>

        <div class="book-meta">
          <span v-if="publication_date" class="publish-date">
            {{ formatDate(publication_date) }}
          </span>
        </div>

        <p class="book-description" v-if="description">
          {{ truncateText(description, 100) }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.book-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.book-card {
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #6A5ACD;
}

.book-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  background: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  color: #999;
  font-size: 14px;
}

.book-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
}

.book-genre {
  font-size: 12px;
  color: #6A5ACD;
  font-weight: 500;
  text-transform: capitalize;
}

.book-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #333;
  line-height: 1.3;
}

.book-author {
  font-size: 14px;
  color: #666;
}

.book-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #888;
}

.publish-date::before {
  content: '📅 ';
}

.book-description {
  font-size: 13px;
  color: #555;
  line-height: 1.4;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>