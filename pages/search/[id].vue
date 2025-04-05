<script setup lang="ts">
import {useRouter} from 'vue-router';
import {useBookStore} from "~/stores/book";
import {onMounted} from "vue";
const store = useBookStore();
const results = ref([])
const route = useRoute()
const keyword = ref(route.params.id)
const searchBooks = async () => {
  if (keyword.value) {
    try {
      store.searchBooks(keyword.value);
      console.log('searched books', store.searched_books.length)
    } catch (err) {
      console.error(err)
    }
  }
};
onMounted(()=>{
  searchBooks()
})
</script>

<template>
<h2 class="text-4xl text-center mb-10">Результаты поиска:</h2>
  <div v-if="!store.searched_books.length" class="">
    <h2 class="text-center text-3xl">По запросу <i><b>{{keyword}}</b></i> ничего не найдено</h2>
  </div>
  <div v-else class="results main">
    <div v-for="book in store.searched_books"  class="">
      <books-item
          :title="book.title"
          :author="book.author"
          :image-src="book.image"
          :id ="book.id"
      />
    </div>

  </div>
</template>

<style scoped>
.results{
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}
</style>