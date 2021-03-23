
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
        <ion-fab-button @click="clickDebug"><ion-icon :icon="browsers" :md="browsers"></ion-icon></ion-fab-button>
      </ion-fab-list>
  
    </ion-fab>
    
    
      <div id="container">
    
   <img v-if="toogleImg" :src="'data:image/jpeg;base64,'+ base">  
<br>
<ion-button @click="clickDebug" v-if="toogleImg" >Process</ion-button>
  
   
       <br>
{{RSLT}}
<br>
<ion-button @click="translateApi" v-if="toogleImg" >Translate</ion-button>
<br>
{{translatedText}}


        <strong v-if="!toogleImg">Click the  <ion-icon icon="add" :md="add" ></ion-icon> Button to scan document</strong>
        <br>
        <button @click="debugShow">DebugShow</button>
       
  
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

import {add, camera, browsers, trash, close} from "ionicons/icons";

import { usePhotoGallery, sendtoVue, imageSrc, base } from '@/composables/usePhotoGallery';
import { CameraSource } from '@capacitor/core';

//console.log(imageSrc)



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
     const { takePhoto} = usePhotoGallery();



     //Send to vision api//

     const api = function sendToVision(){
       console.log('start fetch function')
 var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"requests":[{"image":{"content":base.value},"features":[{"type":"DOCUMENT_TEXT_DETECTION"}]}]});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBoy7d6rNyetysP_esKu0CrBHizVFQVAHo\n", requestOptions)
  .then(response => response.text())
  .then(result => getVision(result))
  .catch(error => console.log('error', error)+alert('No text recognized in image, Please scan again.'));
     }

      const RSLT = ref()
      const translatedText = ref()

      function getVision(x){
    console.log('this is from x', x)
    RSLT.value = JSON.parse(x).responses[0].fullTextAnnotation.text
    console.log(JSON.parse(x).responses[0].fullTextAnnotation.text)
    }



  watch(base, ()=>{
     //alert('watch')

     if (base.value === ''){
       console.log("from base.value", base.value)
       //alert(" ''   ")
       toogleImg.value = false
     }else if(base.value !== ''){
       //alert(" not ''")
       toogleImg.value = true
     }

   })
      let toogleImg = ref(false)
         console.log(toogleImg)

    

const r = ref('x')
    

  ///Translate API//


  const translateApi = function sendToTranslate(){
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"q":RSLT.value,"target":"he","model":"base"});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://translation.googleapis.com/language/translate/v2?key=AIzaSyBoy7d6rNyetysP_esKu0CrBHizVFQVAHo\n", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result)+ showTranslate(result))
  .catch(error => console.log('error', error));

  }

        function showTranslate(resultTranslate){
    translatedText.value = JSON.parse(resultTranslate).data.translations[0].translatedText
    }







    //Debug button///

     const clickDebug = ()=>{
   console.log('imageSrc raw:',imageSrc)
   console.log('imageSrc.value',imageSrc.value)
    console.log('imageSrc.value',imageSrc.value.value)
    
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
    ///toogle IMG

 
 

//base.value = "'data:image/jpeg;base64,'+ iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="    

    return {
      add,
      camera,
      browsers,
      trash,
      close,
      takePhoto,
      clickDebug,
      imageSrc,
      base,
      RSLT,
      debugApi,
      debugShow,
      r,
      toogleImg,
      translateApi,
      translatedText
       
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