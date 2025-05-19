<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {useBookStore} from "~/stores/book";
import { useRoute } from 'vue-router';
import {fetchBookById} from "~/composables/useBook";
import {useCommentsStore} from "~/stores/comments";
const book = ref(null);
const route = useRoute(); // Получаем объект маршрута
const id = ref(route.params.id); // Извлекаем ID из параметров маршрута
const store = useBookStore();
const commentStore = useCommentsStore();
onMounted(() => {
  store.getBook(id.value)
  store.getComments(id.value)
  console.log('ID из маршрута:', id.value); // Проверяем, что ID правильно извлечён
});
const submitReview = async(content: string, book_id: number)=>{
  try{
    await commentStore.postComments(content, book_id)
    store.getComments(id.value)
  }catch (e)
  {
    console.error(e)
  }

}
</script>

<template>
  <h1
  v-if="!store.book"
  >Загрузка...</h1>
  <div v-else class="">
    <books-page-item
        :title="store.book.title"
        :authors="store.book.author"
        :genre="store.book.genre"
        :isbn="store.book.isbn"
        :language="store.book.language"
        :description="store.book.description"
        :published-date="store.book.publication_date"
        :publisher="store.book.publisher"
        :reviews="store.comments"
        :count="store.book.count"
        :id="store.book.id"
        @submit-review="submitReview"
    />
  </div>

</template>

<style scoped>

</style>