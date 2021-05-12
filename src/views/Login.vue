<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>OCR-Translate</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <section id="firebaseui-auth-container"></section>

      <!-- Android Native log-in TODO!!!-->
      <!--
      <ion-button @click="googleSignIn">native sign-up</ion-button>
      <p>userdata:{{ userdata }}</p>-->
      <!--<p>
        For demo log-in, press sing-up with Email. <br />Credentials:
        <br />Email: ocrtranslate@protonmail.com <br />Password: ocrdemo
      </p>-->
    </ion-content>
  </ion-page>
</template>

<script>
import { onMounted, defineComponent, ref } from "vue";

import firebase from "firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

import "@codetrix-studio/capacitor-google-auth";
import { Plugins } from "@capacitor/core";
//Plugins.GoogleAuth.signIn();

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

    // Android native login TODO!
    /*  const userdata = ref("");

    const googleSignIn = async () => {
      let googleUser = await Plugins.GoogleAuth.signIn(null);
      /*const credential = auth.GoogleAuthProvider.credential(
        googleUser.authentication.idToken
      );*/
    /*
      userdata.value = googleUser;
      console.log(googleUser);
      console.log("from user");*/
    //return this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);
    /* };

    return { userdata, googleSignIn };*/
  }
});
</script>

<style scoped>
p {
  text-align: center;
}
</style>
