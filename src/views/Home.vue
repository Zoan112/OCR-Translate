
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
            <!-- <ion-content>
      <ion-button @click="openPicker()">SHOW PICKER</ion-button>
    </ion-content>-->

    <!--  Container -->
      <div id="container">
 
      <ion-card>
        
          <img v-if="toogleImg" :src="'data:image/jpeg;base64,'+ base">
          <br>
            <ion-button @click="processOcr" v-if="toogleImg" >Process</ion-button> 

    <ion-card-content>  

   <ion-textarea v-if="showTranslateBtn" v-model="RSLT" auto-grow></ion-textarea>
    </ion-card-content>


<ion-grid>
  <ion-row class="ion-no-padding">
    <ion-col>
    </ion-col>

    <ion-col>
            <ion-button @click="processTranslate" v-if="showTranslateBtn" >Translate</ion-button>
    </ion-col>

    <ion-col>
             <ion-button @click="addToClipboard" fill="outline" v-if="showAfterTranslate"><ion-icon color="#3171e0" name="copy" size="large" :icon="copy" :md="copy"></ion-icon></ion-button>
    </ion-col>

        
  </ion-row>
</ion-grid>


      <ion-card-content>
        <ion-textarea v-if="showAfterTranslate" v-model="translatedText" auto-grow></ion-textarea>    
      </ion-card-content>

      
    <strong v-if="!toogleImg">Click the  <ion-icon icon="add" :md="add" ></ion-icon> Button to scan document</strong>
      </ion-card>


   
        
      
  
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
    IonCard,
    IonCardContent,
    IonTextarea,
    IonButton,
    toastController,
    IonToast,
    IonDatetime,
    pickerController} from '@ionic/vue';




import { computed, defineComponent , reactive, ref, watch, watchEffect} from 'vue';

import {add, camera, trash, close, copy} from "ionicons/icons";

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
    IonButton,
    IonCard,
    IonCardContent,
    IonTextarea
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
  
  const showTranslateBtn = ref(false)

  watch(RSLT, ()=>{
     if (RSLT.value === ''){
       console.log("from RSLT.value = '' ", RSLT.value )
       showTranslateBtn.value = false
     }else if(RSLT.value !== ''){
       showTranslateBtn.value = true
     }

   })

const showAfterTranslate = ref(false)

watch(translatedText ,()=>{
if (translatedText.value !== ''){
  showAfterTranslate.value = true
}
} )



//Add translated text to clipboard
//getInputElement() => Promise<IonTextarea>

   const addToClipboard = (()=>{
     console.log(translatedText.value)
    
    navigator.clipboard.writeText(translatedText.value)
  
  handleButtonClick()
       async function handleButtonClick() {
      const toast = await toastController.create({
        color: 'dark',
        duration: 2000,
        message: 'Copied to clipboard',
        showCloseButton: true
      });

      await toast.present();
    }

     // translatedText.value.select()
       
      //document.execCommand('copy');
   })
     
     /*
      const defaultColumnOptions = [
      [
        'Hebrew',
        'Spanish',
        'Russian',
      ]
    ]
async function openPicker(numColumns = 1, numOptions = 3, columnOptions = defaultColumnOptions){
      const picker = await pickerController.create({
        columns: getColumns(numColumns, numOptions, columnOptions),
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Confirm',
            handler: (value) => {
              console.log(`Got Value ${value}`)+alert(JSON.stringify(value));
            }
          }
        ]
      });

      await picker.present();
    }

    function getColumns(numColumns, numOptions, columnOptions) {
      let columns = [];
      for (let i = 0; i < numColumns; i++) {
        columns.push({
          name: `col-${i}`,
          options: getColumnOptions(i, numOptions, columnOptions)
        });
      }

      return columns;
    }

    function getColumnOptions(columnIndex, numOptions, columnOptions) {
      let options = [];
      for (let i = 0; i < numOptions; i++) {
        options.push({
          text: columnOptions[columnIndex][i % numOptions],
          value: i
        })
      }

      return options;
    }
    */
    return {
      add,
      copy,
      camera,
      trash,
      close,
      takePhoto,
      imageSrc,
      base,
      RSLT,
      toogleImg,
      translatedText,
      processOcr,
      processTranslate,
      showTranslateBtn,
      addToClipboard,
      showAfterTranslate,
      //openPicker
       
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


ion-textarea{
  background:#f0f8ff;
  border-radius: 10px
}

ion-card{
  max-height: 100vh;
  overflow: auto;
}
</style>