<script setup lang="ts">
import { User, Lock } from "@element-plus/icons-vue";
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import router from "../router";
import useAuthStore from "../stores";

const store = useAuthStore();

const form = reactive({
    username: "",
    password: "",
    remember: false,
});

const login = () => {
    if (!form.username || !form.password) {
        ElMessage.warning("请填写用户名和密码！");
    } else {
        post(
            "/api/auth/login",
            {
                username: form.username,
                password: form.password,
                remember: form.remember,
            },
            (message) => {
                ElMessage.success(message);
                get(
                    "/api/user/me",
                    (message) => {
                        store.auth.user = message;
                        router.push("/index");
                    },
                    () => {
                        store.auth.user = null;
                    }
                );
            }
        );
    }
};
</script>

<template>
    <div class="login">
        <div>
            <div style="font-size: 25px; font-weight: bold">登录</div>
            <div style="font-size: 14px; color: grey">
                在进入系统之前请先输入用户名和密码进行登录
            </div>
        </div>
        <div style="margin-top: 50px">
            <el-input v-model="form.username" type="text" placeholder="用户名">
                <template #prefix>
                    <el-icon><User /></el-icon>
                </template>
            </el-input>
            <el-input
                v-model="form.password"
                type="password"
                style="margin-top: 10px"
                placeholder="密码"
            >
                <template #prefix>
                    <el-icon><Lock /></el-icon>
                </template>
            </el-input>
        </div>
        <el-row style="margin-top: 5px">
            <el-col :span="12" style="text-align: left">
                <el-checkbox v-model="form.remember" label="记住我" />
            </el-col>
            <el-col :span="12" style="text-align: right">
                <el-link @click="router.push('/forget')">忘记密码？</el-link>
            </el-col>
        </el-row>
        <div style="margin-top: 40px">
            <el-button
                @click="login()"
                style="width: 270px"
                type="success"
                plain
                >立即登录</el-button
            >
        </div>
        <el-divider />
        <div>
            <el-button
                style="width: 270px"
                @click="router.push('/register')"
                type="warning"
                plain
                >注册账号</el-button
            >
        </div>
    </div>
</template>

<style scoped>
.login {
    text-align: center;
    margin: 0 auto;
    max-width: 40%;
    box-shadow: 0 0 8px #cdd0d6;
    border-radius: 15px;
    padding: 10px 10px;
}
</style>
