<script setup>
import { computed, ref } from 'vue';
import { useGlobalStore } from "~/stores/global";
import { useReservationStore } from "~/stores/reservation";
import { useFavoriteStore } from "~/stores/favorite";
import { useBookStore } from "~/stores/book";
import { navigateTo } from '#app';
import BookWarningModal from "~/components/modal/BookWarningModal.vue";
import { useCommentsStore } from "~/stores/comments";

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

const commentStore = useCommentsStore();
const emit = defineEmits(['submitReview']);
const newReview = ref('');
const editingReviewId = ref(null);
const editedReview = ref('');
const isProcessingDeletion = ref(false);
const isSavingReview = ref(false);
const deletingCommentId = ref(null);
const commentError = computed(() => commentStore.errorMessage);

const isAdmin = computed(() => globalStore.currentUser?.role === 'Admin');
const currentUserId = computed(() => Number(globalStore.currentUser?.id ?? 0));
const canManageReview = (reviewUserId) => {
  return currentUserId.value === Number(reviewUserId ?? 0);
};

const toggleFavorite = async () => {
  if (!globalStore.isAuthenticated) {
    return;
  }

  try {
    if (props.isFavorite) {
      await favoritesStore.removeFavorites(props.id);
    } else {
      await favoritesStore.addFavorite(props.id);
      if (process.client) {
        window.location.reload();
      }
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

const getReviewIdentifier = (review, index) => {
  if (!review || typeof review !== 'object') {
    return `index-${index}`;
  }

  return (
    review.id ??
    review.comment_id ??
    review.review_id ??
    `${review.user_id ?? 'user'}-${review.created_at ?? ''}-${index}`
  );
};

const getCommentId = (review) => {
  if (!review || typeof review !== 'object') {
    return null;
  }

  return review.id ?? review.comment_id ?? review.review_id ?? null;
};

const startEditing = (review, index) => {
  commentStore.clearError();
  editingReviewId.value = getReviewIdentifier(review, index);
  editedReview.value = review.content;
};

const cancelEditing = () => {
  commentStore.clearError();
  editingReviewId.value = null;
  editedReview.value = '';
};

const updateReview = async (review) => {
  commentStore.clearError();

  const commentId = getCommentId(review);
  const updatedContent = editedReview.value?.trim() ?? '';

  if (!commentId) {
    commentStore.setError('Не удалось определить комментарий для обновления.');
    return;
  }

  if (!updatedContent.length) {
    commentStore.setError('Комментарий не может быть пустым.');
    return;
  }

  if (isSavingReview.value) {
    return;
  }

  try {
    isSavingReview.value = true;
    await commentStore.updateComment(commentId, updatedContent);
  } catch (error) {
    console.error('Ошибка при обновлении комментария:', error);
  } finally {
    isSavingReview.value = false;
  }
};

const deleteReview = async (review) => {
  commentStore.clearError();

  const commentId = getCommentId(review);
  if (!commentId) {
    commentStore.setError('Не удалось определить комментарий для удаления.');
    return;
  }

  if (deletingCommentId.value) {
    return;
  }

  if (!confirm('Вы уверены, что хотите удалить этот комментарий?')) return;

  try {
    deletingCommentId.value = commentId;
    await commentStore.deleteComment(commentId);
  } catch (error) {
    console.error('Ошибка при удалении комментария:', error);
  } finally {
    deletingCommentId.value = null;
  }
};

const submitReview = (content, book_id) => {
  commentStore.clearError();
  const preparedContent = content?.trim() ?? '';

  if (!preparedContent.length) {
    commentStore.setError('Комментарий не может быть пустым.');
    return;
  }

  emit('submitReview', preparedContent, book_id);
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
  <div class="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-8 shadow-2xl shadow-indigo-500/20 backdrop-blur">
    <!-- Основная информация о книге -->
    <div class="mb-8 flex flex-col gap-8 md:flex-row">
      <!-- Обложка книги -->
      <div class="w-full md:w-1/3 lg:w-1/4">
        <div class="relative">
          <img
              :src="imageSrc || '/img/img1.jpg'"
              :alt="title"
              class="h-auto w-full rounded-2xl border border-white/10 shadow-xl shadow-indigo-500/20"
              @error="$event.target.src = '/images/book-placeholder.jpg'"
          />
          <!-- Кнопка избранного -->
          <button
              @click="toggleFavorite"
              class="absolute right-2 top-2 rounded-full border border-white/10 bg-white/20 p-2 text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-110 hover:bg-white/30"
              aria-label="Добавить в избранное"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                :fill="isFavorite ? 'rgba(129,140,248,0.95)' : 'none'"
                stroke="rgba(129,140,248,0.9)"
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
        <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 class="text-3xl font-bold text-slate-100">{{ title }}</h1>
          <div v-if="isAdmin" class="flex gap-2">
            <button
                type="button"
                class="rounded-full bg-indigo-500/80 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
                @click="handleEdit"
            >
              Редактировать
            </button>
            <button
                type="button"
                class="rounded-full bg-rose-500/80 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-400 disabled:opacity-70"
                :disabled="isProcessingDeletion"
                @click="handleDelete"
            >
              Удалить
            </button>
          </div>
        </div>

        <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div v-if="authors" class="flex flex-wrap gap-1 text-slate-200">
            <span class="font-semibold text-indigo-300">Автор(ы):</span>
            <span class="text-slate-200/90">{{ authors }}</span>
          </div>

          <div class="flex flex-wrap gap-1 text-slate-200">
            <span class="font-semibold text-indigo-300">Дата публикации:</span>
            <span class="text-slate-200/90">{{ formatDate(publishedDate) }}</span>
          </div>

          <div v-if="publisher" class="flex flex-wrap gap-1 text-slate-200">
            <span class="font-semibold text-indigo-300">Издатель:</span>
            <span class="text-slate-200/90">{{ publisher }}</span>
          </div>

          <div class="flex flex-wrap gap-1 text-slate-200">
            <span class="font-semibold text-indigo-300">Жанр:</span>
            <span class="text-slate-200/90">{{ genre || 'Не указан' }}</span>
          </div>

          <div class="flex flex-wrap gap-1 text-slate-200">
            <span class="font-semibold text-indigo-300">ISBN:</span>
            <span class="text-slate-200/90">{{ isbn || 'Не указан' }}</span>
          </div>

          <div class="flex flex-wrap gap-1 text-slate-200">
            <span class="font-semibold text-indigo-300">Язык:</span>
            <span class="text-slate-200/90">{{ language ? language.toUpperCase() : 'Не указан' }}</span>
          </div>

          <div v-if="pages" class="flex flex-wrap gap-1 text-slate-200">
            <span class="font-semibold text-indigo-300">Страниц:</span>
            <span class="text-slate-200/90">{{ pages }}</span>
          </div>

          <div v-if="count !== undefined" class="flex flex-wrap gap-1 text-slate-200">
            <span class="font-semibold text-indigo-300">Доступно экземпляров:</span>
            <span class="text-slate-200/90">{{ count }}</span>
          </div>
        </div>

        <!-- Кнопка бронирования -->
        <button
            @click="reservation.reservBook(id)"
            :disabled="count === 0"
            class="rounded-full bg-indigo-500/80 px-6 py-2 font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-600/70"
        >
          {{ count > 0 ? 'Забронировать книгу' : 'Нет в наличии' }}
        </button>
      </div>
    </div>

    <!-- Описание книги -->
    <div class="mb-8">
      <h2 class="mb-4 border-b-2 border-indigo-500/60 pb-2 text-2xl font-bold text-slate-100">Описание</h2>
      <p class="leading-relaxed text-slate-200/90">{{ deleteTag(description) }}</p>
    </div>

    <!-- Категории -->
    <div v-if="categories" class="mb-8">
      <h2 class="mb-4 border-b-2 border-indigo-500/60 pb-2 text-2xl font-bold text-slate-100">Категории</h2>
      <div class="flex flex-wrap gap-2 text-slate-100">
        <span
            v-for="(category, index) in parseStringToList(categories)"
            :key="index"
            class="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 text-sm"
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
    <div class="mb-8 rounded-2xl border border-white/10 bg-slate-950/50 p-6 shadow-lg shadow-indigo-500/10">
      <h2 class="mb-4 text-2xl font-bold text-slate-100">Оставить рецензию</h2>
      <textarea
          v-model="newReview"
          placeholder="Напишите ваше мнение о книге..."
          class="min-h-[100px] w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
      ></textarea>
      <p
          v-if="commentError"
          class="mt-3 text-sm font-medium text-rose-400"
      >
        {{ commentError }}
      </p>
      <button
          @click="submitReview(newReview, id)"
          class="mt-3 inline-flex items-center justify-center rounded-full bg-indigo-500/80 px-6 py-2 font-medium text-white transition-colors hover:bg-indigo-400"
      >
        Отправить
      </button>
    </div>

    <!-- Рецензии -->
    <div v-if="reviews?.length" class="mb-8">
      <h2 class="mb-4 border-b-2 border-indigo-500/60 pb-2 text-2xl font-bold text-slate-100">
        Рецензии ({{ reviews.length }})
      </h2>

      <div class="grid gap-4">
        <div
            v-for="(review, index) in reviews"
            :key="getReviewIdentifier(review, index)"
            class="rounded-2xl border border-white/10 bg-slate-950/50 p-6 shadow-lg shadow-indigo-500/10"
        >
          <div v-if="editingReviewId !== getReviewIdentifier(review, index)">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <h3 class="text-lg font-semibold text-slate-100">{{ review.book_title || title }}</h3>
            </div>

            <p class="mb-4 whitespace-pre-line text-slate-200/90">{{ review.content }}</p>

            <div class="flex flex-col sm:flex-row sm:justify-between gap-2">
              <div>
                <NuxtLink
                    :to="`/user/${review.user_id}`"
                    class="font-medium text-indigo-300 hover:text-indigo-200 hover:underline"
                >
                  {{ review.user_name || 'Аноним' }}
                </NuxtLink>
                <span class="ml-2 text-sm text-slate-400">{{ formatReviewDate(review.created_at) }}</span>
              </div>

              <div
                  v-if="canManageReview(review.user_id)"
                  class="flex gap-2"
              >
                <button
                    @click="startEditing(review, index)"
                    class="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-200 transition hover:bg-indigo-500/20"
                >
                  Редактировать
                </button>
                <button
                    @click="deleteReview(review)"
                    :disabled="deletingCommentId === getCommentId(review)"
                    class="rounded-full border border-rose-400/40 bg-rose-500/10 px-3 py-1 text-sm text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
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
                class="mb-3 min-h-[100px] w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-slate-100 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
            ></textarea>
            <p
                v-if="commentError"
                class="mb-3 text-sm font-medium text-rose-400"
            >
              {{ commentError }}
            </p>
            <div class="flex justify-end gap-2">
              <button
                  @click="updateReview(review)"
                  :disabled="isSavingReview"
                  class="rounded-full bg-emerald-500/80 px-3 py-1 text-sm text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Сохранить
              </button>
              <button
                  @click="cancelEditing"
                  class="rounded-full bg-slate-600/60 px-3 py-1 text-sm text-slate-200 transition hover:bg-slate-600/80"
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