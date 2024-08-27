import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { trackRouter } from "vue-gtag-next";

export const Layout = () => import("@/layout/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },

  {
    path: "/",
    redirect: "/user",
    component: Layout,
    children: [
      {
        path: "user",
        name: "User",
        meta: {
          affix: true,
          icon: "icon-guanzhu-weiguanzhu",
          title: "用户列表",
          keepAlive: true,
          alwaysShow: false,
        },
        component: () => import("@/views/userManagement/index.vue"),
        children: [

        ],
      },
      {
        path: "/user/userdetails",
        name: "UserDetails",
        component: () => import("@/views/userManagement/userDetails.vue"),
        meta: {
          icon: "icon-guanjianci",
          title: "用户详情",
          hidden: true,
          showBack: true,
        },
      },
    ],
  },
  {
    path: "/recommend",
    name: "recommend",
    component: Layout,
    redirect: "/recommend",
    children: [
      {
        path: "/recommend",
        name: "recommend",
        component: () => import("@/views/sysManagement/recommend.vue"),
        meta: {
          icon: "icon-tuisonglishi",
          title: "推荐列表",
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/push-record",
    name: "pushRecord",
    component: Layout,
    redirect: "/push-record",
    children: [
      {
        path: "/push-record",
        name: "pushRecord",
        component: () => import("@/views/pushManagement/pushRecord.vue"),
        meta: {
          icon: "icon-tuisonglishi",
          title: "推送记录",
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/sys-setting",
    redirect: "/sys-setting",
    component: Layout,
    meta: {
      icon: "icon-guanzhu-weiguanzhu",
      title: "平台管理",
    },
    children: [
      {
        path: "sys-setting",
        name: "SysSetting",
        meta: {
          affix: true,
          icon: "icon-guanzhu-weiguanzhu",
          title: "平台设置",
          keepAlive: true,
          alwaysShow: false,
        },
        component: () => import("@/views/sysManagement/sysSetting.vue"),
      },
      {
        path: "/accountPool",
        name: "AccountPool",
        component: () => import("@/views/sysManagement/accountPool.vue"),
        meta: {
          icon: "icon-guanjianci",
          title: "账号池",
          keepAlive: true,
        },
      },
      {
        path: "/announcement",
        name: "Announcement",
        component: () => import("@/views/sysManagement/announcement.vue"),
        meta: {
          icon: "icon-guanjianci",
          title: "公告管理",
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/financial-management",
    redirect: "/financial-management",
    component: Layout,
    meta: {
      icon: "icon-guanzhu-weiguanzhu",
      title: "财务管理",
    },
    children: [
      {
        path: "order",
        name: "Order",
        meta: {
          affix: true,
          icon: "icon-guanzhu-weiguanzhu",
          title: "订单列表",
          keepAlive: true,
          alwaysShow: false,
        },
        component: () => import("@/views/financialManagement/order.vue"),
      },
      {
        path: "/withdraw",
        name: "Withdraw",
        component: () => import("@/views/financialManagement/withdraw.vue"),
        meta: {
          icon: "icon-guanjianci",
          title: "提现申请",
          keepAlive: true,
        },
      },
      {
        path: "/discountCode",
        name: "DiscountCode",
        component: () => import("@/views/financialManagement/discountCode.vue"),
        meta: {
          icon: "icon-guanjianci",
          title: "折扣码管理",
          keepAlive: true,
        },
      },
      {
        path: "/redeemCode",
        name: "RedeemCode",
        component: () => import("@/views/financialManagement/redeemCode.vue"),
        meta: {
          icon: "icon-guanjianci",
          title: "兑换码管理",
          keepAlive: true,
        },
      },
    ],
  },
  // 外部链接
  // {
  //   path: "/external-link",
  //   component: Layout,
  //   children: [{
  //     redirect: "/external-link",
  //     path: "https://docs.xsniper.ai",
  //     meta: { title: "帮助中心", icon: "icon-bangzhuzhongxin", hidden: false },
  //   },
  //   ],
  // },
  {
    path: "/401",
    component: () => import("@/views/error-page/401.vue"),
    meta: { hidden: true },
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: { hidden: true },
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

trackRouter(router);

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
