<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-icon
          slot="start"
          class="logo"
          :src="'../assets/language.svg'"
        ></ion-icon>
        <ion-title slot="start">OCR-Translate</ion-title>

        <ion-icon
          class="hamburgerMenu"
          @click="openMenu"
          slot="end"
          name="menu"
          :md="menu"
        ></ion-icon>
      </ion-toolbar>
    </ion-header>

    <Menu
      :savedTranslations="savedTranslations"
      :userName="userName"
      :userEmail="userEmail"
      :userUid="userUid"
      :userAvatar="userAvatar"
      @docSelection="onDocSelection"
    />

    <ion-content
      :fullscreen="false"
      class="has-header"
      id="content"
      style="background-color:#86868630;"
    >
      <!-- FAB Add button  -->

      <Fab />

      <!--  Container -->
      <ion-button @click="debug">debug</ion-button>
      <div id="container">
        <strong v-if="!toogleImg"
          >Click the <ion-icon icon="add" :md="add"></ion-icon> Button to scan
          document</strong
        >
        <ion-row class="ion-no-padding">
          <ion-col> </ion-col>

          <ion-col size-xs="12" size-md="9" size-lg="7">
            <ion-card v-if="toogleImg">
              <img v-if="toogleImg" :src="'data:image/jpeg;base64,' + base" />
              <br />
              <ion-button @click="processOcr" v-if="toogleImg"
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
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col> </ion-col>
        </ion-row>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
/* eslint-disable */

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

import {
  computed,
  defineComponent,
  reactive,
  ref,
  watch,
  watchEffect,
  onMounted
} from "vue";

import { close, copy, menu, bookmark, pricetag, add } from "ionicons/icons";

import { base } from "@/composables/usePhotoGallery";
//import { CameraSource } from "@capacitor/core";
import firebase from "firebase";

import globalToast from "@/composables/Toast";
import { presentLoading, closeLoading } from "@/composables/LoadingScreen";
import { openPicker, selectedLang } from "@/composables/langPicker";

import {
  processTranslate,
  translatedText
} from "@/composables/translateApiCall";

import Menu from "../views/components/Menu";
import Fab from "../views/components/Fab";

export default defineComponent({
  name: "Home",
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
    IonButton,
    IonCard,
    IonCardContent,
    IonTextarea,
    IonAvatar,
    IonMenu,
    IonItem,
    IonList,
    IonItemGroup,
    IonLabel,
    IonItemDivider,
    Menu,
    Fab
  },
  setup() {
    const ocrRslt = ref();
    //  const translatedText = ref(translatedText);
    const showTranslateBtn = ref(false);

    const debug = () => {
      console.log("savedTranslations", savedTranslations);
      console.log("savedTranslations.value", savedTranslations.value);
    };
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

    //Firebase auth var declair

    const userAvatar = ref(null);
    const userName = ref(null);
    const userEmail = ref(null);
    const userUid = ref(null);

    //Default user avatar. (if user as no avatar)
    userAvatar.value = "../assets/avatar.svg";

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

    ///Auth

    onMounted(() => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log(user.displayName);
          userName.value = user.displayName;
          userAvatar.value = user.photoURL;
          console.log(userAvatar.value);
          userEmail.value = user.email;
          userUid.value = user.uid;
          retriveFirestore();
          if (userAvatar.value == null) {
            userAvatar.value = "../assets/avatar.svg";
            console.log("userAvatar.value == null");
          }
          console.log(userAvatar.value);
        } else {
          // No user is signed in.
          console.log("not logged", user);
        }
      });
    });

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
    const savedTranslations = ref([]);

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

    //Menu
    const openMenu = () => {
      console.log("menu open");
      menuController.enable(true, "custom");
      menuController.open("custom");
    };

    //History

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

    /* Conditional element rendering*/

    let toogleImg = ref(false);

    watch(base, () => {
      if (base.value === "") {
        console.log("from base.value", base.value);
        toogleImg.value = false;
      } else if (base.value !== "") {
        toogleImg.value = true;
      }
    });

    ///Conditonal rendering translate button

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

    //Add translation to clipboard
    const addToClipboard = () => {
      navigator.clipboard.writeText(translatedText.value);
      globalToast("dark", "Copied to clipboard");
    };

    //Emit from Menu when a doc is selected.
    const onDocSelection = (ocrText, transText) => {
      console.log("emit");
      ocrRslt.value = ocrText;
      translatedText.value = transText;
    };

    const onTranslatedText = () => {
      console.log("emit");
      alert("translated text emitss!!!!");
    };

    return {
      add,
      copy,
      menu,
      close,
      bookmark,
      base,
      ocrRslt,
      toogleImg,
      translatedText,
      processOcr,
      processTranslate,
      showTranslateBtn,
      addToClipboard,
      showAfterTranslate,
      openPicker,
      selectedLang,
      userAvatar,
      openMenu,
      userEmail,
      saveFirestore,
      pricetag,
      Menu,
      userName,
      savedTranslations,
      debug,
      onDocSelection,
      userUid,
      onTranslatedText,
      Fab
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

ion-title {
  padding: 0px;
}

.logo {
  font-size: 45px;
}

.hamburgerMenu:hover {
  cursor: pointer;
  color: gray;
}

.hamburgerMenu {
  font-size: 60px;
}

.has-header {
  --background: #86868630;
}
</style>
