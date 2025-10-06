<template>
  <div class="container">
    <h1 class="title">Импорт данных</h1>

    <div class="card">
      <h2 class="subtitle">Импорт жанров</h2>
      <form @submit.prevent="uploadGenres" class="form">
        <div class="file-upload">
          <label class="file-label">
            <input type="file" accept=".xlsx,.xls,.csv" @change="onGenreFileChange" class="file-input" required />
            <span class="file-cta">
              <span class="file-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </span>
              <span class="file-label-text">
                {{ genreFile ? genreFile.name : 'Выберите файл...' }}
              </span>
            </span>
          </label>
        </div>
        <button type="submit" class="button" :disabled="isGenresLoading">
          <span v-if="isGenresLoading" class="loader"></span>
          {{ isGenresLoading ? 'Загрузка...' : 'Импортировать жанры' }}
        </button>
      </form>
    </div>

    <div class="card">
      <h2 class="subtitle">Импорт книг</h2>
      <form @submit.prevent="uploadBooks" class="form">
        <div class="file-upload">
          <label class="file-label">
            <input type="file" accept=".xlsx,.xls,.csv" @change="onBookFileChange" class="file-input" required />
            <span class="file-cta">
              <span class="file-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </span>
              <span class="file-label-text">
                {{ bookFile ? bookFile.name : 'Выберите файл...' }}
              </span>
            </span>
          </label>
        </div>
        <button type="submit" class="button" :disabled="isBooksLoading">
          <span v-if="isBooksLoading" class="loader"></span>
          {{ isBooksLoading ? 'Загрузка...' : 'Импортировать книги' }}
        </button>
      </form>
    </div>

    <div class="card">
      <h2 class="subtitle">Импорт тегов</h2>
      <form @submit.prevent="uploadTags" class="form">
        <div class="file-upload">
          <label class="file-label">
            <input type="file" accept=".xlsx,.xls,.csv" @change="onTagFileChange" class="file-input" required />
            <span class="file-cta">
              <span class="file-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </span>
              <span class="file-label-text">
                {{ tagFile ? tagFile.name : 'Выберите файл...' }}
              </span>
            </span>
          </label>
        </div>
        <button type="submit" class="button" :disabled="isTagsLoading">
          <span v-if="isTagsLoading" class="loader"></span>
          {{ isTagsLoading ? 'Загрузка...' : 'Импортировать теги' }}
        </button>
      </form>
    </div>

    <div class="card">
      <h2 class="subtitle">Импорт тегов книг</h2>
      <form @submit.prevent="uploadBookTags" class="form">
        <div class="file-upload">
          <label class="file-label">
            <input type="file" accept=".xlsx,.xls,.csv" @change="onBookTagFileChange" class="file-input" required />
            <span class="file-cta">
              <span class="file-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </span>
              <span class="file-label-text">
                {{ bookTagFile ? bookTagFile.name : 'Выберите файл...' }}
              </span>
            </span>
          </label>
        </div>
        <button type="submit" class="button" :disabled="isBookTagsLoading">
          <span v-if="isBookTagsLoading" class="loader"></span>
          {{ isBookTagsLoading ? 'Загрузка...' : 'Импортировать теги книг' }}
        </button>
      </form>
    </div>

    <div v-if="message" class="notification" :class="{'is-success': messageType === 'success', 'is-error': messageType === 'error'}">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGlobalStore } from '~/stores/global.ts'

const genreFile = ref(null)
const bookFile = ref(null)
const tagFile = ref(null)
const bookTagFile = ref(null)
const message = ref('')
const messageType = ref('success')
const isGenresLoading = ref(false)
const isBooksLoading = ref(false)
const isTagsLoading = ref(false)
const isBookTagsLoading = ref(false)

const globalStore = useGlobalStore()

function onGenreFileChange(event) {
  genreFile.value = event.target.files[0]
}

function onBookFileChange(event) {
  bookFile.value = event.target.files[0]
}

function onTagFileChange(event) {
  tagFile.value = event.target.files[0]
}

function onBookTagFileChange(event) {
  bookTagFile.value = event.target.files[0]
}

async function uploadGenres() {
  if (!genreFile.value) return
  if (!globalStore.token) return navigateTo('/auth/login')

  isGenresLoading.value = true
  message.value = ''

  const formData = new FormData()
  formData.append('file', genreFile.value)

  try {
    const { $config } = useNuxtApp()
    const response = await fetch(`http://127.0.0.1:8000/api/genres/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${globalStore.token}`,
        accept: 'application/json'
      },
      body: formData
    })

    if (!response.ok) throw new Error('Ошибка при загрузке')

    const data = await response.json()
    message.value = data.message || 'Жанры успешно импортированы'
    messageType.value = 'success'
  } catch (error) {
    message.value = error.message || 'Произошла ошибка при импорте жанров'
    messageType.value = 'error'
  } finally {
    isGenresLoading.value = false
  }
}

async function uploadBooks() {
  if (!bookFile.value) return
  if (!globalStore.token) return navigateTo('/auth/login')

  isBooksLoading.value = true
  message.value = ''

  const formData = new FormData()
  formData.append('file', bookFile.value)

  try {
    const { $config } = useNuxtApp()
    const response = await fetch(`http://127.0.0.1:8000/api/books/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${globalStore.token}`,
        accept: 'application/json'
      },
      body: formData
    })

    if (!response.ok) throw new Error('Ошибка при загрузке')

    const data = await response.json()
    message.value = data.message || 'Книги успешно импортированы'
    messageType.value = 'success'
  } catch (error) {
    message.value = error.message || 'Произошла ошибка при импорте книг'
    messageType.value = 'error'
  } finally {
    isBooksLoading.value = false
  }
}

async function uploadTags() {
  if (!tagFile.value) return
  if (!globalStore.token) return navigateTo('/auth/login')

  isTagsLoading.value = true
  message.value = ''

  const formData = new FormData()
  formData.append('file', tagFile.value)

  try {
    const { $config } = useNuxtApp()
    const response = await fetch(`http://127.0.0.1:8000/api/tags/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${globalStore.token}`,
        accept: 'application/json'
      },
      body: formData
    })

    if (!response.ok) throw new Error('Ошибка при загрузке')

    const data = await response.json()
    message.value = data.message || 'Теги успешно импортированы'
    messageType.value = 'success'
  } catch (error) {
    message.value = error.message || 'Произошла ошибка при импорте тегов'
    messageType.value = 'error'
  } finally {
    isTagsLoading.value = false
  }
}

async function uploadBookTags() {
  if (!bookTagFile.value) return
  if (!globalStore.token) return navigateTo('/auth/login')

  isBookTagsLoading.value = true
  message.value = ''

  const formData = new FormData()
  formData.append('file', bookTagFile.value)

  try {
    const { $config } = useNuxtApp()
    const response = await fetch(`http://127.0.0.1:8000/api/book-tags/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${globalStore.token}`,
        accept: 'application/json'
      },
      body: formData
    })

    if (!response.ok) throw new Error('Ошибка при загрузке')

    const data = await response.json()
    message.value = data.message || 'Теги книг успешно импортированы'
    messageType.value = 'success'
  } catch (error) {
    message.value = error.message || 'Произошла ошибка при импорте тегов книг'
    messageType.value = 'error'
  } finally {
    isBookTagsLoading.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  color: #2d3748;
}

.subtitle {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #4a5568;
}

.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-upload {
  margin-bottom: 0.5rem;
}

.file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.file-label {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.file-cta {
  background-color: #f7fafc;
  border: 1px dashed #cbd5e0;
  border-radius: 0.375rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  transition: all 0.2s;
}

.file-cta:hover {
  background-color: #edf2f7;
  border-color: #a0aec0;
}

.file-icon {
  margin-right: 0.5rem;
  color: #4a5568;
}

.file-label-text {
  color: #4a5568;
  font-size: 0.875rem;
}

.button {
  background-color: #6A5ACD;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
}

.button:hover {
  background-color: #3182ce;
}

.button:disabled {
  background-color: #bee3f8;
  cursor: not-allowed;
}

.notification {
  padding: 1rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.is-success {
  background-color: #f0fff4;
  color: #2f855a;
  border: 1px solid #c6f6d5;
}

.is-error {
  background-color: #fff5f5;
  color: #c53030;
  border: 1px solid #fed7d7;
}

.loader {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>