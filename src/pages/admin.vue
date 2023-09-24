<script setup lang="ts">
import axios from "axios";
import { ElMessage } from "element-plus";
import {
    ref,
    toRef,
    defineComponent,
    reactive,
    onMounted,
    onBeforeMount,
    provide,
Ref,
} from "vue";
import CreateProject from "../components/CreateProject.vue";
import mainTable from "../components/mainTable.vue";
import { ProjectIdParams, ProjectInfoResponse } from "../utils/interface";
import { ProjectInfo } from "../utils/type";

const CreateProjectVisitable = ref(false);
const projectList = ref<ProjectInfo[]>([]);
const activeIndex = ref("showData");
const selectProjectInfo = ref<ProjectInfo>();

const controlCreateProjectVisitable = () => {
    console.log("ccc");
    CreateProjectVisitable.value = true;
    console.log(CreateProjectVisitable.value);
};

const fetchProjectList = () => {
    return new Promise((resolve, reject) => {
        axios
            .get<ProjectInfoResponse[]>("project/get/")
            .then((res) => {
                projectList.value = res.data;
                resolve(true);
            })
            .catch((err) => {
                ElMessage.warning("获取project信息错误");
                reject(false);
            });
    });
};

const handleSelect = (index: string) => {
    activeIndex.value = index;
    selectProjectInfo.value = projectList.value.find(
        (project) => project.project_id === activeIndex.value
    );
};

const modifyProjectInfo = (project: ProjectInfo) => {
    const index = projectList.value.findIndex(
        (p) => p.project_id === project.project_id
    );
    projectList.value[index].project_name = project.project_name;
    projectList.value[index].description = project.description;
};

const addProjectInfo = (project: ProjectInfo) => {
    projectList.value.push(project);
};

onBeforeMount(async () => {
    await fetchProjectList();
    activeIndex.value = projectList.value.at(0)?.project_id as string;
    selectProjectInfo.value = projectList.value?.find(
        (project) => project.project_id === activeIndex.value
    );
});

provide<Function>("modifyProjectInfo", modifyProjectInfo);
provide<Function>("addProjectInfo", addProjectInfo);
provide<Ref<Boolean>>("CreateProjectVisitable", CreateProjectVisitable);
</script>

<template>
    <div class="layout">
        <el-container>
            <CreateProject />
            <el-aside width="200px" class="aside">
                <div class="btn">
                    <el-button
                        type="primary"
                        @click="controlCreateProjectVisitable"
                    >
                        <span>新建问卷</span>
                    </el-button>
                </div>
                <el-menu
                    :default-active="activeIndex"
                    style="margin-top: 20px"
                    @select="handleSelect"
                >
                    <el-sub-menu index="showData" class="item">
                        <template #title>
                            <el-icon><House /></el-icon>
                            <span>数据展示</span>
                        </template>
                        <el-menu-item
                            v-for="project in projectList"
                            :key="project.project_id"
                            :index="project.project_id"
                        >
                            {{ project.project_name }}
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-aside>
            <el-main class="main">
                <mainTable :projectInfo="selectProjectInfo" class="table" />
            </el-main>
        </el-container>
    </div>
</template>

<style scoped>
.layout {
    width: 100%;
    height: 100%;
    min-width: 1000px;
    min-height: 800px;
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

.main {
    background-color: #fff;
    margin: 10px;
    box-shadow: 0 0 8px #cdd0d6;
    border-radius: 15px;
}

.btn {
    margin: 20px;
}
</style>
