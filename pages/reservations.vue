<script setup lang="ts">

import CustomTable from "~/components/all/CustomTable.vue";
import {useReservationStore} from "~/stores/reservation";
import {onMounted, ref} from "vue";
definePageMeta({
  middleware: 'admin',
});
let items = ref([])
const headers = [
  { key: 'book_title', label: 'Название книги' },
  { key: 'reservation_time', label: 'Дата бронирования' },
  { key: 'status', label: 'Статус' },
  {key: 'user', label: 'Пользователь'},
];
const apiEmitation = () =>{
  setTimeout(()=>{
    items.value = rows.value
  },3000)
}
const store = useReservationStore();
onMounted(()=>{
  store.getAllReservations()
})
const rows = ref([
  { name: 'John', age: 30, country: 'USA', id: '1' },
  { name: 'Anna', age: 25, country: 'Canada', id: '2' },
  { name: 'Tom', age: 35, country: 'UK', id: '3' },
]);
const deleteBooks = (item: any) => {
  rows.value = rows.value.filter((booking) => booking.id !== item);
  apiEmitation()
};
onMounted(()=>{
  apiEmitation()
})
</script>

<template>
  <div class="main">
    <h1 class="text-4xl font-bold text-center mb-20">Забронированные книги</h1>
    <custom-table
        :rows="store.all_reservations"
        :headers="headers"
        @delete-book="deleteBooks"
        :is-user="false"
    />
  </div>

</template>

<style scoped>

</style>