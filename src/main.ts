import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import { store } from "@/store";
// import VueGtag from "vue-gtag-next";

import "@/permission";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 本地SVG图标
import "virtual:svg-icons-register";

// 国际化
import i18n from "@/lang/index";

// 样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/index.scss";
import "@/assets/aliIcon/Iconfont.css";
import "uno.css";
import { setDomFontSize } from './utils/dom'

// px2rem resize
setDomFontSize()
// 统计页面停留时长

const app = createApp(App);
// 全局注册 状态管理(store)


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// app.use(VueGtag, {
//   // useDebugger: true,
//   property: {
//     id: "G-DEPYW304MH"
//   }
// });
app.use(store).use(router).use(i18n).mount("#app");
