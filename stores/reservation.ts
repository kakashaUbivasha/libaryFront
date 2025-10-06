import { defineStore } from 'pinia';
import {useGlobalStore} from "./global";


type ReservationMeta = {
    current_page: number;
    last_page: number;
    per_page?: number;
    total?: number;
};

export const useReservationStore = defineStore('reservation', {
    state: ()=>({
        reservations: [],
        all_reservations: [],
        allReservationsMeta: null as ReservationMeta | null,
        history: [],
        error_message: ''
    }),
    actions: {
        async reservBook(book_id :string | number){
            const store = useGlobalStore()
            if(!store.token)
            {
                navigateTo('/auth/login')
                return
            }

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
                    this.error_message =  errorData.message || 'Ошибка при бронировании'
                    return
                }
                await navigateTo('/my-reservations');
            }catch (e){
                this.error_message = e
                console.log(this.error_message)
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
        async getAllReservations({ user, page }: { user?: string; page?: number } = {})
        {
            const store = useGlobalStore()
            try{
                const params = new URLSearchParams()
                if(user){
                    params.append('user', user)
                }
                if(page){
                    params.append('page', String(page))
                }
                const query = params.toString()
                const response = await fetch(`http://127.0.0.1:8000/api/admin/reservations${query ? `?${query}` : ''}`, {
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
                this.all_reservations = data.data
                this.allReservationsMeta = data.meta ?? null
            }catch (error){
                console.error(error)
                this.all_reservations = []
                this.allReservationsMeta = null
            }
        },
        async canceledReservBook(book_id: number, user_id: number)
        {
            const store = useGlobalStore()
            console.log(`book_id`, book_id)
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/reservation/canceled`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                        accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ book_id, user_id })
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
        },
        async issueBook(book_id: number, user_id: number)
        {
            const store = useGlobalStore()
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/admin/reservation/issuance`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                        accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ book_id, user_id })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при отмены бронирования');
                }
                const data = await response.json()
                console.log('Отмена бронирования',data)
            }catch(e){
                console.error(e)
            }
        },
        async returnedBook(book_id: number, user_id: number)
        {
            const store = useGlobalStore();
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/admin/reservation/returned`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                        accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ book_id, user_id })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при отмены бронирования');
                }
                const data = await response.json()
                console.log('Отмена бронирования',data)
            }catch (e)
            {
                console.error(e)
            }
        }
    },
})