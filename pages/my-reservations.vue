<template>
  <div class="main">
    <h1 class="text-4xl text-center mb-10 font-bold">Мои бронирования</h1>
    <custom-table
        :rows="items"
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
import CustomTable from "~/components/all/CustomTable.vue";
let items = ref([])
const headers = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'country', label: 'Country' },
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
  rows.value = rows.value.filter((booking) => booking.id !== item);
  apiEmitation()
};
onMounted(()=>{
  apiEmitation()
})
</script>

<style lang="scss" scoped>

</style>