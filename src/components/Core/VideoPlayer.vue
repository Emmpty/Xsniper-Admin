<template>
  <div
    class="template-video-pop-box"
    @click.stop.prevent
  >
    <video
      v-if="mediaType === 'video'"
      class="fileName"
      :src="mediaUrl"
      controls="controls"
    >视频加载失败</video>

    <el-image
      v-else
      class="fileName"
      :src="mediaUrl"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :preview-src-list="[mediaUrl]"
      :initial-index="0"
      fit="cover"
      @click.stop
    />
  </div>
</template>
<script>

export default defineComponent({
  props: {
    activeVideoUrl: {
      type: String,
      required: false
    },
    mediaType: {
      type: String,
      required: false
    },
  },
  setup(props) {
    const { activeVideoUrl } = toRefs(props)

    const mediaUrls = ref([])

    mediaUrls.value = activeVideoUrl.value && JSON.parse(activeVideoUrl.value).map((item) => item.URL)

    const mediaUrl = computed(() => mediaUrls.value[0])

    return {
      mediaUrl,
    }
  }
})
</script>
<style
  lang="scss"
  scoped
>
.template-video-pop-box {
  .fileName {
    max-width: 100%;
    // max-height: 200px;
    overflow: hidden;
  }
}
</style>