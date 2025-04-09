import { defineStore } from 'pinia';
import {useGlobalStore} from "./global";


export const useReservationStore = defineStore('reservation', {
    state: ()=>({

    }),
    actions: {
        async reservBook(book_id :string | number){
            const store = useGlobalStore()
            console.log('lalallalalalalla', typeof book_id, store.token)
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/reservation`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                        accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ book_id })
                })
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при бронировании');
                }

                await navigateTo('/my-reservations');
            }catch (e){
                console.log(`aldkjadkljadhjklakhjldshjkadshjksdahjkasdbhjK`,e)
            }
        }
    },
})