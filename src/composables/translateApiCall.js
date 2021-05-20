import { presentLoading, closeLoading } from "@/composables/LoadingScreen.js";
import firebase from "firebase/app";
import "firebase/firebase-functions";

import { ref } from "vue";

////Language codes
const langCode = [{ Hebrew: "he", Spanish: "es", Russian: "ru" }];

const translatedText = ref();

const processTranslate = (ocrRslt, selectedLang) => {
  // googleFunc.useEmulator("localhost", 5001);
  presentLoading();
  const RSLTFire = ocrRslt;
  let selctedlang = selectedLang;
  const lang = langCode[0][selctedlang];

  const sendToTranslate = firebase
    .functions()
    .httpsCallable("processTranlateLang");

  sendToTranslate({ lang, RSLTFire })
    .then(result => {
      console.log(result.data);
      translatedText.value = JSON.parse(result.data);
    })
    .then(() => {
      closeLoading();
    });
};

export { processTranslate, translatedText };
