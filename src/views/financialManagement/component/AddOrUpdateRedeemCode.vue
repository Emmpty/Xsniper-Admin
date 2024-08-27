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
        <form-selector
          v-model:active="rowDetail.type"
          :props="statusSelectProps"
        />
        <form-input
          v-model:value="rowDetail.number"
          :props="userInputProps"
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
import { CreatRedeemCode } from '@/api/financial'
import { validatePositiveInteger } from "@/utils/form";
import { useVipStore } from "@/store/modules/vip";

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

const vipStore = useVipStore();
const isLoading = ref<boolean>(false)

const rowDetail = ref<any>({
  number: '',
  type: '',
})
if (detail.value) {
  rowDetail.value = cloneDeep(detail.value)
}
const showDialog = ref(true)

onMounted(() => {

})

const statusSelectProps = {
  label: "兑换类型",
  prop: "type",
  colProps: { span: 24 },
  selectProps: { clearable: false, filterable: true, placeholder: "请选择类型" },
  list: {
    list: computed(() => vipStore.dropdownlist || []),
    label: "label",
    value: "value",
  },
};
const userInputProps = {
  label: '创建数量',
  prop: 'number',
  colProps: { span: 24 },
  inputProps: { placeholder: '请输入输入创建的数量' },
  inputEvents: {
    // 格式化为正整数
    input: (val: any) => {
      const integerValue = val.replace(/[^\d]/g, '');
      rowDetail.value.number = integerValue === '' ? 1 : parseInt(integerValue, 10);
      console.log('>>>>>>>>>>>>', rowDetail.value.number);
    },
    // 选中输入框内的文本
    focus: (event: any) => {
      event.target.select();
    }
  }
}

const ruleFormRef = ref<FormInstance>()
const rules = ref({
  number: [
    { required: true, message: '此项为必填' },
    { validator: validatePositiveInteger, trigger: "blur" }
  ],
  type: [
    { required: true, message: '此项为必填', trigger: 'change' },
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
        const { code, result, message } = await CreatRedeemCode(detail)
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
