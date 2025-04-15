import { defineStore } from 'pinia';
import {useGlobalStore} from "./global";


export const useReservationStore = defineStore('reservation', {
    state: ()=>({
        reservations: [],
        history: []
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
        },
        async getReservBook(){
            const store = useGlobalStore()
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/reservations`, {
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                        accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при получении забронированных книг');
                }
                const data = await response.json()
                this.reservations = data.data

            }catch (e){
                console.log(e)
            }
        },
        async canceledReservBook(book_id: number)
        {
            const store = useGlobalStore()
            console.log(`book_id`, book_id)
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/reservation`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                        accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ book_id })
                })
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при получении забронированных книг');
                }
                const data = await response.json()
                console.log(data)
                return `Бронь отменена`
            }catch (e){
                console.error(e)
            }
        },
        async historyReservBook(){
            const store = useGlobalStore()
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/reservation/history`, {
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                        accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при получении забронированных книг');
                }
                const data = await response.json()
                this.history = data.data
            }catch (e){
                console.error(e)
            }
        }
    },
})