import Vue from 'vue'
import Router from 'vue-router'

// Containers
const DefaultContainer = () => import('./containers/DefaultContainer');

// Views
const Home = () => import('./views/Home');
const Moyennes = () => import('./views/Moyennes');
const Notes = () => import('./views/Notes');

const Login = () => import('./views/Login');


Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: DefaultContainer,
            children: [
                {
                    path: '/',
                    name: 'Accueil',
                    component: Home
                }
            ]
        },
        {
            path: '/',
            name: 'Résultats',
            component: DefaultContainer,
            children: [
                {
                    path: '/moyennes',
                    name: 'Moyennes',
                    component: Moyennes
                },
                {
                    path: '/notes',
                    name: 'Relevé de Notes',
                    component: Notes
                }
            ]
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
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
            component: Home,
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
