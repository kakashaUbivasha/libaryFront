<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  reservations: {
    type: Array,
    required: true,
    default: () => []
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Пагинация
const currentPage = ref(1);
const rowsPerPage = 10;

// Фильтр по статусу
const statusFilter = ref('all');
const statusOptions = [
  { value: 'all', label: 'Все статусы' },
  { value: 'active', label: 'Активные' },
  { value: 'canceled', label: 'Отмененные' },
  { value: 'completed', label: 'Завершенные' }
];

// Форматирование даты
const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleString('ru-RU', options);
};

// Фильтрация по статусу
const filteredReservations = computed(() => {
  if (statusFilter.value === 'all') return props.reservations;
  return props.reservations.filter(r => r.status === statusFilter.value);
});

// Сортировка по дате (новые сначала)
const sortedReservations = computed(() => {
  return [...filteredReservations.value].sort((a, b) =>
      new Date(b.reservation_time) - new Date(a.reservation_time)
  );
});

// Пагинация
const totalPages = computed(() =>
    Math.ceil(sortedReservations.value.length / rowsPerPage)
);

const paginatedReservations = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return sortedReservations.value.slice(start, end);
});

// Переключение страниц
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Получение класса для статуса
const getStatusClass = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'canceled': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Текст статуса
const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Активна';
    case 'canceled': return 'Отменена';
    case 'completed': return 'Завершена';
    default: return status;
  }
};
</script>

<template>
  <div class="reservation-history">
    <!-- Фильтры -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h2 class="text-2xl font-bold text-gray-800">История бронирований</h2>

      <div class="flex items-center gap-4">
        <div class="flex items-center">
          <label for="status-filter" class="mr-2 text-sm font-medium text-gray-700">Статус:</label>
          <select
              id="status-filter"
              v-model="statusFilter"
              class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-main focus:border-main"
          >
            <option
                v-for="option in statusOptions"
                :key="option.value"
                :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Таблица -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Книга
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID книги
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Дата бронирования
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Статус
          </th>
          <th v-if="isAdmin" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Пользователь
          </th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr
            v-for="reservation in paginatedReservations"
            :key="reservation.reservation_time"
            class="hover:bg-gray-50 transition-colors"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">
              {{ reservation.book_title }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ reservation.book_id }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatDate(reservation.reservation_time) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
              <span
                  :class="['px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full', getStatusClass(reservation.status)]"
              >
                {{ getStatusText(reservation.status) }}
              </span>
          </td>
          <td v-if="isAdmin" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ reservation.user.name }} (ID: {{ reservation.user.id }})
          </td>
        </tr>

        <tr v-if="paginatedReservations.length === 0">
          <td :colspan="isAdmin ? 5 : 4" class="px-6 py-4 text-center text-sm text-gray-500">
            Нет данных о бронированиях
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Пагинация -->
    <div class="mt-4 flex flex-col sm:flex-row items-center justify-between px-2">
      <div class="text-sm text-gray-700 mb-2 sm:mb-0">
        Показано с {{ (currentPage - 1) * rowsPerPage + 1 }} по
        {{ Math.min(currentPage * rowsPerPage, sortedReservations.length) }} из
        {{ sortedReservations.length }} записей
      </div>

      <div class="flex space-x-1">
        <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Назад
        </button>

        <template v-for="page in totalPages" :key="page">
          <button
              @click="goToPage(page)"
              :class="['px-3 py-1 border rounded-md text-sm font-medium', currentPage === page ? 'bg-main border-main text-white' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50']"
          >
            {{ page }}
          </button>
        </template>

        <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Вперед
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reservation-history {
  @apply p-4 bg-gray-50 rounded-lg;
}

th {
  @apply sticky top-0 z-10;
}
</style>