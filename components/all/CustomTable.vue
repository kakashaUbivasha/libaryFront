<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PropType } from 'vue';
import {useGlobalStore} from "~/stores/global";

const emit = defineEmits(['deleteBook', 'issueBook', 'returnBook', 'changePage']);

type PaginationInfo = {
  currentPage: number;
  lastPage: number;
  perPage?: number;
};

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
  emptyMessage: {
    type: String,
    default: 'Нет зарезервированных книг'
  },
    isUser: {
    type: Boolean,
    default: true
  },
  pagination: {
    type: Object as PropType<PaginationInfo | null>,
    default: null,
  }
});
const store = useGlobalStore();
// Пагинация
const localPage = ref(1);
const DEFAULT_ROWS_PER_PAGE = 50;
const rowsPerPage = computed(() => props.pagination?.perPage ?? DEFAULT_ROWS_PER_PAGE);

watch(
    () => props.rows,
    () => {
      if (!props.pagination) {
        localPage.value = 1;
      }
    }
);

const currentPage = computed(() => props.pagination?.currentPage ?? localPage.value);
const totalPages = computed(() => {
  if (props.pagination) {
    return props.pagination.lastPage || 1;
  }
  const pages = Math.ceil(props.rows.length / rowsPerPage.value);
  return pages > 0 ? pages : 1;
});

const paginatedRows = computed(() => {
  if (props.pagination) {
    return props.rows;
  }
  const startIndex = (localPage.value - 1) * rowsPerPage.value;
  const endIndex = startIndex + rowsPerPage.value;
  return props.rows.slice(startIndex, endIndex);
});

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) {
    return;
  }
  if (props.pagination) {
    emit('changePage', page);
  } else {
    localPage.value = page;
  }
};

const goToPrevious = () => {
  goToPage(currentPage.value - 1);
};

const goToNext = () => {
  goToPage(currentPage.value + 1);
};

const deleteRow = (id, user_id) => {
  emit('deleteBook', id, user_id);
};

const issueBook = (id, user_id) => {
  emit('issueBook', id, user_id);
};
const returnBook = (id, user_id) => {
  emit('returnBook', id, user_id)
}
// Форматирование даты
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// Заголовки таблицы
const tableHeaders = computed(() => ['№', ...props.headers.map(header => header.label), 'Действия']);
</script>

<template>
  <div v-if="rows.length" class="overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/40 shadow-xl shadow-indigo-500/20 backdrop-blur">
    <!-- Таблица -->
    <table class="min-w-full table-auto border-separate border-spacing-0 text-left text-sm text-slate-100">
      <thead>
      <tr class="bg-white/5 text-indigo-100">
        <th
            v-for="(header, index) in tableHeaders"
            :key="index"
            class="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wide first:rounded-tl-3xl last:rounded-tr-3xl"
        >
          {{ header }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(row, rowIndex) in paginatedRows"
          :key="rowIndex"
          class="transition-colors odd:bg-white/5 even:bg-white/10 hover:bg-indigo-500/10"
      >
        <!-- Номер строки -->
        <td class="border-b border-white/5 px-4 py-3 text-sm font-semibold text-slate-100">
          {{ (currentPage - 1) * rowsPerPage + rowIndex + 1 }}
        </td>

        <!-- Название книги -->
        <td class="border-b border-white/5 px-4 py-3 text-sm text-slate-200">
          <NuxtLink :to="`/books/${row.book_id}`">
            {{ row.book_title }}
          </NuxtLink>

        </td>

        <!-- Дата бронирования -->
        <td class="border-b border-white/5 px-4 py-3 text-sm text-slate-300">
          {{ formatDate(row.reservation_time) }}
        </td>

        <!-- Статус -->
        <td class="border-b border-white/5 px-4 py-3 text-sm text-slate-200">
          {{ row.status === 'active' ? 'Активна' : row.status === 'passed' ? 'Выдана' : row.status === 'expired'?'Просрочена':'Бронь отменена' }}
        </td>

        <!-- Пользователь (только для админа) -->
        <td v-if="store.currentUser?.role==='Admin'" class="border-b border-white/5 px-4 py-3 text-sm text-slate-200">
          {{ row.user.name }}
        </td>

        <!-- Кнопки действий -->
        <td class="border-b border-white/5 px-4 py-3 text-center text-slate-100">
          <!-- Статус: отменена -->
          <span
              v-if="row.status === 'canceled'"
              class="text-sm font-semibold text-rose-300"
          >
    Бронь отменена
  </span>

          <!-- Статус: просрочена -->
          <div v-else-if="row.status === 'expired'" class="flex flex-col items-center justify-center gap-2">
            <span
                class="text-sm font-semibold text-amber-300"
            >
    Возврат просрочен
  </span>
            <button
                class="rounded-full bg-emerald-500/90 px-4 py-1 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300/80"
                @click="returnBook(row.book_id, row.user.id)"
            >
              Подтвердить возврат
            </button>
          </div>
          <!-- Статус: выдана -->
          <div v-else-if="row.status === 'passed'" class="flex flex-col items-center justify-center gap-2">
            <span
                class="text-sm font-semibold text-emerald-300">
    Книга выдана, возврат: {{row.reserved_until}}
  </span>
            <button
                class="rounded-full bg-emerald-500/90 px-4 py-1 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300/80"
                @click="returnBook(row.book_id, row.user.id)"
            >
              Подтвердить возврат
            </button>
          </div>
          <div v-else-if="row.status === 'returned'" class="flex flex-col items-center justify-center">
            <span
                class="text-sm font-semibold text-indigo-200"
            >
              Книга возвращена
            </span>
          </div>

          <!-- Статус: активная -->
          <div v-else-if="row.status === 'active'" class="flex flex-wrap justify-center gap-2">
            <button
                @click="deleteRow(row.book_id, row.user.id)"
                class="rounded-full bg-rose-500/90 px-4 py-1 text-sm font-semibold text-white shadow-md shadow-rose-500/30 transition hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300/80"
            >
              Отменить бронь
            </button>
            <button
                v-if="store.currentUser?.role === 'Admin'"
                @click="issueBook(row.book_id, row.user.id)"
                class="rounded-full bg-sky-500/90 px-4 py-1 text-sm font-semibold text-white shadow-md shadow-sky-500/30 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300/80"
            >
              Выдать книгу
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Пагинация -->
    <div class="mt-4 flex flex-wrap items-center justify-center gap-3 px-4 pb-4">
      <button
          @click="goToPrevious"
          :disabled="currentPage === 1"
          class="rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-slate-100 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Назад
      </button>
      <span class="text-sm font-medium text-slate-200">Страница {{ currentPage }} из {{ totalPages }}</span>
      <button
          @click="goToNext"
          :disabled="currentPage === totalPages"
          class="rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-slate-100 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Вперед
      </button>
    </div>
  </div>
  <div v-else class="py-8 text-center text-slate-300">
    {{ emptyMessage }}
  </div>
</template>

<style scoped>
</style>