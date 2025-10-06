<script setup lang="ts">

import CustomTable from "~/components/all/CustomTable.vue";
import {useReservationStore} from "~/stores/reservation";
import {onMounted, ref} from "vue";
import { reloadNuxtApp } from "#app";
import { useRoute } from "#imports";
definePageMeta({
  middleware: ['auth', 'admin'],
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
const route = useRoute();
onMounted(()=>{
  store.getAllReservations()
})
const rows = ref([
  { name: 'John', age: 30, country: 'USA', id: '1' },
  { name: 'Anna', age: 25, country: 'Canada', id: '2' },
  { name: 'Tom', age: 35, country: 'UK', id: '3' },
]);
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
onMounted(()=>{
  apiEmitation()
})
</script>

<template>
  <div class="main">
    <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-20">
      Забронированные книги
    </h1>
    <custom-table
        :rows="store.all_reservations"
        :headers="headers"
        @delete-book="deleteBook"
        @issue-book="issueBook"
        @return-book="returnedBook"
        :is-user="false"
    />
  </div>

</template>

<style scoped>

</style>