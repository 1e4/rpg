import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import VueSocketIO from 'vue-socket.io'

window.$config = JSON.parse(localStorage.getItem('config')) || {};

Vue.config.productionTip = false;

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:3994',
}));

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
