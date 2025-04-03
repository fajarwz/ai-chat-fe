import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "../views/LoginPage.vue";
import ChatPage from "../views/ChatPage.vue";
import HomePage from "../views/HomePage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import MyProfile from "../views/MyProfile.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
    { path: "/", component: HomePage, meta: { requiresAuth: true } },
    { path: "/chat", component: ChatPage, meta: { requiresAuth: true } },
    { path: "/my-profile", component: MyProfile, meta: { requiresAuth: true } },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router
