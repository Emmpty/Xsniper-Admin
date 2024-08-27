<template>
  <div :class="['fr-form-group-title', 'text-[18px]']">
    <!-- <i class="iconfont icon-juxing"></i> -->
    <img
      class="form-group-img mr-3"
      src="@/assets/images/panel/draggable.png"
      alt=""
    />
    <span
      v-if="required"
      class="required"
    >*</span>
    <span class="content">{{ title }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "FrFormGroupTitle",
  props: {
    title: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style
  lang="scss"
  scoped
>
.fr-form-group-title {
  height: 22px;
  position: relative;
  margin-bottom: 16px;
  font-weight: 700;
  // color: $font-color-black;
  display: flex;
  align-items: center;

  .form-group-img {
    width: 0.9rem;
  }

  .iconfont {
    font-size: 14px;
    margin-right: 6px;
    color: var(--el-color-primary);
    margin-left: -2px;
  }

  .content {
    &::after {
      content: "";
      display: inline-block;
      width: 0;
      height: 100%;
      vertical-align: middle;
      margin-top: 3px;
    }
  }

  .required {
    color: $color-red;
    transform: translate(-3px, -3px);
  }
}
</style>
