<template>
  <form-item :props="props">
    <fr-form-item
      :mode="mode"
      :content="labelValue"
    >
      <fr-radio
        :key="list"
        :active="modelActive"
        :list="list"
        v-bind="{
    ...props.radioProps,
    disabled:
      isFormDisabled || (props.radioProps && props.radioProps.disabled),
  }"
        @update:active="updateActiveHandle"
      >
        <template #default="{ item }">
          <slot :item="item"></slot>
        </template>
      </fr-radio>
    </fr-form-item>
  </form-item>
</template>
<script lang="ts">
import {
  computed,
  unref,
  defineComponent,
  toRefs,
  watchEffect,
  ref,
  inject,
} from 'vue'
import { formContextKey } from 'element-plus'

export default defineComponent({
  name: 'FormRadio',
  props: {
    props: {
      type: Object,
      require: true,
    },
    active: {
      type: [String, Number],
      require: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:active'],
  setup(props, context) {
    const elForm = toRefs(inject(formContextKey) as any)
    const { active: modelActive, props: selectorProps } = toRefs(props)

    const activeItem = computed(() => {
      if (!selectorProps.value) return ''
      return unref(selectorProps.value.list).find(
        (item: any) => String(item.value) === String(modelActive.value)
      )
    })

    const labelValue = computed(() => {
      if (activeItem.value) {
        return activeItem.value.label
      }
      return ''
    })

    const updateActiveHandle = (val: any) => {
      context.emit('update:active', val)
    }

    const list = ref([])

    const isFormDisabled = computed(
      () => elForm && elForm.disabled && elForm.disabled.value
    )

    watchEffect(() => {
      if (selectorProps.value?.radioProps?.disabled || isFormDisabled.value) {
        if (activeItem.value) {
          list.value = [activeItem.value] as any
          return
        } else {
          list.value = []
          return
        }
      }
      if (selectorProps.value) {
        list.value = unref(selectorProps.value.list)
        return
      }
      list.value = []
    })

    const mode = computed(() => {
      if (selectorProps.value) {
        return unref(selectorProps.value.mode)
      }
      return 'form'
    })

    return {
      isFormDisabled,
      updateActiveHandle,
      modelActive,
      labelValue,
      list,
      mode,
    }
  },
})
</script>
<style lang=""></style>
