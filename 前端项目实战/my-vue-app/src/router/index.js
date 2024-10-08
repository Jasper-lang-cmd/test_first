import { createRouter, createWebHashHistory } from "vue-router";

// 指定路由规则
const routes = [
  {
    path: "/",
    name: "main",
    component: () => import("@/views/Main.vue"),
    // 重定位
    redirect: "/home",
    // 子路由
    children: [
      //   {
      //     path: "home",
      //     name: "home",
      //     component: () => import("@/views/Home.vue"),
      //   },
      //   {
      //     path: "user",
      //     name: "user",
      //     component: () => import("@/views/User.vue"),
      //   },
      //   {
      //     path: "mall",
      //     name: "mall",
      //     component: () => import("@/views/Mall.vue"),
      //   },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404.vue"),
  },
];

const router = createRouter({
  // 设置路由模式
  history: createWebHashHistory(),
  routes,
});

export default router;
