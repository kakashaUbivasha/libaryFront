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
  { value: 'active', label: 'Забронировано' },
  { value: 'canceled', label: 'Отменено' },
  { value: 'passed', label: 'Выдано' },
  { value: 'returned', label: 'Возвращено' },
  { value: 'expired', label: 'Просрочено' }
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
    case 'active': return 'bg-indigo-500/20 text-indigo-100';
    case 'canceled': return 'bg-rose-500/20 text-rose-200';
    case 'passed': return 'bg-emerald-500/20 text-emerald-100';
    case 'returned': return 'bg-sky-500/20 text-sky-100';
    case 'expired': return 'bg-amber-500/20 text-amber-100';
    default: return 'bg-white/10 text-slate-100';
  }
};

// Текст статуса
const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Забронировано';
    case 'canceled': return 'Отменено';
    case 'passed': return 'Выдано';
    case 'returned': return 'Возвращено';
    case 'expired': return 'Просрочено';
    default: return status;
  }
};
</script>

<template>
  <div class="reservation-history">
    <!-- Фильтры -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h2 class="text-2xl font-bold text-slate-100">История бронирований</h2>

      <div class="flex items-center gap-4">
        <div class="flex items-center">
          <label for="status-filter" class="mr-2 text-sm font-medium text-slate-300">Статус:</label>
          <select
              id="status-filter"
              v-model="statusFilter"
              class="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-100 shadow-inner shadow-indigo-500/10 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
    <div class="overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/40 shadow-xl shadow-indigo-500/20 backdrop-blur">
      <table class="min-w-full table-auto border-separate border-spacing-0 text-sm text-slate-100">
        <thead class="bg-white/5 text-indigo-100">
        <tr>
          <th class="border-b border-white/10 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
            Книга
          </th>
          <th class="border-b border-white/10 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
            Срок сдачи
          </th>
          <th class="border-b border-white/10 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
            Дата бронирования
          </th>
          <th class="border-b border-white/10 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
            Статус
          </th>
          <th v-if="isAdmin" class="border-b border-white/10 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
            Пользователь
          </th>
        </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
        <tr
            v-for="reservation in paginatedReservations"
            :key="reservation.reservation_time"
            class="transition-colors odd:bg-white/5 even:bg-white/10 hover:bg-indigo-500/10"
        >
          <td class="px-6 py-4 text-sm font-medium text-slate-100">
            <div>
              {{ reservation.book_title }}
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-slate-300">
            {{ reservation.reserved_until }}
          </td>
          <td class="px-6 py-4 text-sm text-slate-300">
            {{ formatDate(reservation.reservation_time) }}
          </td>
          <td class="px-6 py-4">
              <span
                  :class="['px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full', getStatusClass(reservation.status)]"
              >
                {{ getStatusText(reservation.status) }}
              </span>
          </td>
          <td v-if="isAdmin" class="px-6 py-4 text-sm text-slate-300">
            {{ reservation.user.name }} (ID: {{ reservation.user.id }})
          </td>
        </tr>

        <tr v-if="paginatedReservations.length === 0">
          <td :colspan="isAdmin ? 5 : 4" class="px-6 py-4 text-center text-sm text-slate-300">
            Нет данных о бронированиях
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Пагинация -->
    <div class="mt-4 flex flex-col sm:flex-row items-center justify-between px-2">
      <div class="mb-2 text-sm text-slate-300 sm:mb-0">
        Показано с {{ (currentPage - 1) * rowsPerPage + 1 }} по
        {{ Math.min(currentPage * rowsPerPage, sortedReservations.length) }} из
        {{ sortedReservations.length }} записей
      </div>

      <div class="flex flex-wrap gap-2">
        <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-sm font-medium text-slate-100 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Назад
        </button>

        <template v-for="page in totalPages" :key="page">
          <button
              @click="goToPage(page)"
              :class="['rounded-full border px-4 py-1 text-sm font-medium transition', currentPage === page ? 'border-indigo-400 bg-indigo-500/90 text-white shadow shadow-indigo-500/30' : 'border-white/10 bg-white/10 text-slate-200 hover:bg-white/20']"
          >
            {{ page }}
          </button>
        </template>

        <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-sm font-medium text-slate-100 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Вперед
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reservation-history {
  @apply rounded-3xl border border-white/10 bg-slate-950/20 p-4 shadow-lg shadow-indigo-500/10 backdrop-blur;
}

th {
  @apply sticky top-0 z-10 bg-slate-950/60 backdrop-blur;
}
</style>