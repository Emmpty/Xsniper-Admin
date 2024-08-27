<script
  setup
  lang="ts"
>
import { useAppStore } from "@/store/modules/app";
import { useVipStore } from "@/store/modules/vip";

const appStore = useAppStore();
const vipStore = useVipStore();
// 获取vip配置信息
vipStore.FetchVipSetting()

</script>

<template>
  <el-config-provider
    :locale="appStore.locale"
    :size="appStore.size"
  >
    <router-view />
  </el-config-provider>
</template>
