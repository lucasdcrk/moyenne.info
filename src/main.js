import Vue from 'vue'
import VueMatomo from 'vue-matomo'
import App from './App.vue'
import router from './router'
import axios from 'axios'

import './styles/quasar.styl'
import lang from 'quasar-framework/i18n/fr'
import 'quasar-extras/animate'
import 'quasar-extras/roboto-font'
import 'quasar-extras/material-icons'
import Quasar from 'quasar'

window.axios = axios.create({
    baseURL: 'https://vmws01.ecoledirecte.com/v3/',
});

window.bus = new Vue();

Vue.use(Quasar, {
  config: {}, i18n: lang
});

if (!process.env.NODE_ENV === 'development') {
    Vue.use(VueMatomo, {
        host: 'https://analytics.attranet.com/',
        siteId: 5,
        router: router,
        requireConsent: false,
        trackInitialView: true,
        trackerFileName: 'piwik'
    });
}

Vue.config.productionTip = false;

if (localStorage.token !== undefined) {
    let user = JSON.parse(localStorage.user);
    Vue.prototype.beta = [1425, 251, 619].indexOf(user.id) >= 0;
    Vue.prototype.user = user;
    Vue.prototype.token = localStorage.token;
    Vue.prototype.logged = true;
} else {
    Vue.prototype.logged = false;
}

window.bus.$on('logged-in', () => {
    let user = JSON.parse(localStorage.user);
    Vue.prototype.beta = [1425, 251, 619].indexOf(user.id) >= 0;
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

Vue.prototype.version = '1.2.1';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
