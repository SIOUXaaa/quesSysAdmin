<script setup lang="ts">
import axios from "axios";
import { ElMessage } from "element-plus";
import {
    ref,
    toRef,
    defineComponent,
    reactive,
    onMounted,
    inject,
    defineProps,
    watch,
    Ref,
} from "vue";
import { ProjectInfoParams, ProjectInfoResponse } from "../utils/interface";
import { ProjectInfo } from "../utils/type";

const addProjectInfo = inject<Function>("addProjectInfo");
const visitable = inject<Ref<Boolean>>("CreateProjectVisitable", ref(false));

console.log(visitable);

const project = reactive<ProjectInfo>({
    project_id: "",
    project_name: "",
    description: "",
});

const handlePostProject = async () => {
    if (
        project.project_id === "" ||
        project.project_name === "" ||
        project.description === ""
    ) {
        ElMessage.warning("请完整填写表单");
        return;
    }
    try {
        let params: ProjectInfoParams = {
            project_id: project.project_id,
            project_name: project.project_name,
            description: project.description,
        };
        await axios.post<ProjectInfoResponse>("project/post/", params);
        addProjectInfo?.(project);
    } catch (err: any) {
        if (err.response) {
            ElMessage.warning("新建请求失败，请重试");
        }
    } finally {
        visitable.value = false;
    }
};

const handleReset = () => {
    project.project_id = "";
    project.project_name = "";
    project.description = "";
};
</script>

<template>
    <el-dialog v-model="visitable" center show-close>
        <el-form>
            <el-form-item label="Project ID">
                <el-input v-model="project.project_id" />
            </el-form-item>
            <el-form-item label="Project Name">
                <el-input v-model="project.project_name" />
            </el-form-item>
            <el-form-item label="Project Description">
                <el-input v-model="project.description" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handlePostProject">
                    完成
                </el-button>
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<style scoped></style>
