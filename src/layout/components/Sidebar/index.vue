<template>
  <div :class="{ 'relative has-logo': sidebarLogo }">
    <!--混合布局-->
    <div
      class="flex w-full"
      v-if="layout == 'mix'"
    >
      <SidebarLogo
        v-if="sidebarLogo"
        :collapse="!appStore.sidebar.opened"
      />
      <SidebarMixTopMenu class="flex-1" />
      <NavbarRight />
    </div>
    <!--左侧布局 || 顶部布局 -->
    <template v-else>
      <SidebarLogo
        v-if="sidebarLogo"
        :collapse="!appStore.sidebar.opened"
      />
      <div class="divider w-full h-1px mb-4"></div>
      <div class="sidebar-box">
        <el-scrollbar>
          <SidebarMenu
            :menu-list="permissionStore.routes"
            base-path=""
          />
        </el-scrollbar>
      </div>
      <div class="absolute bottom-0 left-0 w-full mb-4 flex items-center justify-center">
        <hamburger
          :is-active="appStore.sidebar.opened"
          @toggle-click="toggleSideBar"
        />
      </div>
      <NavbarRight v-if="layout === 'top'" />
    </template>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { useSettingsStore, usePermissionStore, useAppStore } from "@/store";

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();

const sidebarLogo = computed(() => settingsStore.sidebarLogo);
const layout = computed(() => settingsStore.layout);
function toggleSideBar() {
  appStore.toggleSidebar();
}

</script>

<style
  lang="scss"
  scoped
>
.has-logo {
  .el-scrollbar {
    /* height: calc(100vh - $navbar-height); */
  }
}

.divider {
  background-color: var(--el-color-primary);
  opacity: 0.5;
}

.sidebar-box {
  height: calc(100vh - $navbar-height);
  /* background-color: var(--el-bg-color-page); */
}

.el-scrollbar {
  height: 100%;
  background-color: var(--el-bg-color);
  /* border-radius: 15px; */
  /* box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); */
}
</style>
