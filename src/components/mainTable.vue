<script lang="ts" setup>
import { ref, reactive, onMounted, watch, onBeforeMount, inject } from "vue";
import axios from "axios";
import { ElMessage, FormInstance } from "element-plus";
import { DataInfo, ProjectInfo } from "../utils/type";
import {
    ProjectIdParams,
    DataParams,
    DataResponse,
    ProjectInfoResponse,
    ProjectInfoParams,
    DataResults,
} from "../utils/interface";
import { keysOf } from "element-plus/es/utils";

const props = defineProps({
    projectInfo: {
        type: Object as () => ProjectInfo,
        required: true,
        default: () => ({}),
    },
});

const columns = ref([
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
]);

const formInstance = ref<FormInstance>();
const projectInfo = reactive<ProjectInfo>({
    project_id: "",
    project_name: "",
    description: "",
});

const dataList = ref<DataResults[]>([]);
const dataSource = ref<DataInfo[]>([]);
const loading = ref(false);
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: ["10", "20", "30", "40"],
});

const modifyProjectInfo = inject<Function>("modifyProjectInfo");

const convertData = (data: DataResults) => {
    const { project, user_id, ip, time, answer, ...rest } = data;
    const dataInfo: DataInfo = {
        project,
        user_id,
        ip,
        time,
        ...answer,
        ...rest,
    };
    return dataInfo;
};

const computeColumns = () => {
    columns.value = columns.value.slice(0, 4);
    if (dataList.value.length > 0) {
        const keys = Object.keys(dataList.value[0].answer);
        keys.forEach((key) => {
            columns.value.push({
                label: key,
                dataIndex: key,
            });
        });
    } else {
        ElMessage.warning("当前问卷没有提交记录");
    }
};

const computeAnswer = (list: DataResults[]) => {
    dataSource.value = [];
    list.forEach((item) => {
        const dataInfo = convertData(item);
        dataSource.value?.push(dataInfo);
    });
};

const fetchProjectList = async () => {
    try {
        const response = await axios.get<ProjectInfoResponse>("project/get/", {
            params: {
                project_id: projectInfo.project_id,
            },
        });
        projectInfo.project_name = response.data.project_name;
        projectInfo.description = response.data.description;
    } catch (error) {
        ElMessage.warning("获取project信息错误");
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
        console.log(res);
        dataList.value = res.data.results;
        computeColumns();
        computeAnswer(dataList.value);
        pagination.total = res.data.total;
    } catch (error) {
        console.log(error);
        ElMessage.warning("数据请求失败");
    } finally {
        loading.value = false;
    }
};

const handleProjectInfoChange = async () => {
    pagination.currentPage = 1;
    try {
        let params: ProjectInfoParams = {
            project_id: projectInfo.project_id,
            project_name: projectInfo.project_name,
            description: projectInfo.description,
        };
        const res = await axios.put<ProjectInfoResponse>(
            "project/put/",
            params
        );
        projectInfo.project_name = res.data.project_name;
        projectInfo.description = res.data.description;
        modifyProjectInfo?.(projectInfo);
    } catch (error) {
        ElMessage.warning("问卷信息数据请求失败");
    }
};

const handleReset = () => {
    projectInfo.project_id = props.projectInfo.project_id;
    projectInfo.project_name = props.projectInfo.project_name;
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

const handleDownloadData = async () => {
    let params = {
        project: props.projectInfo.project_id,
    };
    axios
        .get("excel/get/", {
            params,
            responseType: "blob"
        })
        .then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = params.project + '.xlsx'
            link.click();
            window.URL.revokeObjectURL(url);
        })
        .catch((err) => {
            ElMessage.error("下载错误: " + err);
        });
};

watch(
    () => props.projectInfo,
    (newValue) => {
        if (newValue) {
            handleReset();
            fetchProjectList();
            fetchData();
        }
    }
);
</script>

<template>
    <div>
        <div class="btn" v-if="projectInfo">
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
                    <el-button class="reset" @click="handleReset"
                        >重置</el-button
                    >
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
                />
            </template>
        </el-table>

        <el-button type="success" @click="handleDownloadData" class="download">导出excel</el-button>
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
    </div>
</template>

<style scoped>
.table {
    max-width: 100%;
    max-height: 90%;
}

.reset {
    margin-left: 8px;
}

.btn {
    margin-bottom: 15px;
}

.download{
    margin-top: 15px;
    float: left;
}

.pagination {
    margin-top: 15px;
    float: right;
}
</style>
