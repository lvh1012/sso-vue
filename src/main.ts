import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import mgr from './oidc-client'
import { useAuthStore } from './stores/auth'

mgr.getUser()
    .then((user) => {
        const app = createApp(App)
        app.provide('$oidc', mgr)
        app.use(createPinia())
        app.use(router)

        const store = useAuthStore();

        // token đã hết hạn
        mgr.events.addAccessTokenExpired(() => {
            console.log(`addAccessTokenExpired`, new Date())
        })

        // token trước khi hết hạn
        mgr.events.addAccessTokenExpiring(() => {
            console.log(`addAccessTokenExpiring`, new Date())
        })

        // renew token lỗi
        mgr.events.addSilentRenewError(() => {
            console.log(`addSilentRenewError`, new Date())
            store.clearUser();
            store.setIsAuthenticated(false);
        })

        // user seesion đc khởi tạo
        mgr.events.addUserLoaded((user) => {
            console.log(`addUserLoaded`, new Date())
            store.setUser(user);
            store.setIsAuthenticated(true);
        })

        // user seesion hủy
        mgr.events.addUserUnloaded(() => {
            console.log(`addUserUnloaded`, new Date())
            store.clearUser();
            store.setIsAuthenticated(false);
        })

        if (user && !user.expired) {
            store.setUser(user);
            store.setIsAuthenticated(true);
        }

        app.mount('#app')
    })
    .catch((err) => {
        console.error(err)
    })
