<template>
  <div class="container-box">
    <el-card
      shadow="always"
      class="mb-4 !rounded-20px"
    >
      <div class="header flex-x-between mb-4">
        <el-form
          :inline="true"
          :model="params"
          label-width="auto"
          class="save search"
        >
          <el-form-item label="">
            <el-input
              clearable
              placeholder="请输入用户ID或钱包地址"
              v-model="params.user_id"
            />
          </el-form-item>
          <el-form-item label="">
            <el-input
              clearable
              placeholder="请输入折扣码"
              v-model="params.code"
            />
          </el-form-item>
        </el-form>
        <div class="flex-center">
          <el-button @click="creatDiscountCode()">
            <img
              class="btn-img"
              src="@/assets/images/btn-img/btn-add.png"
              alt=""
            />
            创建折扣码
          </el-button>
        </div>
      </div>
    </el-card>
    <el-card
      shadow="always"
      class="mb-4 !rounded-20px"
    >
      <el-table
        class="w-full "
        v-loading="isLoading"
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
      >
        <el-table-column
          prop="code"
          label="折扣码"
        >
        </el-table-column>
        <el-table-column
          prop="user_id"
          label="用户ID"
        >
        </el-table-column>
        <template
          v-for="(item, index) in vipStore.dropdownlist"
          :key="item.label"
        >
          <el-table-column
            :prop="`value[${item.value}]`"
            :label="item.label"
          >
          </el-table-column>
        </template>

        <el-table-column
          prop="createTime"
          label="创建时间"
          min-width="120"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            {{ dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
        >
          <template #default="{ row }">
            <div class="flex items-center">
              <el-button
                type="primary"
                size="small"
                text
                bg
                @click="editDiscountCode(row)"
              >
                编辑
              </el-button>
              <el-button
                class="ml-4"
                type="warning"
                size="small"
                text
                bg
                @click="deleteDiscountCode(row)"
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
      >{{ `共 ${paginationProps.total} 条` }}</div>
      <el-pagination
        class="common"
        background
        layout="sizes, prev, pager, next, jumper"
        v-bind="paginationProps"
        :page-sizes="[20, 50, 100, 200, 500]"
        @size-change="pagSizeChangeHandle"
        @current-change="pageChangeHandle"
      />
    </div>

    <template v-if="showDialog">
      <component
        v-model="showDialog"
        :is="dialogComponent"
        :title="dialogTitle"
        :detail="currentRowDetail"
        :propParams="currentRowDetail"
        :propFunction="CreatDiscountCode"
        @refresh="refreshHandle"
      />
    </template>
  </div>
</template>

<script
  setup
  lang="ts"
>
import useListFetch from "@/hooks/useListFetch";
import { CreatDiscountCode, FetchDiscountCodeList, FetchRedeemCodeType } from "@/api/financial";
import dayjs from "dayjs";
import variables from "@/styles/variables.module.scss";
import { browserHeight } from '@/utils/dom'
import AddOrUpdateDiscountCode from "./component/AddOrUpdateDiscountCode.vue";
import XDialog from "@/components/Core/XDialog.vue";
import { useVipStore } from "@/store/modules/vip";

defineOptions({
  name: "DiscountCode",
  inheritAttrs: false,
});

onMounted(async () => {
  await getList();
});

const vipStore = useVipStore();
const currentRowDetail = ref()
const dialogComponent = shallowRef();
const dialogTitle = ref('添加会员')
const showDialog = ref<boolean>(false);

const { params, list, isLoading, getList, pageChangeHandle, pagSizeChangeHandle, paginationProps } =
  useListFetch(FetchDiscountCodeList, {
    // user_id: "",
    // code: '',
    type: null,
    pageNum: 1,
    pageSize: 20,
  });

const creatDiscountCode = () => {
  dialogComponent.value = AddOrUpdateDiscountCode;
  currentRowDetail.value = {}
  dialogTitle.value = "添加折扣码";
  showDialog.value = true;
};

const editDiscountCode = (row: any) => {
  dialogComponent.value = AddOrUpdateDiscountCode;
  dialogTitle.value = "编辑折扣码";
  currentRowDetail.value = { ...row, modify: true, };
  showDialog.value = true;
};

const deleteDiscountCode = async (row?: any) => {
  currentRowDetail.value = { ...row, modify: true, deleted: '0' };
  dialogComponent.value = XDialog
  dialogTitle.value = "您确定要删除该折扣码吗";
  showDialog.value = true;
};

const refreshHandle = (type?: string) => {
  params.pageNum = 1;
  params.pageSize = 20;
  getList();
};
</script>

<style
  lang="scss"
  scoped
>
.container-box {
  position: relative;
  border-radius: 15px;

  :deep(.el-drawer__header) {
    margin-bottom: 0;
  }
}

.header {
  margin-bottom: 0;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}
</style>
