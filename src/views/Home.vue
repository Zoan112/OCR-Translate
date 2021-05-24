<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-icon
          slot="start"
          class="logo"
          :src="'../assets/language.svg'"
        ></ion-icon>
        <ion-title slot="start">OCR-Translate</ion-title>

        <ion-icon
          class="hamburgerMenu"
          @click="openMenu"
          slot="end"
          name="menu"
          :md="menu"
        ></ion-icon>
      </ion-toolbar>
    </ion-header>

    <!-- :savedTranslations="savedTranslations"-->

    <Menu
      :userName="userName"
      :userEmail="userEmail"
      :userUid="userUid"
      v-if="userUid"
      :userAvatar="userAvatar"
      @docSelection="onDocSelection"
    />

    <ion-content
      :fullscreen="false"
      class="has-header"
      id="content"
      style="background-color:#86868630;"
    >
      <!-- FAB Add button  -->
      <Fab />

      <!--  Container -->
      <Card
        :fetchedOcrRslt="fetchedOcrRslt"
        :translatedText="translatedText"
        :photo="photo"
      />
    </ion-content>
  </ion-page>
</template>

<script>
/* eslint-disable */

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButton,
  menuController
} from "@ionic/vue";

import { defineComponent, ref, watch, watchEffect, onMounted } from "vue";

import { menu } from "ionicons/icons";

import { base } from "@/composables/usePhotoGallery";
import firebase from "firebase";

//Import components
import Menu from "../views/components/Menu";
import Card from "../views/components/Card.vue";
import Fab from "../views/components/Fab";

export default defineComponent({
  name: "Home",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonButton,
    Menu,
    Fab,
    Card
  },
  setup() {
    ///Global VARS
    const fetchedOcrRslt = ref("www");
    const translatedText = ref("xxx");
    const photo = ref("");

    ///user auth

    //Firebase auth var declair

    const userAvatar = ref(null);
    const userName = ref(null);
    const userEmail = ref(null);
    const userUid = ref(null);

    //Default user avatar. (if user as no avatar)
    userAvatar.value = "../assets/avatar.svg";

    ///Auth
    onMounted(() => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log(user.displayName);
          userName.value = user.displayName;
          userAvatar.value = user.photoURL;
          console.log(userAvatar.value);
          userEmail.value = user.email;
          userUid.value = user.uid;
          // retriveFirestore();
          if (userAvatar.value == null) {
            userAvatar.value = "../assets/avatar.svg";
            console.log("userAvatar.value == null");
          }
          console.log(userAvatar.value);
        } else {
          // No user is signed in.
          console.log("not logged", user);
        }
      });
    });

    //Menu
    const openMenu = () => {
      console.log("menu open");
      menuController.enable(true, "custom");
      menuController.open("custom");
    };

    //Emit from Menu when a doc is selected.
    const onDocSelection = (ocrText, transText, image) => {
      console.log("emit");

      fetchedOcrRslt.value = ocrText;
      translatedText.value = transText;
      photo.value = image;

      console.log(ocrText, transText, image);
    };

    return {
      base,
      //Icons:
      menu,

      //Props for card:
      fetchedOcrRslt,
      translatedText,
      photo,

      //Props for menu:
      //Auth:
      userName,
      userAvatar,
      openMenu,
      userEmail,
      userUid,
      //Emit from Menu:
      onDocSelection,
      ///Components:
      Menu,
      Fab,
      Card
    };
  }
});
</script>

<style scoped>
ion-title {
  padding: 0px;
}

.logo {
  font-size: 45px;
}

.hamburgerMenu:hover {
  cursor: pointer;
  color: gray;
}

.hamburgerMenu {
  font-size: 60px;
}
</style>
