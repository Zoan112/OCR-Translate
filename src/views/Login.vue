<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>OCR-Translate</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <section id="firebaseui-auth-container"></section>
    </ion-content>
  </ion-page>
</template>

<script>
import { onMounted, defineComponent } from "vue";

import firebase from "firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonContent
} from "@ionic/vue";

export default defineComponent({
  name: "Login",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonPage,
    IonContent
  },

  setup() {
    onMounted(() => {
      console.log(firebaseui);
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      var uiConfig = {
        signInSuccessUrl: "/home",
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
      };
      ui.start("#firebaseui-auth-container", uiConfig);
    });

    return {};
  }
});
</script>

<style></style>
