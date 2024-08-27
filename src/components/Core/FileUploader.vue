<template>
  <el-upload
    :action="actionUrl"
    :show-file-list="false"
    :file-list="fileList"
    :auto-upload="true"
    :on-progress="progressFile"
    :on-error="uploadErrorHandle"
    :on-success="uploadSuccessHandle"
    :headers="{ 'Authorization': `Bearer ${userStore?.user.token}` }"
    :before-upload="beforeUpload"
    v-bind="uploadProps"
  >
    <slot>
      <el-button class="upload-btn">
        <i class="iconfont icon-shangchuan"></i>
        点击上传
      </el-button>
    </slot>
  </el-upload>
</template>
<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from "@/store";

export default defineComponent({
  name: 'FileUploader',
  props: {
    actionUrl: { type: String },
    fileList: { type: Array },
    uploadProps: { type: Object },
    customFileTypeList: { type: Array }
  },
  emits: ['update:fileList', 'upLoadSuccess'],
  setup(props, context) {
    const { fileList, customFileTypeList } = toRefs(props)
    const userStore = useUserStore()
    const beforeUpload = (file: any) => {
      let FileExt = file.name.replace(/.+\./, "")
      const allowFiles = customFileTypeList.value || ['jpg', 'pic', 'gif', 'mp4', 'avi', 'png', 'txt', 'zip', 'rar', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']
      const idAllowFiles = allowFiles.indexOf(FileExt.toLowerCase()) === -1
      if (idAllowFiles) {
        const hintAllowFiles = allowFiles.join('、').slice(0, -1)
        const hintText = '请上传后缀名为' + hintAllowFiles + '或' + allowFiles[allowFiles.length - 1] + '的文件！'
        ElMessage({ message: hintText, showClose: true, type: 'warning' })
        return Promise.reject(hintText)
      }
      file.fileSize = file.size / 1024 / 1024
      const isLt2M = file.fileSize < 100
      if (!isLt2M) {
        ElMessage({ message: '上传大小不能超过100MB!', showClose: true, type: 'error' })
        return Promise.reject('上传大小不能超过100MB!')
      }
      if ((file.fileSize * 1024) <= 1) {
        file.fileSize = '1KB'
      } else if (file.fileSize < 1) {
        file.fileSize = (file.fileSize * 1024).toFixed(1) + 'KB'
      } else if (file.fileSize < 1024) {
        file.fileSize = file.fileSize.toFixed(2) + 'MB'
      }
      file.percentage = 0
      context.emit('update:fileList', [...(fileList.value || []), file])
    }

    const progressFile = (event: any, file: any) => {
      if (!file || !fileList.value || !fileList.value.length) return
      let _fileList
      if (fileList.value) {
        _fileList = fileList.value.map((item: any) => {
          if (item.uid === file.uid) {
            item.percentage = event.percent
          }
          return item
        })
      }
      context.emit('update:fileList', [...(_fileList || [])])
    }

    const uploadErrorHandle = (response: any, file: any) => {
      ElMessage({ message: '上传失败', showClose: true, type: 'error' })
      if (fileList.value) {
        const _fileList = fileList.value.filter((item: any) => item.uid !== file.uid)
        context.emit('update:fileList', [..._fileList])
      }
    }

    const uploadSuccessHandle = (response: any, file: any) => {
      let _fileList
      if (response.code !== 200) {
        if (response.message) {
          ElMessage({ message: `上传失败，${response.message}`, showClose: true, type: 'error' })
        } else {
          ElMessage({ message: '上传失败', showClose: true, type: 'error' })
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
        if (fileList.value) {
          _fileList = fileList.value.filter((item: any) => item.uid !== file.uid)
          context.emit('update:fileList', [..._fileList])
        }
        return
      }
      if (fileList.value && fileList.value.length) {
        _fileList = fileList.value.map((item: any) => {
          if (item) {
            if (item.uid === file.uid) {
              item.path = response.result.avatar
            }
          }
          return item
        })

        context.emit('update:fileList', [..._fileList])
        context.emit('upLoadSuccess', response.result)
      } else {
        context.emit('update:fileList', [])
      }
    }

    return {
      // store,
      userStore,
      beforeUpload,
      uploadErrorHandle,
      uploadSuccessHandle,
      progressFile,
      ElMessage
    }
  }
})
</script>
<style
  lang="scss"
  scoped
>
.upload-btn {
  color: $font-color-grey-5;
}
</style>