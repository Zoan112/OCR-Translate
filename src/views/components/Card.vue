<template>
  <div id="container">
    <strong v-if="!toogleImg"
      >Click the <ion-icon :icon="add" :md="add" :ios="add"></ion-icon> Button
      to scan document</strong
    >
    <ion-row class="ion-no-padding">
      <ion-col> </ion-col>

      <ion-col size-xs="12" size-md="9" size-lg="7">
        <ion-card v-if="toogleImg">
          <img v-if="toogleImg" :src="'data:image/jpeg;base64,' + base" />
          <br />
          <ion-button @click="processOcr(base)" v-if="toogleImg"
            >Process</ion-button
          >

          <ion-card-content>
            <ion-textarea
              v-if="showTranslateBtn"
              v-model="ocrRslt"
              auto-grow
            ></ion-textarea>
          </ion-card-content>

          <ion-grid>
            <ion-row class="ion-no-padding">
              <ion-col>
                <ion-button
                  @click="openPicker()"
                  v-if="showTranslateBtn"
                  fill="outline"
                  >Translate into: &#160;
                  <text class="selectedLang">{{
                    selectedLang
                  }}</text></ion-button
                >
              </ion-col>
              <ion-col>
                <ion-button
                  @click="processTranslate(ocrRslt, selectedLang)"
                  v-if="showTranslateBtn"
                  >Translate</ion-button
                >
              </ion-col>

              <ion-col v-if="showAfterTranslate">
                <ion-button
                  @click="addToClipboard"
                  fill="outline"
                  v-if="showAfterTranslate"
                  ><ion-icon
                    color="#3171e0"
                    name="copy"
                    size="large"
                    :icon="copy"
                    :md="copy"
                    :ios="copy"
                  ></ion-icon
                ></ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>

          <ion-card-content>
            <ion-textarea
              v-if="showAfterTranslate"
              v-model="translatedText"
              auto-grow
            ></ion-textarea>
            <ion-button @click="saveFirestore" color="success"
              ><ion-icon
                :name="bookmark"
                :md="bookmark"
                :ios="bookmark"
              ></ion-icon>
              &#160;Save translation</ion-button
            >
            <ion-button @click="debug">debug</ion-button>
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col> </ion-col>
    </ion-row>
  </div>
</template>

<script>
import { close, copy, menu, bookmark, add } from "ionicons/icons";

import {
  IonCard,
  IonGrid,
  IonRow,
  IonCardContent,
  IonTextarea,
  IonButton,
  IonCol,
  IonIcon
} from "@ionic/vue";

import {
  processTranslate,
  translatedText
} from "@/composables/translateApiCall";

import globalToast from "@/composables/Toast";
import { presentLoading, closeLoading } from "@/composables/LoadingScreen";
import { openPicker, selectedLang } from "@/composables/langPicker";
import { defineComponent, ref } from "@vue/runtime-core";
import { watch, toRefs, computed } from "vue";

import { processOcr, ocrRslt } from "@/composables/processOcr";

import { base, usePhotoGallery } from "@/composables/usePhotoGallery";

export default defineComponent({
  props: ["fetchedOcrRslt", "translatedText", "photo"],
  components: {
    add,
    IonCard,
    IonGrid,
    IonRow,
    IonCardContent,
    IonTextarea,
    IonButton,
    IonCol,
    IonIcon,
    ocrRslt
  },

  setup(props) {
    /*   const propsrefs = toRefs(props);
    console.log(propsrefs);
    console.log(propsrefs.ocrRslt);
    console.log(propsrefs.ocrRslt.value);

*/

    const showTranslateBtn = ref(false);

    const Rslt = ref();

    const base = toRefs(props).photo;
    // const ocrRslt = ref();

    //const translatedText = ref();

    const localProps = computed(() =>
      (ocrRslt.value = props.fetchedOcrRslt)(
        (translatedText.value = props.translatedText)
      )
    );

    // const currentOcrText = ref();

    const testing = ref(props.photo);

    /* Conditional element rendering*/

    let toogleImg = ref(false);

    const debug = () => {
      ocrRslt.value = "www";
      /*
      console.log("RSLT", Rslt);
      console.log("RSLT", Rslt.value);
      console.log("currentOcrText:", currentOcrText.value);
      console.log("ocrRslt:", ocrRslt.value);
      console.log("ocrRslt:", ocrRslt);
      console.log("ocrRslt:", ocrRslt.value);
      localProps;
      localProps();*/
      // console.log("ocrRslt:", ocrRslt.value.fetchedOcrRslt);
      //console.log("ocrRslt:", ocrRslt.value.translatedText);
    };

    watch(base, () => {
      console.log("base watcher");
      if (base.value === "") {
        console.log("from base.value", base.value);
        toogleImg.value = false;
      } else if (base.value !== "") {
        toogleImg.value = true;
      }
    });

    watch(ocrRslt, () => {
      if (ocrRslt.value === "") {
        console.log("from ocrRslt.value = '' ", ocrRslt.value);
        showTranslateBtn.value = false;
      } else if (ocrRslt.value !== "") {
        showTranslateBtn.value = true;

        console.log("dissmiss");
      }
    });

    const showAfterTranslate = ref(false);

    watch(translatedText, () => {
      if (translatedText.value !== "") {
        showAfterTranslate.value = true;
      }
    });

    //Get image size
    const getImageSize = () => {
      console.log(base.value);

      let padding;
      let inBytes;
      let base64StringLength;
      if (base.value.endsWith("==")) {
        alert("padding = 2");
        padding = 2;
      } else if (base.value.endsWith("=")) {
        alert("padding = 1");
        padding = 1;
      } else {
        alert("padding = 0");
        padding = 0;
      }

      base64StringLength = base.value.length;
      console.log(base64StringLength);
      inBytes = (base64StringLength / 4) * 3 - padding;
      console.log(inBytes);
      let kbytes = inBytes / 1000;
      console.log(kbytes);
      alert(kbytes);
    };

    //resize image
    const imageResize = async (dataUrl, targetFileSizeKb, maxDeviation = 1) => {
      console.log("resize function starts");
      let originalFile = await urltoFile(dataUrl, "test.png", "image/png");
      if (originalFile.size / 1000 < targetFileSizeKb) return dataUrl; // File is already smaller

      let low = 0.0;
      let middle = 0.5;
      let high = 1.0;

      let result = dataUrl;

      let file = originalFile;

      while (Math.abs(file.size / 1000 - targetFileSizeKb) > maxDeviation) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const img = document.createElement("img");

        const promise = new Promise((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
        });

        img.src = dataUrl;

        await promise;

        canvas.width = Math.round(img.width * middle);
        canvas.height = Math.round(img.height * middle);
        context.scale(canvas.width / img.width, canvas.height / img.height);
        context.drawImage(img, 0, 0);
        file = await urltoFile(canvas.toDataURL(), "test.jpeg", "image/jpeg");

        if (file.size / 1000 < targetFileSizeKb - maxDeviation) {
          low = middle;
        } else if (file.size / 1000 > targetFileSizeKb) {
          high = middle;
        }

        middle = (low + high) / 2;
        result = canvas.toDataURL();
      }

      return result;
    };

    function urltoFile(url, filename, mimeType) {
      return fetch(url)
        .then(function(res) {
          return res.arrayBuffer();
        })
        .then(function(buf) {
          return new File([buf], filename, { type: mimeType });
        });
    }

    const Resize = () => {
      presentLoading() +
        imageResize("data:image/jpeg;base64," + base.value, 700, 50).then(
          res => {
            globalToast(
              "success",
              "Re-size finished..  Proceeding to save document..."
            ),
              closeLoading(),
              (base.value = res = res.substring(22)),
              console.log("res", res),
              uploadDocument();
          }
        );
    };
    ///Write to fireStore

    const saveFirestore = () => {
      //Check if file exist in array by taking first 15 charcthers and compering them to array.
      let checkIfExists = savedTranslations.value.find(
        ({ id }) => id == ocrRslt.value.substring(0, 15)
      );

      //Check size of image
      checkImageSize();
      function checkImageSize() {
        let base64StringLength = base.value.length;

        ///Check image size
        if (base64StringLength >= 1000000) {
          console.log("bigger then 1mb, need to resize!");
          globalToast(
            "danger",
            "Photo is bigger then 1Mb, Re-Sizing please wait ..."
          );
          Resize(base.value);
        } else if (base64StringLength <= 1000000) {
          uploadDocument(checkIfExists);
          console.log("No resize needed");
        }
      }
    };

    const uploadDocument = checkIfExists => {
      console.log(checkIfExists);

      if (ocrRslt.value == "") {
        globalToast("danger", "Not Saved! No text found, please try again. ");
      } else if (typeof checkIfExists !== "undefined") {
        if (ocrRslt.value.substring(0, 15) == checkIfExists.id) {
          globalToast("warning", "Document name already exists!");
        }
      } else if (typeof checkIfExists == "undefined") {
        savedTranslations.value = [];

        presentLoading();
        //Clear array before FireStore write and then firestore retrive
        firebase
          .firestore()
          .collection(userUid.value)
          .doc(ocrRslt.value.substring(0, 15))
          .set({
            imageBase64: base.value,
            ocrText: ocrRslt.value,
            translatedText: translatedText.value
          })
          .then(() => {
            closeLoading();
            console.log("Document successfully written!");
            globalToast("success", "Saved successfully!");
          })
          .catch(error => {
            console.error("Error writing document: ", error);
            closeLoading();
          });
      }
    };

    const retriveFirestore = () => {
      savedTranslations.value = [];

      firebase
        .firestore()
        .collection(userUid.value)
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
              id: doc.id,
              image: doc.data().imageBase64,
              ocrText: doc.data().ocrText,
              translatedText: doc.data().translatedText
            };
            console.log(doc.data());
            savedTranslations.value.push(data);
            console.log(doc.id, " => ", doc.data());
          });
        });
    };

    /*
    //Send base64 Img to google functions
    const processOcr = () => {
      // firebase.functions().useEmulator("localhost", 5001);
      presentLoading();
      var baseFire = base.value;
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
            globalToast(
              "danger",
              "No text found, Please scan another document."
            );
            closeLoading();
          }
        });
    };
*/
    //Add translation to clipboard
    const addToClipboard = () => {
      navigator.clipboard.writeText(translatedText.value);
      globalToast("dark", "Copied to clipboard");
    };

    return {
      //Icons:
      bookmark,
      add,
      copy,
      ocrRslt,
      toogleImg,
      processOcr,
      processTranslate,
      showTranslateBtn,
      addToClipboard,
      showAfterTranslate,
      openPicker,
      selectedLang,
      translatedText,
      saveFirestore,
      base,
      debug,
      localProps,
      Rslt
    };
  }
});
</script>

<style scoped>
#container {
  text-align: center;
  max-height: 100%;
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

ion-textarea {
  background: #f0f8ff;
  border-radius: 10px;
}

ion-card {
  overflow: auto;
}

.selectedLang {
  font-weight: 550;
  text-decoration: underline;
}
</style>
