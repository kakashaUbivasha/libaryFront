<script setup>
  defineProps({
  title: '',
  author: '',
  imageSrc: '',
    id: ''
  })
  const truncateAuthor = (author) => {
    if (!author) return 'Неизвестный автор';
    return author.length > 20 ? author.slice(0, 20) + '...' : author;
  };
</script>

<template>
    <NuxtLink :to="`/books/${id}`">
      <div class="book">
        <h2>{{ truncateAuthor(title) }}</h2>
        <h3>{{ truncateAuthor(author)}}</h3>
        <img v-if="imageSrc" :src="imageSrc" alt="Book Cover" loading="lazy"/>
      </div>

    </NuxtLink>
</template>

<style scoped>
.book{
  border: 1px solid #6A5ACD;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  img{
    height: 400px;
    width: 300px;
  }
}
</style>