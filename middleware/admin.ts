import { useGlobalStore } from '~/stores/global';

export default defineNuxtRouteMiddleware(() => {
    const store = useGlobalStore();
    if (store.currentUser?.role === 'Admin') {
        return;
    }

    const authToken = useCookie('auth_token');
    const userRole = useCookie('user_role');

    if (!authToken.value || userRole.value !== 'Admin') {
        return navigateTo('/auth/login');
    }
});
