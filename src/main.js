import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

// Above the createApp() line
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Firebase Import*/
import firebase from "firebase/app"
import 'firebase/functions' 

firebase.initializeApp({
    apiKey: "AIzaSyAraqP78ELsXF2ckhG0WfeJd0DUT_aI9pg",
    authDomain: "fir-functions-8307b.firebaseapp.com",
    projectId: "fir-functions-8307b",
    storageBucket: "fir-functions-8307b.appspot.com",
    messagingSenderId: "326340236602",
    appId: "1:326340236602:web:dc85ff32bcadc31d36ac03"
})


  


const app = createApp(App)
  .use(IonicVue)
  .use(router);
  
router.isReady().then(() => {
  app.mount('#app');
});

const googleFunc = firebase.functions()

export default googleFunc 
console.log('from main',googleFunc)