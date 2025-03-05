export const fetchBookById = async (id) => {
    try {
        console.log(id)
        const apiKey = 'AIzaSyAcwU-p-csUT5UbMbRKBuss_N5jb4A4M0o';  // Замените на ваш API ключ
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Ошибка при получении данных о книге с ID: ${id}`);
        }
        const data = await response.json();
        return data.volumeInfo;
    } catch (error) {
        console.error('Ошибка:', error.message);
        return null; // Если произошла ошибка, возвращаем null
    }
}