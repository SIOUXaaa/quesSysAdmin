import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-message-box.css";
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import AxiosPlugin from './utils/axios'
import axios from 'axios';
import { CONSTANTS } from './utils/constants';

const pinia = createPinia()

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(pinia)
// app.use(AxiosPlugin)
app.mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

axios.defaults.baseURL = CONSTANTS.apiURL;
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
app.config.globalProperties.$axios = axios;