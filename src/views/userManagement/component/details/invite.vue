<template>
  <el-table
    :data="list"
    v-loading="isLoading"
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
    class="w-full mt-4"
    empty-text="暂无数据"
  >
    <el-table-column label="类型">
      <template #default="scope">
        <panelUserInfo
          :detail="scope.row"
          showUserId
          :canJump="false"
          nameFontSize="font-size: 16px"
          userNameFontSize="font-size: 14px"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="添加时间"
      min-width="120"
      :show-overflow-tooltip="true"
    >
      <template #default="scope">
        {{ dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm") }}
      </template>
    </el-table-column>
  </el-table>

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
    ></el-pagination>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { FetchUserInviteList } from "@/api/user/index";
import dayjs from "dayjs";
import variables from "@/styles/variables.module.scss";
import useListFetch from "@/hooks/useListFetch";

const emit = defineEmits(["total"]);
const userId = inject("userId") as number;

const {
  params,
  list,
  isLoading,
  total,
  getList,
  paginationProps,
  pageChangeHandle,
  pagSizeChangeHandle,
} = useListFetch(FetchUserInviteList, {
  user_id: userId,
  pageNum: 1,
  pageSize: 20,
});

onMounted(async () => {
  await getList();
});
</script>

<style
  lang="scss"
  scoped
></style>
