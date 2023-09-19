<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from "vue";
import axios from "axios";
import { ElMessage, FormInstance } from "element-plus";

const columns = [
    {
        label: "Project ID",
        dataIndex: "project_id",
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

const dataSource = ref([]);
const loading = ref(false);
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: ["10", "20", "30", "40"],
});
const filterID = ref("");

const fetchData = async () => {
    try {
        let params = {
            project_id: filterID.value,
            current_page: pagination.currentPage,
            page_size: pagination.pageSize,
        };
        loading.value = true;
        const res = await axios.get("project/get/", { params });
        dataSource.value = res.data.results;
        pagination.total = res.data.count;
    } catch (error) {
        ElMessage.warning("数据请求失败");
    } finally {
        loading.value = false;
    }
};

const handleFilter = () => {
    pagination.currentPage = 1;
    fetchData();
};

const handleReset = () => {
    formInstance?.value?.resetFields();
    filterID.value = "";
    handleFilter();
};

const handleSizeChange = (val: number) => {
    pagination.pageSize = val;
    fetchData();
};

const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    fetchData();
};

fetchData();
</script>

<template>
    <div class="btn">
        <el-form :model="formInstance" inline>
            <el-form-item label="Project ID">
                <el-input v-model="filterID" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleFilter">筛选</el-button>
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

.pagination{
    margin-top: 15px;
    float: right;
}
</style>
