import Vue from 'vue'
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

Vue.config.productionTip = false;

if (localStorage.token !== undefined) {
    Vue.prototype.user = JSON.parse(localStorage.user);
    Vue.prototype.token = localStorage.token;
    Vue.prototype.logged = true;
} else {
    Vue.prototype.logged = false;
}

window.bus.$on('logged-in', () => {
    Vue.prototype.user = JSON.parse(localStorage.user);
    Vue.prototype.token = localStorage.token;
    Vue.prototype.logged = true;
});

window.bus.$on('logged-out', () => {
    Vue.prototype.logged = false;
});

Vue.prototype.version = '1.0.1';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
