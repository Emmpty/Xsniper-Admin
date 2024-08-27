<template>
  <!-- 上传组件 -->
  <el-upload
    v-model="imgUrl"
    class="single-uploader"
    :show-file-list="false"
    list-type="picture-card"
    :before-upload="handleBeforeUpload"
    :on-success="handleUploadSuccess"
    :on-error="handleuploadError"
    :http-request="uploadFile"
    v-bind="uploadProps"
  >
    <img
      v-if="imgUrl"
      :src="imgUrl"
      class="single-uploader__image"
    />
    <el-icon
      v-else
      class="single-uploader__icon"
    ><i-ep-plus /></el-icon>
  </el-upload>
</template>

<script
  setup
  lang="ts"
>
import type { UploadProps } from 'element-plus'
import { UploadRawFile, UploadRequestOptions } from "element-plus";
import { uploadFileApi } from "@/api/system";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  maxSize: {
    type: Number,
    default: 2,
  },
  uploadProps: { type: Object },
  propUploadFunction: Function
});

const emit = defineEmits(["update:modelValue"]);
const { maxSize } = toRefs(props)
const loading = ref()
const imgUrl = useVModel(props, "modelValue", emit);
const uploadFileFun = props.propUploadFunction || uploadFileApi

/**
 * 自定义图片上传
 *
 * @param options
 */
async function uploadFile(options: UploadRequestOptions): Promise<any> {
  const { result: fileInfo } = await uploadFileFun(options.file);
  imgUrl.value = fileInfo.image_url;
}

/**
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  if (file.size > maxSize.value * 1048 * 1048) {
    ElMessage.warning(`上传图片不能大于${maxSize.value}M`);
    return false;
  }
  loading.value = ElLoading.service({
    lock: true,
    text: '上传中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  return true;
}

const handleUploadSuccess: UploadProps['onSuccess'] = async (response, uploadFile) => {
  loading.value.close()
}

const handleuploadError = (response: any, file: any) => {
  loading.value.close()
  ElMessage({ message: '上传失败!请稍候再试', showClose: true, type: 'error' })
}
</script>

<style
  scoped
  lang="scss"
>
.single-uploader {
  overflow: hidden;
  cursor: pointer;
  border: 1px var(--el-border-color) solid;
  border-radius: 6px;

  &:hover {
    border-color: var(--el-color-primary);
  }

  &__image {
    display: block;
    width: 178px;
    height: 178px;
  }

  &___icon {
    width: 178px;
    height: 178px;
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
}
</style>
