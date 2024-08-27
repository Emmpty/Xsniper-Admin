<template>
  <form-item :props="props">
    <fr-form-item
      :mode="props.mode"
      :content="labelValue"
    >
      <fr-selector
        :active="modelActive"
        :props="selectorProps"
      />
    </fr-form-item>
  </form-item>
</template>
<script lang="ts">
import {
  computed,
  unref,
  defineComponent,
  PropType,
  Ref,
  toRefs,
  watch,
  onMounted,
} from 'vue'

interface IFrisSelectorList<T> {
  list: Ref<T[]> | T[]
  value: string
  label: string
}
interface IFrisUseFormSelectorProps<T = any> {
  list: IFrisSelectorList<T>
  label?: string
  mode?: 'form' | 'show'
  prop: string
  selectProps?: any
  selectEvents?: any
  optionProps?: any
  optionEvents?: any
  colProps?: any
  formProps?: any
}

export default defineComponent({
  name: 'FormSelector',
  props: {
    props: {
      type: Object as PropType<IFrisUseFormSelectorProps>,
      require: true,
    },
    active: {
      type: [String, Number, Array],
      require: true,
    },
  },
  emits: ['update:active'],
  setup(props, context) {
    const { active: modelActive, props: selectorProps } = toRefs(props)

    const labelValue = computed(() => {
      // 如果存在list
      if (selectorProps.value && unref(selectorProps.value.list.list)) {
        const list = unref(selectorProps.value.list.list)
        if (!list || !list.length) return ''
        // 查找active
        const activeItem = list.find((item) => {
          // 都转换为 string 类型
          const value = String(item[selectorProps.value!.list.value])
          const modelValue = String(modelActive.value)
          return value === modelValue
        })
        if (activeItem) {
          return activeItem[selectorProps.value.list.label]
        }
      }
      return ''
    })

    const formatChange = () => {
      if (selectorProps.value) {
        // 如果没有events 重设events为空对象
        if (!selectorProps.value.selectEvents) {
          selectorProps.value.selectEvents = {}
        }
        // 获取传入的自定义change事件
        const customerChange = selectorProps.value.selectEvents.change
        // 触发change，并且调用自定义change事件
        selectorProps.value.selectEvents.change = (val: any, list: any) => {
          context.emit('update:active', val)
          if (typeof customerChange === 'function') {
            customerChange(val, list)
          }
        }
      }
    }

    watch(selectorProps, formatChange)

    onMounted(formatChange)

    return {
      modelActive,
      labelValue,
      selectorProps,
    }
  },
})
</script>
<style lang=""></style>
