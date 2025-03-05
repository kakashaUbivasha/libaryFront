<script setup>
import { ref } from 'vue';
import { useRouter } from 'nuxt/app'; // Для перенаправления после успешного логина

const password = ref('');
const email = ref('');
const isError = ref(false);
const errorMessage = ref(''); // Для более конкретного сообщения об ошибке

const router = useRouter(); // Инициализация роутера Nuxt

const onLogin = async () => {
  // Проверка на пустые поля
  if (!password.value.trim() || !email.value.trim()) {
    isError.value = true;
    errorMessage.value = 'Пожалуйста, заполните все поля';
    return;
  }

  try {
    // Выполняем POST-запрос на сервер
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    // Проверяем, успешен ли запрос
    if (!response.ok) {
      throw new Error('Ошибка входа: неверная почта или пароль');
    }

    const data = await response.json(); // Получаем ответ от сервера
    console.log('Успешный вход:', data); // Для отладки

    // Сбрасываем ошибку, если она была
    isError.value = false;
    errorMessage.value = '';

    // Перенаправляем пользователя, например, на главную страницу
    router.push('/'); // Можно изменить путь, куда перенаправлять
  } catch (error) {
    // Обрабатываем ошибку
    isError.value = true;
    errorMessage.value = error.message || 'Произошла ошибка при входе';
    console.error('Ошибка:', error);
  }
};
</script>

<template>
  <div class="form__block">
    <form action="" class="form" @submit.prevent>
      <div class="input__block">
        <label for="email">Ваша почта</label>
        <input v-model="email" type="email" id="email" placeholder="Введите почту..." />
      </div>
      <div class="input__block">
        <label for="password">Пароль</label>
        <input v-model="password" type="password" id="password" placeholder="Введите пароль..." />
      </div>
      <span v-if="isError" class="error">{{ errorMessage }}</span>
      <button type="button" class="btn" @click="onLogin">Войти</button>
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