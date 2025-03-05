// useBooks.js
const apiKey = 'AIzaSyAcwU-p-csUT5UbMbRKBuss_N5jb4A4M0o';
export const useBooks = () => {
    const fetchRandomBooks = async () => {
        try {
            // Используйте свой API-ключ Google Books (получить его в Google Cloud Console)
            const keywords = ['book', 'novel', 'science', 'fiction', 'history'];
            const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
            // Делаем запрос к Google Books API
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${randomKeyword}&maxResults=40&key=${apiKey}`);
            const data = await response.json();

            if (!data.items || data.items.length === 0) {
                return [];
            }

            // Сортируем случайные 10 книг
            const randomBooks = data.items.sort(() => Math.random() - 0.5).slice(0, 10);
            console.log(data.items);
            return randomBooks.map(book => ({
                title: book.volumeInfo.title || 'Без названия',
                author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : book.volumeInfo.authors,
                coverUrl: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : null,
                id: book.id, // ID книги
            }));
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
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=programming&orderBy=newest&maxResults=10&key=${apiKey}`);
            const data = await response.json();
            if (!data.items || data.items.length === 0) {
                return [];
            }
            return data.items.map((book) => ({
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors?.join(', ') || 'Неизвестный автор',
                coverUrl: book.volumeInfo.imageLinks?.thumbnail || null,
                id: book.id,
            }));
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
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=education+learning&printType=books&filter=partial&langRestrict=en&maxResults=10&key=${apiKey}`);
            const data = await response.json();
            if (!data.items || data.items.length === 0) {
                return [];
            }
            return data.items.map((book) => ({
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors?.join(', ') || 'Неизвестный автор',
                coverUrl: book.volumeInfo.imageLinks?.thumbnail || null,
                id: book.id,
            }));
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return [];
        }
    };
    return { fetchRandomBooks };
}