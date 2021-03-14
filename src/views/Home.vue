<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>OCR-Translate</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">WWW</ion-title>
        </ion-toolbar>
      </ion-header>


      <!-- Add button  -->

         <ion-fab edge vertical="top" horizontal="end" slot="fixed">
      <ion-fab-button>
        <ion-icon :name="add" :icon="add" :md="add"></ion-icon>
      </ion-fab-button>

        <ion-fab-list side="bottom">
        <ion-fab-button @click="takePhoto()"><ion-icon :icon="camera" :md="camera"></ion-icon></ion-fab-button>
        <ion-fab-button><ion-icon :icon="browsers" :md="browsers"></ion-icon></ion-fab-button>
      </ion-fab-list>
  
    </ion-fab>
    
    
      <div id="container">
          <p>icon?</p>
         <ion-icon :name="add" icon="add" :md="add" ></ion-icon>
        <strong>Ready to create an app?</strong>
        <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, 
    IonFabList, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonImg } from '@ionic/vue';




import { defineComponent } from 'vue';

import {add, camera, browsers, trash, close} from "ionicons/icons";

import { usePhotoGallery } from '@/composables/usePhotoGallery';

export default defineComponent({
  name: 'Home',
  components: {
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
    IonImg 
  },
  setup() {
     const { takePhoto } = usePhotoGallery();
    return {
      add,
      camera,
      browsers,
      trash,
      close,
      takePhoto
    }
  
  }
});
</script>

<style scoped>
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>