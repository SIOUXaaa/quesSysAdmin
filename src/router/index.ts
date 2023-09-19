import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/', redirect: {name:'admin'}
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../pages/admin.vue')
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
    
export default router