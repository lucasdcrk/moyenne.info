import Vue from 'vue'
import VueWait from 'vue-wait'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

window.axios = axios.create({
    baseURL: 'https://vmws01.ecoledirecte.com/v3/',
});

window.bus = new Vue();

Vue.use(VueWait);
Vue.use(BootstrapVue);

if (localStorage.token !== undefined) {
    Vue.prototype.user = JSON.parse(localStorage.user);
    Vue.prototype.token = localStorage.token;
    Vue.prototype.logged = true;
} else {
    Vue.prototype.logged = false;
}

window.bus.$on('logged-in', () => {
    let user = JSON.parse(localStorage.user);
    Vue.prototype.user = user;
    Vue.prototype.token = localStorage.token;
    Vue.prototype.logged = true;

    axios.post('https://api.moyenne.info/census.php', {
        ed_id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        classe: user.classe.libelle
    });

    window.axios.post('E/' + user.id + '/emploidutemps.awp?verbe=get', 'data={"token": "' + localStorage.token + '"}')
        .then((response) => {
            if (response.data.code !== 200) {
                if (localStorage.credentials && localStorage.user) {
                    let credentials = JSON.parse(localStorage.credentials);

                    this.refreshingSession = true;

                    window.axios.post('login.awp', 'data={"identifiant": "' + credentials.username + '", "motdepasse": "' + credentials.password + '"}')
                        .then((response) => {
                            if (response.data.code === 200) {
                                localStorage.token = response.data.token;

                                let accounts = response.data.data.accounts[0].profile.eleves;

                                let account = accounts.find(function (account) {
                                    return account.id === user.id;
                                });

                                localStorage.user = JSON.stringify(account);

                                this.refreshingSession = false;

                                window.bus.$emit('logged-in');

                                this.$router.push('/');
                            }
                        })
                        .catch(() => {
                            localStorage.clear();
                            window.bus.$emit('logged-out');
                            this.refreshingSession = false;
                            this.$router.push('/login');
                        });
                } else {
                    localStorage.clear();
                    window.bus.$emit('logged-out');
                    this.$router.push('/login');
                }
            }
        })
        .catch(() => {
            localStorage.clear();
            window.bus.$emit('logged-out');
            this.refreshingSession = false;
            this.$router.push('/login');
        });
});

window.bus.$on('logged-out', () => {
    Vue.prototype.logged = false;
});

Vue.prototype.version = '2.2';

Vue.config.productionTip = false;

new Vue({
    router,
    wait: new VueWait(),
    render: h => h(App)
}).$mount('#app');
