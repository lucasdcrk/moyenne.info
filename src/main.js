import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import SuiVue from 'semantic-ui-vue';

import './styles/quasar.styl'
import lang from 'quasar-framework/i18n/fr'
import 'quasar-extras/animate'
import 'quasar-extras/roboto-font'
import 'quasar-extras/material-icons'
import Quasar from 'quasar'

import 'semantic-ui-css/semantic.min.css';

Vue.use(SuiVue);

window.axios = axios.create({
    baseURL: 'https://vmws01.ecoledirecte.com/v3/',
});

window.bus = new Vue();

Vue.use(Quasar, {
  config: {}, i18n: lang
});

Vue.config.productionTip = false;

if (localStorage.token !== undefined) {
    let user = JSON.parse(localStorage.user);
    if ([1425, 251, 619].indexOf(user.id) >= 0) {
        Vue.prototype.beta = true;
    }
    Vue.prototype.user = user;
    Vue.prototype.token = localStorage.token;
    Vue.prototype.logged = true;
} else {
    Vue.prototype.logged = false;
}

window.bus.$on('logged-in', () => {
    let user = JSON.parse(localStorage.user);
    if ([1425, 251, 619].indexOf(user.id) >= 0) {
        Vue.prototype.beta = true;
    }
    Vue.prototype.user = user;
    Vue.prototype.token = localStorage.token;
    Vue.prototype.logged = true;

    axios.post('https://api.moyenne.info/census.php', {
        ed_id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        classe: user.classe.libelle
    });
});

window.bus.$on('logged-out', () => {
    Vue.prototype.logged = false;
});

Vue.prototype.version = '1.1';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
