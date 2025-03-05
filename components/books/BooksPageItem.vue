<script setup>
defineProps({
  title: '',
  imageSrc: '',
  publishedDate: '',
  description: '',
  categories: [],
  authors: [],
  pages: '',
  language: '',
  reviews: [],
  publisher: ''
})
const deleteTag = (desc) => {
  return desc.replace(/<\/?[^>]+(>|$)/g, "");
}
</script>

<template>
<div class="book">
  <img :src="imageSrc" :alt="title">
  <div class="book__info">
    <h1 class="book__title">
      {{ title }}
    </h1>
    <ul class="authors">
      <li
      v-for="author in authors"
      >
        <h2>Автор: {{author}}</h2>
      </li>
    </ul>
    <p class="book__published">
      Дата выхода:
      {{ publishedDate || 'Не указана' }}
    </p>

    <p>Издатель:
      {{ publisher || 'Не указан' }}
    </p>

    <ul>
      <li><h3>Категории:</h3></li>
      <li v-if="!categories">
        Категории не указаны
      </li>
      <li v-for="category in categories" :key="category">
        {{ category }}
      </li>
    </ul>

    <p class="pages__count">
      Количество страниц:
      {{ pages || 'Не указано' }}
    </p>

    <div class="description">
      <p style="font-weight: 700;">Описание:</p>
      <p>
        {{ deleteTag(description||'Нет описания') }}
      </p>
    </div>
  </div>
</div>
  <div class="flex justify-center mt-10">
    <span class="bg-main py-5 px-10 uppercase text-white rounded-2xl cursor-pointer font-bold shadow-xl hover:bg-[#7B68EE]">Забронироавть книгу</span>
  </div>
  <div class="reviews main">
    <h2>Рецензии</h2>
    <div class="reviews__block">
      <div v-for="review in reviews" class="reviews__block__item">
        <h3>{{review.title}}</h3>
        <p>
          {{review.text}}
        </p>
        <p>Пользователь: {{review.user}}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book{
  display: flex;
  width: 80%;
  gap: 100px;
  margin: 0 auto;
  justify-content: space-between;
  img{
    max-width: 100%;
    width: 400px;
    max-height: 600px;
  }
  .book__info{
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 5px;
    max-width: 800px;
    .book__title{
      text-align: end;
      font-size: 40px;
    }
    ul{
      text-align: end;
    }
    .description{
      display: flex;
      flex-direction: column;
      align-items: end;
      text-align: end;
    }
  }
}
.reviews{
  display: flex;
  flex-direction: column;
  gap: 20px;
  h2{
    font-size: 34px;
    margin-top: 40px;
    text-align: center;
  }
  .reviews__block{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 80px;
    row-gap: 20px;
    .reviews__block__item{
      width: 100%;
      border: 1px solid #777474;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      padding: 20px;
      justify-content: space-between;
    }
  }
}
</style>