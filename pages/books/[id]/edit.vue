<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBookStore } from '~/stores/book';

definePageMeta({
  middleware: 'admin'
});

const route = useRoute();
const bookStore = useBookStore();

const bookId = computed(() => Number(route.params.id));
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref('');

const form = reactive({
  title: '',
  author: '',
  description: '',
  publication_date: '',
  publisher: '',
  isbn: '',
  language: '',
  count: 0,
  genre_id: '' as string | number | undefined
});

const applyBookToForm = (book: Record<string, any>) => {
  form.title = book?.title ?? '';
  form.author = book?.author ?? '';
  form.description = book?.description ?? '';
  form.publication_date = book?.publication_date ? String(book.publication_date).slice(0, 10) : '';
  form.publisher = book?.publisher ?? '';
  form.isbn = book?.isbn ?? '';
  form.language = book?.language ?? '';
  form.count = Number(book?.count ?? 0);
  form.genre_id = book?.genre_id ?? book?.genre?.id ?? '';
};

watch(() => bookStore.book, (book: any) => {
  if (book && Object.keys(book).length) {
    applyBookToForm(book);
  }
}, { immediate: true });

const loadData = async () => {
  const id = bookId.value;
  if (Number.isNaN(id)) {
    errorMessage.value = 'Некорректный идентификатор книги';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  try {
    await Promise.all([
      bookStore.get_categories(),
      bookStore.getBook(id)
    ]);
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error?.message || 'Не удалось загрузить данные книги';
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  const id = bookId.value;
  if (Number.isNaN(id)) {
    errorMessage.value = 'Некорректный идентификатор книги';
    return;
  }

  saving.value = true;
  errorMessage.value = '';
  try {
    const payload: Record<string, any> = {
      title: form.title,
      author: form.author,
      description: form.description,
      publication_date: form.publication_date,
      publisher: form.publisher,
      isbn: form.isbn,
      language: form.language,
      count: Number(form.count)
    };

    if (form.genre_id) {
      payload.genre_id = form.genre_id;
    }

    await bookStore.updateBook(id, payload);
    await bookStore.getBook(id);
    await bookStore.get_books(40, '', 1);
    await navigateTo(`/books/${id}`);
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error?.message || 'Не удалось сохранить изменения';
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Редактирование книги</h1>

    <div v-if="loading" class="text-center text-gray-600 py-10">Загрузка данных...</div>
    <div v-else>
      <div v-if="errorMessage" class="mb-4 rounded-md bg-red-50 p-4 text-red-600">
        {{ errorMessage }}
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="title">Название</label>
          <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="author">Автор</label>
          <input
              id="author"
              v-model="form.author"
              type="text"
              required
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="genre">Жанр</label>
          <select
              id="genre"
              v-model="form.genre_id"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Выберите жанр</option>
            <option
                v-for="genre in bookStore.genres"
                :key="genre.id"
                :value="genre.id"
            >
              {{ genre.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="publication_date">Дата публикации</label>
          <input
              id="publication_date"
              v-model="form.publication_date"
              type="date"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="publisher">Издатель</label>
          <input
              id="publisher"
              v-model="form.publisher"
              type="text"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="isbn">ISBN</label>
            <input
                id="isbn"
                v-model="form.isbn"
                type="text"
                class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="language">Язык</label>
            <input
                id="language"
                v-model="form.language"
                type="text"
                class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="count">Количество экземпляров</label>
          <input
              id="count"
              v-model.number="form.count"
              type="number"
              min="0"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="description">Описание</label>
          <textarea
              id="description"
              v-model="form.description"
              rows="6"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          ></textarea>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
              type="submit"
              :disabled="saving"
              class="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-white font-medium transition-colors hover:bg-indigo-700 disabled:opacity-70"
          >
            {{ saving ? 'Сохранение...' : 'Сохранить изменения' }}
          </button>
          <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
              @click="navigateTo(`/books/${bookId}`)"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
