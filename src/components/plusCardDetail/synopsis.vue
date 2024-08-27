<template>
  <div class="history-details text-sm">
    <div class="history-type mt-3 mb-2 text-xs">{{ '新简介' }}</div>
    <div
      class="rounded-md p-2  text-sm"
      :class="settingsStore.theme == 'light' ? 'bg-slate-200' : 'bg-slate-700'"
    >
      <div class="detail-text text-xs my-1 line-clamp-3 ">{{ detail.profile.biography }}</div>
    </div>
    <div class="history-type mt-3 mb-2 text-xs">{{ '原简介' }}</div>
    <div
      class="rounded-md p-2  text-sm"
      :class="settingsStore.theme == 'light' ? 'bg-slate-200' : 'bg-slate-700'"
    >
      <div class="detail-text text-xs my-1 line-clamp-3 line-through">{{ detail.origin.biography }}</div>
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
    detail: any
  }>(),
  {
    detail: {},
  }
)

onMounted(() => {

})

const settingsStore = useSettingsStore();

const { detail, title } = toRefs(props)
const emit = defineEmits(['update:modelValue', 'refresh', 'addUser'])

const rowDetail = ref<any>()
rowDetail.value = cloneDeep(detail.value)

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
