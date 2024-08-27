<template>
  <div class="container-box">
    <el-card
      v-loading="isDetailsLoading"
      shadow="always"
      class="!pt-[5px] "
    >
      <el-collapse
        v-model="activeNames"
        accordion
      >
        <el-collapse-item name="1">
          <template #title>
            <panelUserInfo
              :detail="userDetails"
              :avatarSize="50"
              showUserId
              nameFontSize="font-size: 16px"
              userNameFontSize="font-size: 14px"
            />
          </template>

          <el-descriptions
            v-if="userDetails"
            class="mt-[16px]"
            title=""
            border
            :column="3"
          >
            <template v-for="(item, index) in userInfoDescriptions">
              <el-descriptions-item :label="item.label">{{ userDetails[item.key] || '--' }}</el-descriptions-item>
            </template>
          </el-descriptions>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-card
      class="mt-6"
      shadow="always"
    >
      <div class="flex flex-row item-center">
        <div
          v-for="(item, index) in pageTitleList"
          :key="index"
          class=" pb-1 text-[18px] cursor-pointer tab-item"
          :class="{
        active: activeIndex === index,
      }"
          @click="clickHandle(index)"
        >
          {{ item.name }}
          <!-- <span v-if="index == 0">{{ `共${inviteTotal || 0}人` }}</span> -->
        </div>
      </div>

      <component :is="currentComponent" />
    </el-card>
  </div>
</template>
<script
  setup
  lang="ts"
>
import { FetchUserDetails, } from "@/api/user";
import userFocusComponent from "./component/details/focus.vue"
import userInviteComponent from "./component/details/invite.vue"
import userKeywordComponent from "./component/details/keyword.vue"

const route = useRoute();
const isDetailsLoading = ref(false)
const userDetails = ref()
const activeNames = ref(['1'])
const activeIndex = ref(0);
const pageTitleList = ref([
  { id: 0, name: "已关注" },
  { id: 1, name: "邀请记录" },
  { id: 2, name: "关键词" },
]);
const userInfoDescriptions = [
  { key: 'invite_people', label: '邀请人', }, { key: 'inviterCode', label: '邀请码', },
  { key: 'invite_number', label: '邀请人数', }, { key: 'focus', label: '已关注数量', }, { key: 'focus_group', label: '分组数量', },
  { key: 'keyword', label: '关键词数量', }, { key: 'create_time', label: '注册时间', }, { key: 'member_time', label: '会员时间', },
  { key: 'membership_level', label: '会员等级', }, { key: 'identifier', label: '登录账号', },
]

const userId = computed(() => +route.query.id);
provide("userId", userId.value);

const currentComponent = computed(() => {
  if (activeIndex.value == 1) return userInviteComponent;
  if (activeIndex.value == 2) return userKeywordComponent;
  return userFocusComponent;
});

const getUserDetails = async () => {
  isDetailsLoading.value = true
  try {
    const { code, result } = await FetchUserDetails({ id: userId.value })
    if (code == 200) {
      userDetails.value = result
    }
  } catch (error) {
    console.error('-----error', error);
  } finally {
    isDetailsLoading.value = false
  }
}

const clickHandle = (index: number) => {
  activeIndex.value = index;
};

onMounted(() => {
  getUserDetails()
})

</script>
<style
  scoped
  lang="scss"
>
.container-box {
  :deep(.el-card) {
    border-radius: 15px;
  }

  :deep(.el-collapse) {
    border: 0;
  }

  :deep(.el-collapse-item__header) {
    border: 0;
  }

  :deep(.el-collapse-item__wrap) {
    border: 0;
  }

  .tab-item {
    position: relative;

    &::after {
      width: 0;
    }

    &.active::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -2px;
      transform: translateX(-50%);
      width: 60%;
      /* Width of the line */
      height: 2px;
      /* Height of the line */
      background-color: #409eff;
      /* Blue line color */
      transition: width 0.3s ease-in-out;
    }

    &.light {
      color: #999999;
    }

    &.dark {
      color: rgb(163 163 163);
    }
  }

  .tab-item+.tab-item {
    margin-left: 2rem;
  }
}
</style>