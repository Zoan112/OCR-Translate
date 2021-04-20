import { createRouter, createWebHistory } from "@ionic/vue-router";
import Home from "../views/Home.vue";
import Camera from "../views/Camera.vue";
import Login from "../views/Login.vue";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/home",
    name: "Home",
    component: Home
  },
  {
    path: "/Camera",
    name: "Camera",
    component: Camera
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
