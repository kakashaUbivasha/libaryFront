<script setup>
import { ref } from 'vue';
import { useRouter } from 'nuxt/app';

const router = useRouter();
const name = ref('');
const password = ref('');
const email = ref('');
const password2 = ref('');
const isError = ref(false);
const errorMessage = ref(''); // Исправлено с errorMassage на errorMessage

const onRegistr = async () => {
  // Проверка на пустые поля
  if (!name.value.trim() || !email.value.trim() || !password.value.trim() || !password2.value.trim()) {
    isError.value = true;
    errorMessage.value = 'Пожалуйста, заполните все поля';
    return;
  }

  // Проверка совпадения паролей
  if (password.value !== password2.value) {
    isError.value = true;
    errorMessage.value = 'Пароли не совпадают';
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
      }),
    });

    // Проверяем успешность запроса
    if (!response.ok) {
      const errorData = await response.json(); // Пробуем получить детали ошибки от сервера
      throw new Error(errorData.message || 'Ошибка регистрации: проверьте данные');
    }

    const data = await response.json();
    console.log('Успешная регистрация:', data);

    // Сбрасываем ошибки
    isError.value = false;
    errorMessage.value = '';

    // Перенаправляем пользователя на страницу логина или другую
    router.push('/auth/login'); // Перенаправление на страницу входа после регистрации
  } catch (error) {
    isError.value = true;
    errorMessage.value = error.message || 'Произошла ошибка при регистрации';
    console.error('Ошибка:', error);
  }
};
</script>

<template>
  <div class="form__block">
    <form action="" class="form">
      <div class="input__block">
        <label for="name">
          Имя
        </label>
        <input v-model="name" id="name" placeholder="Введите имя...">
      </div>
      <div class="input__block">
        <label for="email">
          Ваша почта
        </label>
        <input v-model="email" type="email" id="email" placeholder="Введите почту..." required>
      </div>
      <div class="input__block">
        <label for="password">
          Пароль
        </label>
        <input v-model="password" type="password" id="password" placeholder="Введите пароль...">
      </div>
      <div class="input__block">
        <label for="password2">
          Повторите пароль
        </label>
        <input v-model="password2" type="password" id="password2" placeholder="Повторите пароль...">
      </div>
      <span v-if="isError" class="error">
          {{errorMessage}}
      </span>
      <button type="button" class="btn" @click="onRegistr">Зарегистрироваться</button>
      <NuxtLink style="text-align: center" to="/auth/login">Войти</NuxtLink>
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