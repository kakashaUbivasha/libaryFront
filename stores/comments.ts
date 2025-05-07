import { defineStore } from 'pinia';
import {useGlobalStore} from "~/stores/global";

export const useCommentsStore = defineStore('comments', {
    state: () =>({

    }),
    actions: {
        async postComments(content: string, book_id: number){
            const store = useGlobalStore();
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/book/comment`,{
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                        accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content, book_id })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при отмены бронирования');
                }
                const data = await response.json()
                console.log('Отмена бронирования',data)
            }catch (e){
                console.error(e)
            }
        }
    }
})