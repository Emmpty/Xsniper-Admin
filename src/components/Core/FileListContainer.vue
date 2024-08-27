<template>
  <ul class="file-list">
    <template
      v-for="item in fileList"
      :key="item && item.uid"
    >
      <li
        v-if="item"
        class="file-item"
      >
        <i class="iconfont icon-fujian fileIcon"></i>
        <p class="file">
          <span class="file-name">
            {{ item.name }}
          </span>
          <span class="file-size">
            ( {{ item.fileSize }} )
          </span>
          <slot :item="item"></slot>
          <span
            class="delete"
            @click="removeFile(item)"
          >
            删除
          </span>
        </p>
      </li>
    </template>
  </ul>
</template>
<script
  setup
  lang="ts"
>
// import { defineComponent } from 'vue'

const props = withDefaults(
  defineProps<{
    fileList: Array<any>
  }>(),
  {
  }
)

onMounted(() => {

})

const { fileList } = toRefs(props)
const emit = defineEmits(['update:fileList'])

const removeFile = (file: any) => {
  const list = fileList.value
  if (list && list.length) {
    const filteredList = list.filter((item: any) => {
      return item.uid !== file.uid
    })
    emit('update:fileList', filteredList)
  }
}

// export default defineComponent({
//   name: 'FileList',
//   props: {
//     fileList: { type: Array }
//   },
//   emits: ['update:fileList'],
//   setup (props, context) {
//     const removeFile = (file: any) => {
//       const list = props.fileList
//       if (list && list.length) {
//         const filteredList = list.filter((item: any) => {
//           return item.uid !== file.uid
//         })
//         context.emit('update:fileList', filteredList)
//       }
//     }
//     return {
//       removeFile
//     }
//   }
// })
</script>
<style
  lang="scss"
  scoped
>
.file-list {
  width: 100%;
  display: flex;
  flex-flow: column;
  margin-top: $space-small;

  .file-item {
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    font-size: $font-size-base;
    line-height: 24px;
    margin-bottom: $space-small;

    .iconfont {
      color: var(--el-color-primary);
      font-size: 20px;
      margin-right: $space-small;
    }

    .file {
      flex: 1;
      flex-shrink: 1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;

      span {
        display: inline-block;
        line-height: 32px;
        color: $font-color-black;
      }

      .delete {
        margin-left: $space-large;
        color: var(--el-color-primary);
        cursor: pointer;
        min-width: 28px;
      }

      .file-name {
        // margin-right: 5px;
        min-width: 96px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .file-size {
        min-width: 76px;
      }
    }
  }
}
</style>