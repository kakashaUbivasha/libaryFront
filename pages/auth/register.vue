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
  if (!name.value.trim() || !email.value.trim() || !password.value.trim() || !password2.value.trim()) {
    isError.value = true;
    errorMessage.value = 'Пожалуйста, заполните все поля';
    return;
  }
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка регистрации: проверьте данные');
    }
    const data = await response.json();
    console.log('Успешная регистрация:', data);
    isError.value = false;
    errorMessage.value = '';
    router.push('/auth/login');
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
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: min(100%, 420px);
  margin: clamp(40px, 12vh, 120px) auto;
  padding: clamp(24px, 6vw, 40px);
  border: 1px solid #2C3E50;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5),
  0 1px 3px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  position: relative;
  box-sizing: border-box;

  .form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .input__block {
      display: flex;
      flex-direction: column;
      gap: 10px;

      label {
        font-size: 16px;
      }

      input {
        width: 100%;
        padding: 12px 20px;
        border-radius: 20px;
        border: 1px solid #2C3E50;
        font-size: 16px;
      }
    }

    .btn {
      background: #6A5ACD;
      color: #fff;
      border: none;
      padding: 12px 20px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 18px;
      transition: background-color 0.2s ease;
    }

    .btn:hover {
      background: #7B68EE;
    }
  }

  .logo {
    font-size: clamp(32px, 10vw, 40px);
    font-weight: 600;
    letter-spacing: 2px;
  }
}

@media (max-width: 640px) {
  .form__block {
    margin: clamp(24px, 10vh, 80px) auto;
    padding: 24px 16px;
    gap: 16px;
  }

  .form {
    gap: 16px;
  }

  .form .btn {
    width: 100%;
  }
}

@media (min-width: 768px) {
  .form__block {
    align-items: center;
    padding: 40px 48px;
  }

  .logo {
    position: absolute;
    right: -70px;
    top: 50%;
    transform: translateY(-50%);
    rotate: -90deg;
  }
}
</style>