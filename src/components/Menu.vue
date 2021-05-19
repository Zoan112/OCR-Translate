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
import { defineComponent } from "vue";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonCard,
  IonCardContent,
  IonTextarea,
  IonButton,
  IonDatetime,
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
    IonAvatar
  },
  setup() {
    const openMenu = () => {
      console.log("menu open");
      menuController.enable(true, "custom");
      menuController.open("custom");
    };
    return { openMenu };
  }
});
</script>

<style></style>
