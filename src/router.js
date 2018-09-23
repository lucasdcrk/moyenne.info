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
            window.bus.$q.loading.show({
                message: 'Vérification de vos informations ...'
            });

            window.axios.post('E/' + JSON.parse(localStorage.user).id + '/emploidutemps.awp?verbe=get', 'data={"token": "' + localStorage.token + '"}')
                .then((response) => {
                    if (response.data.code !== 200) {
                        window.bus.$q.notify({
                            message: 'Session expirée, merci de vous reconnecter.',
                            type: 'negative'
                        });

                        window.$emit('loggout');

                        this.$router.push('/login');
                    }

                    window.bus.$q.loading.hide();
                    next();
                })
                .catch(error => {
                    this.$q.notify('Une erreur s\'est produite lors de la vérification : ' + error);
                    this.$q.loading.hide();
                });
        }
    } else {
        next();
    }
});

export default router
