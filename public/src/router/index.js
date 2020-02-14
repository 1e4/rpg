import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Woodcutting from '../views/Woodcutting'
import Play from '../views/Play'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/play',
        name: 'play',
        component: Play,
        children: [
            {
                path: '/woodcutting',
                name: 'woodcutting',
                component: Woodcutting
            },
        ]
    },
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router
