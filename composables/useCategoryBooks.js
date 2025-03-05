export const useCategoryBooks = async(category) => {
try{
    const apiKey = 'AIzaSyAcwU-p-csUT5UbMbRKBuss_N5jb4A4M0o'
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${category}&maxResults=40&key=${apiKey}`)
    const data = response.data.items.map((book)=>({
        id: book.id,
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors?.join(', ') || 'Неизвестный автор',
            description: book.volumeInfo.description || 'Описание отсутствует',
            imageLink: book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150',
    }));
    return data;
}
catch(err){
    console.log(err);
    return null;
}
}