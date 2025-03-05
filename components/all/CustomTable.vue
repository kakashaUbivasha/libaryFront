<script setup>
import { ref, computed } from 'vue';

// Эмиссия события для удаления строки
const emit = defineEmits(['deleteBook']);

// Получаем заголовки и данные из родителя
const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
  isUser: true
});

// Пагинация
const currentPage = ref(1); // Текущая страница
const rowsPerPage = 50; // Максимальное количество строк на странице

// Всего страниц
const totalPages = computed(() => Math.ceil(props.rows.length / rowsPerPage));

// Текущие строки для отображения
const paginatedRows = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  return props.rows.slice(startIndex, endIndex);
});

// Удаление строки
const deleteRow = (index) => {
  emit('deleteBook', index);
};

// Вычисляемый массив для заголовков таблицы (включая статичные)
const tableHeaders = computed(() => ['№', ...props.headers.map(header => header.label), '']);

// Получение данных строки по ключу
const getCellData = (row, headerKey) => row[headerKey] || '-';

// Переключение страниц
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
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

        <!-- Динамические колонки -->
        <td
            v-for="header in props.headers"
            :key="header.key"
            class="border border-gray-300 p-3 text-gray-600 text-sm"
        >
          {{ getCellData(row, header.key) }}
        </td>

        <!-- Кнопка удаления -->
        <td v-if="isUser" class="border border-gray-300 p-3 text-center">
          <button
              @click="deleteRow(row.id)"
              class="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 transition"
          >
            Отменить бронь
          </button>
        </td>
        <td v-else class="border border-gray-300 p-3 text-center">
          <button
              @click="deleteRow(row.id)"
              class="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 transition mr-5"
          >
            Отменить бронь
          </button>
          <button
              @click="deleteRow(row.id)"
              class="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 transition"
          >
            Выдать книгу
          </button>
        </td>

      </tr>
      </tbody>
    </table>

    <!-- Пагинация -->
    <div class="mt-4 flex justify-center items-center space-x-2">
      <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="bg-gray-300 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span class="text-gray-600 text-sm font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="bg-gray-300 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
  <div v-else>
    <div class="loader-container">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<style scoped>
</style>
