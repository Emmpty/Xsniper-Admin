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
            <el-col
              :sm="12"
              :md="12"
              :lg="12"
            >
              <el-form-item label="">
                <el-input
                  clearable
                  placeholder="请输入用户昵称"
                  v-model="params.nickname"
                />
              </el-form-item>
            </el-col>

            <el-col
              :sm="12"
              :md="12"
              :lg="12"
            >
              <el-form-item label="">
                <el-input
                  clearable
                  placeholder="请输入用户ID或钱包地址"
                  v-model="params.id"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        class="w-full "
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
              :canJump="false"
              showUserId
              nameFontSize="font-size: 0.9rem"
              userNameFontSize="font-size: 0.73rem"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="注册时间"
          min-width="120"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            {{ dayjs(scope.row.create_time).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column
          prop="member_time"
          label="会员时间"
          min-width="120"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            <template v-if="row.member_time">
              {{ dayjs(row.member_time).format("YYYY-MM-DD HH:mm") }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="membership_level"
          label="会员等级"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="focus"
          label="已关注数"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="focus_group"
          label="分组数"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="keyword"
          label="关键词数"
          show-overflow-tooltip
        />

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
                @click="editFollow(row)"
              >
                详情
              </el-button>
              <el-button
                class="ml-4"
                type="warning"
                size="small"
                text
                bg
                @click="deleteFollow(row)"
              >
                {{ row.enable == '1' ? '封号' : '解封' }}
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
        :propParams="{
        user_id: currentRowDetail.id,
        enable: currentRowDetail.enable == '1' ? '0' : '1'
      }"
        :propFunction="EnableOrdisableUser"
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
import { FetchUserList, EnableOrdisableUser } from "@/api/user";
import dayjs from "dayjs";
import XDialog from "@/components/Core/XDialog.vue";
import { browserHeight } from '@/utils/dom'

defineOptions({
  name: "User",
  inheritAttrs: false,
});

onMounted(async () => {
  await getList();
});

onActivated(() => { });

const { params, list, isLoading, getList, pageChangeHandle, pagSizeChangeHandle, paginationProps } =
  useListFetch(FetchUserList, {
    id: "",
    nickname: "",
    pageNum: 1,
    pageSize: 20,
  });

watch(() => paginationProps.value.pageSize, (newV) => {
  console.log('>>>>>>>newV', newV);
  getList()
})

const router = useRouter();
// 新增或修改
const showDialog = ref<boolean>(false);
const deleteIds = ref()
provide("deleteIds", deleteIds);
const dialogComponent = shallowRef();
const dialogTitle = ref("添加关注");
const currentRowDetail = ref({}) as any;
const selectionData = ref([]) as any;

const refreshHandle = async (type?: string) => {
  if (!type) {
    params.pageNum = 1;
    params.pageSize = 20;
  }
  await getList();
};

const editFollow = (row: any) => {
  currentRowDetail.value = { ...row };
  router.push({
    path: "/user/userdetails",
    query: { id: row.id || '' },
  });
};

const deleteFollow = async (row?: any) => {
  currentRowDetail.value = { ...row };
  deleteIds.value = (row && [row?.id]) || selectionData.value;
  dialogComponent.value = XDialog
  dialogTitle.value = `您确定要将这个账号${currentRowDetail.enable == '1' ? '解封' : '封号'}吗`;
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
