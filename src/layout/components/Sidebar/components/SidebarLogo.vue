<template>
  <div class="logo-container">
    <transition name="logo-transition">
      <router-link v-if="collapse" class="wh-full flex-center" to="/">
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="logo-image" />
      </router-link>

      <router-link v-else class="wh-full flex-center" to="/">
        <img
          v-if="settingsStore.sidebarLogo"
          :src="logo"
          mode="aspectFit"
          class="logo-image mr-1 rounded-1"
        />
        <img
          v-if="settingsStore.sidebarLogo"
          :src="logoText"
          class="logo-text-image"
        />
        <!-- <span class="logo-title"> {{ defaultSettings.title }}</span> -->
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import defaultSettings from "@/settings";
import { useSettingsStore } from "@/store";
import logoImage from "@/assets/images/logo/xsniper-black-login.png";
import logoImageDark from "@/assets/images/logo/xsniper-black.png";
import logoTextImage from "@/assets/images/logo/xsniper-text.png";
import logoTextImageDark from "@/assets/images/logo/xsniper-text-black.png";

const settingsStore = useSettingsStore();

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

const logo = computed(() =>
  settingsStore.theme == "dark" ? logoImageDark : logoImage
);
const logoText = computed(() =>
  settingsStore.theme == "dark" ? logoTextImage : logoTextImageDark
);
</script>

<style lang="scss" scoped>
.logo-container {
  width: 100%;
  height: $navbar-height;
  background-color: $sidebar-logo-background;

  .logo-image {
    height: 38px;
  }

  .logo-text-image {
    height: 12px;
  }

  .logo-title {
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    color: white;
  }
}

.layout-top,
.layout-mix {
  .logo-container {
    width: $sidebar-width;
  }

  &.hideSidebar {
    .logo-container {
      width: $sidebar-width-collapsed;
    }
  }
}
</style>
