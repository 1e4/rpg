import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import io from 'socket.io-client';

Vue.config.productionTip = false;

function login() {
    // let username = window.prompt("What is your username?", "Ian");

    window.$socket.emit('login', {
        username: 'Ian'
    })
}

window.$socket = io('127.0.0.1:8085', {
    // WARNING: in that case, there is no fallback to long-polling
    transports: ['websocket'] // or [ 'websocket', 'polling' ], which is the same thing
});

window.$socket.on('connect', login);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
