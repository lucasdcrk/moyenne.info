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
});

window.bus.$on('logged-out', () => {
    Vue.prototype.logged = false;
});

Vue.prototype.version = '2.4.2';

Vue.config.productionTip = false;

new Vue({
    router,
    wait: new VueWait(),
    render: h => h(App)
}).$mount('#app');
