<script setup lang="ts">
import {useGlobalStore} from "~/stores/global";
import {ref, onMounted} from "vue";
import Reviews from "~/components/profile/Reviews.vue";
import UserInfo from "~/components/profile/UserInfo.vue";

const route = useRoute()
const id = route.params.id
const store = useGlobalStore()
const currentGuest = ref(null);
const error = ref(null);
const isLoading = ref(true)
const isCurrentUser = computed(() => id === store.currentUser.id)
const containerRef = ref(null)
const containerRef1 = ref(null)
const swiper = useSwiper(containerRef, {

  loop: true,
  autoplay: {
    delay: 3000,
  },
  spaceBetween: 20,
  slidesPerView: 3,
  direction: 'horizontal',
})
const swiper1 = useSwiper(containerRef1, {

  loop: true,
  autoplay: {
    delay: 3000,
  },
  spaceBetween: 20,
  slidesPerView: 3,
  direction: 'horizontal',
})
const loadGuestData = async () => {
  if (!isCurrentUser.value) {
    isLoading.value = true;
    try {
      currentGuest.value = await store.getUser(id)
      console.log(currentGuest.value)
    } catch (err) {
      error.value = 'Не удалось загрузить данные пользователя.';
    } finally {
      isLoading.value = false;
    }
  }
  isLoading.value = false;
};
const wordCut = (string: string) => {
  if(string.length > 200){
    return string.substr(0, 200) + '...';
  }
  return string
}
const getBackgroundStyle = () =>{
  const imageUrl = '/img/back_user.jpg';
  const currentHour = new Date().getHours();
  if(currentHour >= 21 && currentHour < 25)
  {
    return {
      backgroundImage: `url(/img/back_user_dark.jpg)`
    };
  }
  return {
    backgroundImage: `url(${imageUrl})`
  };
}
onMounted(() => {
  loadGuestData()
})
const guestExists = computed(() => isCurrentUser.value || !!currentGuest.value);
</script>

<template>
  <div class="main">
    <div v-if="isLoading">
      <div class="loader-container">
        <div class="spinner"></div>
      </div>
    </div>
    <div v-else-if="error" class="text-center">{{ error }}</div>
    <div v-else>
      <div v-if="guestExists">
        <h1 v-if="isCurrentUser" class="text-4xl text-center mb-20">Мой профиль</h1>
        <h1 v-else class="text-4xl text-center mb-20">Профиль пользователя: {{id}}</h1>
        <div v-if="isCurrentUser">
          <user-info
          :name="store.currentUser.name"
          :array="store.currentUser.reviews"
          :level="store.currentUser.level"
          :total-books="store.currentUser.totalBooks "
          :register-date="store.currentUser.registerDate"
          :is-current-user="true"
          />
        </div>
        <div v-else>
          <user-info
              :name="currentGuest.name"
              :array="currentGuest.reviews"
              :level="currentGuest.level"
              :total-books="currentGuest.totalBooks "
              :register-date="currentGuest.registerDate"
              :is-current-user="false"
          />
<!--          <div class="flex flex-col items-center justify-center p-10 rounded-3xl bg-user-main" :style="getBackgroundStyle()" >-->
<!--            <div class="bg-user px-20 py-10">-->
<!--              <div class="text-center flex flex-col justify-center items-center">-->
<!--                <img src="~public/img/img1.jpg" alt="" class="mb-5" />-->
<!--                <p class="text-xl font-bold">{{ currentGuest.name }}</p>-->
<!--                <span>Уровень: {{currentGuest.level}}</span>-->
<!--              </div>-->
<!--              <div class="text-center">-->
<!--                <p>Количество прочитанных книг: {{ currentGuest.totalBooks }}</p>-->
<!--                <p>С нами с: {{ currentGuest.registerDate }}</p>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="my-20">-->
<!--            <h2 class="text-center text-2xl mb-10">Рецензии пользователя</h2>-->
<!--            <reviews-->
<!--            :array="currentGuest.reviews"-->
<!--            />-->
<!--          </div>-->
        </div>
      </div>
      <div v-else>
        <h1>Пользователь не найден</h1>
      </div>
    </div>
  </div>
</template>


<style scoped>
</style>