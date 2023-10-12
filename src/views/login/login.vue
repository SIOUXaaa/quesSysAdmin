<script setup lang="ts">
import { ref, toRef, defineComponent, reactive, onMounted } from "vue";
import { LoginParams, LoginResponse } from "../../utils/interface.ts";
import axios from "axios";
import router from "../../router";
import useAuthStore from "../../stores";

const loginLoading = ref(false);
const signUpLoading = ref(false);
const loginRef = ref<FormInstance>(null);

const loginForm = reactive({
    username: "",
    password: "",
});

const loginRules = {
    username: [
        {
            required: true,
            message: "请输入用户名/手机号",
            trigger: "blur",
        },
    ],
    password: [
        {
            required: true,
            message: "请输入密码",
            trigger: "blur",
        },
    ],
};

const login = async () => {
    // TODO: 登录功能
    if (loginRef.value) {
        loginRef.value.validate((valid) => {
            if (!valid) {
                ElMessage.warning("请输入账号或密码");
            } else {
                let params: LoginParams = {
                    username: loginForm.username,
                    password: loginForm.password,
                };
                axios
                    .post<LoginResponse>("user/login/", params)
                    .then((res) => {
                        const authStore = useAuthStore();
                        localStorage.setItem("token", res.data.token);
                        authStore.login(res.data.username);
                        router.push("/admin");
                    })
                    .catch((error) => {
                        ElMessage.warning("登录失败: 用户或密码错误");
                        console.log(error);
                    });
            }
        });
    }else{
        ElMessage.warning('出现错误');
    }
};
</script>

<template>
    <div class="container">
        <div class="forms-container">
            <div class="signin-signup">
                <el-form
                    ref="loginRef"
                    :model="loginForm"
                    :rules="loginRules"
                    class="sign-in-form"
                >
                    <h2 class="title">登录</h2>
                    <div class="input-field">
                        <i
                            ><el-icon><User /></el-icon
                        ></i>
                        <el-form-item prop="username">
                            <el-input
                                v-model="loginForm.username"
                                placeholder="账号"
                                @keyup.enter="login()"
                            />
                        </el-form-item>
                    </div>
                    <div class="input-field">
                        <i
                            ><el-icon><Lock /></el-icon
                        ></i>
                        <el-form-item prop="password">
                            <el-input
                                v-model="loginForm.password"
                                type="password"
                                placeholder="密码"
                                autocomplete="off"
                                show-password
                                @keyup.enter="login()"
                            />
                        </el-form-item>
                    </div>
                    <el-button
                        type="primary"
                        :loading="loginLoading"
                        @click="login()"
                        class="btn form"
                        round
                    >
                        {{ loginLoading ? "登 录 中" : "登 录" }}
                    </el-button>
                </el-form>
            </div>
        </div>

        <div class="panels-container">
            <div class="panel left-panel">
                <img src="../../assets/login/log.svg" class="image" alt="" />
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "./style.css";
.el-button.is-round {
    border-radius: 49px;
}

.el-form-item {
    margin-bottom: 0;
}

.el-form-item.is-error .el-input__inner,
.el-form-item.is-error .el-input__inner:focus,
.el-form-item.is-error .el-select-v2__wrapper,
.el-form-item.is-error .el-select-v2__wrapper:focus,
.el-form-item.is-error .el-textarea__inner,
.el-form-item.is-error .el-textarea__inner:focus {
    box-shadow: none;
}

.el-input {
    align-items: center;
    margin-right: 8px;
}

.el-input .el-input__icon {
    font-size: 1.4em;
}
</style>
