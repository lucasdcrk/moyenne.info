import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Notes from './views/Notes.vue'
import Moyennes from './views/Moyennes.vue'
import Login from './views/Login.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router);

const router = new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            component: About
        },
        {
            path: '/notes',
            name: 'notes',
            component: Notes
        },
        {
            path: '/moyennes',
            name: 'moyennes',
            component: Moyennes
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
            next('/login');
        }

        next();
    } else {
        next();
    }
});

export default router
