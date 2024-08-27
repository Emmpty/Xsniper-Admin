<template>
  <div class="flex-center ">
    <el-button
      class="ml-[50px]"
      type="primary"
      size="small"
      :loading="isLoading"
      @click="exportClearFollow()"
    >
      导出账号
    </el-button>
    <el-button
      class="ml-[10px]"
      type="warning"
      size="small"
      :loading="isLoading"
      @click="exportClearFollow(1)"
    >
      清空
    </el-button>
    <el-button
      class="ml-[10px]"
      type="primary"
      size="small"
      :loading="isLoading"
      @click="exportClearFollow(2)"
    >
      导出并清空
    </el-button>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { exportAccount } from '@/api/system'

const props = withDefaults(
  defineProps<{
    excelName: string
    poolKey: string
    flagKey: number
    proxy?: string
  }>(),
  {
    excelName: '',
    poolKey: 'state',
    flagKey: 2,
  }
)

onMounted(() => {
})

const { poolKey, flagKey, excelName, proxy } = toRefs(props)
const emit = defineEmits(['refresh',])

const isLoading = ref<boolean>(false)
interface Params {
  pool: string;
  flag: number;
  clear?: number;
  proxy?: string;
}
const exportClearFollow = async (type?: number) => {
  console.log('>>>>>>>>>>>', poolKey.value, flagKey.value);
  try {
    let params: Params = {
      pool: poolKey.value == 'pool' ? '' : poolKey.value,
      flag: flagKey.value,
    }
    if (proxy.value == '0') {
      params.proxy = proxy.value
    }
    if (type) params.clear = type
    const { code, result, message } = await exportAccount(params)
    if (code == 200) {
      if (!type || type == 2) {
        const link = document.createElement('a')
        link.href = result.downloadUrl
        link.download = `${excelName.value}.xlsx`
        link.click()
      }
    }
    ElMessage({
      message: message,
      showClose: true,
      type: 'success',
    })

    if (type) emit('refresh')
  } catch (err: any) {
    console.error(err);
  } finally {
    isLoading.value = false
  }
}
</script>

<style
  lang="scss"
  scoped
>
.img-upload {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  width: 150px;
  height: 150px;
}

.img-current {
  border-radius: 8px;
  border: 1px solid var(--el-border-color);
  max-width: 100%;
  max-height: 200px;
}
</style>
