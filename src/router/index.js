import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ChatView from "../views/ChatView.vue";
import { isAuth } from "../middleware/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: LoginView,
      beforeEnter: isAuth,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      beforeEnter: isAuth,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      beforeEnter: isAuth,
    },
    {
      path: "/chat",
      name: "chat",
      component: ChatView,
      beforeEnter: isAuth,
    },
  ],
});

export default router;
