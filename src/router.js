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
                },
                {
                    path: '/debug',
                    name: 'Debug',
                    component: () => import('./views/Debug.vue')
                },
                {
                    path: '/logout',
                    name: 'Deconnexion',
                    component: () => import('./views/Logout.vue')
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
            path: '/',
            name: 'Graphiques',
            component: DefaultContainer,
            children: [
                {
                    path: '/evolution',
                    name: 'Évolution',
                    component: () => import('./views/Evolution.vue')
                },
                {
                    path: '/graphique',
                    name: 'Matières',
                    component: () => import('./views/Graphique.vue')
                }
            ]
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
