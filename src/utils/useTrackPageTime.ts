import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { useGtag } from "vue-gtag-next";

export function useTrackPageTime() {
  // const pageStartTime = new Date().getTime();
  // const route = useRoute();
  // const { time } = useGtag()

  // const trackPageTime = () => {
  //   const pageEndTime = new Date().getTime();
  //   const pageTime = pageEndTime - pageStartTime;
  //   console.error('>>>>>>>>>>>>>页面停留时长', route.path, pageTime);
  //   time({
  //     name: route.path,
  //     value: pageTime,
  //     event_category: '页面停留时长',
  //   });
  // };

  // onBeforeRouteLeave((to, from, next) => {
  //   trackPageTime();
  //   next();
  // });
}