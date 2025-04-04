import { defineStore } from 'pinia';


export const useBookStore = defineStore('books', {
    state: ()=>({
        books: []
    }),
    actions: {
        async get_books(){
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/books`)
                const data = await response.json();

                return data.data
            }catch (error){
             console.error(error)
            }
        }
    }
})