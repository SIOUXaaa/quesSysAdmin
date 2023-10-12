import { convertToken } from './../utils/utils';
import axios from 'axios';
import { defineStore } from 'pinia'
import router from '../router';

const useAuthStore = defineStore("auth", {
    state: () => ({
        username: "",
        isLoggedIn: false,
        token: ""
    }),
    getters: {
        getUser: (state) => state.username,
        getIsLoggedIn: (state) => state.isLoggedIn,
        getToken: (state) => state.token
    },
    actions: {
        login(username: string) {
            this.username = username;
            this.isLoggedIn = true;
        },
        setToken(token: string) {
            this.token = token;
        },
        async validateToken() {
            const res = await axios.get('token/', {
                headers: {
                    Authorization: convertToken(this.token)
                }
            })
            if (res.status != 200) {
                this.isLoggedIn = false;
                throw new Error("Invalid token");
            }
            this.isLoggedIn = true;
        }
    }
});

export default useAuthStore