<script setup lang="ts">
import { ref, toRef, defineComponent, reactive, onMounted } from "vue";
import "./style.css";

const loginLoading = ref(false);
const signUpLoading = ref(false);

const loginForm = reactive({
    name: "",
    password: "",
});

const signUpForm = reactive({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
});

const loginRules = {
    name: [
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

const signUpRules = {
    name: [
        {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
        },
    ],
    phone: [
        {
            required: true,
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入11位合法手机号",
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
    confirmPassword: [
        {
            validator: (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入确认密码"));
                } else if (value !== signUpForm.password) {
                    callback(new Error("两次密码不匹配!"));
                } else {
                    callback();
                }
            },
            trigger: "blur",
        },
    ],
};

let signUpMode = ref(false);

const login = () => {
    //TODO: 登录功能
};

const signUp = () => {
    //TODO: 注册功能
    signUpLoading = false;
};

const toggleSignUpMode = () => {
    signUpMode = !signUpMode;
};

onMounted(() => {
    const signInBtn = document.querySelector("#sign-in-btn");
    const signUpBtn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    signUpBtn.addEventListener("click", () => {
        container.classList.add("sign-up-mode")
    });

    signInBtn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode")
    });
});
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
                        <i><el-icon><User /></el-icon></i>
                        <el-form-item prop="name">
                            <el-input
                                v-model="loginForm.name"
                                placeholder="账号/手机号"
                                @keyup.enter="Login(loginForm)"
                            />
                        </el-form-item>
                    </div>
                    <div class="input-field">
                        <i><el-icon><Lock /></el-icon></i>
                        <el-form-item prop="password">
                            <el-input
                                v-model="loginForm.password"
                                type="password"
                                placeholder="密码"
                                autocomplete="off"
                                show-password
                                @keyup.enter="Login(loginForm)"
                            />
                        </el-form-item>
                    </div>
                    <el-button
                        type="primary"
                        :loading="loginLoading"
                        @click="Login(loginForm)"
                        class="btn form"
                        round
                    >
                        {{ loginLoading ? "登 录 中" : "登 录" }}
                    </el-button>
                </el-form>

                <el-form
                    ref="signUpRef"
                    :model="signUpForm"
                    :rules="signUpRules"
                    class="sign-up-form"
                >
                    <h2 class="title">注册</h2>
                    <div class="input-field">
                        <i><el-icon><User /></el-icon></i>
                        <el-form-item prop="name">
                            <el-input
                                v-model="signUpForm.name"
                                placeholder="姓名/称呼"
                            />
                        </el-form-item>
                    </div>
                    <div class="input-field">
                        <i><el-icon><Phone /></el-icon></i>
                        <el-form-item prop="phone">
                            <el-input
                                v-model="signUpForm.phone"
                                placeholder="手机号"
                            />
                        </el-form-item>
                    </div>
                    <div class="input-field">
                        <i><el-icon><Lock /></el-icon></i>
                        <el-form-item prop="password">
                            <el-input
                                v-model="signUpForm.password"
                                type="password"
                                placeholder="密码"
                                autocomplete="off"
                                show-password
                            />
                        </el-form-item>
                    </div>
                    <div class="input-field">
                        <i><el-icon><Lock /></el-icon></i>
                        <el-form-item prop="confirmPassword">
                            <el-input
                                v-model="signUpForm.confirmPassword"
                                type="password"
                                placeholder="确认密码"
                                autocomplete="off"
                                show-password
                            />
                        </el-form-item>
                    </div>
                    <el-button
                        type="primary"
                        :loading="signUploading"
                        @click="SignUp(signUpForm)"
                        class="btn form"
                        round
                    >
                        {{ signUploading ? "注 册 中" : "注 册" }}
                    </el-button>
                </el-form>
            </div>
        </div>

        <div class="panels-container">
            <div class="panel left-panel">
                <div class="content">
                    <h3>新用户 ?</h3>
                    <p>输入您的信息成为我们的客户</p>
                    <button class="btn transparent" @click="toggleSignUpMode" id="sign-up-btn">
                        注 册
                    </button>
                </div>
                <img src="../../assets/login/log.svg" class="image" alt="" />
            </div>
            <div class="panel right-panel">
                <div class="content">
                    <h3>已有账号 ?</h3>
                    <p>请登录以享受我们更多的服务</p>
                    <button class="btn transparent" @click="toggleSignUpMode" id="sign-in-btn">
                        登 录
                    </button>
                </div>
                <img
                    src="../../assets/login/register.svg"
                    class="image"
                    alt=""
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
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
