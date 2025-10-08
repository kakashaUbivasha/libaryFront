<script setup lang="ts">
import {ref} from "vue";
defineProps({
  array: []
})
const containerRef = ref(null)
const swiper = useSwiper(containerRef, {

  loop: true,
  autoplay: {
    delay: 3000,
  },
  spaceBetween: 20,
  slidesPerView: 3,
  breakpoints: {
    0: {
      slidesPerView: 1
    },
    640: {
      slidesPerView: 1
    },
    768: {
      slidesPerView: 2
    },
    1024: {
      slidesPerView: 3
    }
  },
  direction: 'horizontal',
})
const wordCut = (string: string) => {
  if(string.length > 200){
    return string.substr(0, 200) + '...';
  }
  return string
}
</script>

<template>
  <ClientOnly>
    <div class="reviews-slider">
      <swiper-container
          ref="containerRef"
          :init="false"
          class="custom-swiper"
      >
        <swiper-slide
            v-for="(slide, idx) in array"
            :key="idx"
        >
          <NuxtLink
              class="review-card"
              :to="`/books/${slide.book_id}`"
          >
            <div class="book-title">{{ slide.book_title }}</div>
            <div class="review-content">{{ wordCut(slide.content) }}</div>
            <div class="review-footer">
              <div class="author">@{{ slide.user_name }}</div>
              <div class="actions">
                <span class="likes">👍 {{ slide.likes }}</span>
                <span class="dislikes">👎 {{ slide.dislikes }}</span>
              </div>
            </div>
          </NuxtLink>
        </swiper-slide>
      </swiper-container>
    </div>
  </ClientOnly>
</template>

<style scoped>
.reviews-slider {
  width: 100%;
  padding: 20px 0;
  position: relative;
}

.custom-swiper {
  padding: 10px 30px !important;
}

.review-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  padding: 25px;
  height: 220px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid #e0e7ff;
  text-decoration: none;
}

.review-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(106, 90, 205, 0.12);
}

.book-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #4f46e5;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e0e7ff;
}

.review-content {
  flex-grow: 1;
  color: #475569;
  line-height: 1.5;
  font-size: 0.95rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.author {
  font-size: 0.85rem;
  color: #64748b;
  font-style: italic;
}

.actions {
  display: flex;
  gap: 12px;
}

.likes, .dislikes {
  font-size: 0.8rem;
  padding: 3px 8px;
  border-radius: 12px;
}

.likes {
  background-color: #f0fdf4;
  color: #16a34a;
}

.dislikes {
  background-color: #fef2f2;
  color: #dc2626;
}

/* Анимации перехода между слайдами */
.swiper-slide {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Кастомизация навигации */
.swiper-button-next,
.swiper-button-prev {
  color: #6a5acd !important;
  background: white;
  width: 36px !important;
  height: 36px !important;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 16px !important;
  font-weight: bold;
}

/* Пагинация */
.swiper-pagination-bullet {
  background: #c7d2fe !important;
  opacity: 1 !important;
}

.swiper-pagination-bullet-active {
  background: #6a5acd !important;
  width: 20px !important;
  border-radius: 4px !important;
}

/* Адаптивность */
@media (max-width: 768px) {
  .review-card {
    height: auto;
    min-height: 200px;
    padding: 18px;
  }

  .review-content {
    -webkit-line-clamp: 4;
  }

  .custom-swiper {
    padding: 10px 15px !important;
  }
}
</style>