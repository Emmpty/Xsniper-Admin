<template>
  <div class="fr-radio">
    <template v-if="list && list.length">
      <el-tag
        v-for="item in list"
        :key="item.value"
        :class="[
          'fr-radio-tag',
          'mr-2',
          {
            disabled: disabled || item.disabled,
            'mb-8': list.length > 5,
            'fr-radio-tag-foramt': formatLabel,
          },
        ]"
        :type="item.value == active ? 'primary' : 'info'"
        :effect="item.value == active ? 'dark' : 'plain'"
        @click="changeActive(item.value)"
      >
        <span v-if="!formatLabel">{{ item.label }}</span>
        <slot v-else :item="item"></slot>
      </el-tag>
    </template>
    <span v-else>-</span>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";

export interface IFrisRadioList {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface IFrisRadioProps {
  list: IFrisRadioList[];
  active: string | number;
  formatLabel?: boolean;
}

export default defineComponent({
  name: "FrRadio",
  props: {
    list: {
      type: Array as PropType<IFrisRadioList[]>,
      required: true,
    },
    active: {
      type: [String, Number],
      default: "",
    },
    disabled: { type: Boolean },
    formatLabel: { type: Boolean },
  },
  emits: ["update:active"],
  setup(props: IFrisRadioProps, context) {
    const changeActive = (item: string | number) => {
      context.emit("update:active", item);
    };

    return {
      changeActive,
    };
  },
});
</script>
<style lang="scss" scoped>
.fr-radio {
  .fr-radio-tag {
    transition: all 0.3s;
    min-height: 30px;
    height: 100%;
    line-height: 30px;
    font-size: $font-size-base;
    padding: 4px 16px;
    cursor: pointer;
    border-radius: 9px;

    &.el-tag--plain.el-tag--info {
      color: $color-text-placeholder;
      border-color: $border-color-base;
    }

    &.disabled {
      background-color: $element-disable-background;
      cursor: not-allowed;
    }

    &.el-tag--dark {
      &.disabled {
        color: $element-disable-font-color;
        border-color: $element-disable-border-color;
      }
    }

    .label-text {
      white-space: pre-line;
    }

    &.fr-radio-tag-foramt {
      line-height: 14px;
      padding: 10px 15px;
    }
  }
}
</style>
