<template>
  <fr-dialog
    v-if="modelValue"
    v-model="showDialog"
    :dialogProps="{
      center: true,
      showCancel: true,
      width: '600px',
      title: title,

    }"
    :isLoading="isLoading"
    :close-on-click-modal="false"
    @cancel="closeHandle()"
    @close="closeHandle()"
    @confirm="confirmHandle(ruleFormRef)"
  >
    <el-form
      :model="rowDetail"
      :rules="rules"
      class="save"
      ref="ruleFormRef"
      label-position="top"
      label-width="auto"
      inline-message
    >
      <el-row :gutter="56">
        <form-input
          v-model:value="rowDetail.title"
          :props="titleInputProps"
        />
        <el-col v-bind="{ span: 24 }">
          <el-form-item
            label="图片"
            prop="image_url"
          >
            <single-upload
              v-model="rowDetail.image_url"
              :uploadProps="{
      accept: '.jpeg,.png,.jpg,.bmp,.gif',
    }"
              :maxSize="10"
            />
          </el-form-item>
        </el-col>
        <form-input
          v-model:value="rowDetail.context"
          :props="contextInputProps"
        />
        <form-date-picker
          v-model:value="rowDetail.release_time"
          type="afterToday"
          :props="datePickerProps"
        />
      </el-row>
    </el-form>
  </fr-dialog>
</template>

<script
  setup
  lang="ts"
>
import dayjs from "dayjs";
import { cloneDeep, debounce } from 'lodash-es'
import type { FormInstance, UploadProps, UploadInstance } from 'element-plus'
import { SaveAnnouncement } from '@/api/system'
import { useUserStoreHook } from "@/store/modules/user";

const props = withDefaults(
  defineProps<{
    modelValue: any
    title: string
    detail?: any
  }>(),
  {
    title: '',
    detail: {},
  }
)

onMounted(() => {
})

const { detail, title } = toRefs(props)
const emit = defineEmits(['update:modelValue', 'refresh', 'addUser'])

const isLoading = ref<boolean>(false)
const rowDetail = ref<any>({
  release_time: dayjs().format("YYYY-MM-DDTHH:mm:ssZ")
})
if (detail.value.id) {
  rowDetail.value = cloneDeep(detail.value)
}
const showDialog = ref(true)
const ruleFormRef = ref<FormInstance>()
const rules = ref({
  title: [
    { required: true, message: '此项为必填', },
  ],
  context: [
    { required: true, message: '此项为必填' },
  ],
  release_time: [
    { required: true, message: '此项为必填', trigger: 'change' },
  ],
})
const titleInputProps = {
  label: '标题',
  prop: 'title',
  colProps: { span: 24 },
  inputProps: { placeholder: '请输入标题名称' }
}
const contextInputProps = {
  label: '内容',
  prop: 'context',
  colProps: { span: 24 },
  inputProps: { type: 'textarea', placeholder: '请输入内容', autosize: { minRows: 2, maxRows: 4 } }
}
const datePickerProps = ref({
  label: "选择时间",
  prop: "release_time",
  colProps: { span: 24 },
  datePickerProps: {
    type: "datetime",
    clearable: true,
    valueFormat: "YYYY-MM-DD HH:mm:ss",
  },
})

const closeHandle = () => {
  console.error('closeHandle-----------------');
  emit('update:modelValue', false)
}

// 新增或修改
const confirmHandle = debounce(async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
  } catch (error) {
    return
  }
  isLoading.value = true
  try {
    let detail = { ...rowDetail.value }
    const { message } = await SaveAnnouncement(detail)
    ElMessage({
      message: message,
      showClose: true,
      type: 'success',
    })
    emit('refresh')
    emit('update:modelValue', false)
  } catch (err: any) {
    console.error(err);
  } finally {
    isLoading.value = false
  }
}, 300)
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
