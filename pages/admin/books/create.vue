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
const showEditGenreDialog = ref(false);
const showDeleteGenreDialog = ref(false);
const showEditTagDialog = ref(false);
const showDeleteTagDialog = ref(false);
const newGenreName = ref('');
const newTagName = ref('');
const newGenreError = ref('');
const newTagError = ref('');
const genreActionError = ref('');
const tagActionError = ref('');
const creatingGenre = ref(false);
const creatingTag = ref(false);
const updatingGenre = ref(false);
const deletingGenre = ref(false);
const updatingTag = ref(false);
const deletingTag = ref(false);
const editingGenre = ref<any | null>(null);
const editingTag = ref<any | null>(null);
const genreFormName = ref('');
const tagFormName = ref('');

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

const openEditGenreDialog = (genreId: string | number | undefined) => {
  if (!genreId) {
    return;
  }

  const genre = genres.value.find((item: any) => String(item.id) === String(genreId));
  if (!genre) {
    return;
  }

  editingGenre.value = genre;
  genreFormName.value = genre?.name ?? '';
  genreActionError.value = '';
  showEditGenreDialog.value = true;
};

const openDeleteGenreDialog = (genreId: string | number | undefined) => {
  if (!genreId) {
    return;
  }

  const genre = genres.value.find((item: any) => String(item.id) === String(genreId));
  if (!genre) {
    return;
  }

  editingGenre.value = genre;
  genreActionError.value = '';
  showDeleteGenreDialog.value = true;
};

const openNewTagDialog = () => {
  newTagName.value = '';
  newTagError.value = '';
  showNewTagDialog.value = true;
};

const openEditTagDialog = (tag: any) => {
  if (!tag) {
    return;
  }

  editingTag.value = tag;
  tagFormName.value = tag?.name ?? '';
  tagActionError.value = '';
  showEditTagDialog.value = true;
};

const openDeleteTagDialog = (tag: any) => {
  if (!tag) {
    return;
  }

  editingTag.value = tag;
  tagActionError.value = '';
  showDeleteTagDialog.value = true;
};

const openDefaultTagEditDialog = () => {
  const preferredId = form.tag_ids[0] ?? tags.value[0]?.id;
  if (!preferredId) {
    return;
  }

  const tag = tags.value.find((item: any) => String(item.id) === String(preferredId));
  if (tag) {
    openEditTagDialog(tag);
  }
};

const openDefaultTagDeleteDialog = () => {
  const preferredId = form.tag_ids[0] ?? tags.value[0]?.id;
  if (!preferredId) {
    return;
  }

  const tag = tags.value.find((item: any) => String(item.id) === String(preferredId));
  if (tag) {
    openDeleteTagDialog(tag);
  }
};


const closeNewGenreDialog = (force = false) => {
  if (creatingGenre.value && !force) {
    return;
  }
  showNewGenreDialog.value = false;
  newGenreName.value = '';
  newGenreError.value = '';
};

const closeEditGenreDialog = () => {
  if (updatingGenre.value) {
    return;
  }
  showEditGenreDialog.value = false;
  genreFormName.value = '';
  genreActionError.value = '';
  editingGenre.value = null;
};

const closeDeleteGenreDialog = () => {
  if (deletingGenre.value) {
    return;
  }
  showDeleteGenreDialog.value = false;
  genreActionError.value = '';
  editingGenre.value = null;
};

const closeNewTagDialog = (force = false) => {
  if (creatingTag.value && !force) {

    return;
  }
  showNewTagDialog.value = false;
  newTagName.value = '';
  newTagError.value = '';
};

const closeEditTagDialog = () => {
  if (updatingTag.value) {
    return;
  }
  showEditTagDialog.value = false;
  tagFormName.value = '';
  tagActionError.value = '';
  editingTag.value = null;
};

const closeDeleteTagDialog = () => {
  if (deletingTag.value) {
    return;
  }
  showDeleteTagDialog.value = false;
  tagActionError.value = '';
  editingTag.value = null;
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

    closeNewGenreDialog(true);
  } catch (error: any) {
    console.error(error);
    newGenreError.value = error?.message || 'Не удалось создать жанр';
  } finally {
    creatingGenre.value = false;
  }
};

const synchronizeSelectedGenre = (genreId: string | number | undefined) => {
  if (!genreId) {
    form.genre_id = '';
    return;
  }

  const exists = genres.value.some((genre: any) => String(genre.id) === String(genreId));
  if (!exists) {
    form.genre_id = '';
  } else {
    form.genre_id = genreId;
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

    closeNewTagDialog(true);
  } catch (error: any) {
    console.error(error);
    newTagError.value = error?.message || 'Не удалось создать тег';
  } finally {
    creatingTag.value = false;
  }
};

const synchronizeSelectedTags = (tagIds: Array<string | number>) => {
  const availableIds = new Set(tags.value.map((tag: any) => String(tag.id)));
  form.tag_ids = tagIds
    .map((id) => (typeof id === 'number' || typeof id === 'string' ? id : String(id)))
    .filter((id) => availableIds.has(String(id)));
};

const handleUpdateGenre = async () => {
  if (!editingGenre.value) {
    return;
  }

  if (!genreFormName.value.trim()) {
    genreActionError.value = 'Введите название жанра';
    return;
  }

  if (!globalStore.token) {
    genreActionError.value = 'Требуется авторизация для обновления жанра';
    return;
  }

  updatingGenre.value = true;
  genreActionError.value = '';

  const genreId = editingGenre.value.id;

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/genres/${genreId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${globalStore.token}`,
        accept: 'application/json'
      },
      body: JSON.stringify({ name: genreFormName.value.trim() })
    });

    const responseData = response.status === 204 ? {} : await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error((responseData as any)?.message || 'Не удалось обновить жанр');
    }

    const previousGenreId = editingGenre.value.id;
    await bookStore.get_categories();
    synchronizeSelectedGenre(previousGenreId);
    closeEditGenreDialog();
  } catch (error: any) {
    console.error(error);
    genreActionError.value = error?.message || 'Не удалось обновить жанр';
  } finally {
    updatingGenre.value = false;
  }
};

const handleDeleteGenre = async () => {
  if (!editingGenre.value) {
    return;
  }

  if (!globalStore.token) {
    genreActionError.value = 'Требуется авторизация для удаления жанра';
    return;
  }

  deletingGenre.value = true;
  genreActionError.value = '';

  const genreId = editingGenre.value.id;

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/genres/${genreId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${globalStore.token}`,
        accept: 'application/json'
      }
    });

    if (!response.ok) {
      const responseData = response.status === 204 ? {} : await response.json().catch(() => ({}));
      throw new Error((responseData as any)?.message || 'Не удалось удалить жанр');
    }

    const deletedGenreId = editingGenre.value.id;
    await bookStore.get_categories();

    if (String(form.genre_id) === String(deletedGenreId)) {
      form.genre_id = '';
    } else {
      synchronizeSelectedGenre(form.genre_id);
    }

    closeDeleteGenreDialog();
  } catch (error: any) {
    console.error(error);
    genreActionError.value = error?.message || 'Не удалось удалить жанр';
  } finally {
    deletingGenre.value = false;
  }
};

const handleUpdateTag = async () => {
  if (!editingTag.value) {
    return;
  }

  if (!tagFormName.value.trim()) {
    tagActionError.value = 'Введите название тега';
    return;
  }

  if (!globalStore.token) {
    tagActionError.value = 'Требуется авторизация для обновления тега';
    return;
  }

  updatingTag.value = true;
  tagActionError.value = '';

  const tagId = editingTag.value.id;

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/tags/${tagId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${globalStore.token}`,
        accept: 'application/json'
      },
      body: JSON.stringify({ name: tagFormName.value.trim() })
    });

    const responseData = response.status === 204 ? {} : await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error((responseData as any)?.message || 'Не удалось обновить тег');
    }

    const previousSelectedTags = [...form.tag_ids];
    await fetchTags();
    synchronizeSelectedTags(previousSelectedTags);
    closeEditTagDialog();
  } catch (error: any) {
    console.error(error);
    tagActionError.value = error?.message || 'Не удалось обновить тег';
  } finally {
    updatingTag.value = false;
  }
};

const handleDeleteTag = async () => {
  if (!editingTag.value) {
    return;
  }

  if (!globalStore.token) {
    tagActionError.value = 'Требуется авторизация для удаления тега';
    return;
  }

  deletingTag.value = true;
  tagActionError.value = '';

  const tagId = editingTag.value.id;

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/tags/${tagId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${globalStore.token}`,
        accept: 'application/json'
      }
    });

    if (!response.ok) {
      const responseData = response.status === 204 ? {} : await response.json().catch(() => ({}));
      throw new Error((responseData as any)?.message || 'Не удалось удалить тег');
    }

    const previousSelectedTags = form.tag_ids.filter((id) => String(id) !== String(tagId));
    await fetchTags();
    synchronizeSelectedTags(previousSelectedTags);
    closeDeleteTagDialog();
  } catch (error: any) {
    console.error(error);
    tagActionError.value = error?.message || 'Не удалось удалить тег';
  } finally {
    deletingTag.value = false;
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
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
            <label class="block text-sm font-medium text-gray-700" for="genre">Жанр</label>
            <div class="flex flex-wrap items-center gap-3 text-sm">
              <button
                type="button"
                class="text-indigo-600 hover:text-indigo-700"
                @click="openNewGenreDialog"
              >
                Добавить
              </button>
              <button
                type="button"
                class="text-indigo-600 hover:text-indigo-700 disabled:text-gray-400"
                :disabled="!genres.length"
                @click="openEditGenreDialog(form.genre_id || genres[0]?.id)"
              >
                Редактировать
              </button>
              <button
                type="button"
                class="text-red-600 hover:text-red-700 disabled:text-gray-400"
                :disabled="!genres.length"
                @click="openDeleteGenreDialog(form.genre_id || genres[0]?.id)"
              >
                Удалить
              </button>
            </div>
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
          <div v-if="genres.length" class="mt-3 space-y-2 rounded-md border border-gray-200 p-3">
            <p class="text-xs uppercase tracking-wide text-gray-500">Список жанров</p>
            <div
              v-for="genre in genres"
              :key="`genre-${genre.id}`"
              class="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
            >
              <span class="text-sm text-gray-700">{{ genre.name }}</span>
              <div class="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  class="text-indigo-600 hover:text-indigo-700"
                  @click="openEditGenreDialog(genre.id)"
                >
                  Редактировать
                </button>
                <button
                  type="button"
                  class="text-red-600 hover:text-red-700"
                  @click="openDeleteGenreDialog(genre.id)"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
            <label class="block text-sm font-medium text-gray-700" for="tags">Теги</label>
            <div class="flex flex-wrap items-center gap-3 text-sm">
              <button
                type="button"
                class="text-indigo-600 hover:text-indigo-700"
                @click="openNewTagDialog"
              >
                Добавить
              </button>
              <button
                type="button"
                class="text-indigo-600 hover:text-indigo-700 disabled:text-gray-400"
                :disabled="!tags.length"
                @click="openDefaultTagEditDialog"
              >
                Редактировать
              </button>
              <button
                type="button"
                class="text-red-600 hover:text-red-700 disabled:text-gray-400"
                :disabled="!tags.length"
                @click="openDefaultTagDeleteDialog"
              >
                Удалить
              </button>
            </div>
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
          <div v-if="tags.length" class="mt-3 space-y-2 rounded-md border border-gray-200 p-3">
            <p class="text-xs uppercase tracking-wide text-gray-500">Список тегов</p>
            <div
              v-for="tag in tags"
              :key="`tag-${tag.id}`"
              class="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
            >
              <span class="text-sm text-gray-700">{{ tag.name }}</span>
              <div class="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  class="text-indigo-600 hover:text-indigo-700"
                  @click="openEditTagDialog(tag)"
                >
                  Редактировать
                </button>
                <button
                  type="button"
                  class="text-red-600 hover:text-red-700"
                  @click="openDeleteTagDialog(tag)"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
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
      v-if="showEditGenreDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 class="text-lg font-semibold text-gray-900">Редактирование жанра</h2>
        <p class="mt-1 text-sm text-gray-500">Измените название выбранного жанра.</p>
        <input
          v-model="genreFormName"
          type="text"
          class="mt-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Название жанра"
        />
        <p v-if="genreActionError" class="mt-2 text-sm text-red-600">{{ genreActionError }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            @click="closeEditGenreDialog"
            :disabled="updatingGenre"
          >
            Отмена
          </button>
          <button
            type="button"
            :disabled="updatingGenre"
            class="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-70"
            @click="handleUpdateGenre"
          >
            {{ updatingGenre ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showDeleteGenreDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 class="text-lg font-semibold text-gray-900">Удалить жанр</h2>
        <p class="mt-1 text-sm text-gray-500">
          Вы уверены, что хотите удалить жанр «{{ editingGenre?.name }}»? Это действие нельзя отменить.
        </p>
        <p v-if="genreActionError" class="mt-2 text-sm text-red-600">{{ genreActionError }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            @click="closeDeleteGenreDialog"
            :disabled="deletingGenre"
          >
            Отмена
          </button>
          <button
            type="button"
            :disabled="deletingGenre"
            class="rounded-full bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-70"
            @click="handleDeleteGenre"
          >
            {{ deletingGenre ? 'Удаление...' : 'Удалить' }}
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

    <div
      v-if="showEditTagDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 class="text-lg font-semibold text-gray-900">Редактирование тега</h2>
        <p class="mt-1 text-sm text-gray-500">Измените название выбранного тега.</p>
        <input
          v-model="tagFormName"
          type="text"
          class="mt-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Название тега"
        />
        <p v-if="tagActionError" class="mt-2 text-sm text-red-600">{{ tagActionError }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            @click="closeEditTagDialog"
            :disabled="updatingTag"
          >
            Отмена
          </button>
          <button
            type="button"
            :disabled="updatingTag"
            class="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-70"
            @click="handleUpdateTag"
          >
            {{ updatingTag ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showDeleteTagDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 class="text-lg font-semibold text-gray-900">Удалить тег</h2>
        <p class="mt-1 text-sm text-gray-500">
          Вы уверены, что хотите удалить тег «{{ editingTag?.name }}»? Это действие нельзя отменить.
        </p>
        <p v-if="tagActionError" class="mt-2 text-sm text-red-600">{{ tagActionError }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            @click="closeDeleteTagDialog"
            :disabled="deletingTag"
          >
            Отмена
          </button>
          <button
            type="button"
            :disabled="deletingTag"
            class="rounded-full bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-70"
            @click="handleDeleteTag"
          >
            {{ deletingTag ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
