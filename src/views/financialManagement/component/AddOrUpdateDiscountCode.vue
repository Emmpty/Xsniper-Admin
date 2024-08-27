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
          v-model:value="rowDetail.code"
          :props="codeInputProps"
        />
        <form-input
          v-model:value="rowDetail.user_id"
          :props="userInputProps"
        />
        <template
          v-for="(props, key) in vipProps"
          :key="props.label"
        >
          <form-input
            v-model:value="rowDetail.value[key]"
            :props="props"
          />
        </template>
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
import { CreatDiscountCode } from '@/api/financial'
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

const isLoading = ref<boolean>(false)
const vipStore = useVipStore();

const { detail, title } = toRefs(props)
const emit = defineEmits(['update:modelValue', 'refresh', 'addUser'])

onMounted(() => {
})

const rowDetail = ref<any>({
  value: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  }
})
if (detail.value.code) {
  rowDetail.value = cloneDeep(detail.value)
}

const showDialog = ref(true)

const ruleFormRef = ref<FormInstance>()
const rules = ref({
  code: [
    { required: true, message: '此项为必填', },
  ],
  user_id: [
    { required: true, message: '此项为必填' },
  ],
})
const codeInputProps = {
  label: '折扣码',
  prop: 'code',
  colProps: { span: 24 },
  inputProps: { placeholder: '请输入折扣码名称' }
}
const userInputProps = {
  label: '用户ID',
  prop: 'user_id',
  colProps: { span: 24 },
  inputProps: { placeholder: '请输入用户ID或钱包地址' }
}
const commonInputProps = {
  colProps: { span: 8 },
  inputProps: { placeholder: "请输入折扣金额", class: "long" },
};
const vipProps = computed(() => {
  let props = {} as any
  if (vipStore.dropdownlist && vipStore.dropdownlist.length > 0) {
    vipStore.dropdownlist.forEach((item: any) => {
      props[item.value] = {
        ...commonInputProps,
        label: item.label,
        prop: `value.${item.value}`,
        inputEvents: {
          input: (val: any) => {
            const integerValue = val.replace(/[^\d]/g, '');
            rowDetail.value.value[item.value] = integerValue === '' ? 0 : parseInt(integerValue, 10);
          },
          focus: (event: any) => {
            // 选中输入框内的文本
            event.target.select();
          }
        }
      }
    })
  }
  return props
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
        let detail = { ...rowDetail.value }
        const { code, result, message } = await CreatDiscountCode(detail)
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
