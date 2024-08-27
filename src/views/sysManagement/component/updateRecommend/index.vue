<template>
  <fr-dialog
    v-if="modelValue"
    v-model="showDialog"
    :dialogProps="{
      showCancel: true,
      width: '500px',
      title: title,

    }"
    :close-on-click-modal="false"
    @close="closeHandle()"
    @cancel="closeHandle()"
    @confirm="confirmHandle(ruleFormRef)"
  >
    <div class="relative">
      <div
        v-if="rowDetail.showQuota"
        class="text-[14px] text-[#333] absolute right-0 top-0"
      >已关注数量：{{ 10 }} / {{ 50 }}</div>
      <el-form
        :model="rowDetail"
        :rules="rules"
        class="save"
        inline-message
        ref="ruleFormRef"
        label-position="top"
        label-width="auto"
      >
        <el-row :gutter="56">
          <template v-if="addType === 0">
            <form-input
              v-model:value="rowDetail.code"
              :props="userInputProps"
            />
          </template>
          <template v-else-if="addType === 1">
            <el-col :span="24">
              <el-form-item
                label="模板导入"
                :required="true"
              >
                <fr-form-item>
                  <p class="upload-file-hint ">
                    您可以下载模板后填写 <a
                      :href="`${baseUrl}/${fileTemplate}`"
                      class="down-box tac cursor-pointer"
                    >下载模板</a>
                  </p>

                  <el-upload
                    ref="uploadRefs"
                    class="upload-box"
                    v-model:file-list="fileList"
                    action=""
                    accept=".xlsx,.xls"
                    :auto-upload="false"
                    :limit="1"
                    :multiple="false"
                    :headers="{ 'Authorization': `Bearer ${userStore?.user.token}` }"
                    :on-error="uploadErrorHandle"
                    :on-success="uploadSuccessHandle"
                    :before-upload="beforeUpload"
                    :http-request="uploadExcel"
                  >
                    <el-button class="upload-btn">
                      <i class="iconfont icon-shangchuan"></i>
                      点击上传
                    </el-button>
                  </el-upload>
                </fr-form-item>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
    </div>
  </fr-dialog>
</template>

<script
  setup
  lang="ts"
>
import { cloneDeep, debounce } from 'lodash-es'
import type { FormInstance } from 'element-plus'
import { useUserStore } from "@/store"
import { ImportRecommend, ImportRecommendByExcel } from '@/api/system'


const props = withDefaults(
  defineProps<{
    modelValue: any
    title: string
    detail: any
    showType: string
  }>(),
  {
    title: '',
    detail: {},
  }
)

onMounted(() => {
  if (showType.value == 'batch') {
    addType.value = 1
  }
})

const { detail, title, showType } = toRefs(props)
const emit = defineEmits(['update:modelValue', 'refresh', 'addUser'])
const userStore = useUserStore()
const rowDetail = ref<any>()
rowDetail.value = cloneDeep(detail.value)

const showDialog = ref(true)
const baseUrl = import.meta.env.VITE_APP_BASE_API
const fileTemplate = inject('fileTemplate') as any
const addType = ref<number>(0)
const customFileTypeList = ref(['xls', 'xlsx'])
const fileList = ref([]) as Ref<any>
const isLoading = ref()

const beforeUpload = (file: any) => {
  let FileExt = file.name.replace(/.+\./, "")
  const allowFiles = customFileTypeList.value
  const idAllowFiles = allowFiles.indexOf(FileExt.toLowerCase()) === -1
  if (idAllowFiles) {
    const hintAllowFiles = allowFiles.join('、').slice(0, -1)
    const hintText = '请上传后缀名为' + hintAllowFiles + '或' + allowFiles[allowFiles.length - 1] + '的文件！'
    ElMessage({ message: hintText, showClose: true, type: 'warning' })
    return Promise.reject(hintText)
  }
}

const uploadErrorHandle = (response: any, file: any) => {
  ElMessage({ message: '上传失败', showClose: true, type: 'error' })
}

const uploadSuccessHandle = (response: any, file: any) => {
  console.error('-----response', response);
  if (response && response.code !== 200) {
    if (response.message) {
      ElMessage({ message: `上传失败，${response.message}`, showClose: true, type: 'error' })
    } else {
      ElMessage({ message: '上传失败', showClose: true, type: 'error' })
    }
  }
  if (response.code === 401) {
    return ElMessageBox.confirm("登录信息已失效，请重新登录", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      userStore.resetToken().then(() => {
        location.reload();
      });
    });
  }
  fileList.value = [file]
}

const uploadExcel = async (param: any) => {
  isLoading.value = ElLoading.service({
    lock: true,
    text: '导入中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  let fileFormData = new FormData()
  console.log('fileList', fileList.value[0])
  fileFormData.append('file', param.file, param.file.name)
  try {
    const { code, message } = await ImportRecommendByExcel({ file: fileFormData.get('file') })
    console.log('uploadErrorInfo.value', param.file.name)
    if (code == 200) {
      emit('update:modelValue', false)
      emit('refresh')
      ElMessage({
        message: message,
        showClose: true,
        type: 'success',
      })
    }
  } catch (err) {
    console.log(err)
  } finally {
    isLoading.value.close()
  }
}

const userInputProps = {
  label: '推荐用户',
  prop: 'code',
  colProps: { span: 24 },
  inputProps: { placeholder: '请输入用户主页链接或用户ID' }
}

const ruleFormRef = ref<FormInstance>()
const uploadRefs = ref<any>()
const rules = ref({
  code: [
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
  const valid = await formEl.validate()
  if (valid) {
    if (addType.value === 1) {
      if (fileList.value.length === 0) {
        return ElMessage({ message: '请上传需要导入的Excel文件', showClose: true, type: 'warning' })
      }
      try {
        uploadRefs.value.submit()
      } catch (error) {
        console.error('upload error', error);
      }
      return
    }
    var res, type
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    try {

      res = await ImportRecommend({ code: rowDetail.value.code })
      loading.close()
      console.log('--------------', res)
      if (res.code == 200) {
        ElMessage({
          message: '操作成功！',
          showClose: true,
          type: 'success',
        })
        emit('update:modelValue', false)
        emit('refresh', type)
      } else {
        ElMessage({
          message: res.message,
          showClose: true,
          type: 'error',
        })
      }

    } catch (err: any) {
      loading.close()
      console.error(err);
    }
  } else {
    console.log('error submit!')
    return false
  }

}, 300)

</script>

<style
  lang="scss"
  scoped
>
.upload-file-hint {
  font-size: $font-size-base;
  color: $font-color-grey-5;
  line-height: $font-size-extra-large;
  margin-top: 8px;

  .down-box {
    color: var(--el-color-primary);
  }
}

.file-progress.el-progress {
  width: 96px;
  margin-left: $space-base;
}
</style>
