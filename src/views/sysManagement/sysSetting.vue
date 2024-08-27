<template>
  <div class="container-box">
    <el-card
      shadow="always"
      v-loading="isLoading"
    >
      <el-form
        label-width="80px"
        ref="formRef"
        class="save"
        :model="settingData"
        :rules="rules"
      >
        <el-row :gutter="36">
          <el-col :span="24">
            <fr-form-group-title title="关注数量设置" />
          </el-col>
          <template
            v-for="(props, key) in focusProps"
            :key="key"
          >
            <form-input
              v-model:value="settingData.focus[key]"
              :props="props"
            />
          </template>
          <el-col :span="24">
            <fr-form-group-title
              class="!mt-4"
              title="关键词数量设置"
            />
          </el-col>
          <template
            v-for="(props, key) in keywordsProps"
            :key="key"
          >
            <form-input
              v-model:value="settingData.keywords[key]"
              :props="props"
            />
          </template>
        </el-row>
        <el-button
          class="page-save-btn"
          type="primary"
          style="width: 248px"
          @click="saveConfig"
        >
          保存
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { FetchSystemSetting } from "@/api/system";
import type { FormInstance } from "element-plus";
import { validatePositiveInteger } from "@/utils/form";

const formRef = ref<FormInstance | null>(null);
const isLoading = ref(false);

const settingData = ref({
  focus: {
    general: 10,
    vip: 100,
    svip: 500,
  },
  keywords: {
    general: 10,
    vip: 100,
    svip: 500,
  },
});

const rules = {
  "focus.general": [{ validator: validatePositiveInteger, trigger: "blur" }],
  "focus.vip": [{ validator: validatePositiveInteger, trigger: "blur" }],
  "focus.svip": [{ validator: validatePositiveInteger, trigger: "blur" }],
  "keywords.general": [{ validator: validatePositiveInteger, trigger: "blur" }],
  "keywords.vip": [{ validator: validatePositiveInteger, trigger: "blur" }],
  "keywords.svip": [{ validator: validatePositiveInteger, trigger: "blur" }],
};

const commonInputProps = {
  colProps: { span: 4 },
  inputProps: { placeholder: "请输入数量", class: "long" },
  // inputEvents: {
  //   // 格式化为正整数
  //   input: (val: any) => {
  //     const integerValue = val.replace(/[^\d]/g, '');
  //     rowDetail.value.number = integerValue === '' ? 1 : parseInt(integerValue, 10);
  //     console.log('>>>>>>>>>>>>', rowDetail.value.number);
  //   },
  //   // 选中输入框内的文本
  //   focus: (event: any) => {
  //     event.target.select();
  //   }
  // }
};

const focusProps = {
  general: { ...commonInputProps, prop: "focus.general", label: '普通用户' },
  vip: { ...commonInputProps, prop: "focus.vip", label: 'VIP' },
  svip: { ...commonInputProps, prop: "focus.svip", label: 'SVIP' },
};

const keywordsProps = {
  general: { ...commonInputProps, prop: "keywords.general", label: '普通用户' },
  vip: { ...commonInputProps, prop: "keywords.vip", label: 'VIP' },
  svip: { ...commonInputProps, prop: "keywords.svip", label: 'SVIP' },
};

const getConfig = async () => {
  try {
    const { code, result } = await FetchSystemSetting({});
    if (code === 200) {
      settingData.value = result
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const saveConfig = async () => {
  try {
    await formRef.value!.validate()
  } catch (error) {
    console.error(error);
    return
  }
  try {
    isLoading.value = true;
    const res = await FetchSystemSetting(settingData.value);
    if (res.code === 200) {
      ElMessage({ message: "保存成功", showClose: true, type: "success" });
      getConfig();
    }
  } catch (error) {
    ElMessage({ message: "保存失败", showClose: true, type: "error" });
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  isLoading.value = true;
  await getConfig();
});
</script>

<style
  lang="scss"
  scoped
>
.container-box {
  position: relative;
  border-radius: 15px;

  .el-card {
    border-radius: 15px;
  }
}
</style>
