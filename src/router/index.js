import { createRouter, createWebHistory } from "@ionic/vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";

const routes = [
  {
    path: "/:catchAll(.*)",
    redirect: "/login"
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true }
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

//ToDO need to be automaticly imported from main js//
import firebase from "firebase";

console.log("each");
router.beforeEach(async (to, from, next) => {
  console.log("router");
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !(await firebase.auth().currentUser)) {
    next("login");
  } else {
    next();
  }
});

export default router;
