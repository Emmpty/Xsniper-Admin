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
    <el-table-column
      prop="word"
      label="关键词"
      :show-overflow-tooltip="true"
    />
    <el-table-column
      prop="createTime"
      label="添加时间"
      min-width="120"
      :show-overflow-tooltip="true"
    >
      <template #default="scope">
        {{ dayjs(scope.row.logTime).format("YYYY-MM-DD HH:mm") }}
      </template>
    </el-table-column>
    <el-table-column
      prop="payMoney"
      label="推送设置"
      show-overflow-tooltip
    >
      <template #default="scope">
        <div>
          {{ plusTypeList.find((item) => item.id === scope.row.pushType)?.name }}
          <!-- <fr-selector
                v-model:active="scope.row.pushType"
                :props="pushSelectProps"
                @change="(pushType: any) => changePushType(pushType, scope.row)"
              /> -->
        </div>
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
import { FetchUserKeywordList } from "@/api/user/index";
import dayjs from "dayjs";
import variables from "@/styles/variables.module.scss";
import useListFetch from "@/hooks/useListFetch";
import { onMounted } from "vue";

onMounted(() => {
  getList()
})

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
} = useListFetch(FetchUserKeywordList, {
  user_id: userId,
  pageNum: 1,
  pageSize: 20,
});

const plusTypeList = ref([
  { id: 0, name: "不推送" },
  { id: 1, name: "全部推送" },
  { id: 2, name: "原创推送" },
  { id: 3, name: "关注推送" },
]);

</script>

<style
  lang="scss"
  scoped
></style>
