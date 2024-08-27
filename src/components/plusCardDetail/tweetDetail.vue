<template>
  <div class="history-details text-sm">
    <div
      class="rounded-md text-sm cursor-pointer"
      @click.stop="toTweetDetails()"
    >
      <div
        ref="detailText"
        class="detail-text text-[15px] my-1 whitespace-pre-line"
      >
        <!-- :class="{ 'line-clamp-4': !expanded }" -->
        {{ getText(detail) }}
      </div>
      <!-- <el-button
        v-if="isOverflown"
        class="text-blue-500 hover:underline  font-bold"
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
      <template v-if="detail.quotedStatus || detail.retweetedStatus">
        <slot>
        </slot>
      </template>
      <template v-else>
        <el-row v-if="getMedia(detail)">
          <el-col :span="mediaCol">
            <videoPlayer
              class="mt-2"
              :mediaType="getMediaType"
              :activeVideoUrl="getMedia(detail)"
            />
          </el-col>
        </el-row>
      </template>

    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { cloneDeep } from 'lodash-es'
import { useSettingsStore } from "@/store";

const props = withDefaults(
  defineProps<{
    detail: any,
    mediaCol: number
  }>(),
  {
    detail: {},
    mediaCol: 24
  }
)

onMounted(() => {
  checkOverflow()
})

const settingsStore = useSettingsStore();

const { detail, mediaCol } = toRefs(props)
const emit = defineEmits(['update:modelValue', 'refresh', 'addUser'])

const rowDetail = ref<any>()
rowDetail.value = cloneDeep(detail.value)

const detailText = ref()
const expanded = ref(false);
const isOverflown = ref(false);

const getMediaType = computed(() => (detail.value.photos || (detail.value.target && detail.value.target.photos)) ? 'photos' : 'video')
const checkOverflow = () => {
  if (detailText.value.scrollHeight > detailText.value.clientHeight) {
    isOverflown.value = true;
  } else {
    isOverflown.value = false;
  }
};

const expandText = () => {
  expanded.value = !expanded.value
};

watch(() => detailText.value, checkOverflow);

const toTweetDetails = () => {
  let obj = detail.value && (detail.value.quotedStatus || detail.value.target || detail.value) || {}
  if (obj) {
    let tweetUrl = obj.permanentUrl
    console.log('>>>>>>>>>>>tweetUrl', tweetUrl, obj);
    window.open(tweetUrl)
  }
}

const getText = (detail: any) => {
  if (detail.target) {
    return detail.target.text
  } else {
    return detail.text || ''
  }
}

const getMedia = (detail: any) => {
  if (detail.target) {
    return detail.target.photos || detail.target.videos || detail.target.gifs
  } else {
    return detail.photos || detail.videos || detail.gifs
  }
}
</script>

<style
  lang="scss"
  scoped
>
.history-details {
  .detail-text {
    word-break: break-all;
    text-overflow: ellipsis;
    font-family: "Work Sans", sans-serif;

    font-optical-sizing: auto;
    line-height: 26px;
  }
}
</style>
