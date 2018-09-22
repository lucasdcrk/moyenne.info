import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Notes from './views/Notes.vue'
import Login from './views/Login.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/notes',
            name: 'notes',
            component: Notes
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { public: true }
        },
        {
            path: '**',
            name: 'notfound',
            component: NotFound,
            meta: { public: true }
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (!to.matched.some(record => record.meta.public)) {
        if (localStorage.token === undefined) {
            console.log('No token, redirecting to login page.');
            next('/login');
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router
