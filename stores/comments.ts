import { defineStore } from 'pinia';
import {useGlobalStore} from "~/stores/global";

export const useCommentsStore = defineStore('comments', {
    state: () =>({
        errorMessage: ''
    }),
    actions: {
        setError(message: string) {
            this.errorMessage = message;
        },
        clearError() {
            this.errorMessage = '';
        },
        async postComments(content: string, book_id: number){
            const store = useGlobalStore();
            this.clearError();

            if (!store.token) {
                const message = 'Для добавления комментария требуется авторизация.';
                this.setError(message);
                throw new Error(message);
            }

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

                let responseData: any = null;
                try {
                    responseData = await response.json();
                } catch (error) {
                    responseData = null;
                }

                if (!response.ok) {
                    const message = responseData?.errors?.content?.[0]
                        || responseData?.message
                        || 'Не удалось отправить комментарий.';
                    this.setError(message);
                    throw new Error(message);
                }

                if (process.client) {
                    window.location.reload();
                }

                return responseData;
            }catch (error){
                if (error instanceof Error && !this.errorMessage) {
                    this.setError(error.message);
                }
                console.error(error);
                throw error;
            }
        },
        async updateComment(commentId: number | string, content: string){
            const store = useGlobalStore();
            this.clearError();

            if (!store.token) {
                const message = 'Для редактирования комментария требуется авторизация.';
                this.setError(message);
                throw new Error(message);
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/book/comment/${commentId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                        accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content })
                });

                let responseData: any = null;
                try {
                    responseData = await response.json();
                } catch (error) {
                    responseData = null;
                }

                if (!response.ok) {
                    const message = responseData?.errors?.content?.[0]
                        || responseData?.message
                        || 'Не удалось обновить комментарий.';
                    this.setError(message);
                    throw new Error(message);
                }

                if (process.client) {
                    window.location.reload();
                }

                return responseData;
            } catch (error) {
                if (error instanceof Error && !this.errorMessage) {
                    this.setError(error.message);
                }
                console.error(error);
                throw error;
            }
        },
        async deleteComment(commentId: number | string){
            const store = useGlobalStore();
            this.clearError();

            if (!store.token) {
                const message = 'Для удаления комментария требуется авторизация.';
                this.setError(message);
                throw new Error(message);
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/book/comment/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                        accept: 'application/json'
                    }
                });

                let responseData: any = null;
                try {
                    responseData = await response.json();
                } catch (error) {
                    responseData = null;
                }

                if (!response.ok) {
                    const message = responseData?.message || 'Не удалось удалить комментарий.';
                    this.setError(message);
                    throw new Error(message);
                }

                if (process.client) {
                    window.location.reload();
                }

                return responseData;
            } catch (error) {
                if (error instanceof Error && !this.errorMessage) {
                    this.setError(error.message);
                }
                console.error(error);
                throw error;
            }
        }
    }
});

