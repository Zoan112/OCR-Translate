import { presentLoading, closeLoading } from "@/composables/LoadingScreen.js";
import firebase from "firebase/app";
import "firebase/firebase-functions";

import { ref } from "vue";
import globalToast from "../composables/Toast";

const ocrRslt = ref();

//Send base64 Img to google functions
const processOcr = base => {
  // firebase.functions().useEmulator("localhost", 5001);
  console.log(base);
  presentLoading();
  var baseFire = base;
  console.log("basefire", baseFire);
  const sendToOcr = firebase.functions().httpsCallable("sendToOcr1");
  sendToOcr({ baseFire })
    .then(result => {
      console.log(result);
      console.log(result.data);
      const parseOcr = JSON.parse(result.data);
      ocrRslt.value = parseOcr;
    })
    .then(() => {
      closeLoading();
    })
    .catch(error => {
      // Getting the Error details.
      if (error.message == "no-text recognized") {
        globalToast("danger", "No text found, Please scan another document.");
        closeLoading();
      }
    });
};

export { processOcr, ocrRslt };
