<script setup>
import { computed, ref } from 'vue';
import { useGlobalStore } from "~/stores/global";
import { useReservationStore } from "~/stores/reservation";
import { useFavoriteStore } from "~/stores/favorite";
import { useBookStore } from "~/stores/book";
import { navigateTo } from '#app';
import BookWarningModal from "~/components/modal/BookWarningModal.vue";

const globalStore = useGlobalStore();
const reservation = useReservationStore();
const favoritesStore = useFavoriteStore();
const bookStore = useBookStore();

const props = defineProps({
  title: String,
  imageSrc: String,
  publishedDate: String,
  description: String,
  categories: String,
  authors: String,
  pages: [String, Number],
  language: String,
  reviews: Array,
  publisher: String,
  genre: String,
  isbn: [String, Number],
  id: [String, Number],
  count: Number,
  isFavorite: Boolean
});

const emit = defineEmits(['submitReview']);
const newReview = ref('');
const editingReviewId = ref(null);
const editedReview = ref('');
const isProcessingDeletion = ref(false);

const isAdmin = computed(() => globalStore.currentUser?.role === 'Admin');

const toggleFavorite = async () => {
  if (!globalStore.isAuthenticated) {
    return;
  }

  try {
    if (props.isFavorite) {
      await favoritesStore.removeFavorites(props.id);
    } else {
      await favoritesStore.addFavorite(props.id);
    }
  } catch (error) {
    console.error('Ошибка при обновлении избранного:', error);
  }
};

const deleteTag = (desc) => {
  return desc?.replace(/<\/?[^>]+(>|$)/g, "") || 'Нет описания';
};

const formatDate = (dateString) => {
  if (!dateString) return 'Не указана';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

const parseStringToList = (str) => {
  if (!str) return [];
  return str.split(',').map(item => item.trim()).filter(item => item);
};

const formatReviewDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ru-RU');
};

const startEditing = (review) => {
  editingReviewId.value = review.id;
  editedReview.value = review.content;
};

const cancelEditing = () => {
  editingReviewId.value = null;
  editedReview.value = '';
};

const updateReview = async (reviewId) => {
  if (!editedReview.value.trim()) return;

  try {
    await $api.put(`/reviews/${reviewId}`, {
      content: editedReview.value
    });
    editingReviewId.value = null;
    // Обновить список рецензий
  } catch (error) {
    console.error('Ошибка при обновлении рецензии:', error);
  }
};

const deleteReview = async (reviewId) => {
  if (!confirm('Вы уверены, что хотите удалить эту рецензию?')) return;

  try {
    await $api.delete(`/reviews/${reviewId}`);
    // Обновить список рецензий
  } catch (error) {
    console.error('Ошибка при удалении рецензии:', error);
  }
};

const submitReview = (content, book_id) => {
  emit('submitReview', content, book_id);
};

const handleEdit = () => {
  if (!props.id) {
    return;
  }
  navigateTo(`/books/${props.id}/edit`);
};

const handleDelete = async () => {
  if (!props.id || isProcessingDeletion.value) {
    return;
  }

  if (!confirm('Вы уверены, что хотите удалить эту книгу?')) {
    return;
  }

  try {
    isProcessingDeletion.value = true;
    await bookStore.deleteBook(Number(props.id));
    await bookStore.get_books(40, '', 1);
    await navigateTo('/catalog');
  } catch (error) {
    console.error('Ошибка при удалении книги:', error);
  } finally {
    isProcessingDeletion.value = false;
  }
};
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Основная информация о книге -->
    <div class="flex flex-col md:flex-row gap-8 mb-8">
      <!-- Обложка книги -->
      <div class="w-full md:w-1/3 lg:w-1/4">
        <div class="relative">
          <img
              :src="imageSrc || '/img/img1.jpg'"
              :alt="title"
              class="w-full h-auto rounded-lg shadow-lg"
              @error="$event.target.src = '/images/book-placeholder.jpg'"
          />
          <!-- Кнопка избранного -->
          <button
              @click="toggleFavorite"
              class="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white hover:scale-110 transition-all"
              aria-label="Добавить в избранное"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                :fill="isFavorite ? '#6A5ACD' : 'none'"
                stroke="#6A5ACD"
                stroke-width="2"
                class="w-6 h-6"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Детали книги -->
      <div class="w-full md:w-2/3 lg:w-3/4">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
          <div v-if="isAdmin" class="flex gap-2">
            <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                @click="handleEdit"
            >
              Редактировать
            </button>
            <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors disabled:opacity-70"
                :disabled="isProcessingDeletion"
                @click="handleDelete"
            >
              Удалить
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div v-if="authors" class="flex flex-wrap gap-1">
            <span class="font-semibold text-[#6A5ACD]">Автор(ы):</span>
            <span class="text-gray-700">{{ authors }}</span>
          </div>

          <div class="flex flex-wrap gap-1">
            <span class="font-semibold text-[#6A5ACD]">Дата публикации:</span>
            <span class="text-gray-700">{{ formatDate(publishedDate) }}</span>
          </div>

          <div v-if="publisher" class="flex flex-wrap gap-1">
            <span class="font-semibold text-[#6A5ACD]">Издатель:</span>
            <span class="text-gray-700">{{ publisher }}</span>
          </div>

          <div class="flex flex-wrap gap-1">
            <span class="font-semibold text-[#6A5ACD]">Жанр:</span>
            <span class="text-gray-700">{{ genre || 'Не указан' }}</span>
          </div>

          <div class="flex flex-wrap gap-1">
            <span class="font-semibold text-[#6A5ACD]">ISBN:</span>
            <span class="text-gray-700">{{ isbn || 'Не указан' }}</span>
          </div>

          <div class="flex flex-wrap gap-1">
            <span class="font-semibold text-[#6A5ACD]">Язык:</span>
            <span class="text-gray-700">{{ language ? language.toUpperCase() : 'Не указан' }}</span>
          </div>

          <div v-if="pages" class="flex flex-wrap gap-1">
            <span class="font-semibold text-[#6A5ACD]">Страниц:</span>
            <span class="text-gray-700">{{ pages }}</span>
          </div>

          <div v-if="count !== undefined" class="flex flex-wrap gap-1">
            <span class="font-semibold text-[#6A5ACD]">Доступно экземпляров:</span>
            <span class="text-gray-700">{{ count }}</span>
          </div>
        </div>

        <!-- Кнопка бронирования -->
        <button
            @click="reservation.reservBook(id)"
            :disabled="count === 0"
            class="px-6 py-2 bg-[#6A5ACD] text-white rounded-full font-medium hover:bg-[#5a4abd] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ count > 0 ? 'Забронировать книгу' : 'Нет в наличии' }}
        </button>
      </div>
    </div>

    <!-- Описание книги -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#6A5ACD]">Описание</h2>
      <p class="text-gray-700 leading-relaxed">{{ deleteTag(description) }}</p>
    </div>

    <!-- Категории -->
    <div v-if="categories" class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#6A5ACD]">Категории</h2>
      <div class="flex flex-wrap gap-2">
        <span
            v-for="(category, index) in parseStringToList(categories)"
            :key="index"
            class="px-3 py-1 bg-[#e0e0ff] text-[#6A5ACD] rounded-full text-sm"
        >
          {{ category }}
        </span>
      </div>
    </div>

    <!-- Модальное окно с предупреждением -->
    <BookWarningModal
        :is-open="!!reservation.error_message.length"
        :on-close="() => reservation.error_message = ''"
        :error-text="reservation.error_message"
    />

    <!-- Форма добавления рецензии -->
    <div class="bg-[#f5f5ff] p-6 rounded-lg mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Оставить рецензию</h2>
      <textarea
          v-model="newReview"
          placeholder="Напишите ваше мнение о книге..."
          class="w-full min-h-[100px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A5ACD] focus:border-transparent"
      ></textarea>
      <button
          @click="submitReview(newReview, id)"
          class="mt-2 px-6 py-2 bg-[#6A5ACD] text-white rounded-lg hover:bg-[#5a4abd] transition-colors"
      >
        Отправить
      </button>
    </div>

    <!-- Рецензии -->
    <div v-if="reviews?.length" class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#6A5ACD]">
        Рецензии ({{ reviews.length }})
      </h2>

      <div class="grid gap-4">
        <div
            v-for="review in reviews"
            :key="review.id"
            class="bg-[#f9f9ff] border border-[#e0e0ff] rounded-lg p-6"
        >
          <div v-if="editingReviewId !== review.id">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <h3 class="text-lg font-semibold text-gray-900">{{ review.book_title || title }}</h3>
              <div class="flex gap-4">
                <span class="text-green-600">👍 {{ review.likes || 0 }}</span>
                <span class="text-red-600">👎 {{ review.dislikes || 0 }}</span>
              </div>
            </div>

            <p class="text-gray-700 mb-4 whitespace-pre-line">{{ review.content }}</p>

            <div class="flex flex-col sm:flex-row sm:justify-between gap-2">
              <div>
                <NuxtLink
                    :to="`/user/${review.user_id}`"
                    class="text-[#6A5ACD] font-medium hover:underline"
                >
                  {{ review.user_name || 'Аноним' }}
                </NuxtLink>
                <span class="text-gray-500 text-sm ml-2">{{ formatReviewDate(review.created_at) }}</span>
              </div>

              <div
                  v-if="store.currentUser.id === review.user_id"
                  class="flex gap-2"
              >
                <button
                    @click="startEditing(review)"
                    class="px-3 py-1 bg-[#e0e0ff] text-[#6A5ACD] rounded text-sm hover:opacity-80"
                >
                  Редактировать
                </button>
                <button
                    @click="deleteReview(review.id)"
                    class="px-3 py-1 bg-[#ffebee] text-red-500 rounded text-sm hover:opacity-80"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>

          <!-- Форма редактирования рецензии -->
          <div v-else>
            <textarea
                v-model="editedReview"
                class="w-full min-h-[100px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A5ACD] focus:border-transparent mb-3"
            ></textarea>
            <div class="flex justify-end gap-2">
              <button
                  @click="updateReview(review.id)"
                  class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:opacity-80"
              >
                Сохранить
              </button>
              <button
                  @click="cancelEditing"
                  class="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:opacity-80"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>