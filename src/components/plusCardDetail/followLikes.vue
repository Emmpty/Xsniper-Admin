<template>
  <div class="history-details mt-4">
    <div
      v-if="miniWidth && showTag"
      class="type-tag my-2 text-[13px]"
    >
      {{ "新" + statusList[detail.type] }}
    </div>
    <div
      class="rounded-md p-2 flex-col items-center"
      :style="{
        backgroundColor:
          settingsStore.theme == 'light'
            ? 'var(--el-bg-color-page)'
            : 'bg-slate-700',
      }"
    >
      <panelUserInfo
        :avatarSize="40"
        nameFontSize="font-size: 14px"
        userNameFontSize="font-size: 14px"
        :detail="detail"
      />
      <div
        class="cursor-pointer"
        @click.prevent.stop="toTweetDetails()"
      >
        <div
          ref="detailText"
          class="detail-text text-[15px] my-1 whitespace-pre-line"
        >
          <!-- :class="{ 'line-clamp-2': !expanded }" -->
          {{ getText(detail) }}
        </div>
        <!-- <el-button
          v-if="isOverflown"
          class="text-blue-500 hover:underline mb-4 font-bold"
          type="primary"
          link
          @click.stop="expandText"
        >
          {{ !expanded ? '展开' : '折叠' }}
          <el-icon
            v-if="!expanded"
            class="ml-1 -mt-0.5"
          >
            <ArrowDownBold />
          </el-icon>
          <el-icon
            v-else
            class="ml-1 -mt-0.5"
          >
            <ArrowUpBold />
          </el-icon>
        </el-button> -->

        <el-row v-if="(detail.photos || detail.videos) && detail.type != 0">
          <el-col :span="mediaCol">
            <videoPlayer
              :mediaType="detail.photos ? 'photos' : 'video'"
              :activeVideoUrl="detail.photos || detail.videos"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { cloneDeep } from "lodash-es";
import { useSettingsStore } from "@/store";

const props = withDefaults(
  defineProps<{
    detail: any;
    mediaCol: number;
    containerWidth?: number;
    showTag?: boolean;
  }>(),
  {
    detail: {},
    mediaCol: 24,
    showTag: false,
    containerWidth: 540,
  }
);

onMounted(() => { });

const statusList = inject("statusList") as any;
const settingsStore = useSettingsStore();

const { detail, mediaCol, containerWidth } = toRefs(props);

const detailText = ref();
const expanded = ref(false);
const isOverflown = ref(false);

const miniWidth = computed(() => containerWidth.value < 400);

const getText = (detail: any) => {
  return detail.text || (detail.quotedStatus && detail.quotedStatus.text) || "";
};

const checkOverflow = () => {
  if (detailText.value.scrollHeight > detailText.value.clientHeight) {
    isOverflown.value = true;
  } else {
    isOverflown.value = false;
  }
};

const expandText = () => {
  expanded.value = !expanded.value;
};

watch(() => detailText.value, checkOverflow);

const toTweetDetails = () => {
  if (detail.value.permanentUrl || detail.value.quotedStatus) {
    let tweetUrl =
      detail.value.permanentUrl || detail.value.quotedStatus.permanentUrl;
    window.open(tweetUrl);
  }
};
</script>

<style
  lang="scss"
  scoped
>
.history-details {
  font-family: Verdana, sans-serif;

  .detail-text {
    word-break: break-all;
    text-overflow: ellipsis;
  }
}

.type-tag {
  width: 65px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: #f0f8ff;
  border-radius: 26px;
  color: var(--el-color-primary);
  font-weight: bold;
}
</style>
