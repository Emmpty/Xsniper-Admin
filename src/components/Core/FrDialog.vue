<template>
  <div class="fr-dialog-box">
    <el-dialog
      :model-value="modelValue"
      @close="emit('update:modelValue', false)"
      :close-on-click-modal="false"
      :before-close="handleClose"
      close-icon="CircleCloseFilled"
      width="400px"
      destroy-on-close
      v-bind="componentDialogProps"
    >
      <slot></slot>
      <template
        v-if="!hideFooter"
        #footer
      >
        <span
          class="dialog-footer flex flex-row items-center justify-center"
          :class="{ 'footer-class': !dialogProps.showCancel }"
        >
          <el-button
            v-if="dialogProps.showCancel"
            type="primary"
            class="cancel-btn"
            :class="{ 'cancel-class': dialogProps.showCancel }"
            plain
            @click="cancelHandle()"
          >{{ cancelText }}</el-button>
          <el-button
            type="primary"
            class="confirm-btn"
            :loading="isLoading"
            @click="confirmHandle()"
          >{{ confirmText }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script
  setup
  lang="ts"
>
import { computed, toRefs, onMounted } from 'vue'
const props = withDefaults(
  defineProps<{
    modelValue: any
    dialogProps?: any
    hideFooter?: boolean
    isLoading?: boolean
  }>(),
  {
    modelValue: false,
    hideFooter: false,
    isLoading: false,
    dialogProps: {},
  }
)

const { modelValue, dialogProps } = toRefs(props)

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

const componentDialogProps = computed(() => {
  return {
    title: '提示',
    center: false,
    closeOnClickModal: false,
    ...dialogProps.value,
  }
})

const cancelText = computed(() => {
  return dialogProps.value.cancelText || '取消'
})
const confirmText = computed(() => {
  return dialogProps.value.confirmText || '确认'
})

const confirmHandle = () => {
  emit('confirm')
}

const cancelHandle = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

onMounted(() => { })

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>
<style
  lang="scss"
  scoped
>
.fr-dialog-box {
  .cancel-class {
    width: 96px;
    background-color: #fff;
    color: var(--el-color-primary);
  }

  :deep(.el-dialog) {
    border-radius: 16px;
    overflow: hidden;
    padding-top: 0;
    padding-left: 0;
    padding-right: 0;
  }

  :deep(.el-dialog__header) {
    background-color: #f5f6f8;
    height: 54px;
    line-height: 54px;
    padding-left: 30px;
    margin: 0;

    .el-dialog__title {
      display: inline-block;
      font-size: 1rem;
      // -webkit-text-stroke: 0.5px;
      font-weight: bold;
      font-family: AlibabaPuHuiTi_2_65_Medium;
      color: #333333;
      line-height: 22px;
      /* transform: translateY(0px); */
    }
  }

  :deep(.el-dialog__body) {
    padding: 32px 32px 8px 32px !important;
  }

  :deep(.table-dialog) {
    .el-dialog__body {
      padding: 16px 32px !important;
    }
  }

  :deep(.el-dialog__footer) {
    display: flex;
    align-items: center;
    justify-content: center;

    .dialog-footer {
      width: calc(100% - 60px);

      .confirm-btn {
        flex: 1;
        max-width: 300px;
        height: 44px;
        font-size: 16px;
        background: linear-gradient(270deg, var(--el-color-primary) 0%, var(--el-color-primary) 100%);
        box-shadow: 0px 6px 9px 0px rgba(33, 122, 249, 0.3);
        border-radius: 10px;
      }

      .cancel-btn {
        flex: 1;
        max-width: 248px;
        height: 44px;
        font-size: 16px;
        border-radius: 10px;
        margin-right: 75px;
      }

    }

    .footer-class {
      width: 58%;
    }
  }
}
</style>
