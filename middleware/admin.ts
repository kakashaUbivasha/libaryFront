import { useGlobalStore } from '~/stores/global';

export default defineNuxtRouteMiddleware((to, from) => {
    const store = useGlobalStore();  // Получаем доступ к store
    const auth_token = useCookie('auth_token')
    const user_role = useCookie('user_role')
    // Проверка, если пользователь не авторизован
    if (!auth_token&&user_role!=='Admin') {
        return navigateTo('/auth/login');  // Перенаправление на главную страницу
    }
});