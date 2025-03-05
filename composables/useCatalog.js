export const useCatalog = async (categories) => {
    try{
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${categories}&maxResults=10`);

    }
    catch(error){
        console.error(error);
        return null;
    }
}