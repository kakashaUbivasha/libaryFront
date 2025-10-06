<script setup>
import { ref, computed } from 'vue';
import {useGlobalStore} from "~/stores/global";

const emit = defineEmits(['deleteBook', 'issueBook', 'returnBook']);

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
  }
});
const store = useGlobalStore();
// Пагинация
const currentPage = ref(1);
const rowsPerPage = 50;

const totalPages = computed(() => Math.ceil(props.rows.length / rowsPerPage));

const paginatedRows = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  return props.rows.slice(startIndex, endIndex);
});

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
  <div v-if="rows.length" class="overflow-x-auto">
    <!-- Таблица -->
    <table class="min-w-full table-auto border-collapse border border-gray-300 text-left shadow-lg">
      <thead>
      <tr class="bg-main text-white">
        <th
            v-for="(header, index) in tableHeaders"
            :key="index"
            class="border border-gray-300 p-3 text-sm font-semibold uppercase tracking-wide"
        >
          {{ header }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(row, rowIndex) in paginatedRows"
          :key="rowIndex"
          class="hover:bg-gray-100 odd:bg-white even:bg-gray-50 transition-colors"
      >
        <!-- Номер строки -->
        <td class="border border-gray-300 p-3 text-gray-700 text-sm font-medium">
          {{ (currentPage - 1) * rowsPerPage + rowIndex + 1 }}
        </td>

        <!-- Название книги -->
        <td class="border border-gray-300 p-3 text-gray-600 text-sm">
          <NuxtLink :to="`/books/${row.book_id}`">
            {{ row.book_title }}
          </NuxtLink>

        </td>

        <!-- Дата бронирования -->
        <td class="border border-gray-300 p-3 text-gray-600 text-sm">
          {{ formatDate(row.reservation_time) }}
        </td>

        <!-- Статус -->
        <td class="border border-gray-300 p-3 text-gray-600 text-sm">
          {{ row.status === 'active' ? 'Активна' : row.status === 'passed' ? 'Выдана' : row.status === 'expired'?'Просрочена':'Бронь отменена' }}
        </td>

        <!-- Пользователь (только для админа) -->
        <td v-if="store.currentUser?.role==='Admin'" class="border border-gray-300 p-3 text-gray-600 text-sm">
          {{ row.user.name }}
        </td>

        <!-- Кнопки действий -->
        <td class="border border-gray-300 p-3 text-center space-y-1">
          <!-- Статус: отменена -->
          <span
              v-if="row.status === 'canceled'"
              class="text-sm text-red-600 font-semibold"
          >
    Бронь отменена
  </span>

          <!-- Статус: просрочена -->
          <div v-else-if="row.status === 'expired'" class="flex flex-col justify-center items-center">
            <span
                class="text-sm text-yellow-600 font-semibold"
            >
    Возврат просрочен
  </span>
            <button
                class="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 transition"
                @click="returnBook(row.book_id, row.user.id)"
            >
              Подтвердить возврат
            </button>
          </div>
          <!-- Статус: выдана -->
          <div v-else-if="row.status === 'passed'" class="flex flex-col justify-center items-center">
            <span
                class="text-sm text-green-400 font-semibold">
    Книга выдана, возврат: {{row.reserved_until}}
  </span>
            <button
                class="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 transition"
                @click="returnBook(row.book_id, row.user.id)"
            >
              Подтвердить возврат
            </button>
          </div>
          <div v-else-if="row.status === 'returned'" class="flex flex-col justify-center items-center">
            <span
                class="text-sm text-yellow-600 font-semibold"
            >
              Книга возвращена
            </span>
          </div>

          <!-- Статус: активная -->
          <div v-else-if="row.status === 'active'" class="flex justify-center flex-wrap gap-2">
            <button
                @click="deleteRow(row.book_id, row.user.id)"
                class="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 transition"
            >
              Отменить бронь
            </button>
            <button
                v-if="store.currentUser?.role === 'Admin'"
                @click="issueBook(row.book_id, row.user.id)"
                class="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-1 transition"
            >
              Выдать книгу
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Пагинация -->
    <div class="mt-4 flex justify-center items-center space-x-2">
      <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="bg-gray-300 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
      >
        Назад
      </button>
      <span class="text-gray-600 text-sm font-medium">Страница {{ currentPage }} из {{ totalPages }}</span>
      <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="bg-gray-300 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
      >
        Вперед
      </button>
    </div>
  </div>
  <div v-else class="text-center py-8 text-gray-500">
    {{ emptyMessage }}
  </div>
</template>

<style scoped>
</style>