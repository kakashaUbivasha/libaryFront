<script setup lang="ts">

</script>

<template>
  <div class="footer">
    <div class="logo">
      <NuxtLink to="/">LibraryApp</NuxtLink>
    </div>
    <div class="footer__info">
      <ul>
        <li>Контакты</li>
        <li><a href="">библиотека@example.com</a></li>
        <li><a href="">Телефон: +7 (123) 456-78-90</a></li>
        <li><a href="">Рабочие часы: Пн-Пт с 9:00 до 18:00</a></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
  margin-top: 100px;
  .logo a {
    font-size: 20px;
    font-weight: bold;
    text-decoration: none;
    color: #4A68AD;
  }
  .footer__info {
    width: 100%;
    ul{
      display: flex;
      flex-direction: column;
      row-gap: 6px;
      width: 100%;
      text-align: left;
      li{
        font-size: 16px;
        color: #2C3E50;
        word-break: break-word;
      }
      li:first-child{
        font-size: 14px;
        color: #4c5e71;

      }
    }
  }
}

@media (min-width: 768px) {
  .footer {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0;
    padding: 10px 20px;
    .logo a {
      font-size: 24px;
    }
    .footer__info {
      width: auto;
      ul {
        width: auto;
        text-align: left;
        row-gap: 0;
        li {
          font-size: 18px;
        }
        li:first-child {
          font-size: 16px;
        }
      }
    }
  }
}
a:hover{
  color: #5A78BD;
}
</style>
