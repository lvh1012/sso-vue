import type { User } from 'oidc-client-ts';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref(false);
    const user = ref(null as User | null);

    const getUser = computed(() => user.value)
    const getIsAuthenticated = computed(() => isAuthenticated.value)

    function setIsAuthenticated(ok: boolean) {
        isAuthenticated.value = ok
    }

    function setUser(_user: User) {
        user.value = _user
    }

    function clearUser() {
        user.value = null
    }

    return { isAuthenticated, user, getUser, getIsAuthenticated, setUser, clearUser, setIsAuthenticated }
})
