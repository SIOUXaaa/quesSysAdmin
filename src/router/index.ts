import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/', redirect: { name: 'admin' }
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/admin.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('../views/login/test.vue')
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router