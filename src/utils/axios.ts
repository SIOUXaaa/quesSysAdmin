import axios, { AxiosInstance } from 'axios'
import { App } from 'vue'
import { CONSTANTS } from './constants'

const AxiosPlugin = {
    install(app: App) {
        const axiosInstance: AxiosInstance = axios.create({
            baseURL: CONSTANTS.apiURL,
            timeout: CONSTANTS.timeout
        })
        axiosInstance.interceptors.request.use(
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
        app.config.globalProperties.$axios = axiosInstance
    }
}

export default AxiosPlugin