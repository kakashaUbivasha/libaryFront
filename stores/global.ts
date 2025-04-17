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
        currentUser: null,
        isInitialized: false,
        topUsers: []
    }),
    actions: {
        async logout() {
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/logout`,{
                    headers:{
                        Authorization: `Bearer ${this.token}`,
                        accept: 'application/json'
                    }
                })
                console.log(response)
                this.token = null;
                this.currentUser = null;
                if (process.client) {
                    localStorage.removeItem('token');
                }
            }catch (e){
                console.log(e)
            }

        },
        async getUser() {
            if (!this.token) return;
            const cookie = useCookie('auth_token')
            cookie.value = this.token
            cookie.maxAge = 60 * 60 * 24 * 7
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user', {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        accept: 'application/json'
                    }
                });
                const userData = await response.json();
                console.log('user',userData.data)
                this.currentUser = userData.data;
                return userData.data
            }catch (error){
                this.logout();
                throw error;
            }
        },
        async guestProfile(id){
            try{
                console.log('user')
                const response = await fetch(`http://127.0.0.1:8000/api/guest/${id}`)
                const user = await response.json()
                console.log('user', user)
                return user.data
            }catch (error){
                console.error(error)
            }
        },
        async login(email :string, password :string) {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!data.token) {
                throw new Error('Authentication failed');
            }
            this.token = data.token;
            if (process.client) {
                localStorage.setItem('token', data.token);
            }
            await this.initialize();
            navigateTo('/dashboard');
        },
        async initialize() {
            if (process.client) { // Только на клиенте
                const token = localStorage.getItem('token')
                if (token) {
                    this.token = token
                    await this.getUser();
                }
                this.isInitialized = true
            }
        },
        async getTopUsers(){
            try{
                const response = await fetch('http://127.0.0.1:8000/api/top-users',{
                    headers:{Authorization: `Bearer ${this.token}`}
                })
                const data = await response.json()
                console.log(`top-users`, data)
                this.topUsers = data.data
            }catch (e){
                console.log(e)
            }
        }
    },
    getters: {
        isAuthenticated: (state :any) => !!state.currentUser
    },
});
