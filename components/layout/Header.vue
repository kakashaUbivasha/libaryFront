<template>
  <header class="header">
    <div class="logo">
      <NuxtLink to="/">LibraryApp</NuxtLink>
    </div>

    <nav class="nav-menu">
      <NuxtLink to="/catalog">Каталог</NuxtLink>
      <NuxtLink to="/about">О нас</NuxtLink>
      <div class="search-bar">
        <div v-if="isSearched" class="search-overlay" key="search">
          <div class="backdrop" @click="closeInput"></div>
          <div class="input__block">
            <button @click="closeInput" class="close-btn">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
                <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
              </svg>
            </button>
            <input v-model="searchQuery" type="text" placeholder="Поиск книг..." />
            <div class="info-block">
              <label class="switch">
                <input v-model="isNpl" type="checkbox">
                <span class="slider round"></span>
              </label>
              <span class="info-icon">
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0,0,256,256">
      <g fill="#7b68ee" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
        <g transform="scale(5.12,5.12)">
          <path d="M25,2c-12.6907,0 -23,10.3093 -23,23c0,12.69071 10.3093,23 23,23c12.69071,0 23,-10.30929 23,-23c0,-12.6907 -10.30929,-23 -23,-23zM25,4c11.60982,0 21,9.39018 21,21c0,11.60982 -9.39018,21 -21,21c-11.60982,0 -21,-9.39018 -21,-21c0,-11.60982 9.39018,-21 21,-21zM25,11c-1.65685,0 -3,1.34315 -3,3c0,1.65685 1.34315,3 3,3c1.65685,0 3,-1.34315 3,-3c0,-1.65685 -1.34315,-3 -3,-3zM21,21v2h1h1v13h-1h-1v2h1h1h4h1h1v-2h-1h-1v-15h-1h-4z"></path>
        </g>
      </g>
    </svg>
    <span class="hover-text">Включает продвинутый поиск. При таком поиске вы можете написать описание книги а наша система при помощи ии сама подберёт вам книги</span>
  </span>
            </div>

            <button @click="onSearch" class="search-btn">🔍</button>
          </div>
        </div>
        <button @click="onSearch">🔍</button>
      </div>
      <NuxtLink to="/reservations" v-if="store.currentUser?.role==='Admin'">Бронирования</NuxtLink>
      <NuxtLink to="/my-reservations" v-else>Мои бронирования</NuxtLink>
      <NuxtLink to="/recomendation">ИИ Рекомендации</NuxtLink>
      <a href="/random/book">Случайная книга</a>
      <NuxtLink to="/import-files" v-if="store.currentUser?.role==='Admin'">Импортировать книги</NuxtLink>
    </nav>

    <div class="auth-section">
      <template v-if="isAuthenticated">
        <div class="profile-menu" @click="toggleDropdown">
          <img src="/img/products-2.jpg" alt="Profile" />
          <ul v-if="isDropdownOpen" class="dropdown">
            <li><NuxtLink :to="`/user/${store.currentUser.id}`">Мой профиль</NuxtLink></li>
            <li><NuxtLink :to="`/history`">История бронирований</NuxtLink></li>
            <li><NuxtLink :to="`/favorites`">Избранные книги</NuxtLink></li>
            <li class="text-red-500"><button @click="store.logout()">Выйти</button></li>
          </ul>
        </div>
      </template>
      <template v-else>
        <div class="">
          <button class="auth-buttons" @click=""><NuxtLink to="/auth/login">Войти</NuxtLink></button>
          <button class="auth-buttons" @click=""><NuxtLink to="/auth/register">Зарегистрироваться</NuxtLink></button>
        </div>
      </template>
    </div>
  </header>
</template>

<script>
import { ref } from "vue";
import {useGlobalStore} from "~/stores/global";
export default {
  name: "Header",
  setup() {
    const store = useGlobalStore();
    const searchQuery = ref("");
    const isDropdownOpen = ref(false);
    let isSearched = ref(false);
    const isNpl = ref(false)
    const router = useRouter()
    const closeInput = () =>{
      isSearched.value = false;
    }
    const onSearch = () => {
      isSearched.value = true
      if (searchQuery.value.trim()) {
        isSearched.value = false;
        navigateTo(`/search/${encodeURIComponent(searchQuery.value.trim())}`)
        searchQuery.value = ""
      }
    };
    function goToRandom() {
      router.push({ path: '/random/book', force: true })
    }
    const isAuthenticated = computed(()=>{
      return store.isAuthenticated
    })
    console.log("Header: Initial isAuthenticated:", isAuthenticated.value);
    watch(isAuthenticated, (newVal) => {
      console.log("Header: isAuthenticated changed to:", newVal);
    });
    console.log(isAuthenticated.value)
    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };
    return {
      searchQuery,
      isAuthenticated,
      isDropdownOpen,
      onSearch,
      toggleDropdown,
      isSearched,
      closeInput,
      store,
      isNpl,
      goToRandom
    };
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #F0F4F8;
  border-bottom: 1px solid #ddd;
  margin-bottom: 50px;
  z-index: 3;
  margin-top: 10px;
}

.logo a {
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: #4A68AD ;
}
.nav-menu{
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
.nav-menu a {
  margin: 0 15px;
  text-decoration: none;
  color: #4A68AD ;
}

.nav-menu a:hover {
  color: #5A78BD ;
}
.search-bar{
  display: flex;
  gap: 10px;
  position: relative;
  .input__block{
    display: flex;
    gap: 10px;
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    margin-top: 100px;
    input {
      padding: 5px 10px;
      font-size: 16px;
    }
  }
}
.search-bar button {
  margin-left: 5px;
  background-color: #6A5ACD      ;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  width: 40px;
  height: 40px;
}

.search-bar button:hover {
  background-color: #7B68EE      ;
}
.search-bar button:active {
  background-color: #5D4AD0  ;
}
.auth-section {
  display: flex;
  align-items: center;
}

.auth-buttons {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #6A5ACD;
  color: white !important;
  border: none;
  cursor: pointer;
}

.auth-buttons:hover {
  background-color: #7B68EE;
}

.profile-menu {
  position: relative;
}

.profile-menu img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.profile-menu .dropdown {
  position: absolute;
  top: 50px;
  right: -15px;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 10px 0;
}

.profile-menu .dropdown li {
  padding: 10px 20px;
  color: $link;
}

.profile-menu .dropdown li:hover {
  background-color: #eaeaea;
}
.search-input-enter-active, .search-input-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.search-input-enter, .search-input-leave-to {
  opacity: 0;
  transform: translateX(-100%); /* Блок скрыт за пределами экрана */
}

.search-input-enter-to, .search-input-leave {
  opacity: 1;
  transform: translateX(0); /* Блок становится видимым */
}
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
}

.backdrop {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.close-btn, .search-btn {
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-btn:hover, .search-btn:hover {
  opacity: 0.7;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 300px;
}

.info-block{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #7B68EE;
}

input:focus + .slider {
  box-shadow: 0 0 1px #7B68EE;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
.info-icon {
  position: relative;
  cursor: help;
}
.hover-text {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
}

.info-icon:hover .hover-text {
  opacity: 1;
  visibility: visible;
}
/* Добавляем небольшой треугольник сверху текста */
.hover-text::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 5px 5px 5px;
  border-style: solid;
  border-color: transparent transparent #333 transparent;
}
</style>
