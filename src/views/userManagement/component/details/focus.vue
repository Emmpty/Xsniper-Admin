<template>
  <div class="header flex-x-between my-4">
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
            <fr-selector
              v-model:active="params.id"
              :props="groupSelectProps"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <el-table
    v-loading="isLoading"
    class="w-full"
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
      prop="imageUrl"
      label="用户"
      min-width="120"
    >
      <template #default="scope">
        <panelUserInfo
          :detail="scope.row.twitterUser"
          nameFontSize="font-size: 0.9rem"
          userNameFontSize="font-size: 0.73rem"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="createAccount"
      label="关注数"
      :show-overflow-tooltip="true"
    >
      <template #default="scope">
        <el-statistic
          title=""
          value-style="font-size: 14px"
          :value="scope.row.twitterUser && scope.row.twitterUser.following || 0"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="number"
      label="粉丝数"
      :show-overflow-tooltip="true"
    >
      <template #default="scope">
        <el-statistic
          title=""
          value-style="font-size: 14px"
          :value="scope.row.twitterUser && scope.row.twitterUser.follower || 0"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="groupId"
      label="分组"
      :show-overflow-tooltip="true"
    >
      <template #default="scope">
        {{ groupList.find((item: any) => scope.row.groupId == item.id)?.name || "-" }}
      </template>
    </el-table-column>
    <el-table-column
      prop="remark"
      label="备注"
      show-overflow-tooltip
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
      prop="status"
      label="新关注推送"
      width="120"
      show-overflow-tooltip
    >
      <template #default="scope">
        <div @click="updateSubmitHandle(scope.row, 'pushFollow')">
          <el-switch
            v-model="scope.row.pushFollow"
            :active-value="1"
            :inactive-value="0"
          />
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="status"
      label="新推文推送"
      width="120"
      show-overflow-tooltip
    >
      <template #default="scope">
        <div @click="updateSubmitHandle(scope.row, 'pushPublish')">
          <el-switch
            v-model="scope.row.pushPublish"
            :active-value="1"
            :inactive-value="0"
          />
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="status"
      label="修改简介推送"
      width="120"
      show-overflow-tooltip
    >
      <template #default="scope">
        <div @click="updateSubmitHandle(scope.row, 'pushProfile')">
          <el-switch
            v-model="scope.row.pushProfile"
            :active-value="1"
            :inactive-value="0"
          />
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
    />
  </div>
</template>

<script
  setup
  lang="ts"
>
import { FetchUserFocusList, AmendUserPushSetting, FetchUserGroupList } from "@/api/user";
import dayjs from "dayjs";
import variables from "@/styles/variables.module.scss";
import useListFetch from "@/hooks/useListFetch";
import { browserHeight } from '@/utils/dom'

onMounted(async () => {
  await getGroupList();
  await getList();
});

enum changeType {
  "入账" = 1,
  "出账" = 2,
}
enum logType {
  "入账" = 1001,
  "出账" = 2001,
}

const userId = inject("userId") as number;

const groupList = ref<any>([]);
const groupSelectProps = {
  label: "分组",
  prop: "id",
  colProps: { span: 24 },
  selectProps: { filterable: true },
  list: {
    list: computed(() => groupList.value || []),
    label: "name",
    value: "id",
  },
};

const {
  params,
  list,
  isLoading,
  getList,
  paginationProps,
  pageChangeHandle,
  pagSizeChangeHandle,
} = useListFetch(FetchUserFocusList, {
  user_id: userId,
  id: "",
  pageNum: 1,
  pageSize: 20,
});

const getGroupList = async () => {
  try {
    const { code, result } = await FetchUserGroupList({ user_id: userId });
    if (code == 200) {
      groupList.value = result;
    }
  } catch (error) {
    console.error('------error', error);
  }
};

const updateSubmitHandle = async (row: any, key: string) => {
  const data = {
    user_id: 1600131,
    ids: [+row.id],
    groupId: row.groupId,
    pushFollow: row.pushFollow,
    pushPublish: row.pushPublish,
    pushProfile: row.pushProfile,
    pushFavorite: row.pushFavorite || 0,
    remark: row.remark,
  };
  try {
    const { code, result } = await AmendUserPushSetting(data);
    if (code == 200) {
      // ElMessage({ message: '修改成功', showClose: true, type: 'success' })
    } else {
      ElMessage({ message: "修改失败", showClose: true, type: "error" });
      if (row[key] == 1) {
        row[key] = 0;
      } else {
        row[key] = 1;
      }
    }
  } catch (error) {
    ElMessage({ message: "修改失败", showClose: true, type: "error" });
    if (row[key] == 1) {
      row[key] = 0;
    } else {
      row[key] = 1;
    }
    console.error(error);
  }
};
</script>

<style
  lang="scss"
  scoped
></style>
