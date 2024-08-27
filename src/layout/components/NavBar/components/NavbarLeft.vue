<template>
  <div class="flex">
    <template v-if="showBack">
      <el-page-header @back="goBack">
        <template #content>
          <breadcrumb />
        </template>
      </el-page-header>
    </template>
    <template v-else>
      <breadcrumb />
    </template>
  </div>
</template>

<script
  setup
  lang="ts"
>
const router = useRouter();
const currRoute = useRoute();
const showBack = computed(() => currRoute.meta.showBack)

const goBack = () => {
  router.go(-1);
}

</script>
