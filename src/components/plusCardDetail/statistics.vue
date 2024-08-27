<template>
  <div class="">
    <div class="flex-x-between text-xs mt-4">
      <el-button
        class="!rounded-lg"
        @click="changeShowHandle(1)"
      >
        {{ (detail.counts || 0) + '人' + statusList[detail.type] }}
        <el-icon class="ml-2">
          <ArrowUpBold v-if="showScrollbar == 1" />
          <ArrowDownBold v-else />
        </el-icon>
      </el-button>
      <el-button
        class="!rounded-lg"
        @click="changeShowHandle(2)"
      >
        {{ '累计' + (detail.total || 0) + '人' + statusList[detail.type] }}
        <el-icon class="ml-2">
          <ArrowUpBold v-if="showScrollbar == 2" />
          <ArrowDownBold v-else />
        </el-icon>
      </el-button>
    </div>
    <div
      class="transition-all h-40 mt-4"
      :class="{ '!h-0 !mt-0': !showScrollbar }"
    >
      <el-scrollbar>
        <template v-if="showScrollbar == 1">
          <panelUserInfo
            class="mb-2"
            v-for="item in detail.queryUsers"
            :key="item.userId"
            :detail="item"
          />
        </template>
        <template v-if="showScrollbar == 2">
          <panelUserInfo
            class="mb-2"
            v-for="item in detail.totalUsers"
            :key="item.userId"
            :detail="item"
          />
        </template>
      </el-scrollbar>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { cloneDeep } from 'lodash-es'
import { useSettingsStore } from "@/store";

const props = withDefaults(
  defineProps<{
    detail: any,
  }>(),
  {
    detail: {},
  }
)

onMounted(() => {

})

const statusList = inject('statusList') as any
const settingsStore = useSettingsStore();
const { detail } = toRefs(props)
const emit = defineEmits(['update:modelValue', 'refresh', 'addUser'])


const rowDetail = ref<any>()
rowDetail.value = cloneDeep(detail.value)
const showScrollbar = ref(null)

const changeShowHandle = (value) => {
  if (showScrollbar.value == value) {
    return showScrollbar.value = null
  } else {
    showScrollbar.value = value
  }
}
</script>

<style
  lang="scss"
  scoped
>
.history-details {
  .detail-text {
    word-break: break-all;
    text-overflow: ellipsis;
  }
}
</style>
