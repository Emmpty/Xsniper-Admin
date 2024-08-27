<template>
  <div class="flex">
    <div
      v-if="device !== 'mobile'"
      class="flex-center"
    >
      <!--全屏 -->
      <!-- <div class="navbar-item" @click="toggle">
        <svg-icon
          :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
        />
      </div> -->
      <!-- 布局大小 -->
      <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
        <size-select class="navbar-item" />
      </el-tooltip> -->
      <!-- <lang-select class="navbar-item" /> -->
      <!-- <div class="flex-center mx-2">
        <el-switch
          v-model="isDark"
          :active-icon="Moon"
          :inactive-icon="Sunny"
          @change="handleThemeChange"
        />
      </div> -->

    </div>

    <!-- 用户头像 -->
    <div class="user-info-box">
      <el-dropdown trigger="click">
        <div class="flex-center ml-1 mr-2">
          <img
            src="@/assets/images/logo/xsniper-black-login.png"
            class="size-[36px] rounded-full cursor-pointer mr-3"
          />
          <span class="text-[14px] truncate ... ">{{ userStore.userInfo.nick }}</span>
          <el-icon class="cursor-pointer ml-2">
            <CaretBottom />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="w-[200px]">
            <!-- <el-dropdown-item
              class="flex-center"
              divided
            >
              <el-switch
                v-model="isDark"
                :active-icon="Moon"
                :inactive-icon="Sunny"
                @change="handleThemeChange"
              />
            </el-dropdown-item> -->
            <!-- <el-dropdown-item
              class="flex-center"
              divided
              @click="toHelp()"
            >
              {{ '帮助中心' }}
            </el-dropdown-item> -->
            <el-dropdown-item
              class="flex-center"
              divided
              @click="logout"
            >
              {{ $t("navbar.logout") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

  </div>
</template>

<script
  setup
  lang="ts"
>
import { useAppStore, useTagsViewStore, useUserStore, useSettingsStore } from "@/store";

const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

// 设备类型：desktop-宽屏设备 || mobile-窄屏设备
const device = computed(() => appStore.device);

const { isFullscreen, toggle } = useFullscreen();

/**
 * 切换主题
 */
const isDark = ref<boolean>(settingsStore.theme === "dark");
const handleThemeChange = (isDark: any) => {
  useToggle(isDark);
  settingsStore.changeSetting({
    key: "theme",
    value: isDark ? "dark" : "light",
  });
};

const toHelp = () => {
  window.open('https://docs.xsniper.ai/')
}

/**
 * 注销
 */
function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false,
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews();
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`);
      });
  });
}
</script>

<style
  lang="scss"
  scoped
>
.user-info-box {
  background-color: var(--el-bg-color);
  border-radius: 14px;
  padding: 8px 16px;

  :deep(.el-dropdown-menu) {
    width: 200px;
  }
}

.navbar-item {
  display: inline-block;
  width: 30px;
  height: $navbar-height;
  line-height: $navbar-height;
  color: var(--el-text-color);
  text-align: center;
  cursor: pointer;

  &:hover {
    background: rgb(0 0 0 / 10%);
  }
}

.layout-top,
.layout-mix {

  .navbar-item,
  .el-icon {
    color: var(--el-color-white);
  }
}

.dark .navbar-item:hover {
  background: rgb(255 255 255 / 20%);
}
</style>
