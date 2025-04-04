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
const isCurrentUser = computed(() => id == store.currentUser?.id)
const guestExists = computed(() => isCurrentUser.value || !!currentGuest.value)
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
      currentGuest.value = await store.guestProfile(id)
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
          :total-books="store.currentUser.passed_books_count "
          :register-date="store.currentUser.created_at"
          :is-current-user="true"
          />
        </div>
        <div v-else>
          <user-info
              :name="currentGuest.name"
              :array="currentGuest.reviews"
              :level="currentGuest.level"
              :total-books="currentGuest.passed_books_count "
              :register-date="currentGuest.created_at"
              :is-current-user="false"
          />
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