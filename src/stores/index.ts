import { defineStore } from 'pinia'

const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        isLoggedIn: false,
        token: null
    }),
    getters: {
        getUser: (state) => state.user,
        getIsLoggedIn: (state) => state.isLoggedIn,
        getToken: (state) => state.token
    },
    actions: {
        login(user_id: string, password: string) {

        },
        register(user_id: string, password: string) {

        },
        logout() {

        },
        setToken(token: string) {

        }
    }
});

export default useAuthStore