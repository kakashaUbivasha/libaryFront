// useBooks.js
const ALL_GENRES = [
    "Образование (общие)",
    "Учебные пособия",
    "Подготовка к экзаменам",
    "Критическое мышление",
    "Логика",
    "Этика",
    "Лингвистика",
    "Педагогика",
    "История",
    "Философия",
    "Психология",
    "Социология",
    "Политология",
    "Право",
    "Экономика",
    "Бизнес",
    "Финансы",
    "Бухгалтерский учет",
    "Менеджмент",
    "Маркетинг",
    "Международные отношения",
    "Медицина и здоровье",
    "Биология",
    "Химия",
    "Физика",
    "Математика",
    "Статистика",
    "Инженерия (общая)",
    "Электротехника",
    "Механика и машиностроение",
    "Строительство",
    "Архитектура",
    "Экология и окружающая среда",
    "География",
    "Программирование (общие)",
    "Алгоритмы и структуры данных",
    "Компьютерные науки",
    "Разработка веб-приложений",
    "Фронтенд",
    "Бэкенд",
    "Базы данных",
    "Тестирование и качество ПО",
    "Инженерия ПО",
    "DevOps и SRE",
    "Сетевые технологии",
    "Кибербезопасность",
    "Искусственный интеллект",
    "Машинное обучение",
    "Наука о данных",
    "Обработка данных и ETL",
    "Мобильная разработка",
    "Разработка игр",
    "Облачные технологии",
    "UI/UX и дизайн",
    "Искусство",
    "Музыка",
    "Кино и медиа",
    "Культурология",
    "Классическая литература",
    "Современная литература",
    "Историческая проза",
    "Фантастика",
    "Научная фантастика",
    "Детектив и триллер",
    "Ужасы",
    "Романтика",
    "Поэзия",
    "Драма и пьесы",
    "Эссеистика",
    "Мемуары и биографии",
    "Рассказы и новеллы",
    "Графические романы и комиксы",
    "Литература для детей",
    "Литература для подростков (YA)",
    "Проектный менеджмент",
    "Предпринимательство",
    "Коммуникации и soft skills",
    "Карьерное развитие",
    "Путеводители и путешествия",
    "Кулинария"
];

const EDUCATIONAL_GENRES = [
    "Образование (общие)",
    "Учебные пособия",
    "Педагогика",
    "История",
    "Философия",
    "Психология",
    "Социология",
    "Политология",
    "Экономика",
    "Медицина и здоровье",
    "Электротехника",
    "Наука о данных"
];

const pickRandomGenre = (genres) => {
    if (!Array.isArray(genres) || genres.length === 0) {
        return undefined;
    }
    const index = Math.floor(Math.random() * genres.length);
    return genres[index];
};

export const useBooks = () => {
    const fetchRandomBooks = async ({ perPage = 20, page = 1 } = {}) => {
        try {
            const params = new URLSearchParams({
                perPage: String(perPage),
                page: String(page)
            });
            const randomGenre = pickRandomGenre(ALL_GENRES);
            if (randomGenre) {
                params.append('genre', randomGenre);
            }
            const response = await fetch(`https://api.libaryai.uz/api/books?${params.toString()}`);
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
    const fetchRandomBooks = async ({ perPage = 20, page = 1 } = {}) => {
        try {
            const params = new URLSearchParams({
                sort: 'newest',
                perPage: String(perPage),
                page: String(page)
            });
            const response = await fetch(`https://api.libaryai.uz/api/books?${params.toString()}`);
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
    const fetchRandomBooks = async ({ perPage = 20, page = 1 } = {}) => {
        try {
            const params = new URLSearchParams({
                perPage: String(perPage),
                page: String(page)
            });
            const randomGenre = pickRandomGenre(EDUCATIONAL_GENRES);
            if (randomGenre) {
                params.append('genre', randomGenre);
            }
            const response = await fetch(`https://api.libaryai.uz/api/books?${params.toString()}`);
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
