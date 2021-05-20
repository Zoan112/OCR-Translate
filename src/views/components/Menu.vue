<template>
  <!--Menu-->

  <ion-menu
    side="end"
    menu-id="custom"
    class="my-custom-menu"
    content-id="content"
  >
    <!-- Header Menu-->
    <ion-header>
      <ion-toolbar class="menuTitles" color="primary">
        <ion-title>{{ userName }}</ion-title>
        <p class="userEmail">{{ userEmail }}</p>
        <ion-avatar class="userAvatar" slot="end">
          <img class="userAvatarImg" @click="closeMenu" :src="userAvatar" />
        </ion-avatar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <!--Sign out-->
        <ion-item lines="full" class="signOut" @click="signOut"
          >Sign Out</ion-item
        >

        <ion-item-group>
          <ion-item-divider size="large" color="">
            <ion-label class="savedTranslationLabel"
              ><ion-icon
                class="menuBookmark"
                size="large"
                :name="bookmark"
                :md="bookmark"
                :ios="bookmark"
              ></ion-icon
              >Saved:</ion-label
            >
          </ion-item-divider>

          <!--Saved items-->

          <span v-for="items in savedTranslations">
            <ion-item
              class="savedItems"
              @click.self="selectSavedItem(items.id)"
            >
              <span>
                <img
                  :src="'../assets/itemTag.svg'"
                  style="height: 23px;
    padding-right: 5px;
    vertical-align: bottom;
    position: relative;
    top: 5px;"
                />
              </span>
              &#160;{{ items.id }}
              <!--Delete Item-->
              <ion-button
                @click.self="deleteDoc(items.id)"
                size="large"
                slot="end"
                fill="outline"
                class="trash"
              >
                <ion-icon :name="trash" :md="trash" :ios="trash"></ion-icon
              ></ion-button>
            </ion-item>
          </span>
        </ion-item-group>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script>
import { defineComponent, ref } from "vue";

import { useRouter } from "vue-router";
import { bookmark, trash } from "ionicons/icons";

import firebase from "firebase/app";
import "firebase/auth";

import { base } from "@/composables/usePhotoGallery";
import globalToast from "@/composables/Toast";

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButton,
  IonAvatar,
  menuController,
  IonMenu,
  IonItem,
  IonList,
  IonItemGroup,
  IonLabel,
  IonItemDivider
} from "@ionic/vue";

export default defineComponent({
  props: [
    "savedTranslations",
    "userAvatar",
    "userName",
    "userEmail",
    "ocrRslt",
    "userUid"
  ],
  components: {
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonMenu,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonAvatar,
    IonItemGroup,
    IonItemDivider,
    IonLabel
  },
  setup(props, { emit }) {
    const router = useRouter();

    //SignOut
    const signOut = () => {
      firebase.auth().signOut();
      router.push({ path: "login" });
    };

    const closeMenu = () => {
      menuController.close("custom");
    };

    ///Stored transaltion
    // Select saved item

    const selectSavedItem = firestoreId => {
      console.log(props.savedTranslations);
      console.log(props.savedTranslations[0]);
      console.log(firestoreId);

      const result = props.savedTranslations.find(
        ({ id }) => id === firestoreId
      );
      base.value = result.image;
      emit("docSelection", result.ocrText, result.translatedText);
    };

    //
    //Delete Item
    const deleteDoc = firestoreId => {
      props.savedTranslations.value = [];
      console.log(firestoreId);
      console.log(props.userUid);
      console.log(props.userUid.value);

      firebase
        .firestore()
        .collection(props.userUid)
        .doc(firestoreId)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          globalToast("secondary", "Successfully deleted!");
        })
        .catch(error => {
          console.error("Error removing document: ", error);
        });
    };

    return { bookmark, trash, signOut, closeMenu, selectSavedItem, deleteDoc };
  }
});
</script>

<style scoped>
ion-item:hover {
  --background: #bdc3c7;
  cursor: pointer;
}

.userEmail {
  margin: 0px;
}

.menuTitles {
  text-align: center;
}

.trash {
  --background-hover: #3880ff;
  --background-hover-opacity: 0.5;
  --color-hover: white;
}

.menuBookmark {
  vertical-align: middle;
  color: #f7c920;
}

.savedTranslationLabel {
  font-size: 1.2em;

  text-decoration: underline;
  font-weight: 500;
}

.savedItems {
  --inner-padding-end: none;
}

.signOut {
  font-size: 1.1em;
  font-weight: 450;
  border-bottom: 2px solid #bdc3c7;
}

.userAvatar {
  padding: 5px;
}

.userAvatar:hover {
  cursor: pointer;
}

.userAvatarImg {
  border: 2px solid;
}
</style>
