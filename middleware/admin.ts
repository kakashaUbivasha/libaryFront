import { useGlobalStore } from '~/stores/global';

export default defineNuxtRouteMiddleware((to, from) => {
    const store = useGlobalStore();  // Получаем доступ к store

    // Проверка, если пользователь не авторизован
    if (!store.isAuthenticated||store.currentUser.role!=='Admin') {
        return navigateTo('/auth/login');  // Перенаправление на главную страницу
    }
});