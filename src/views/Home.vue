
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


      <!-- FAB Add button  -->

    <ion-fab edge vertical="top" horizontal="end" slot="fixed">

      <ion-fab-button>
        <ion-icon :name="add" :icon="add" :md="add"></ion-icon>
      </ion-fab-button>

        <ion-fab-list side="bottom">
        <ion-fab-button @click="takePhoto()"><ion-icon :icon="camera" :md="camera"></ion-icon></ion-fab-button>
      </ion-fab-list>
  
    </ion-fab>
    
    <!--  Container -->
      <div id="container">
      
    <!--Image-->
     <img v-if="toogleImg" :src="'data:image/jpeg;base64,'+ base">  
         <br>
     <ion-button @click="processOcr" v-if="toogleImg" >Process</ion-button>
       <br>
      {{RSLT}}
      <br>
      <ion-button @click="processTranslate" v-if="toogleImg" >Translate</ion-button>
      <br>
      {{translatedText}}

          <!--Placeholder before image is taken -->
        <strong v-if="!toogleImg">Click the  <ion-icon icon="add" :md="add" ></ion-icon> Button to scan document</strong>
        <br>
  
      </div>

    
    </ion-content>
  </ion-page>
</template>

<script>
 /* eslint-disable */
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, 
    IonFabList, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonImg, 
    IonToggle,
    IonButton} from '@ionic/vue';




import { computed, defineComponent , reactive, ref, watch, watchEffect} from 'vue';

import {add, camera, trash, close} from "ionicons/icons";

import { usePhotoGallery, sendtoVue, imageSrc, base } from '@/composables/usePhotoGallery';
import { CameraSource } from '@capacitor/core';
 
import googleFunc from '../main.js'




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
    IonImg,
    imageSrc,
    IonButton
  },
  setup() {
    // TakePhoto
     const { takePhoto} = usePhotoGallery();

    //Send base Img to google functions
     const processOcr = ()=>{

// googleFunc.useEmulator("localhost", 5001);
var baseFire = base.value

console.log ('basefire', baseFire)
const sendToOcr = googleFunc.httpsCallable('sendToOcr1');
    sendToOcr({ baseFire }).then(result => {
        console.log(result);
      console.log(result.data);
       const parseOcr = JSON.parse(result.data)
        RSLT.value = parseOcr
    });
  
     }

 //Send text reasults to google functions
     const processTranslate = ()=>{
       const RSLTFire = RSLT.value
      const sendToTranslate = googleFunc.httpsCallable('processTranlate')

sendToTranslate({ RSLTFire }).then(result => {
  console.log(result)
  console.log(result.data)
  
  translatedText.value = JSON.parse(result.data)
})

     }


      const RSLT = ref()
      const translatedText = ref()

  
/* Conditional element rendering*/ 
let toogleImg = ref(false)

  watch(base, ()=>{
     if (base.value === ''){
       console.log("from base.value", base.value)
       toogleImg.value = false
     }else if(base.value !== ''){
       toogleImg.value = true
     }

   })
      








     const processImgBtn = ()=>{ 
    api()
     }


     const debugApi = ()=>{

       console.log(RSLT)
       console.log(RSLT.value)
       console.log(result)
       console.log(result.value)
       
     }

      const debugShow = ()=>{
        console.log(RSLT)
    
       
     }

    return {
      add,
      camera,
      trash,
      close,
      takePhoto,
      imageSrc,
      base,
      RSLT,
      debugApi,
      debugShow,
      toogleImg,
      translatedText,
      processOcr,
      processTranslate,
      processImgBtn
       
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