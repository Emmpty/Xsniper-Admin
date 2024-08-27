<template>
  <el-select
    :key="props.list.length"
    clearable
    suffix-icon="CaretBottom"
    :model-value="formatedModelActive"
    v-bind="componentSelectProps"
    :placeholder="computedPlaceholder"
    v-on="selectEvents"
  >
    <el-option
      v-for="item in filteredList"
      :key="item && item[props.list.value]"
      :label="item && item[props.list.label]"
      :value="item && item[props.list.value]"
      :disabled="item && item?.disabled"
      v-bind="props.optionProps"
    >
      <slot :option="item"></slot>
    </el-option>
  </el-select>
</template>
<script lang="ts">
import {
  computed,
  unref,
  defineComponent,
  toRefs,
  ref,
  onMounted,
  watchEffect,
  inject,
} from 'vue'
import useSelector from '@/hooks/useSelector'
import { formContextKey } from 'element-plus'
export default defineComponent({
  name: 'FrSelector',
  props: {
    props: {
      type: Object,
      default: () => ({}),
      require: true,
    },
    active: {
      type: [String, Number],
      require: true,
    },
  },
  emits: ['update:active'],
  setup(props, context) {
    const elForm = toRefs(inject(formContextKey) as any)

    const { active: modelActive, props: selectorProps } = toRefs(props)

    const _list = computed(() => unref(selectorProps.value?.list.list) || [])

    const useSelectorHook = useSelector(_list, selectorProps.value.list.label)
    // console.log('?>>>>>>>', elForm)
    // 合并属性
    let componentSelectProps = ref({
      ...useSelectorHook.selectProps,
      ...(selectorProps.value.selectProps || { class: 'long' }),
    })

    // watch([() => useSelectorHook.selectProps.filterable, selectorProps], () => {
    //   componentSelectProps.value = {
    //     ...useSelectorHook.selectProps,
    //     ...(selectorProps.value.selectProps || { class: 'long' }),
    //   }
    // }, { deep: true })

    watchEffect(() => {
      componentSelectProps.value = {
        ...useSelectorHook.selectProps,
        ...(selectorProps.value.selectProps || { class: 'long' }),
      }
    })

    onMounted(() => {
      componentSelectProps.value = {
        ...useSelectorHook.selectProps,
        ...(selectorProps.value.selectProps || { class: 'long' }),
      }
    })

    const originChange = useSelectorHook.chooseActive

    useSelectorHook.selectEvents = {
      ...useSelectorHook.selectEvents,
      ...selectorProps.value.selectEvents,
      change: (val) => {
        context.emit('update:active', val)
        const change =
          (selectorProps.value.selectEvents &&
            selectorProps.value.selectEvents.change) ||
          originChange
        change(val, unref(selectorProps.value.list.list))
        useSelectorHook.clearFilterStr()
      },
    }

    const isDisabled = computed(() => {
      const customDisabled = selectorProps.value?.selectProps?.disabled
      if (customDisabled === true || customDisabled === false) {
        return customDisabled
      }
      return (elForm && elForm.disabled && elForm.disabled.value) || false
    })

    const computedPlaceholder = computed(() => {
      const placeholder =
        componentSelectProps.value.placeholder ||
        '请选择' + (selectorProps.value?.label || '')
      return isDisabled.value ? '-' : placeholder
    })

    const formatedModelActive = computed(() => {
      const _list = unref(selectorProps.value.list.list)
      if (selectorProps.value?.selectProps?.multiple) {
        return modelActive.value
      }
      if (_list && _list.length && modelActive.value) {
        if (typeof _list[0][selectorProps.value.list.value] === 'number') {
          return +modelActive.value
        }
        if (typeof _list[0][selectorProps.value.list.value] === 'string') {
          return String(modelActive.value)
        }
      }
      return modelActive.value
    })

    return {
      computedPlaceholder,
      formatedModelActive,
      modelActive,
      ...useSelectorHook,
      componentSelectProps,
    }
  },
})
</script>
<style lang=""></style>
