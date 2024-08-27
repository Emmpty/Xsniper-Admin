import { debounce } from 'lodash-es';

const BaseSize = 16; // 基准字体大小
const BASE_WIDTH = 1920; // 底图宽度
const MIN_WIDTH = 1200; // 最小宽度
const MAX_WIDTH = 2500; // 最大宽度改变字体计算方式的宽度
// 创建一个响应式的变量来保存浏览器可用高度
export const browserHeight = ref(window.innerHeight);

// 动态设置根元素字体大小以适配不同屏幕
export const setDomFontSize = (): void => {
  const width = document.documentElement.clientWidth || document.body.clientWidth;
  const scale = width / BASE_WIDTH
  // let fontSize;
  // if (width > MAX_WIDTH) {
  //   fontSize = `${(width / 100) * 0.95}px`;
  // } else {
  //   fontSize = `${Math.max(width, MIN_WIDTH) / 100}px`;
  // }
  const fontSize = BaseSize * Math.min(scale, 2) + 'px'
  console.log('Current width and font size:', width, fontSize);
  document.documentElement.style.fontSize = fontSize;
  browserHeight.value = window.innerHeight;
}

// 使用lodash的debounce函数来防抖
const setDomFontSizeDebounce = debounce(setDomFontSize, 400);

// 监听窗口大小变化，动态调整字体大小
window.addEventListener('resize', setDomFontSizeDebounce);
