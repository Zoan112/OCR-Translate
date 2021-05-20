<template>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button>
      <ion-icon :name="add" :icon="add" :md="add"></ion-icon>
    </ion-fab-button>

    <ion-fab-list side="top">
      <ion-fab-button @click="takePhoto"
        ><ion-icon :icon="camera" :md="camera"></ion-icon
      ></ion-fab-button>
    </ion-fab-list>
  </ion-fab>
</template>

<script>
import { IonFab, IonFabButton, IonIcon, IonFabList } from "@ionic/vue";
import { add, camera } from "ionicons/icons";
import { defineComponent } from "@vue/runtime-core";
import { usePhotoGallery } from "@/composables/usePhotoGallery";
//import newPhoto()  from "../Home";

export default defineComponent({
  components: {
    IonFab,
    IonFabButton,
    IonIcon,
    IonFabList
  },
  setup() {
    const { takePhoto } = usePhotoGallery();

    // TakePhoto
    /*
    const newPhoto = () => {
      base.value = "";
      ocrRslt.value = "";
      translatedText.value = "";
      showAfterTranslate.value = false;
      takePhoto();
    };
*/
    return {
      IonFab,
      IonFabButton,
      IonIcon,
      IonFabList,
      add,
      camera,
      takePhoto
    };
  }
});
</script>

<style></style>
