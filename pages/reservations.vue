<script setup lang="ts">

import CustomTable from "~/components/all/CustomTable.vue";
import {onMounted, ref} from "vue";
definePageMeta({
  middleware: 'admin',
});
let items = ref([])
const headers = [
  { key: 'name', label: 'Имя пользователя' },
  { key: 'book', label: 'Name' },
  { key: 'reservation', label: 'Age' },
  { key: 'issue', label: 'Country' },
  { key: 'lease', label: 'Country' },
  { key: 'overdue', label: 'Country' },
];
const apiEmitation = () =>{
  setTimeout(()=>{
    items.value = rows.value
  },3000)
}
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
        :rows="items"
        :headers="headers"
        @delete-book="deleteBooks"
        :is-user="false"
    />
  </div>

</template>

<style scoped>

</style>