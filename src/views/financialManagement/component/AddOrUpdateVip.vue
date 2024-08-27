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
          v-model:value="rowDetail.user_id"
          :props="userInputProps"
        />
        <form-selector
          v-model:active="rowDetail.type"
          :props="typeSelectProps"
        />
        <form-date-picker
          v-model:value="rowDetail.expire_date"
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
import { ref, toRefs, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { cloneDeep, debounce } from 'lodash-es'
import type { FormInstance } from 'element-plus'
import { AddVip } from '@/api/financial'

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

const { detail, title } = toRefs(props)
const emit = defineEmits(['update:modelValue', 'refresh', 'addUser'])

const isLoading = ref<boolean>(false)
const rowDetail = ref<any>({
  user_id: '',
  type: 'VIP',
  expire_date: '',
})
if (detail.value) {
  rowDetail.value = cloneDeep(detail.value)
}
const showDialog = ref(true)

onMounted(() => {

})
const datePickerProps = ref({
  label: "选择时间",
  prop: "expire_date",
  colProps: { span: 24 },
  datePickerProps: {
    type: "date",
    clearable: true,
    valueFormat: "YYYY-MM-DD",
  },
})

const userInputProps = {
  label: '用户ID',
  prop: 'user_id',
  colProps: { span: 24 },
  inputProps: { placeholder: '请输入用户ID或钱包地址' }
}

const typeList = ref([
  { id: 'SVIP', name: 'SVIP' },
  { id: 'VIP', name: 'VIP' },
])

const typeSelectProps = {
  label: '会员类型',
  prop: 'type',
  colProps: { span: 24 },
  list: {
    list: computed(() => typeList.value),
    label: 'name',
    value: 'id'
  },
  selectProps: { clearable: true, filterable: true, }
}

const ruleFormRef = ref<FormInstance>()
const rules = ref({
  user_id: [
    { required: true, message: '此项为必填' },
  ],
  type: [
    { required: true, message: '此项为必填', trigger: 'change' },
  ],
  expire_date: [
    { required: true, message: '此项为必填' },
  ],
})

const closeHandle = () => {
  console.error('closeHandle-----------------');

  emit('update:modelValue', false)
}

// 新增或修改
const confirmHandle = debounce(async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (valid) {
      isLoading.value = true
      try {
        let detail = cloneDeep(rowDetail.value)
        const { code, result, message } = await AddVip(detail)
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
    } else {
      console.log('error submit!')
      return false
    }
  })
}, 300)


</script>

<style
  lang="scss"
  scoped
></style>
