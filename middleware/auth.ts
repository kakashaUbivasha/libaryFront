import { useGlobalStore } from '~/stores/global';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const store = useGlobalStore();
    const token = useCookie('auth_token')


    if (!token.value) {
        return navigateTo('/auth/login');  // Перенаправление на главную страницу
    }
});