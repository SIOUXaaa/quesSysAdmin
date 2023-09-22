<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from "vue";
import axios from "axios";
import { ElMessage, FormInstance } from "element-plus";
import { ProjectInfo } from "../utils/type";
import {
    ProjectInfoParams,
    DataParams,
    DataResponse,
    ProjectInfoResponse,
    ProjectInfoPutParams,
} from "../utils/interface";

const props = defineProps({
    projectInfo: {
        type: Object as () => ProjectInfo,
        required: true,
    },
});

const columns = [
    {
        label: "Project ID",
        dataIndex: "project",
    },
    {
        label: "User ID",
        dataIndex: "user_id",
    },
    {
        label: "Time",
        dataIndex: "time",
    },
    {
        label: "IP",
        dataIndex: "ip",
    },
    {
        label: "Answers",
        dataIndex: "answer",
    },
];

const formInstance = ref<FormInstance>();
const projectInfo = reactive<ProjectInfo>({
    // project_id: props.projectInfo.project_id,
    project_id: "django-demo",
    project_name: "",
    description: "",
});

const dataSource = ref();
const loading = ref(false);
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: ["10", "20", "30", "40"],
});

const getProjectInfo = async () => {
    try {
        let params: ProjectInfoParams = {
            project_id: projectInfo.project_id,
        };
        const res = await axios.get<ProjectInfoResponse>("project/get/", {
            params,
        });
        projectInfo.project_name = res.data.project_name;
        projectInfo.description = res.data.description;
    } catch (error) {
        ElMessage.warning("数据请求失败");
    }
};

const fetchData = async () => {
    try {
        let params: DataParams = {
            project: projectInfo.project_id,
            current_page: pagination.currentPage,
            page_size: pagination.pageSize,
        };
        loading.value = true;
        const res = await axios.get<DataResponse>("surveyResponses/get/", {
            params,
        });
        // console.log(res);
        dataSource.value = res.data.results;
        pagination.total = res.data.total;
    } catch (error) {
        ElMessage.warning("数据请求失败");
    } finally {
        loading.value = false;
    }
};

const handleProjectInfoChange = async () => {
    pagination.currentPage = 1;
    try {
        let params: ProjectInfoPutParams = {
            project_id: projectInfo.project_id,
            project_name: projectInfo.project_name,
            description: projectInfo.description,
        };
        const res = await axios.get<ProjectInfoResponse>("project/put/", {
            params,
        });
        console.log(res.data);
        projectInfo.project_name = res.data.project_id;
        projectInfo.description = res.data.description;
    } catch (error) {
        ElMessage.warning("问卷信息数据请求失败");
    }
};

const handleReset = () => {
    projectInfo.project_name = props.projectInfo.project_id;
    projectInfo.description = props.projectInfo.description;
};

const handleSizeChange = (val: number) => {
    pagination.pageSize = val;
    fetchData();
};

const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    fetchData();
};

getProjectInfo();
fetchData();
</script>

<template>
    <div class="btn">
        <el-form :model="formInstance" inline>
            <el-form-item label="Project ID">
                <el-input v-model="projectInfo.project_id" disabled />
            </el-form-item>
            <el-form-item label="Project Name">
                <el-input v-model="projectInfo.project_name" />
            </el-form-item>
            <el-form-item label="description">
                <el-input v-model="projectInfo.description" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleProjectInfoChange"
                    >修改</el-button
                >
                <el-button class="reset" @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table
        :data="dataSource"
        :row-key="(record: any, index: any) => index"
        :height="'calc(100vh - 200px)'"
        v-loading="loading"
        class="table"
    >
        <template #default="{ row }">
            <el-table-column
                v-for="column in columns"
                :key="column.dataIndex"
                :prop="column.dataIndex"
                :label="column.label"
            >
                <template #default="{ row }">
                    <span v-if="typeof row[column.dataIndex] === 'object'">
                        {{ JSON.stringify(row[column.dataIndex]) }}
                    </span>
                    <span v-else>{{ row[column.dataIndex] }}</span>
                </template>
            </el-table-column>
        </template>
    </el-table>
    <el-pagination
        background
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizeOptions"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
    >
    </el-pagination>
</template>

<style scoped>
.table {
    max-width: 100%;
    max-height: 100%;
}

.reset {
    margin-left: 8px;
}

.btn {
    margin-bottom: 15px;
}

.pagination {
    margin-top: 15px;
    float: right;
}
</style>
