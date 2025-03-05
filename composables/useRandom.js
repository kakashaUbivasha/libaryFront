export const useRandom = async () => {
    try {
        const apiKey = 'AIzaSyAcwU-p-csUT5UbMbRKBuss_N5jb4A4M0o';
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=random&maxResults=1`);
        console.log(`api`,response.json());
        const data = await response.json();
        return data.volumeInfo;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}