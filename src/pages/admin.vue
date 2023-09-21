<script setup lang="ts">
import { ref, toRef, defineComponent, reactive, onMounted } from "vue";
import MainTable from "../components/mainTable.vue";
</script>

<template>
    <div class="layout">
        <el-container>
            <el-aside width="200px" class="aside">
                <el-menu default-active="showData" style="margin-top: 20px">
                    <el-menu-item index="showData" class="item">
                        <el-icon><House /></el-icon>
                        <span>数据展示</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main class="main">
                <mainTable :project_id="{project_id: '123'}" />
            </el-main>
        </el-container>
    </div>
</template>

<style scoped>
.layout {
    width: 100%;
    height: 100vh;
    background-color: #f5f5f5;
}

.aside {
    height: calc(100vh - 50px);
    background-color: #fff;
    box-shadow: 0 0 8px #cdd0d6;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 30px;
    margin-right: 10px;
    border-radius: 15px;
}

.item {
    justify-content: center;
}

.main{
    background-color: #fff;
    margin: 10px;
    box-shadow: 0 0 8px #cdd0d6;
    border-radius: 15px;
}
</style>
