<template>
  <section
      class="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-16 px-4 sm:px-6 lg:px-8"
  >
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -top-24 -left-32 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl"></div>
      <div class="absolute top-1/2 right-[-160px] h-96 w-96 -translate-y-1/2 rounded-full bg-purple-600/25 blur-3xl"></div>
      <div class="absolute bottom-[-140px] left-1/3 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"></div>
    </div>

    <div class="relative mx-auto max-w-6xl text-white">
      <div class="text-center">
        <p class="text-xs uppercase tracking-[0.4em] text-indigo-300/80">AI рекомендации</p>
        <h1 class="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">Персональная подборка книг</h1>
        <p class="mt-4 text-base text-slate-300 sm:text-lg">
          Наш искусственный интеллект анализирует ваши предпочтения и предлагает истории, которые могут вдохновить.
        </p>
      </div>

      <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button
            @click="fetchBooks"
            :disabled="loading"
            class="group inline-flex items-center gap-3 rounded-full bg-indigo-600 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-indigo-500/40 transition duration-200 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <template v-if="loading">
            <span class="h-5 w-5 animate-spin rounded-full border-2 border-white/70 border-t-transparent"></span>
            <span>Обновляем...</span>
          </template>
          <template v-else>
            <svg
                class="h-5 w-5 text-white/80 transition duration-200 group-hover:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12a7.5 7.5 0 0112.894-5.303M19.5 12a7.5 7.5 0 01-12.894 5.303M12 6v6l3 3" />
            </svg>
            <span>Обновить рекомендации</span>
          </template>
        </button>
        <p v-if="!isAuthenticated" class="text-center text-sm text-rose-200 sm:text-left">
          Авторизуйтесь, чтобы получать персональные рекомендации.
        </p>
      </div>

      <div class="mt-16 space-y-10">
        <div v-if="loading" class="flex flex-col items-center gap-3 text-slate-200">
          <span class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-400/70 border-t-transparent"></span>
          <p class="text-sm text-slate-300">AI подбирает для вас новые истории, пожалуйста, подождите.</p>
        </div>

        <template v-if="errorMessage">
          <div class="mx-auto max-w-3xl rounded-3xl border border-rose-400/30 bg-rose-500/10 p-8 text-center text-rose-100 shadow-lg shadow-rose-500/20">
            <p class="text-lg font-semibold">Что-то пошло не так</p>
            <p class="mt-2 text-sm text-rose-100/80">{{ errorMessage }}</p>
          </div>
        </template>
        <template v-else-if="!loading && recommendations.length === 0 && !firstLoad && isAuthenticated">
          <div class="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-200 shadow-lg shadow-indigo-500/10">
            <h2 class="text-2xl font-semibold text-white">Пока рекомендаций нет</h2>
            <p class="mt-3 text-sm text-slate-300">Попробуйте обновить подборку чуть позже — мы уже работаем над новыми идеями!</p>
          </div>
        </template>

        <div v-if="recommendations.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
              v-for="book in recommendations"
              :key="book.key"
              class="group relative h-full rounded-3xl border border-white/10 bg-white/5 p-3 shadow-lg shadow-indigo-500/10 transition duration-200 hover:-translate-y-1 hover:shadow-indigo-500/30"
          >
            <books-item
                :title="book.title"
                :author="book.author"
                :image-src="book.image"
                :id="book.id"
                :genre="book.genre"
                :publication_date="book.publication_date"
                :description="book.description"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useBookStore } from '~/stores/book'
import { useGlobalStore } from '~/stores/global'

type RawBook = Record<string, any>

interface NormalizedBook {
  key: string
  id: number | string
  title: string
  author: string
  image: string
  genre: string
  publication_date: string
  description: string
}

definePageMeta({
  middleware: 'auth',
})

const bookStore = useBookStore()
const globalStore = useGlobalStore()

const loading = ref(false)
const errorMessage = ref('')
const firstLoad = ref(true)

const isAuthenticated = computed(() => !!globalStore.token)

const toText = (value: unknown): string => {
  if (value == null) {
    return ''
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value
        .map((item) => toText(item))
        .filter(Boolean)
        .join(', ')
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    const candidateKeys = ['name', 'title', 'label']
    for (const key of candidateKeys) {
      const candidate = record[key]
      if (typeof candidate === 'string') {
        return candidate
      }
    }
  }

  return ''
}

const normalizeBook = (book: RawBook, index: number): NormalizedBook => {
  const rawId =
      book?.id ??
      book?.book_id ??
      book?.bookId ??
      book?.uuid ??
      book?.slug ??
      book?.external_id ??
      book?.externalId ??
      book?.primary_id

  const numericId = typeof rawId === 'number' ? rawId : Number(rawId)
  const fallbackKey =
      (typeof rawId === 'string' && rawId.trim().length > 0 ? rawId : '') ||
      toText(book?.slug) ||
      toText(book?.title) ||
      `recommendation-${index}`
  const id = Number.isNaN(numericId) ? (rawId ?? '') : numericId
  const key = Number.isNaN(numericId) ? fallbackKey : String(numericId)

  const author =
      toText(book?.author) ||
      toText(book?.authors) ||
      'Неизвестный автор'

  const genre =
      toText(book?.genre) ||
      toText(book?.genres) ||
      toText(book?.categories) ||
      ''

  const publicationDate =
      toText(book?.publication_date) ||
      toText(book?.publicationDate) ||
      toText(book?.published_at) ||
      toText(book?.publishedAt) ||
      ''

  const description =
      toText(book?.description) ||
      toText(book?.summary) ||
      toText(book?.short_description) ||
      toText(book?.annotation) ||
      ''

  return {
    key,
    id,
    title: book?.title ?? book?.name ?? 'Без названия',
    author,
    image:
        book?.image ??
        book?.imageSrc ??
        book?.imageLink ??
        book?.cover ??
        book?.cover_url ??
        book?.coverUrl ??
        '',
    genre,
    publication_date: publicationDate,
    description
  }
}

const recommendations = computed<NormalizedBook[]>(() => {
  const list = Array.isArray(bookStore.aiRecommendations) ? bookStore.aiRecommendations : []
  return list.map((item: RawBook, index: number) => normalizeBook(item, index))
})

const fetchBooks = async () => {
  if (!isAuthenticated.value) {
    errorMessage.value = ''
    bookStore.$patch({ aiRecommendations: [] })
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await bookStore.fetchAIRecommendations()
  } catch (error) {
    console.error('Не удалось получить AI-рекомендации', error)
    errorMessage.value =
        error instanceof Error
            ? error.message
            : 'Не удалось загрузить рекомендации. Попробуйте позже.'
  } finally {
    loading.value = false
    firstLoad.value = false
  }
}

onMounted(() => {
  fetchBooks()
})

watch(isAuthenticated, (value, previous) => {
  if (!value) {
    bookStore.$patch({ aiRecommendations: [] })
    firstLoad.value = true
    errorMessage.value = ''
    return
  }

  if (value && !previous) {
    fetchBooks()
  }
})
</script>

<style scoped>
.blur-3xl {
  filter: blur(72px);
}
</style>
