<template>
  <div class="fr-form-item truncate ...">
    <slot v-if="useMode === 'form'"></slot>
    <slot
      v-if="useMode === 'show'"
      name="show"
    >
      <p
        v-if="useMode === 'show'"
        class="fr-form-content"
      >
        {{ content || '-' }}
      </p>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, unref, computed } from 'vue'
export default defineComponent({
  name: 'FrFormItem',
  props: {
    content: {
      type: [String, Number, Array],
      default: '',
    },
    mode: {
      type: String,
      default: undefined,
    },
  },
  setup (props) {
    const useMode = computed(() => {
      const injectMode = unref(inject('frFormItemType', ''))
      return props.mode || injectMode || 'form'
    })
    return {
      useMode,
    }
  },
})
</script>

<style
  lang="scss"
  scoped
>
.fr-form-item {
  padding-left: 4px;
  width: 100%;

  .fr-form-content {
    font-size: $font-size-base;
    color: $font-color-black;
    margin-left: 10px;
    display: flex;
    align-items: center;
  }
}
</style>
