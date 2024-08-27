<template>
  <div>
    <fr-dialog
      v-if="modelValue"
      v-model="showDialog"
      :dialogProps="{
        showCancel: true,
        width: '450px',
        title: '温馨提示',
      }"
      :close-on-click-modal="false"
      @cancel="closeHandle()"
      @close="closeHandle()"
      @confirm="confirmHandle()"
    >
      <div class="flex-center text-base text-[#524A4A] my-6">
        {{ title }}
      </div>
    </fr-dialog>
  </div>
</template>

<script
  setup
  lang="ts"
>
const props = withDefaults(
  defineProps<{
    modelValue: any
    title: string
    propParams: any
    propFunction: Function
  }>(),
  {
    title: '',
  }
)

onMounted(() => {

})

const { title, propParams } = toRefs(props)
const emits = defineEmits(['update:modelValue', 'refresh',])
const showDialog = ref(true)

const closeHandle = () => {
  emits('update:modelValue', false)
}

// 新增或修改
const confirmHandle = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '处理中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    console.log('>>>>>>>>>>>', propParams.value);
    const { message } = await props.propFunction(propParams.value);
    ElMessage({ message: message, showClose: true, type: "success" });
    emits('update:modelValue', false)
    emits('refresh')
  } catch (err) {
    console.log(err);
  } finally {
    loading.close()
  }
}


</script>

<style
  lang="scss"
  scoped
></style>
