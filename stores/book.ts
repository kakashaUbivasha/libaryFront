import { defineStore } from 'pinia';


export const useBookStore = defineStore('books', {
    state: ()=>({
        books: [],
        genres: [],
        searched_books: []
    }),
    actions: {
        async get_books(startIndex :number, genre :string){
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/books?perPage=${startIndex}&genre=${genre}`)
                const data = await response.json();
                this.books = data.data
                return
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
    }
})