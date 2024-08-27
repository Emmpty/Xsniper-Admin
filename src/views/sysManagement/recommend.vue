<template>
  <div class="container-box">
    <el-card
      v-loading="isLoading"
      shadow="always"
      class="!pt-[5px] "
    >
      <div class="header flex-x-between mb-4">
        <el-form
          :inline="true"
          label-width="auto"
          :model="params"
          class="save search"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="">
                <el-input
                  clearable
                  placeholder="请输入用户ID"
                  v-model="params.twitter_user_name"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="flex-center">
          <el-button @click="addUser('')">
            <img
              class="btn-img"
              src="@/assets/images/btn-img/btn-add.png"
              alt=""
            />
            添加关注
          </el-button>
          <el-button @click="addUser('batch')">
            <img
              class="btn-img"
              src="@/assets/images/btn-img/btn-batch.png"
              alt=""
            />
            批量导入
          </el-button>
          <el-button @click="deleteFollow()">
            <img
              class="btn-img"
              src="@/assets/images/btn-img/btn-delete.png"
              alt=""
            />
            批量删除
          </el-button>
        </div>
      </div>
      <el-table
        style="width: 100%; font-size: 0.9rem"
        :data="list"
        :max-height="`${browserHeight - 280}px`"
        empty-text="暂无数据"
        :header-cell-style="{
        background: variables['table-header-background'],
        fontSize: '16px',
      }"
        :header-row-style="{ height: '45px' }"
        :row-style="{ height: '52px' }"
        :cell-style="{
        width: 'fit-content',
        whiteSpace: 'nowrap',
      }"
        @selection-change="selectionChangeHandle"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="imageUrl"
          label="用户"
          min-width="120"
        >
          <template #default="scope">
            <panelUserInfo
              :detail="scope.row"
              nameFontSize="font-size: 0.9rem"
              userNameFontSize="font-size: 0.73rem"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
        >
          <template #default="{ row }">
            <div class="flex items-center">
              <el-button
                class="ml-4"
                type="warning"
                size="small"
                text
                bg
                @click="deleteFollow(row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="pagination-container flex-x-center mt-4 text-16px">
      <div
        v-if="paginationProps.total"
        class="pagination-left-box"
      >
        <template v-if="selectionData.length > 0">{{ `已选 ${selectionData.length} 条` }}</template>
        {{ `共 ${paginationProps.total} 条` }}
      </div>
      <el-pagination
        class="common"
        background
        layout="sizes, prev, pager, next, jumper"
        v-bind="paginationProps"
        :page-sizes="[20, 50, 100, 200, 500]"
        @size-change="pagSizeChangeHandle"
        @current-change="pageChangeHandle"
      >
        <template #total></template>
      </el-pagination>
    </div>

    <template v-if="showDialog">
      <component
        v-model="showDialog"
        :is="dialogComponent"
        :title="dialogTitle"
        :showType="formShowType"
        :detail="currentRowDetail"
        :propParams="{
        id: deleteIds,
        deleted: '0'
      }"
        :propFunction="ImportRecommend"
        @refresh="refreshHandle"
      />
    </template>
  </div>
</template>

<script
  setup
  lang="ts"
>
import variables from "@/styles/variables.module.scss";
import useListFetch from "@/hooks/useListFetch";
import {
  FetchRecommend,
  ImportRecommend,
  FetchFileTemplate,
} from "@/api/system";
import dayjs from "dayjs";
import XDialog from "@/components/Core/XDialog.vue";
import AddOrUpdate from "./component/updateRecommend/index.vue";
import { browserHeight } from '@/utils/dom'

defineOptions({
  name: "recommend",
  inheritAttrs: false,
});

// 新增或修改
const showDialog = ref<boolean>(false);
const formShowType = ref("");
const deleteIds = ref()
const dialogComponent = shallowRef();
const dialogTitle = ref("添加关注");
const currentRowDetail = ref({});
const selectionData = ref<any>([]);
const fileTemplate = ref('')
provide("fileTemplate", fileTemplate);

onMounted(async () => {
  getFileTemplate()
  await getList();
});

onActivated(() => { });

const { params, list, isLoading, getList, pageChangeHandle, pagSizeChangeHandle, paginationProps } =
  useListFetch(FetchRecommend, {
    twitter_user_name: '',
    pageNum: 1,
    pageSize: 20,
  });

watch(() => paginationProps.value.pageSize, (newV) => {
  console.log('>>>>>>>newV', newV);
  getList()
})

const selectionChangeHandle = (selection: any) => {
  if (Array.isArray(selection)) {
    selectionData.value = selection.map((item) => item.id);
  }
};
const getFileTemplate = async () => {
  try {
    const { result } = await FetchFileTemplate();
    if (result) {
      fileTemplate.value = result.templateUrl;
    }
  } catch (error) {
    console.error(error);
  }

};
const refreshHandle = async (type?: string) => {
  if (!type) {
    params.pageNum = 1;
    params.pageSize = 20;
  }
  await getList();
};

const addUser = (type?: any) => {
  dialogComponent.value = AddOrUpdate;
  dialogTitle.value = "添加关注";
  if (type == "batch") dialogTitle.value = "批量添加关注";
  formShowType.value = type;
  currentRowDetail.value = {};
  showDialog.value = true;
};

const deleteFollow = async (row?: any) => {
  deleteIds.value = (row && row?.id) || selectionData.value.join(',');
  if (!deleteIds.value || deleteIds.value.length == 0) {
    return ElMessage({
      message: "请勾选要批量删除的数据",
      showClose: true,
      type: "warning",
    });
  }
  dialogComponent.value = XDialog
  dialogTitle.value = "您确定要删除选中的数据吗";
  showDialog.value = true;
};

</script>

<style
  lang="scss"
  scoped
>
.container-box {
  position: relative;
  border-radius: 20px;

  /* padding: 24px; */
  .el-card {
    border-radius: 15px;
  }
}

.header {
  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  .el-button {
    margin-bottom: 0;
  }
}

.table-box {
  max-height: calc(100vh - 280px);
}
</style>
