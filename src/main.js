// Above the createApp() line
import { defineCustomElements } from "@ionic/pwa-elements/loader";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { IonicVue } from "@ionic/vue";

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/* Firebase Import*/
import firebase from "firebase/app";
import "firebase/functions";
import firebaseui from "firebaseui";

firebase.initializeApp({
  apiKey: "AIzaSyAraqP78ELsXF2ckhG0WfeJd0DUT_aI9pg",
  authDomain: "fir-functions-8307b.firebaseapp.com",
  projectId: "fir-functions-8307b",
  storageBucket: "fir-functions-8307b.appspot.com",
  messagingSenderId: "326340236602",
  appId: "1:326340236602:web:dc85ff32bcadc31d36ac03"
});
let app = "";

/*
const app = createApp(App)
  .use(IonicVue)
  .use(router);

router.isReady().then(() => {
  app.mount("#app");
});
*/
const googleFunc = firebase.functions();

export default googleFunc + firebase;
console.log("from main", googleFunc);
console.log("from main firebase auth", firebase.auth());
console.log("from main firebase auth", firebase.auth().onAuthStateChanged);

firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    console.log(user);
    //  console.log(firebase.auth().currentUser);
    app = createApp(App)
      .use(IonicVue)
      .use(router);
    router.isReady().then(() => {
      app.mount("#app");
    });
  }
});

/*
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log(user);
    console.log(user.displayName);
  } else {
    // No user is signed in.
    console.log("not lodged", user);
  }
});
*/
