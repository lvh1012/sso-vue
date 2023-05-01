import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth';
import mgr from '@/oidc-client';
import { h } from 'vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      meta: {
        requiresAuth: true
      },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

// handle token từ server

router.addRoute(
  {
    path: '/callback',
    name: 'callback',
    component: {
      render() {
        return h('div', 'callback')
      },
      mounted() {
        mgr.signinRedirectCallback()
          .then(function (user) {
            router.replace((user.state as any).front_login_uri || "/");
          })
          .catch(() => router.replace("/"));;
      }
    }
  }
)

router.addRoute(
  {
    path: '/silent-callback',
    name: 'silent-callback',
    component: {
      render() {
        return h('div', 'silent-callback')
      },
      mounted() {
        mgr.signinSilentCallback();
      }
    }
  }
)

router.beforeEach((to, from, next) => {
  // ignore path
  if (to.path == '/silent-callback' || to.path == '/silent') next()
  else {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const { getIsAuthenticated } = useAuthStore();

    if (requiresAuth) {
      if (getIsAuthenticated) {
        mgr.startSilentRenew();
        next()
      }
      else {
        mgr.signinRedirect({ state: { front_login_uri: to.path } });
      }
    } else {
      if (getIsAuthenticated) {
        mgr.startSilentRenew();
      }
      else {
        // nếu chưa login và requiresAuth thì không cần renew token
        mgr.stopSilentRenew();
      }
      next();
    }

  }
});

export default router
