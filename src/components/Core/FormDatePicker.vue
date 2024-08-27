<template>
  <form-item :props="props">
    <fr-form-item
      :mode="props.mode"
      :content="value"
    >
      <el-date-picker
        v-model="modelValue"
        :editable="false"
        type="date"
        style="width: 100%;"
        value-format="YYYY-MM-DD 00:00:00"
        :disabled-date="disabledDate"
        v-bind="props.datePickerProps"
        :placeholder="computedPlaceholder"
        v-on="formDatePickerEvents"
      />
    </fr-form-item>
  </form-item>
</template>

<script>

import { defineComponent, toRefs, ref, watchEffect, computed, inject } from 'vue'
import { formContextKey } from 'element-plus'

export default defineComponent({
  name: 'FormDatePicker',
  props: {
    props: {
      type: Object,
      require: true
    },
    value: {
      type: [String, Number, Array],
      require: true
    },
    type: {
      type: [String, Number, Array],
      default: ''
    }
  },
  emits: ['update:value'],
  setup(props, context) {
    const elForm = toRefs(inject(formContextKey))
    const { props: datePickerComponentProps, type, value } = toRefs(props)

    const dateChangeHandle = datePickerComponentProps.value?.datePickerEvents?.change

    const modelValue = ref()

    const modelValueChangeHandle = (val) => {
      context.emit('update:value', val)
      if (typeof dateChangeHandle === 'function') {
        dateChangeHandle(val)
      }
    }

    watchEffect(() => {
      modelValue.value = value.value
    })

    const isDisabled = computed(() => {
      const customDisabled = datePickerComponentProps.value?.datePickerProps?.disabled
      if (customDisabled === true || customDisabled === false) {
        return customDisabled
      }
      return elForm && elForm.disabled && elForm.disabled.value || false
    })

    const computedPlaceholder = computed(() => {
      const placeholder = datePickerComponentProps.value?.datePickerProps?.placeholder || '请选择日期'
      return isDisabled.value ? '-' : placeholder
    })

    const formDatePickerEvents = {
      ...datePickerComponentProps.value?.datePickerEvents,
      change: modelValueChangeHandle
    }

    const disabledDate = (time) => {
      let oneDayTime = 1000 * 60 * 60 * 24
      if (typeof type.value === 'number') {
        return time.getTime() > (Date.now() + oneDayTime * type.value)
      }
      // 时间范围
      if (Array.isArray(type.value)) {
        return time.getTime() < (Date.now() + oneDayTime * (type.value[0] - 2)) || time.getTime() > (Date.now() + oneDayTime * (type.value[1] + 1))
      }
      if (type.value === 'beforeToday') {
        return time.getTime() > Date.now()
      }
      if (type.value === 'afterToday') {
        return time.getTime() < (Date.now() - oneDayTime)
      }
      return false
    }

    return {
      computedPlaceholder,
      formDatePickerEvents,
      modelValueChangeHandle,
      modelValue,
      disabledDate
    }
  }
})

</script>

<style
  lang="scss"
  scoped
></style>