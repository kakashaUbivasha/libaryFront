import { defineStore } from 'pinia';
import {useGlobalStore} from "./global";

export const useFavoriteStore = defineStore('favorite', {
    state: ()=>({
            books: []
        }
    ),
    actions: {
        async getFavorites()
        {
            try {
                const response = await fetch(`https://api.libaryai.uz/api/favorites`,{
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при получении забронированных книг');
                }
                const data = await response.json()
                this.books = data.data
                console.log('fav books',this.books.length)
            }catch (e){
                console.error(e)
            }
        },
        async addFavorite(book_id: number)
        {
            try {
                const response = await fetch(`https://api.libaryai.uz/api/favorite`,{
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ book_id })
                })
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при получении забронированных книг');
                }
                return
            }catch (e){
                console.error(e)
            }
        },
        async removeFavorites(book_id: number)
        {
            try{
                const response = await fetch(`https://api.libaryai.uz/api/favorite/${book_id}`,{
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при получении забронированных книг');
                }
                return
            }catch (e) {
                console.error(e)
            }
        },
        async isFavorite(book_id: number)
        {
            try{
                const response = await fetch(`https://api.libaryai.uz/api/favorite/${book_id}`,{
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при получении забронированных книг');
                }
                const data = await response.json()
                return data.data.is_favorite
            }catch (e) {
                console.error(e)
            }
        }

    }
})