<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-center text-white">Избранные книги</h1>
      <div v-if="store.books.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
        <div class="w-16 h-16 text-[#6A5ACD] mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2 text-white">У вас пока нет избранных книг</h3>
        <p class="text-slate-300 max-w-md mb-6">Добавляйте книги в избранное, чтобы они отображались здесь</p>
        <NuxtLink to="/catalog" class="px-6 py-2 bg-[#6A5ACD] text-white rounded-md hover:bg-[#5a4abd] transition-colors">
          Перейти к книгам
        </NuxtLink>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
            v-for="book in store.books"
            :key="book.id"
            class="rounded-lg border border-white/10 bg-slate-900/80 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <NuxtLink :to="`/books/${book.id}`">
            <div class="relative h-48 overflow-hidden">
              <img
                  :src="book.image || '/placeholder-book.jpg'"
                  :alt="book.title"
                  class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <button
                  @click="toggleFavorite(book.id)"
                  class="absolute top-2 right-2 bg-white/90 rounded-full p-2 hover:bg-white hover:scale-110 transition-all"
                  aria-label="Удалить из избранного"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6A5ACD" stroke="#6A5ACD" stroke-width="2" class="w-5 h-5">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-white mb-1">{{ book.title }}</h3>
              <p class="text-sm text-slate-300 mb-1">{{ book.author }}</p>
              <span class="inline-block px-2 py-1 text-xs text-white bg-[#6A5ACD] rounded mb-2">{{ book.genre }}</span>
              <p class="text-sm text-slate-300 mb-3 line-clamp-2">{{ book.description }}</p>
              <div class="flex justify-between text-xs text-slate-400">
                <span>{{ book.language }}</span>
                <span>{{ book.publication_date }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useFavoriteStore} from "~/stores/favorite";
const store = useFavoriteStore();
const loading = ref(false)
const error = ref(null)
const books = computed(() => store.books);
// Удаление книги из избранного
// const toggleFavorite = async (bookId) => {
//   try {
//     await useFetch(`https://api.libaryai.uz/api/favorites/${bookId}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//
//     books.value = books.value.filter(book => book.id !== bookId)
//   } catch (err) {
//     console.error('Ошибка при удалении из избранного:', err)
//   }
// }


// Загружаем данные при монтировании
onMounted(()=>{
  store.getFavorites()
})
</script>

<style>
/* Анимация спиннера */
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>