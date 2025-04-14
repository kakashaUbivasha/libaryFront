<template>
  <div class="main">
    <h1 class="text-4xl text-center mb-10 font-bold">Мои бронирования</h1>
    <custom-table
        :rows="store.reservations"
        :headers="headers"
        @delete-book="deleteBooks"
        :is-user="true"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});
import {onMounted, ref} from 'vue'
import {useReservationStore} from "~/stores/reservation";
import CustomTable from "~/components/all/CustomTable.vue";
let items = ref([])
const store = useReservationStore();
const headers = [
  { key: 'book_title', label: 'Название книги' },
  { key: 'reservation_time', label: 'Дата бронирования' },
  { key: 'status', label: 'Статус' }
];
const apiEmitation = () =>{
  setTimeout(()=>{
    items.value = rows.value
  },3000)
}
let rows = ref([
  { name: 'John', age: 30, country: 'USA', id: '1' },
  { name: 'Anna', age: 25, country: 'Canada', id: '2' },
  { name: 'Tom', age: 35, country: 'UK', id: '3' },
]);
const deleteBooks = (item: any) => {
return 1

};
onMounted(()=>{
  store.getReservBook()
})
</script>

<style lang="scss" scoped>

</style>