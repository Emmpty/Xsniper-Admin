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
              placeholder="请输入提现单号"
              v-model="params.serial"
            />
          </el-form-item>
          <el-form-item label="">
            <fr-selector
              v-model:active="params.status"
              :props="statusSelectProps"
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
              :clearable="true"
              :shortcuts="shortcuts"
              :disabled-date="disabledDate"
            />
          </el-form-item>
        </el-form>
        <div class="flex-center">
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
          label="提现单号"
          prop="serial"
        />
        <el-table-column
          label="提现用户ID"
          prop="userId"
        />
        <el-table-column
          label="提现地址"
          prop="account"
          min-width="150"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="提现金额"
          prop="cashAmount"
        />
        <el-table-column
          label="提现方式"
          prop="type"
        >
          <template #default="{ row }">
            {{ withdrawWayList[row.type] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="申请时间"
          min-width="120"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            {{ dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column
          label="提现状态"
          prop="status"
        >
          <template #default="{ row }">
            <el-tag :type="getTagType(row.status)">
              {{ withdrawStatusList[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="approveTime"
          label="处理时间"
          min-width="120"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            {{ scope.row.approveTime ? dayjs(scope.row.approveTime).format("YYYY-MM-DD HH:mm") : '--' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
        >
          <template #default="{ row }">
            <div
              v-if="row.status == 0"
              class="flex items-center"
            >
              <el-button
                type="primary"
                size="small"
                text
                bg
                @click="processingWithdrawal(row, 1)"
              >
                通过
              </el-button>
              <el-button
                class="ml-4"
                type="warning"
                size="small"
                text
                bg
                @click="processingWithdrawal(row, 2)"
              >
                拒绝
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
        :propParams="currentParams"
        :propFunction="ProcessingWithdrawal"
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
import { FetchWithdrawList, ProcessingWithdrawal } from "@/api/financial";
import dayjs from "dayjs";
import variables from "@/styles/variables.module.scss";
import { browserHeight } from '@/utils/dom'
import XDialog from "@/components/Core/XDialog.vue";

defineOptions({
  name: "Withdraw",
  inheritAttrs: false,
});

onMounted(async () => {
  getList();
});

enum withdrawStatusList {
  "待审核" = 0,
  "已通过" = 1,
  "已拒绝" = 2,
  "提现失败" = 3,
}
enum withdrawWayList {
  "银行卡" = 0,
  "支付宝" = 1,
  "微信" = 2,
  "USDT" = 3,
}

const currentParams = ref<any>({});
const dialogComponent = shallowRef();
const dialogTitle = ref('')
const showDialog = ref<boolean>(false);
const startTime = ref();
const endTime = ref();
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
const statusSelectList = ref([
  { type: 0, name: "待审核" },
  { type: 1, name: "已通过" },
  { type: 2, name: "已拒绝" },
  { type: 3, name: "提现失败" },
]);
const statusSelectProps = {
  label: "",
  prop: "userType",
  colProps: { span: 8 },
  selectProps: { filterable: true, placeholder: "请选择审核状态" },
  list: {
    list: computed(() => statusSelectList.value || []),
    label: "name",
    value: "type",
  },
};


const { params, list, isLoading, getList, pageChangeHandle, pagSizeChangeHandle, paginationProps } =
  useListFetch(FetchWithdrawList, {
    // user_id: "",
    // serial: '',
    // status:'',
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

const processingWithdrawal = (row: any, type: number) => {
  currentParams.value = { serial: row.serial, status: type }
  if (type == 1) {
    dialogTitle.value = '确定要通过该笔提现吗'
  } else {
    dialogTitle.value = '确定要拒绝该笔提现吗'
  }
  dialogComponent.value = XDialog;
  showDialog.value = true;
};

const refreshHandle = (type?: string) => {
  params.pageNum = 1;
  params.pageSize = 20;
  getList();
};

const getTagType = (type: number) => {
  switch (type) {
    case 1:
      return 'success';
    case 0:
      return 'info';
    case 2:
      return 'warning';
    default:
      return 'danger';
  }
}
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

.history-scroll {
  height: calc(100vh - 100px);
  overflow-x: hidden;
}
</style>
