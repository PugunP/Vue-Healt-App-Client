import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "",
    component: () => import("../views/router-template.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("../views/HomeView.vue"),
      },
      {
        path: "/about",
        name: "about",
        component: () => import("../views/AboutView.vue"),
      },
      {
        path: "/queue",
        name: "queue",
        component: () => import("../views/QueueApp/QueueView.vue"),
      },
      {
        path: "/health",
        name: "health",
        component: () => import("../views/HealthApp/HealthView.vue"),
      },
      {
        path: "/account-info",
        name: "account-info",
        component: () => import("../views/AccountApp/Account-info.vue"),
      },
      {
        path: "/account-edit",
        name: "account-edit",
        component: () => import("../views/AccountApp/Account-edit.vue"),
      },
    ],
  },
  {
    path: "/signin",
    name: "signin",
    component: () => import("../views/LoginApp/SigninView.vue"),
    meta: { reload: true },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/LoginApp/SignupView.vue"),
  },
  {
    path: "/",
    name: "",
    component: () => import("../views/AdminDashboardApp/router-template.vue"),
    children:[
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../views/AdminDashboardApp/Dashboard.vue"),
      },
      {
        path:"/dashboard/users",
        name: "User",
        component:() => import("../views/AdminDashboardApp/UserDashboard.vue"),
      },
      {
        path:"/dashboard/queue",
        name: "Queue",
        component:() => import("../views/AdminDashboardApp/QueueDashboard.vue"),
      },
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
