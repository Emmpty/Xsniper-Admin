import type { App } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia();
// 持久化存储
store.use(piniaPluginPersistedstate)

export * from "./modules/app";
export * from "./modules/permission";
export * from "./modules/settings";
export * from "./modules/tagsView";
export * from "./modules/user";
export * from "./modules/vip";
export { store };
