<template>
  <ReservationHistory
      :reservations="store.history"
      :is-admin="false"
  />
</template>
<script setup lang="ts">
import ReservationHistory from "~/components/history/ReservationHistory.vue";
import {useReservationStore} from "~/stores/reservation";
import {onMounted} from "vue";
const store = useReservationStore()

onMounted(()=>{
  store.historyReservBook()
})
</script>