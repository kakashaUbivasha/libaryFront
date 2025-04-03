// useBooks.js
const apiKey = 'AIzaSyAcwU-p-csUT5UbMbRKBuss_N5jb4A4M0o';
export const useBooks = () => {
    const fetchRandomBooks = async () => {
        try {
            // Используйте свой API-ключ Google Books (получить его в Google Cloud Console)
            const keywords = ['minima', 'quo', 'voluptatum', 'est'];
            const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
            // Делаем запрос к Google Books API
            const response = await fetch(`http://127.0.0.1:8000/api/books?genre=${randomKeyword}`);
            const data = await response.json();
            if (!data || data.data.length === 0) {
                return [];
            }
            return data.data
        } catch (error) {
            console.error('Ошибка при получении книг:', error);
            return [];
        }
    };

    return { fetchRandomBooks };
};
export const useNewBook = () => {
    const fetchRandomBooks = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/books?sort=newest`);
            const data = await response.json();
            console.log('books111', data.data)
            if (!data || data.data.length === 0) {
                return [];
            }
            return data.data
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return [];
        }
    };
    return { fetchRandomBooks };
};
export const educationBooks = () =>{
    const fetchRandomBooks = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/books?genre=quo`);
            const data = await response.json();
            console.log('books111', data.data)
            if (!data || data.data.length === 0) {
                return [];
            }
            return data.data
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return [];
        }
    };
    return { fetchRandomBooks };
}