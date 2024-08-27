<template>
  <form-item :props="props">
    <fr-form-item
      :mode="props?.mode"
      :content="value"
    >
      <el-input
        autocomplete="new-password"
        :model-value="computedValue"
        v-bind="props?.inputProps"
        :maxlength="props?.maxlength || ''"
        :placeholder="computedPlaceholder"
        v-on="formInputEvents"
      />
      <!-- <template #suffix>
          <slot name="customSuffix"></slot>
        </template> -->
    </fr-form-item>
  </form-item>
</template>
<script lang="ts">
import { defineComponent, PropType, toRefs, inject, computed, unref } from 'vue'
import { formContextKey } from 'element-plus'

interface IFrisUseFormInputProps {
  label: string
  prop?: string
  mode?: 'form' | 'show'
  inputProps?: any
  inputEvents?: any
  colProps?: any
  formProps?: any
  maxlength?: string
}

export default defineComponent({
  name: 'FormInput',
  props: {
    props: {
      type: Object as PropType<IFrisUseFormInputProps>,
      require: true,
    },
    value: {
      type: [String, Number],
      require: true,
    },
  },
  emits: ['update:value'],
  setup(props, context) {
    const elForm = toRefs(inject(formContextKey) as any)
    const { props: inputComponentProps, value: modelValue } = toRefs(props)

    const inputEvents =
      inputComponentProps.value &&
      inputComponentProps.value.inputEvents &&
      inputComponentProps.value.inputEvents.input

    const modelValueInputHandle = (val: string) => {
      context.emit('update:value', val)
      if (typeof inputEvents === 'function') {
        inputEvents(val)
      }
    }

    const formInputEvents = {
      ...((inputComponentProps.value &&
        inputComponentProps.value.inputEvents) ||
        {}),
      input: modelValueInputHandle,
    }

    const isDisabled = computed<boolean>(() => {
      const customDisabled =
        inputComponentProps.value &&
        inputComponentProps.value.inputProps &&
        inputComponentProps.value.inputProps.disabled
      if (customDisabled === true || customDisabled === false) {
        return customDisabled
      }
      return (elForm && elForm.disabled && unref(elForm.disabled)) || false
    })

    const computedPlaceholder = computed(() => {
      const placeholder =
        (inputComponentProps.value &&
          inputComponentProps.value.inputProps &&
          inputComponentProps.value.inputProps.placeholder) ||
        '请输入' +
        ((inputComponentProps.value && inputComponentProps.value.label) || '')
      return isDisabled.value ? '-' : placeholder
    })

    const computedValue = computed(() => {
      return modelValue.value
    })

    return {
      formInputEvents,
      computedValue,
      computedPlaceholder,
    }
  },
})
</script>
<style lang=""></style>
