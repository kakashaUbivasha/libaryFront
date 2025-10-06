<script setup lang="ts">

import CustomTable from "~/components/all/CustomTable.vue";
import {useReservationStore} from "~/stores/reservation";
import {computed, onMounted, ref} from "vue";
import { reloadNuxtApp } from "#app";
import { useRoute } from "#imports";
definePageMeta({
  middleware: ['auth', 'admin'],
});
const headers = [
  { key: 'book_title', label: 'Название книги' },
  { key: 'reservation_time', label: 'Дата бронирования' },
  { key: 'status', label: 'Статус' },
  {key: 'user', label: 'Пользователь'},
];
const store = useReservationStore();
const route = useRoute();
const searchQuery = ref('');
const appliedSearch = ref('');
const isLoading = ref(false);
const emptyMessage = computed(() =>
    appliedSearch.value
        ? `Для такого "${appliedSearch.value}" данных нет`
        : 'Нет зарезервированных книг'
);
const fetchReservations = async ({ query, page }: { query?: string; page?: number } = {}) => {
  try {
    isLoading.value = true;
    await store.getAllReservations({ user: query, page });
  } finally {
    isLoading.value = false;
  }
};
const onSearch = async () => {
  appliedSearch.value = searchQuery.value.trim();
  await fetchReservations({ query: appliedSearch.value || undefined, page: 1 });
};
const resetSearch = async () => {
  searchQuery.value = '';
  appliedSearch.value = '';
  await fetchReservations({ page: 1 });
};
onMounted(()=>{
  fetchReservations({ page: 1 });
})
const deleteBook = async(id: number, user_id: number) => {
    try{
      await store.canceledReservBook(id, user_id)
      reloadNuxtApp({ path: route.fullPath, force: true })
    }catch (e){
      console.log(e)
    }
};
const issueBook = async(id: number, user_id: number)=>{
  try{
    await store.issueBook(id, user_id)
    reloadNuxtApp({ path: route.fullPath, force: true })
  }catch (e){
    console.log(e)
  }
}
const returnedBook = async(id: number, user_id: number)=>{
  try{
    await store.returnedBook(id, user_id)
    reloadNuxtApp({ path: route.fullPath, force: true })
  }catch (e){
    console.log(e)
  }
}
const pagination = computed(() => {
  const meta = store.allReservationsMeta;
  if (!meta) {
    return null;
  }
  return {
    currentPage: meta.current_page ?? 1,
    lastPage: meta.last_page ?? 1,
    perPage: meta.per_page,
  };
});
const changePage = async (page: number) => {
  const total = pagination.value?.lastPage ?? 1;
  if (page < 1 || page > total) {
    return;
  }
  await fetchReservations({
    query: appliedSearch.value || undefined,
    page,
  });
};
</script>

<template>
  <div class="main">
    <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-20">
      Забронированные книги
    </h1>
    <form
        class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3"
        @submit.prevent="onSearch"
    >
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 21l-4.35-4.35m1.43-4.9a6.38 6.38 0 11-12.76 0 6.38 6.38 0 0112.76 0z" />
          </svg>
        </span>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Найти пользователя"
            class="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 shadow-sm transition focus:border-main focus:outline-none focus:ring-2 focus:ring-main/40"
        />
      </div>
      <div class="flex gap-3">
        <button
            type="submit"
            class="flex items-center justify-center rounded-lg bg-main px-6 py-3 text-sm font-semibold text-white transition hover:bg-main/90 disabled:cursor-not-allowed disabled:bg-main/70"
            :disabled="isLoading"
        >
          {{ isLoading ? 'Поиск...' : 'Искать' }}
        </button>
        <button
            v-if="appliedSearch"
            type="button"
            class="flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-400 hover:text-gray-800"
            @click="resetSearch"
        >
          Сбросить
        </button>
      </div>
    </form>
    <custom-table
        :rows="store.all_reservations"
        :headers="headers"
        @delete-book="deleteBook"
        @issue-book="issueBook"
        @return-book="returnedBook"
        :is-user="false"
        :empty-message="emptyMessage"
        :pagination="pagination"
        @change-page="changePage"
    />
  </div>

</template>

<style scoped>

</style>
