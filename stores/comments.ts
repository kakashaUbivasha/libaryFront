import { defineStore } from 'pinia';
import { useGlobalStore } from '~/stores/global';

interface ErrorResponse {
    message?: string;
    errors?: Record<string, string[]>;
}

export const useCommentsStore = defineStore('comments', {
    state: () => ({
        errorMessage: '' as string,
        isProcessing: false as boolean,
    }),
    actions: {
        clearError() {
            this.errorMessage = '';
        },
        async postComments(content: string, book_id: number) {
            const store = useGlobalStore();
            this.isProcessing = true;
            this.clearError();

            try {
                const response = await fetch('http://127.0.0.1:8000/api/book/comment', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                        accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content, book_id })
                });

                if (!response.ok) {
                    const errorData = await this.parseError(response);
                    throw new Error(errorData);
                }

                if (response.status !== 204) {
                    await response.json().catch(() => null);
                }

                if (process.client) {
                    window.location.reload();
                }
            } catch (error: any) {
                this.errorMessage = error?.message || 'Не удалось отправить комментарий.';
                throw error;
            } finally {
                this.isProcessing = false;
            }
        },
        async updateComment(commentId: number | string, content: string) {
            const store = useGlobalStore();
            this.isProcessing = true;
            this.clearError();

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

                if (!response.ok) {
                    const errorData = await this.parseError(response);
                    throw new Error(errorData);
                }

                if (response.status !== 204) {
                    await response.json().catch(() => null);
                }

                if (process.client) {
                    window.location.reload();
                }
            } catch (error: any) {
                this.errorMessage = error?.message || 'Не удалось обновить комментарий.';
                throw error;
            } finally {
                this.isProcessing = false;
            }
        },
        async deleteComment(commentId: number | string) {
            const store = useGlobalStore();
            this.isProcessing = true;
            this.clearError();

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/book/comment/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                        accept: 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await this.parseError(response);
                    throw new Error(errorData);
                }

                if (process.client) {
                    window.location.reload();
                }
            } catch (error: any) {
                this.errorMessage = error?.message || 'Не удалось удалить комментарий.';
                throw error;
            } finally {
                this.isProcessing = false;
            }
        },
        async parseError(response: Response): Promise<string> {
            try {
                const errorData: ErrorResponse = await response.json();
                const fieldError = errorData?.errors ? Object.values(errorData.errors)[0]?.[0] : '';
                return errorData?.message || fieldError || 'Произошла ошибка при выполнении запроса.';
            } catch (e) {
                return 'Произошла ошибка при выполнении запроса.';
            }
        }
    }
});
