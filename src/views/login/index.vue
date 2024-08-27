<template>
  <div class="login-container">
    <!-- 登录表单 -->
    <el-card class="!border-none w-100 !bg-transparent !rounded-4% <sm:w-83">
      <div class="text-center relative flex-col flex-center ">
        <!-- <img
          class="w-25"
          src="@/assets/images/logo/xsniper-black-login.png"
          alt=""
        /> -->
        <img
          class="w-30 my-4"
          src="@/assets/images/logo/xsniper-text-black.png"
          alt=""
        />
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginData"
        :rules="loginRules"
        class="login-form mt-[16px]"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <div class="p-2">
            <svg-icon icon-class="user" />
          </div>
          <el-input
            ref="username"
            v-model="loginData.username"
            class="flex-1"
            size="large"
            placeholder="请输入账号"
            name="username"
          />
        </el-form-item>

        <!-- 密码 -->
        <el-tooltip
          :disabled="isCapslock === false"
          content="Caps lock is On"
          placement="right"
        >
          <el-form-item prop="password">
            <span class="p-2">
              <el-icon>
                <Lock />
              </el-icon>
            </span>
            <el-input
              v-model="loginData.password"
              class="flex-1"
              size="large"
              placeholder="请输入密码"
              :type="passwordVisible === false ? 'password' : 'input'"
              name="password"
              @keyup="checkCapslock"
              @keyup.enter="handleLogin"
            />
            <span
              class="mr-2"
              @click="passwordVisible = !passwordVisible"
            >
              <el-icon v-if="passwordVisible === false">
                <View />
              </el-icon>
              <el-icon v-else>
                <Hide />
              </el-icon>
            </span>
          </el-form-item>
        </el-tooltip>
        <el-button
          :loading="loading"
          type="primary"
          class="w-full h-[38px] mt-[16px] !rounded-[20px]"
          @click.prevent="handleLogin"
        >
          {{ $t("login.login") }}
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script
  setup
  lang="ts"
>
import router from "@/router";
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
import { useSettingsStore, useAppStore, useUserStore } from "@/store";
import { LoginParems } from "@/api/auth/types";

const route = useRoute();
const userStore = useUserStore();
const appStore = useAppStore();
/**
 * 根据屏幕宽度切换设备模式
 */
const WIDTH = 992; // 响应式布局容器固定宽度  大屏（>=1200px） 中屏（>=992px） 小屏（>=768px）
const { width } = useWindowSize();
watchEffect(() => {
  if (width.value < WIDTH) {
    appStore.toggleDevice("mobile");
  } else {
    appStore.toggleDevice("desktop");
  }
});

const loading = ref(false); // 按钮loading
const isCapslock = ref(false); // 是否大写锁定
const passwordVisible = ref(false); // 密码是否可见
const loginFormRef = ref(ElForm); // 登录表单ref

const loginData = ref<LoginParems>({
  username: "",
  password: "",
});

const { t } = useI18n();
const loginRules = computed(() => {
  const prefix = appStore.language === "en" ? "Please enter " : "请输入";
  return {
    username: [
      {
        required: true,
        trigger: "blur",
        message: `${prefix}${t("login.username")}`,
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        validator: (rule: any, value: any, callback: any) => {
          if (value.length < 6) {
            callback(new Error("The password can not be less than 6 digits"));
          } else {
            callback();
          }
        },
        message: `${prefix}${t("login.password")}`,
      },
    ],
  };
});

/**
 * 检查输入大小写状态
 */
function checkCapslock(e: any) {
  const { key } = e;
  isCapslock.value = key && key.length === 1 && key >= "A" && key <= "Z";
}

/**
 * 登录
 */
async function handleLogin() {
  try {
    await loginFormRef.value.validate()
  } catch (error) {
    return
  }
  loading.value = true
  try {
    await userStore.login(loginData.value)
    ElMessage({ message: '登录成功', showClose: true, type: 'success' })

    const query: LocationQuery = route.query;
    const redirect = (query.redirect as LocationQueryValue) ?? "/";
    const otherQueryParams = Object.keys(query).reduce(
      (acc: any, cur: string) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      },
      {}
    );
    console.error('-----------------redirect', redirect, otherQueryParams);
    router.push({ path: redirect, query: otherQueryParams });

  } catch (error) {
    console.error('登录失败', error);
    ElMessage({ message: '登录失败，请重试', showClose: true, type: 'error' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 主题初始化
  const theme = useSettingsStore().theme;
  useSettingsStore().changeSetting({ key: "theme", value: theme });
  if (theme == "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});
</script>

<style
  lang="scss"
  scoped
>
.dark .login-container {
  background: url("@/assets/images/login-bg-dark.jpg") no-repeat center right;
}

.login-container {
  overflow-y: auto;
  background: url("@/assets/images/login-bg.jpg") no-repeat center right;

  @apply wh-full flex-center;

  .login-form {
    padding: 10px;
  }
}

.el-form-item {
  background: var(--el-input-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
}

:deep(.el-input) {
  .el-input__wrapper {
    padding: 0;
    background-color: transparent;
    box-shadow: none;

    &.is-focus,
    &:hover {
      box-shadow: none !important;
    }

    input:-webkit-autofill {
      transition: background-color 1000s ease-in-out 0s;
      /* 通过延时渲染背景色变相去除背景颜色 */
    }
  }
}
</style>
