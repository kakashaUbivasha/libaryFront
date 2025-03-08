import { defineStore } from 'pinia';
let users: any = [
    {id: '1', name: 'User', totalBooks: '10',registerDate: '10.10.2015', level: '1', role: 'User', reviews: [{
            title: "Отличная книга!",
            text: "Эта книга оставила глубокое впечатление. Очень интересный сюжет, отлично проработанные персонажи и неожиданные повороты событий. Однозначно рекомендую к прочтению! Эта книга оставила глубокое впечатление. Очень интересный сюжет, отлично проработанные персонажи и неожиданные повороты событий.",
            user: "Алексей",
            expanded: false
        },
            {
                title: "Не понравилась",
                text: "Книга затянута, слишком много описаний и мало действия. Прочитал до конца только потому, что не люблю бросать начатые книги, но второй раз читать точно не буду.",
                user: "Марина",
                expanded: false
            },
            {
                title: "Хорошая, но могла быть лучше",
                text: "Интересная концепция, но развитие сюжета местами слишком предсказуемо. Тем не менее, книга оставляет положительные впечатления, особенно для любителей этого жанра.",
                user: "Иван",
                expanded: false
            },
            {
                title: "Шедевр",
                text: "Книга потрясающая! Захватывающий сюжет, эмоционально насыщенные моменты, глубокие мысли. Это произведение оставляет след в душе на долгое время.",
                user: "Екатерина",
                expanded: false
            },
            {
                title: "Средне",
                text: "Мне было скучно читать. Есть интересные моменты, но в целом книга не произвела должного впечатления. Возможно, не мой жанр.",
                user: "Ольга",
                expanded: false
            }]},
    {id: '2', name: 'User2', totalBooks: '20',registerDate: '10.10.2015', level: '2', role: 'User', reviews: [{
            title: "Отличная книга!",
            text: "Эта книга оставила глубокое впечатление. Очень интересный сюжет, отлично проработанные персонажи и неожиданные повороты событий. Однозначно рекомендую к прочтению! Эта книга оставила глубокое впечатление. Очень интересный сюжет, отлично проработанные персонажи и неожиданные повороты событий.",
            user: "Алексей",
            expanded: false
        },
            {
                title: "Не понравилась",
                text: "Книга затянута, слишком много описаний и мало действия. Прочитал до конца только потому, что не люблю бросать начатые книги, но второй раз читать точно не буду.",
                user: "Марина",
                expanded: false
            },
            {
                title: "Хорошая, но могла быть лучше",
                text: "Интересная концепция, но развитие сюжета местами слишком предсказуемо. Тем не менее, книга оставляет положительные впечатления, особенно для любителей этого жанра.",
                user: "Иван",
                expanded: false
            },
            {
                title: "Шедевр",
                text: "Книга потрясающая! Захватывающий сюжет, эмоционально насыщенные моменты, глубокие мысли. Это произведение оставляет след в душе на долгое время.",
                user: "Екатерина",
                expanded: false
            },
            {
                title: "Средне",
                text: "Мне было скучно читать. Есть интересные моменты, но в целом книга не произвела должного впечатления. Возможно, не мой жанр.",
                user: "Ольга",
                expanded: false
            }]},
    {id: '3', name: 'User3', totalBooks: '10',registerDate: '10.10.2015', level: '0', role: 'User', reviews: [{
            title: "Отличная книга!",
            text: "Эта книга оставила глубокое впечатление. Очень интересный сюжет, отлично проработанные персонажи и неожиданные повороты событий. Однозначно рекомендую к прочтению! Эта книга оставила глубокое впечатление. Очень интересный сюжет, отлично проработанные персонажи и неожиданные повороты событий.",
            user: "Алексей",
            expanded: false
        },
            {
                title: "Не понравилась",
                text: "Книга затянута, слишком много описаний и мало действия. Прочитал до конца только потому, что не люблю бросать начатые книги, но второй раз читать точно не буду.",
                user: "Марина",
                expanded: false
            },
            {
                title: "Хорошая, но могла быть лучше",
                text: "Интересная концепция, но развитие сюжета местами слишком предсказуемо. Тем не менее, книга оставляет положительные впечатления, особенно для любителей этого жанра.",
                user: "Иван",
                expanded: false
            },
            {
                title: "Шедевр",
                text: "Книга потрясающая! Захватывающий сюжет, эмоционально насыщенные моменты, глубокие мысли. Это произведение оставляет след в душе на долгое время.",
                user: "Екатерина",
                expanded: false
            },
            {
                title: "Средне",
                text: "Мне было скучно читать. Есть интересные моменты, но в целом книга не произвела должного впечатления. Возможно, не мой жанр.",
                user: "Ольга",
                expanded: false
            }]},
]
export const useGlobalStore = defineStore('global', {
    state: () => ({
        count: 0,
        items: [],
        token: null,
        isAuthenticated: false,
        currentUser: {id: '1', name: 'User', registerDate: '10.10.2015', totalBooks: '10', level: '1', role: 'User', reviews: [{
                title: "Отличная книга!",
                text: "Эта книга оставила глубокое впечатление. Очень интересный сюжет, отлично проработанные персонажи и неожиданные повороты событий. Однозначно рекомендую к прочтению! Эта книга оставила глубокое впечатление. Очень интересный сюжет, отлично проработанные персонажи и неожиданные повороты событий.",
                user: "Алексей",
                expanded: false
            },
                {
                    title: "Не понравилась",
                    text: "Книга затянута, слишком много описаний и мало действия. Прочитал до конца только потому, что не люблю бросать начатые книги, но второй раз читать точно не буду.",
                    user: "Марина",
                    expanded: false
                },
                {
                    title: "Хорошая, но могла быть лучше",
                    text: "Интересная концепция, но развитие сюжета местами слишком предсказуемо. Тем не менее, книга оставляет положительные впечатления, особенно для любителей этого жанра.",
                    user: "Иван",
                    expanded: false
                },
                {
                    title: "Шедевр",
                    text: "Книга потрясающая! Захватывающий сюжет, эмоционально насыщенные моменты, глубокие мысли. Это произведение оставляет след в душе на долгое время.",
                    user: "Екатерина",
                    expanded: false
                },
                {
                    title: "Средне",
                    text: "Мне было скучно читать. Есть интересные моменты, но в целом книга не произвела должного впечатления. Возможно, не мой жанр.",
                    user: "Ольга",
                    expanded: false
                }]},
    }),
    actions: {
        async logout() {
            this.isAuthenticated = false;
            fetch('http://127.0.0.1:8000/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
            })
            this.token = null
            localStorage.removeItem('token')
            navigateTo('/')
        },
        async searchBooks(keyword: string) {
            try {
                const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(keyword)}&maxResults=40`)
                const data = await response.json();
                console.log(`items:`,data)
                this.items = data.items?.map((item: any) => ({
                    id: item.id,
                    title: item.volumeInfo.title,
                    author: item.volumeInfo.authors?.join(", ") || 'Автор неизвестен',
                    imageLink: item.volumeInfo.imageLinks?.thumbnail||""

                }))||[];
            }
            catch(error) {
                console.log(error);
            }
        },
        async getUser(id: string) {
            let token = localStorage.getItem('token')
            if(token){
                this.token = token
                const response = await fetch('http://127.0.0.1:8000/api/user',
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                if(response.ok){
                    this.currentUser = await response.json()
                    this.isAuthenticated = true
                }else{
                    this.token = null
                    localStorage.removeItem('token')
                    this.isAuthenticated = false
                    navigateTo('/login')
                }
            }
        },
        async login(email :string, password :string) {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (data.token) {
                this.token = data.token;
                localStorage.setItem('token', data.token);
                this.currentUser = data.user;
                this.isAuthenticated = true;
                navigateTo('/dashboard');
            }
        },
    },
});
