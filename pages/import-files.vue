<template>
  <div class="container import-page">
    <h1 class="title">Импорт данных</h1>

    <div class="card glass-card">
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

    <div class="card glass-card">
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

    <div class="card glass-card">
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

    <div class="card glass-card">
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
    const response = await fetch(`https://api.libaryai.uz/api/genres/import`, {
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
    const response = await fetch(`https://api.libaryai.uz/api/books/import`, {
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
    const response = await fetch(`https://api.libaryai.uz/api/tags/import`, {
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
    const response = await fetch(`https://api.libaryai.uz/api/book-tags/import`, {
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
  color: #e2e8f0;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  color: #f8fafc;
  text-shadow: 0 12px 30px rgba(15, 23, 42, 0.6);
}

.subtitle {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: rgba(226, 232, 240, 0.9);
}

.card {
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.glass-card {
  background: linear-gradient(150deg, rgba(15, 23, 42, 0.9), rgba(30, 64, 175, 0.35));
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 25px 50px rgba(30, 64, 175, 0.18);
  backdrop-filter: blur(12px);
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
  background: rgba(15, 23, 42, 0.65);
  border: 1px dashed rgba(129, 140, 248, 0.45);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  transition: all 0.2s;
  color: #e2e8f0;
}

.file-cta:hover {
  background: rgba(30, 41, 59, 0.75);
  border-color: rgba(165, 180, 252, 0.65);
}

.file-icon {
  margin-right: 0.5rem;
  color: rgba(165, 180, 252, 0.9);
}

.file-label-text {
  color: rgba(226, 232, 240, 0.9);
  font-size: 0.9rem;
}

.button {
  background: linear-gradient(120deg, rgba(129, 140, 248, 0.9), rgba(56, 189, 248, 0.6));
  color: #0b1120;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  box-shadow: 0 15px 30px rgba(79, 70, 229, 0.35);
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 20px 35px rgba(56, 189, 248, 0.35);
}

.button:disabled {
  background: rgba(100, 116, 139, 0.4);
  color: rgba(226, 232, 240, 0.6);
  box-shadow: none;
  cursor: not-allowed;
}

.notification {
  padding: 1rem;
  border-radius: 0.75rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  border: 1px solid transparent;
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.35);
}

.notification.is-success {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.4);
  color: rgba(190, 242, 100, 0.9);
}

.notification.is-error {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  color: rgba(252, 165, 165, 0.95);
}

.loader {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(15, 23, 42, 0.35);
  border-radius: 50%;
  border-top-color: rgba(226, 232, 240, 0.8);
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>