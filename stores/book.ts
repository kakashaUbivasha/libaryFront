import { defineStore } from 'pinia';
import { useRuntimeConfig } from '#imports';
import { useGlobalStore } from '~/stores/global';


export const useBookStore = defineStore('books', {
    state: ()=>({
        books: [],
        genres: [],
        searched_books: [],
        book: {},
        comments: []
    }),
    actions: {
        async get_books(perPage: number, genre: string, page: number){
            try{
                const params = new URLSearchParams({
                    perPage: String(perPage),
                    page: String(page),
                });
                if (genre) {
                    params.append('genre', genre);
                }
                const response = await fetch(`http://127.0.0.1:8000/api/books?${params.toString()}`)
                const data = await response.json();
                const books = Array.isArray(data.data) ? data.data : [];
                let booksSlice = books;
                if (books.length > perPage) {
                    const start = (page - 1) * perPage;
                    booksSlice = books.slice(start, start + perPage);
                }
                this.books = page === 1 ? booksSlice : [...this.books, ...booksSlice];
                return booksSlice;
            }catch (error){
             console.error(error)
            }
        },
        async get_categories(){
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/genres`)
                const data = await response.json()
                this.genres = data.data
            }catch (error){
                console.error(error)
            }
        },
        async searchBooks(keyword: string) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/book/search?query=${encodeURIComponent(keyword)}`)
                const data = await response.json();
                console.log(`search:`,data.data)
                this.searched_books = data.data
            }
            catch(error) {
                console.log(error);
            }
        },
        async getBook(id: number){
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/books/${id}`)
                const data = await response.json()
                this.book = data.data
                console.log(`book`, this.book)
            }catch (error){
                console.log(error)
            }
        },
        async viewBook(id: number) {
            try {
                const config = useRuntimeConfig();
                const baseURL = config.public?.apiBase ?? 'http://127.0.0.1:8000';
                const globalStore = useGlobalStore();

                if (!globalStore.token) {
                    return;
                }

                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                    accept: 'application/json'
                };

                if (globalStore.token) {
                    headers.Authorization = `Bearer ${globalStore.token}`;
                }

                await fetch(`${baseURL}/api/view-book/`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        book_id: id
                    })
                });
            } catch (error) {
                console.error('Failed to track book view', error);
            }
        },
        async updateBook(id: number, payload: Record<string, any>) {
            const globalStore = useGlobalStore();
            if (!globalStore.token) {
                throw new Error('Требуется авторизация для обновления книги');
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/books/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${globalStore.token}`,
                        accept: 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Не удалось обновить книгу');
                }

                const data = response.status === 204 ? null : await response.json();
                const updatedBook = data?.data ?? data ?? {};
                if (Object.keys(updatedBook).length) {
                    this.book = updatedBook;
                    this.books = this.books.map((book: any) => Number(book.id) === Number(id) ? updatedBook : book);
                }
                return updatedBook;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        async deleteBook(id: number) {
            const globalStore = useGlobalStore();
            if (!globalStore.token) {
                throw new Error('Требуется авторизация для удаления книги');
            }

            const numericId = Number(id);
            if (Number.isNaN(numericId)) {
                throw new Error('Некорректный идентификатор книги');
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/books/${numericId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${globalStore.token}`,
                        accept: 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Не удалось удалить книгу');
                }

                this.books = this.books.filter((book: any) => Number(book.id) !== numericId);
                if ((this.book as any)?.id === numericId) {
                    this.book = {} as any;
                }
                this.comments = [];
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        async getRandomBooks(){
          try {
              const response = await fetch(`http://127.0.0.1:8000/api/books/random`)
              const data = await response.json()
              this.book = data.data
              console.log(`book`, this.book)
          }  catch (e){
              console.error(e)
          }
        },
        async getComments(id: number){
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/books/${id}/comments`)
                const data = await response.json()
                this.comments = data.data
                console.log('comments', this.comments)
            }catch (e){
                console.error(e)
            }
        }
    }
})