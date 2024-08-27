<template>
  <div class="info-box flex-x-between">
    <div
      class="flex flex-row items-center cursor-pointer flex-1"
      @click="toUserTweitterHome()"
    >
      <el-avatar
        :size="avatarSize"
        :src="detail.avatar"
      />
      <div
        class="flex flex-col justify-center ml-2"
        :class="showTime ? (miniWidth ? ' max-w-15' : ' max-w-30') : ''"
      >
        <div
          class="text-sm font-bold "
          :class="{ 'truncate ...': showTime }"
          :style="nameFontSize"
        >
          {{ detail.nickname || detail.name }}
        </div>
        <div
          class="text-xs text-slate-400 "
          :class="{ 'truncate ...': showTime }"
          :style="userNameFontSize"
        >
          {{
        showUserId ? '@' + (detail.userId || detail.id || detail.twitter_user_id) :
          '@' + (detail.username || detail.twitter_user_name)
      }}
        </div>
      </div>
      <div
        v-if="!miniWidth && showTag"
        class="type-tag ml-2 text-13px"
      >
        {{ "新" + statusList[detail.type] }}
      </div>
    </div>
    <div
      v-if="showTime"
      class="text-xs text-slate-400 w-20 text-right"
    >
      {{ dayjs(showTime).format("MM-DD HH:mm") }}
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { cloneDeep } from "lodash-es";
import dayjs from "dayjs";

const props = withDefaults(
  defineProps<{
    detail: any;
    avatarSize?: number;
    showUserId?: boolean;
    nameFontSize?: string;
    userNameFontSize?: string;
    containerWidth?: number;
    canJump?: boolean;
    showTag?: boolean;
  }>(),
  {
    detail: {},
    canJump: true,
    showTag: false,
    avatarSize: 36,
    containerWidth: 540,
  }
);

const statusList = inject("statusList", []) as any;
// console.error('>>>>>>>>>>>', statusList);
onMounted(() => { });

const { detail, containerWidth, canJump } = toRefs(props);

const miniWidth = computed(() => containerWidth.value < 400);

const emit = defineEmits(["update:modelValue", "refresh", "addUser"]);

const rowDetail = ref<any>();
rowDetail.value = cloneDeep(detail.value);

const showTime = computed(() => rowDetail.value.timeParsed || rowDetail.value.logTime)

const toUserTweitterHome = () => {
  if (!canJump.value) {
    return;
  }
  window.open("https://twitter.com/" + detail.value.username);
};
</script>

<style
  lang="scss"
  scoped
>
.info-box {
  /* font-family: "Work Sans", sans-serif; */
  font-optical-sizing: auto;
  /* font-family: "Roboto", sans-serif; */
  font-family: "Karla", sans-serif;
}

.type-tag {
  background: #f0f8ff;
  border-radius: 26px;
  padding: 2px 10px;
  color: var(--el-color-primary);
  font-weight: bold;
}
</style>
