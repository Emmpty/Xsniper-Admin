<template>
  <div class="container-box">
    <el-card
      shadow="always"
      v-loading="isLoading"
    >
      <div class="flex flex-row">
        <div class="flex flex-col w-[160px] left-tab">
          <div
            class="tab-item text-[16px] font-bold text-right pr-[32px] pb-[20px] cursor-pointer duration-300"
            :class="{ ' text-[#409eff]': currentTabkey == item.key }"
            v-for="(item, index) in tabsList"
            :key="item.label"
            @click="changeTab(item)"
          >
            {{ item.label }}
          </div>
        </div>
        <div class="flex-1 pl-[32px]">
          <div class="header !mb-0">
            <fr-form-group-title title="账号池信息" />
          </div>
          <div class="flex flex-col pl-[11px] text-[15px]">
            <div class="flex flex-row  items-center">
              <span class="w-[120px] text-right">账号池总量：</span>
              <span class="w-[120px] text-left"> {{ currentSettingData.accounts_total }}</span>
              <el-upload
                v-show="currentTabkey == 'pool'"
                v-model:file-list="fileList"
                ref="uploadRef"
                class="flex"
                accept=".xls,.xlsx"
                :action="baseUrl + '/backadmin/platform_import_account'"
                :limit="1"
                :headers="uploadHeaders"
                :auto-upload="false"
                :on-exceed="handleExceed"
                @success="handleUploadSuccess"
                @error="handleUploadError"
              >
                <template #trigger>
                  <el-button
                    class="ml-[50px]"
                    type="primary"
                    size="small"
                  >
                    导入账号
                  </el-button>
                </template>
              </el-upload>
            </div>
            <div class="flex flex-row  items-center mt-[6px]">
              <span class="w-[120px] text-right">工作中：</span>
              <span class="w-[120px] text-left"> {{ currentSettingData.works }}</span>
            </div>
            <div
              class="flex flex-row  items-center mt-[6px]"
              v-for="(item, index) in settingStateList"
              :key="item.label"
            >
              <span class="w-[120px] text-right">{{ item.label }}：</span>
              <span class="w-[120px] text-left"> {{ currentSettingData[item.key] }}</span>
              <AccountPoolBtn
                :excelName="`${currentTabLabel} - ${item.label}`"
                :poolKey="currentTabkey"
                :flagKey="item.flagKey"
                @refresh="refreshHandle"
              />
            </div>
          </div>
          <template v-if="currentTabkey == 'pool'">
            <div class="header mt-[32px] !mb-0">
              <fr-form-group-title title="代理IP信息" />
            </div>
            <div class="flex flex-col pl-[11px] text-[15px]">
              <div class="flex flex-row  items-center">
                <span class="w-[120px] text-right">代理IP总量：</span>
                <span class="w-[120px] text-left"> {{ currentSettingData.proxy_total }}</span>
                <el-upload
                  v-show="currentTabkey == 'pool'"
                  v-model:file-list="fileProxyList"
                  ref="uploadProxyRef"
                  class="flex"
                  accept=".xls,.xlsx"
                  :action="baseUrl + '/backadmin/platform_import_account'"
                  :limit="1"
                  :headers="uploadHeaders"
                  :auto-upload="false"
                  :data="{ proxy: '0' }"
                  :on-exceed="handleExceedProxy"
                  @success="handleUploadSuccess"
                  @error="handleUploadError"
                >
                  <template #trigger>
                    <el-button
                      class="ml-[50px]"
                      type="primary"
                      size="small"
                    >
                      导入账号
                    </el-button>
                  </template>
                </el-upload>
              </div>
              <div
                class="flex flex-row  items-center mt-[6px]"
                v-for="(item, index) in proxyStateList"
                :key="item.label"
              >
                <span class="w-[120px] text-right">{{ item.label }}：</span>
                <span class="w-[120px] text-left"> {{ currentSettingData[item.key] }}</span>
                <AccountPoolBtn
                  :excelName="`${currentTabLabel} - ${item.label}`"
                  :poolKey="currentTabkey"
                  :flagKey="item.flagKey"
                  proxy="0"
                  @refresh="refreshHandle"
                />
              </div>
            </div>
          </template>
          <el-form
            label-width="120px"
            ref="formRef"
            class="save"
            :model="currentSettingData"
            :rules="rules"
          >
            <el-row :gutter="0">
              <el-col :span="24">
                <fr-form-group-title
                  class="!mt-[32px]"
                  title="账号池设置"
                />
              </el-col>
            </el-row>
            <template
              v-for="(props, key) in poolProps"
              :key="key"
            >
              <el-row :gutter="0">
                <form-input
                  v-model:value="currentSettingData[key]"
                  :props="props"
                />
              </el-row>
            </template>
            <form-radio
              v-model:active="currentSettingData.enable"
              :props="enableRadioProps"
            />
            <el-button
              class="page-save-btn"
              type="primary"
              style="width: 248px"
              @click="handleSubmit"
            >
              保存
            </el-button>
          </el-form>
        </div>
      </div>

    </el-card>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { set } from 'lodash-es';
import { genFileId } from 'element-plus'
import type { FormInstance, UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { debounce } from 'lodash-es';
import { FetchAccountPool, FetchSystemSetting } from "@/api/system";
import { validatePositiveInteger } from "@/utils/form";
import AccountPoolBtn from "./component/accountPool/AccountPoolBtn.vue";

const baseUrl = import.meta.env.VITE_APP_BASE_API
const formRef = ref<FormInstance | null>(null);
const uploadRef = ref<UploadInstance>()
const uploadProxyRef = ref<UploadInstance>()
const fileList = ref([]);
const fileProxyList = ref([]);
const uploadHeaders = ref({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
})
const isLoading = ref(false);
const currentTabLabel = ref('账号池总览')
const currentTabkey = ref('pool')
const tabsList = ref([
  { label: "账号池总览", key: "pool" },
  { label: "个人资料账号池", key: "user" },
  { label: "推文账号池", key: "tweet" },
  { label: "关注账号池", key: "follow" },
  { label: "关键词账号池", key: "keyword" },
])
const poolData = ref<any>()
const child_pool = ref<any>({
  user: {},
  tweet: {},
  follow: {},
  keyword: {}
})
const settingData = ref<any>({
  pool: {},
  user: {},
  tweet: {},
  follow: {},
  keyword: {}
});
const settingStateList = [
  { key: 'login_error', label: '登录错误', flagKey: 2 }, { key: 'token_expiration', label: 'token 过期', flagKey: 3 },
  { key: 'proxy_error', label: '代理错误', flagKey: 7 }, { key: 'api_limit', label: 'api受限', flagKey: 4 },
  { key: 'disable', label: '封禁', flagKey: 5 }, { key: 'wrong_account_password', label: '账号密码错误', flagKey: 6 },
  { key: 'account_error', label: '账号错误', flagKey: 8 },
]
const proxyStateList = [
  { key: 'proxy_works', label: '可用代理IP数量', flagKey: 1 }, { key: 'proxy_failure', label: '失效代理IP数量', flagKey: 2 },
]
const enableRadioProps = {
  list: [{ label: '开启', value: 1 }, { label: '关闭', value: 0 }],
  label: "账号池状态",
  prop: "enable",
  colProps: { span: 8 },
};
const commonInputProps = {
  colProps: { span: 8 },
  inputProps: { placeholder: "请输入正整数", class: "long" },

};

const currentSettingData = computed(() => {
  if (currentTabkey.value == 'pool') {
    return settingData.value.pool
  } else {
    return settingData.value.child_pool[currentTabkey.value]
  }
})
const poolProps = computed(() => {
  if (currentTabkey.value == 'pool') {
    return {
      thread_number: { ...commonInputProps, prop: "thread_number", label: '获取线程并发数' },
    }
  } else {
    return {
      weights: { ...commonInputProps, prop: "weights", label: '账号池权重' },
      timer: { ...commonInputProps, prop: "timer", label: '定时爬取数据/秒' },
      thread_number: { ...commonInputProps, prop: "thread_number", label: '获取线程并发数' },
      use_limit: { ...commonInputProps, prop: "use_limit", label: '账号使用限制' },
      use_limit_sec: { ...commonInputProps, prop: "use_limit_sec", label: '账号使用限制休眠时长/秒', formProps: { labelWidth: 170 } },
      rate_sec: { ...commonInputProps, prop: "rate_sec", label: '账号每使用一次休眠时长/秒', formProps: { labelWidth: 200 } },
    };
  }
})

const rules = {
  thread_number: [{ validator: validatePositiveInteger, trigger: "blur" }],
  weights: [{ validator: validatePositiveInteger, trigger: "blur" }],
  timer: [{ validator: validatePositiveInteger, trigger: "blur" }],
  use_limit: [{ validator: validatePositiveInteger, trigger: "blur" }],
  use_limit_sec: [{ validator: validatePositiveInteger, trigger: "blur" }],
  rate_sec: [{ validator: validatePositiveInteger, trigger: "blur" }],
};

const getConfig = async () => {
  try {
    const { code, result } = await FetchAccountPool({});
    if (code === 200) {
      poolData.value = result.pool
      child_pool.value = result.child_pool
      settingData.value = result
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const saveConfig = debounce(async () => {
  try {
    isLoading.value = true;
    const params = new URLSearchParams(settingData.value);
    const parsedData = {}
    for (const [key, value] of params.entries()) {
      const keys = key.replace(/\]/g, '').split('[');
      set(parsedData, keys, value);
    }
    const res = await FetchSystemSetting(settingData.value);
    if (res.code === 200) {
      ElMessage({ message: "保存成功", showClose: true, type: "success" });
      fileList.value = []
      fileProxyList.value = []
      getConfig();
    }
  } catch (error) {
    ElMessage({ message: "保存失败", showClose: true, type: "error" });
    console.error(error);
  } finally {
    isLoading.value = false
  }
}, 300);

const changeTab = (item: any) => {
  currentTabLabel.value = item.label
  currentTabkey.value = item.key
}

const refreshHandle = async () => {
  isLoading.value = true;
  await getConfig();
}

const handleSubmit = async () => {
  const validate = await formRef.value!.validate();
  if (validate) {
    try {
      isLoading.value = true;
      const hasFileToUpload = fileList.value.length !== 0 || fileProxyList.value.length !== 0;
      if (hasFileToUpload) {
        if (fileList.value.length !== 0) {
          uploadRef.value!.submit();
        }
        if (fileProxyList.value.length !== 0) {
          uploadProxyRef.value!.submit();
        }
        return
      }
      saveConfig()
    } catch (error) {
      isLoading.value = false
      ElMessage({ message: "保存失败", showClose: true, type: "error" });
      console.error(error);
    }
  }
}

const handleUploadSuccess = async () => {
  saveConfig()
};

const handleUploadError = () => {
  ElMessage({ message: "文件上传失败", showClose: true, type: "error" });
  isLoading.value = false;
};

const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}
const handleExceedProxy: UploadProps['onExceed'] = (files) => {
  uploadProxyRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadProxyRef.value!.handleStart(file)
}


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

  .left-tab {
    border-right: 2px solid #E4E7ED;
  }

  .right-tab {
    border: 2px solid #e0e0e0;
    border-radius: 15px;
    padding: 20px;
    margin-left: 20px;
  }
}
</style>
