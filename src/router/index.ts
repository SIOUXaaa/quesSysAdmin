import { ElMessage } from 'element-plus'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import useAuthStore from '../stores'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/', redirect: { name: 'admin' }
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/admin.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/login.vue'),
        meta: { checkLogin: true }
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem('token');
        if (token) {
            authStore.setToken(token!)
            try {
                await authStore.validateToken()
                next();
            } catch (error) {
                // ElMessage.warning("身份验证错误:" + error)
            }
        }
        if (!authStore.isLoggedIn) {
            next('/login');
        }
    } else if (to.meta.checkLogin) {
        if (authStore.isLoggedIn) {
            next('/admin');
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router