<template>
  <div class="container-box">
    <el-card
      shadow="always"
      class="mb-4 !rounded-20px"
    >
      <div class="header">
        <el-form
          :inline="true"
          :model="params"
          label-width="auto"
          class="save search"
        >
          <el-form-item label="">
            <el-input
              clearable
              placeholder="请输入用户昵称"
              v-model="params.nickname"
            />
          </el-form-item>
          <el-form-item label="">
            <el-input
              clearable
              placeholder="请输入用户ID或钱包地址"
              v-model="params.user_id"
            />
          </el-form-item>
          <el-form-item label="">
            <fr-selector
              v-model:active="params.type"
              :props="taskStatusProps"
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
          prop="imageUrl"
          label="用户"
          min-width="120"
        >
          <template #default="scope">
            <panelUserInfo
              :detail="scope.row"
              showUserId
              nameFontSize="font-size: 0.9rem"
              userNameFontSize="font-size: 0.73rem"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="logType"
          label="推送类型"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            {{ `新${historyList[scope.row.logType]}历史` }}
          </template>
        </el-table-column>
        <el-table-column
          prop="pushTime"
          label="推送时间"
          min-width="120"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            {{ dayjs(scope.row.logTime).format("YYYY-MM-DD HH:mm") }}
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
                @click="Details(row)"
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
                封号
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
    <el-drawer
      v-if="currrentDetails"
      v-model="showPushDetailsDrawer"
    >
      <template #header>
        <fr-form-group-title
          class="history-title !text-18px"
          :title="`新${historyList[currrentDetails.logType]}详情`"
        />
      </template>
      <template #default>
        <el-scrollbar class="history-scroll">
          <panelUserInfo
            nameFontSize="font-size: 0.8rem"
            userNameFontSize="font-size: 0.7rem"
            :detail="{ ...((currrentDetails.content && (currrentDetails.content.user || currrentDetails.content.twitterUser || currrentDetails.content.target || currrentDetails.content.origin)) || currrentDetails.content || currrentDetails.user || currrentDetails), type: currrentDetails.logType, }"
            :showTag="true"
          />
          <!-- 关注点赞列内容 -->
          <follow-likes
            v-if="currrentDetails.logType == 0 || currrentDetails.logType == 2"
            :detail="{ ...((currrentDetails.content && (currrentDetails.content.followUser || currrentDetails.content.tweet)) || currrentDetails.followUser), type: currrentDetails.logType, }"
            :mediaCol="24"
          />
          <!-- 修改简介列表 -->
          <synopsis
            v-if="currrentDetails.logType == 3"
            :detail="currrentDetails.content"
          />
          <!-- 推文内容 -->
          <tweet-detail
            v-if="currrentDetails.logType == 1 || currrentDetails.logType == 4"
            :detail="currrentDetails.content"
            :mediaCol="24"
          >
            <template v-if="currrentDetails.content.quotedStatus || currrentDetails.content.retweetedStatus">
              <div class="flex-col !border-1 border-slate-100 rounded p-2">
                <div class="flex items-center">
                  <el-avatar
                    :size="30"
                    :src="getAvatar(currrentDetails.content.quotedStatus || currrentDetails.content.retweetedStatus)"
                  />
                  <div class="text-sm font-bold truncate ... mx-2 text-16px max-w-30">
                    {{ getName(currrentDetails.content.quotedStatus || currrentDetails.content.retweetedStatus) }}
                  </div>
                  <div class="text-xs text-slate-400 truncate ... text-14px max-w-30">
                    {{ "@" + getUsername(currrentDetails.content.quotedStatus ||
            currrentDetails.content.retweetedStatus)
                    }}
                  </div>
                </div>
                <tweet-detail
                  :detail="currrentDetails.content.quotedStatus || currrentDetails.content.retweetedStatus"
                  :mediaCol="24"
                />
              </div>
            </template>
          </tweet-detail>
        </el-scrollbar>
      </template>
    </el-drawer>
  </div>
</template>

<script
  setup
  lang="ts"
>
import useListFetch from "@/hooks/useListFetch";
import { pushList } from "@/api/push";
import dayjs from "dayjs";
import variables from "@/styles/variables.module.scss";
import { browserHeight } from '@/utils/dom'

defineOptions({
  name: "PushRecord",
  inheritAttrs: false,
});

onMounted(async () => {
  getList();
});

enum historyList {
  "关注" = 0,
  "推文" = 1,
  "修改简介" = 3,
  "关键词" = 4,
}

provide("statusList", historyList);
const showPushDetailsDrawer = ref(false)
const currrentDetails = ref()
const startTime = ref(dayjs().subtract(6, "day").format("YYYY-MM-DDT00:00:00Z"));
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
  useListFetch(pushList, {
    // user_id: "",
    // nickname: '',
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

const panelColumnTypeList = ref([
  { type: 0, name: "新关注历史" },
  { type: 1, name: "新推文历史" },
  { type: 3, name: "新修改简介历史" },
  { type: 4, name: "新关键词历史" },
]);
const taskStatusProps = {
  label: "",
  prop: "userType",
  colProps: { span: 8 },
  selectProps: { filterable: true, placeholder: "请选择分类" },
  list: {
    list: computed(() => panelColumnTypeList.value || []),
    label: "name",
    value: "type",
  },
};

const Details = (row: any) => {
  currrentDetails.value = row
  showPushDetailsDrawer.value = true
}
const getAvatar = (status) => {
  return status && status.avatar;
};
const getName = (status) => {
  return (status && status.name) || "";
};
const getUsername = (status) => {
  return (status && status.username) || "";
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

.history-scroll {
  height: calc(100vh - 100px);
  overflow-x: hidden;
}
</style>
