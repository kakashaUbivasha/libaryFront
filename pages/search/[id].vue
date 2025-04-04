<script setup lang="ts">
import {useRouter} from 'vue-router';
import {useGlobalStore} from "~/stores/global";
import {onMounted} from "vue";
const store = useGlobalStore();
const results = ref([])
const route = useRoute()
const keyword = ref(route.params.id)
const searchBooks = async () => {
  if (keyword.value) {
    try {
      results.value = await store.searchBooks(keyword.value);
      console.log(results.value[0])
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
  <div v-if="!results" class="">
    <h2 class="text-center text-3xl">По запросу <i><b>{{keyword}}</b></i> ничего не найдено</h2>
  </div>
  <div v-else class="results main">
    <div v-for="book in results"  class="">
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