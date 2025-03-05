<script setup>
import { ref } from 'vue';

const password = ref('')
const email = ref('')
const isError = ref(false)

const onLogin = () =>{
  if (!password.value.trim()||!email.value.trim()){
    return isError.value = true
  }
  isError.value = false

}
</script>

<template>
  <div class="form__block">
    <form action="" class="form">
      <div class="input__block">
        <label for="email">
          Ваша почта
        </label>
        <input v-model="email" type="email" id="email" placeholder="Введите почту...">
      </div>
      <div class="input__block">
        <label for="password">
          Пароль
        </label>
        <input v-model="password" type="password" id="password" placeholder="Введите пароль...">
      </div>
      <span v-if="isError" class="error">
          Неверная почта или пароль
      </span>
      <button type="button"  class="btn" @click="onLogin">Войти</button>
      <NuxtLink style="text-align: center" to="/auth/register">Зарегистрироваться</NuxtLink>
    </form>
    <span class="logo">LibraryApp</span>
  </div>
</template>

<style scoped>
.form__block {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #2C3E50;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5),
  0 1px 3px rgba(0, 0, 0, 0.06);
  max-width: 400px;
  margin: 0 auto;
  padding: 40px;
  border-radius: 20px;
  position: relative;

  .form{
    display: flex;
    flex-direction: column;
    gap: 20px;
    .input__block{
      display: flex;
      flex-direction: column;
      gap: 10px;
      input{
        padding: 10px 20px;
        border-radius: 20px;
        border: 1px solid #2C3E50;
      }
    }
    .btn{
      background: #6A5ACD;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 20px;
      cursor: pointer;
    }
    .btn:hover{
      background: #7B68EE;
    }
  }
  .logo{
    position: absolute;
    right: -60px;
    rotate: -90deg;
    font-size: 40px;
  }
}
</style>