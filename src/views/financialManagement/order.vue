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
              placeholder="请输入订单号"
              v-model="params.order_id"
            />
          </el-form-item>
          <el-form-item label="">
            <el-date-picker
              v-model="keyWordTime"
              type="daterange"
              valueFormat="YYYY-MM-DD"
              rangeSeparator="至"
              startPlaceholder="开始时间"
              endPlaceholder="结束时间"
              :clearable="false"
              :shortcuts="shortcuts"
              :disabled-date="disabledDate"
            />
          </el-form-item>
        </el-form>
        <div class="flex-center">
          <el-button @click="addVip()">
            <img
              class="btn-img"
              src="@/assets/images/btn-img/btn-add.png"
              alt=""
            />
            添加会员
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
          prop="id"
          label="订单号"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="userId"
          label="用户ID"
        >
        </el-table-column>
        <el-table-column
          prop="code"
          label="商品ID"
        >
        </el-table-column>
        <el-table-column
          prop="promotion"
          label="折扣码"
        >
        </el-table-column>
        <el-table-column
          prop="commission"
          label="佣金"
        >
        </el-table-column>
        <el-table-column
          prop="code"
          label="商品ID"
        >
        </el-table-column>
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
          prop="payTime"
          label="支付时间"
          min-width="120"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            {{ dayjs(scope.row.payTime).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column
          prop="paySerial"
          label="支付流水号"
        >
        </el-table-column>
        <el-table-column
          prop="commission"
          label="支付金额"
        >
        </el-table-column>
        <el-table-column
          prop="payStatus"
          label="支付状态"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-tag
              v-if="scope.row.payStatus === 1"
              class="ml-2"
              type="success"
            >已完成</el-tag>
            <el-tag
              v-if="scope.row.payStatus === 0"
              class="ml-2"
              type="warning"
            >确认中</el-tag>
            <el-tag
              v-if="scope.row.payStatus === 2"
              class="ml-2"
              type="danger"
            >已关闭</el-tag>
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
import { FetchOrderList } from "@/api/financial";
import dayjs from "dayjs";
import variables from "@/styles/variables.module.scss";
import { browserHeight } from '@/utils/dom'
import AddOrUpdateVip from "./component/AddOrUpdateVip.vue";

defineOptions({
  name: "Order",
  inheritAttrs: false,
});

onMounted(async () => {
  getList();
});

const dialogComponent = shallowRef();
const dialogTitle = ref('添加会员')
const showDialog = ref<boolean>(false);
const startTime = ref(dayjs().format("YYYY-MM-DDT00:00:00Z"));
const endTime = ref(dayjs().format("YYYY-MM-DDT23:59:59Z"));
// 日期组件禁选日期
const disabledDate = (time: any) => {
  return time.getTime() > Date.now()
}
const shortcuts = [
  {
    text: '当天',
    value: [startTime.value, endTime.value],
  },
  {
    text: '近3天',
    value: () => {
      return [dayjs().subtract(2, "day").format("YYYY-MM-DDT00:00:00Z"), endTime.value]
    },
  },
  {
    text: '近7天',
    value: () => {
      return [dayjs().subtract(6, "day").format("YYYY-MM-DDT00:00:00Z"), endTime.value]
    },
  },
]



const { params, list, isLoading, getList, pageChangeHandle, pagSizeChangeHandle, paginationProps } =
  useListFetch(FetchOrderList, {
    // user_id: "",
    // order_id: '',
    type: null,
    pageNum: 1,
    pageSize: 20,
    startTime: startTime.value,
    endTime: endTime.value,
  });

const keyWordTime = ref<string[]>([startTime.value, endTime.value]);

watch(keyWordTime, () => {
  if (keyWordTime.value && keyWordTime.value.length === 2) {
    params.startTime = dayjs(keyWordTime.value[0] + " 00:00:00").format("YYYY-MM-DDTHH:mm:ssZ");
    params.endTime = dayjs(keyWordTime.value[1] + " 23:59:59").format("YYYY-MM-DDTHH:mm:ssZ");
  } else {
    params.startTime = "";
    params.endTime = "";
  }
});

const addVip = (type?: any) => {
  dialogComponent.value = AddOrUpdateVip;
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
