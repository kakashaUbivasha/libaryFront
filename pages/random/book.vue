<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useBookStore} from "~/stores/book";
const store = useBookStore()
const book = ref({});
const comments = ref([])
const loadBook = async () => {
  book.value = await store.getRandomBooks()
  console.log(book.value)
  console.log(book.value.title)
};
onMounted(() => {
  loadBook()
  store.getComments(book.value.id)
});
</script>

<template>
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
  />
</template>

<style scoped>

</style>