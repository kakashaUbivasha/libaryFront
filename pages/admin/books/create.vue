<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useBookStore } from '~/stores/book';
import { useGlobalStore } from '~/stores/global';

definePageMeta({
  middleware: 'admin'
});

const bookStore = useBookStore();
const globalStore = useGlobalStore();

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
  genre_id: '' as string | number | undefined,
  tag_ids: [] as Array<string | number>
});

const showNewGenreDialog = ref(false);
const showNewTagDialog = ref(false);
const newGenreName = ref('');
const newTagName = ref('');
const newGenreError = ref('');
const newTagError = ref('');
const creatingGenre = ref(false);
const creatingTag = ref(false);

const tags = computed(() => Array.isArray(bookStore.tags) ? bookStore.tags : []);
const genres = computed(() => Array.isArray(bookStore.genres) ? bookStore.genres : []);

const fetchTags = async () => {
  if (!globalStore.token) {
    throw new Error('Требуется авторизация для загрузки тегов');
  }

  const response = await fetch('http://127.0.0.1:8000/api/tags', {
    headers: {
      Authorization: `Bearer ${globalStore.token}`,
      accept: 'application/json'
    }
  });

  const data = response.status === 204 ? {} : await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || 'Не удалось загрузить теги');
  }

  const fetchedTags = Array.isArray((data as any)?.data) ? (data as any).data : Array.isArray(data) ? data : [];
  bookStore.tags = fetchedTags;
  return fetchedTags;
};

const loadInitialData = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    await bookStore.get_categories();
    await fetchTags();
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error?.message || 'Не удалось загрузить данные для создания книги';
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  if (!form.title.trim()) {
    errorMessage.value = 'Укажите название книги';
    return false;
  }

  if (!form.author.trim()) {
    errorMessage.value = 'Укажите автора книги';
    return false;
  }

  const countNumber = Number(form.count);
  if (Number.isNaN(countNumber) || countNumber < 0) {
    errorMessage.value = 'Количество экземпляров должно быть неотрицательным числом';
    return false;
  }

  if (!form.genre_id) {
    errorMessage.value = 'Выберите жанр книги';
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  saving.value = true;
  errorMessage.value = '';

  try {
    const payload: Record<string, any> = {
      title: form.title,
      author: form.author,
      description: form.description,
      publication_date: form.publication_date || null,
      publisher: form.publisher,
      isbn: form.isbn,
      language: form.language,
      count: Number(form.count),
      tag_ids: form.tag_ids
        .map((id) => {
          const numericId = Number(id);
          return Number.isNaN(numericId) ? id : numericId;
        })
        .filter((id) => id !== '' && id !== undefined && id !== null)
    };

    if (form.genre_id !== '' && form.genre_id !== undefined) {
      const numericGenreId = Number(form.genre_id);
      payload.genre_id = Number.isNaN(numericGenreId) ? form.genre_id : numericGenreId;
    }

    const createdBook = await bookStore.createBook(payload);
    await bookStore.get_books(40, '', 1);

    if (createdBook?.id) {
      await navigateTo(`/books/${createdBook.id}`);
    } else {
      await navigateTo('/books');
    }
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error?.message || 'Не удалось создать книгу';
  } finally {
    saving.value = false;
  }
};

const openNewGenreDialog = () => {
  newGenreName.value = '';
  newGenreError.value = '';
  showNewGenreDialog.value = true;
};

const openNewTagDialog = () => {
  newTagName.value = '';
  newTagError.value = '';
  showNewTagDialog.value = true;
};

const closeNewGenreDialog = () => {
  if (creatingGenre.value) {
    return;
  }
  showNewGenreDialog.value = false;
  newGenreName.value = '';
  newGenreError.value = '';
};

const closeNewTagDialog = () => {
  if (creatingTag.value) {
    return;
  }
  showNewTagDialog.value = false;
  newTagName.value = '';
  newTagError.value = '';
};

const handleCreateGenre = async () => {
  if (!newGenreName.value.trim()) {
    newGenreError.value = 'Введите название жанра';
    return;
  }

  if (!globalStore.token) {
    newGenreError.value = 'Требуется авторизация для создания жанра';
    return;
  }

  creatingGenre.value = true;
  newGenreError.value = '';

  try {
    const response = await fetch('http://127.0.0.1:8000/api/genres', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${globalStore.token}`,
        accept: 'application/json'
      },
      body: JSON.stringify({ name: newGenreName.value.trim() })
    });

    const responseData = response.status === 204 ? {} : await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(responseData?.message || 'Не удалось создать жанр');
    }

    const createdGenre = (responseData as any)?.data ?? responseData ?? null;
    await bookStore.get_categories();

    if (createdGenre?.id) {
      form.genre_id = createdGenre.id;
    }

    closeNewGenreDialog();
  } catch (error: any) {
    console.error(error);
    newGenreError.value = error?.message || 'Не удалось создать жанр';
  } finally {
    creatingGenre.value = false;
  }
};

const handleCreateTag = async () => {
  if (!newTagName.value.trim()) {
    newTagError.value = 'Введите название тега';
    return;
  }

  if (!globalStore.token) {
    newTagError.value = 'Требуется авторизация для создания тега';
    return;
  }

  creatingTag.value = true;
  newTagError.value = '';

  try {
    const response = await fetch('http://127.0.0.1:8000/api/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${globalStore.token}`,
        accept: 'application/json'
      },
      body: JSON.stringify({ name: newTagName.value.trim() })
    });

    const responseData = response.status === 204 ? {} : await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(responseData?.message || 'Не удалось создать тег');
    }

    const createdTag = (responseData as any)?.data ?? responseData ?? null;
    await fetchTags();

    if (createdTag?.id) {
      const createdTagId = Number(createdTag.id);
      const normalizedTagId = Number.isNaN(createdTagId) ? createdTag.id : createdTagId;
      if (!form.tag_ids.some((tagId) => Number(tagId) === Number(normalizedTagId))) {
        form.tag_ids.push(normalizedTagId);
      }
    }

    closeNewTagDialog();
  } catch (error: any) {
    console.error(error);
    newTagError.value = error?.message || 'Не удалось создать тег';
  } finally {
    creatingTag.value = false;
  }
};

onMounted(() => {
  loadInitialData();
});
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Создание книги</h1>

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
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-medium text-gray-700" for="genre">Жанр</label>
            <button
              type="button"
              class="text-sm text-indigo-600 hover:text-indigo-700"
              @click="openNewGenreDialog"
            >
              Добавить новый жанр
            </button>
          </div>
          <select
            id="genre"
            v-model="form.genre_id"
            required
            class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Выберите жанр</option>
            <option
              v-for="genre in genres"
              :key="genre.id"
              :value="genre.id"
            >
              {{ genre.name }}
            </option>
          </select>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-medium text-gray-700" for="tags">Теги</label>
            <button
              type="button"
              class="text-sm text-indigo-600 hover:text-indigo-700"
              @click="openNewTagDialog"
            >
              Добавить новый тег
            </button>
          </div>
          <select
            id="tags"
            v-model="form.tag_ids"
            multiple
            class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option
              v-for="tag in tags"
              :key="tag.id"
              :value="tag.id"
            >
              {{ tag.name }}
            </option>
          </select>
          <p class="mt-1 text-sm text-gray-500">Используйте Ctrl/Cmd для выбора нескольких тегов.</p>
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
            {{ saving ? 'Создание...' : 'Создать книгу' }}
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
            @click="navigateTo('/books')"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>

    <div
      v-if="showNewGenreDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 class="text-lg font-semibold text-gray-900">Новый жанр</h2>
        <p class="mt-1 text-sm text-gray-500">Введите название нового жанра.</p>
        <input
          v-model="newGenreName"
          type="text"
          class="mt-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Название жанра"
        />
        <p v-if="newGenreError" class="mt-2 text-sm text-red-600">{{ newGenreError }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            @click="closeNewGenreDialog"
          >
            Отмена
          </button>
          <button
            type="button"
            :disabled="creatingGenre"
            class="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-70"
            @click="handleCreateGenre"
          >
            {{ creatingGenre ? 'Создание...' : 'Создать' }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showNewTagDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 class="text-lg font-semibold text-gray-900">Новый тег</h2>
        <p class="mt-1 text-sm text-gray-500">Введите название нового тега.</p>
        <input
          v-model="newTagName"
          type="text"
          class="mt-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Название тега"
        />
        <p v-if="newTagError" class="mt-2 text-sm text-red-600">{{ newTagError }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            @click="closeNewTagDialog"
          >
            Отмена
          </button>
          <button
            type="button"
            :disabled="creatingTag"
            class="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-70"
            @click="handleCreateTag"
          >
            {{ creatingTag ? 'Создание...' : 'Создать' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
