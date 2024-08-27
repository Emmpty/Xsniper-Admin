<template>
  <i
    class="iconfont "
    :class="[icon, appStore.sidebar.opened ? ' mt-[2px]' : 'ml-2']"
  ></i>
  <!-- <el-icon
    v-if="icon && icon.includes('el-icon')"
    class="sub-el-icon"
  />
  <SvgIcon
    v-else-if="icon"
    :icon-class="icon"
  />
  <SvgIcon
    v-else
    icon-class="menu"
  /> -->
  <span
    v-if="title"
    class="ml-2 text-[16px] font-semibold"
    :class="{ 'hide-title': !isNest }"
  >{{ translateRouteTitle(title) }}</span>
</template>

<script
  setup
  lang="ts"
>
import { translateRouteTitle } from "@/utils/i18n";
import { useAppStore } from "@/store";

const appStore = useAppStore();

defineProps({
  icon: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  isNest: {
    type: Boolean,
    default: false,
  },
});
</script>

<style
  lang="scss"
  scoped
>
.sub-el-icon {
  width: 1em;
  height: 1em;
  color: currentcolor;
}

.hideSidebar {

  .el-sub-menu,
  .el-menu-item {
    .svg-icon {
      margin-left: 20px;
    }
  }

  .hide-title {
    display: inline-block;
    width: 0;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }
}
</style>
