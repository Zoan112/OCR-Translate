<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>OCR-Translate</ion-title>

        <ion-icon
          class="hamburgerMenu"
          @click="openMenu"
          slot="end"
          name="menu"
          :md="menu"
        ></ion-icon>
      </ion-toolbar>
    </ion-header>

    <!--Menu-->

    <ion-menu
      side="end"
      menu-id="custom"
      class="my-custom-menu"
      content-id="content"
    >
      <!-- Header Menu-->
      <ion-header>
        <ion-toolbar class="menuTitles" color="primary">
          <ion-title>{{ userName }}</ion-title>
          <p class="userEmail">{{ userEmail }}</p>
          <ion-avatar class="userAvatar" slot="end">
            <img class="userAvatarImg" @click="closeMenu" :src="userAvatar" />
          </ion-avatar>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <!--Sign out-->
          <ion-item lines="full" class="signOut" @click="signOut"
            >Sign Out</ion-item
          >

          <ion-item-group>
            <ion-item-divider size="large" color="">
              <ion-label class="savedTranslationLabel"
                ><ion-icon
                  class="menuBookmark"
                  size="large"
                  :name="bookmark"
                  :md="bookmark"
                  :ios="bookmark"
                ></ion-icon
                >Saved:</ion-label
              >
            </ion-item-divider>

            <!--Saved items-->

            <span v-for="items in savedTranslations">
              <ion-item
                class="savedItems"
                @click.self="selectSavedItem(items.id)"
              >
                <span>
                  <img
                    :src="'../assets/itemTag.svg'"
                    style="height: 23px;
    padding-right: 5px;
    vertical-align: bottom;
    position: relative;
    top: 5px;"
                  />
                </span>
                &#160;{{ items.id }}
                <!--Delete Item-->
                <ion-button
                  @click.self="deleteDoc(items.id)"
                  size="large"
                  slot="end"
                  fill="outline"
                  class="trash"
                >
                  <ion-icon :name="trash" :md="trash" :ios="trash"></ion-icon
                ></ion-button>
              </ion-item>
            </span>
          </ion-item-group>
        </ion-list>
      </ion-content>
    </ion-menu>

    <ion-content
      :fullscreen="false"
      class="has-header"
      id="content"
      style="background-color:#86868630;"
    >
      <!--<ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">WWW</ion-title>
        </ion-toolbar>
      </ion-header>-->

      <!-- FAB Add button  -->

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
          <ion-icon :name="add" :icon="add" :md="add"></ion-icon>
        </ion-fab-button>

        <ion-fab-list side="top">
          <ion-fab-button @click="newPhoto"
            ><ion-icon :icon="camera" :md="camera"></ion-icon
          ></ion-fab-button>
        </ion-fab-list>
      </ion-fab>

      <!--  Container -->

      <div id="container">
        <ion-button @click="debugResize">debugResize</ion-button>
        <ion-button @click="getImageSize">Calculate image size</ion-button>
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
                  v-model="RSLT"
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
                      @click="processTranslate"
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
  toastController,
  IonToast,
  IonDatetime,
  pickerController,
  loadingController,
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

import { useRouter } from "vue-router";

import {
  add,
  camera,
  trash,
  close,
  copy,
  menu,
  bookmark,
  pricetag
} from "ionicons/icons";

import {
  usePhotoGallery,
  sendtoVue,
  imageSrc,
  base
} from "@/composables/usePhotoGallery";
import { CameraSource } from "@capacitor/core";

import googleFunc from "../main.js";

import firebase from "firebase";

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
    imageSrc,
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
    IonItemDivider
  },
  setup() {
    const { takePhoto } = usePhotoGallery();
    const router = useRouter();

    const RSLT = ref();
    const translatedText = ref();

    const showTranslateBtn = ref(false);

    // TakePhoto

    const newPhoto = () => {
      base.value = "";
      RSLT.value = "";
      translatedText.value = "";
      showAfterTranslate.value = false;

      takePhoto();
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

    const user = ref(null);
    const userAvatar = ref(null);
    const userName = ref(null);
    const userEmail = ref(null);
    const userUid = ref(null);

    //Default user avatar. (if user as no avatar)
    userAvatar.value = "../assets/avatar.svg";

    ///Stored transaltion
    const savedTranslations = ref([]);

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
        file = await urltoFile(canvas.toDataURL(), "test.png", "image/png");

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

    const debugResize = () => {
      imageResize("data:image/jpeg;base64," + base.value, 700, 50).then(res => {
        alert("finish resize"), console.log("res", res);
      });
    };

    ///Auth

    onMounted(() => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log(user);
          console.log(user.displayName);
          userName.value = user.displayName;
          userAvatar.value = user.photoURL;
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
          console.log("not lodged", user);
        }
      });
    });

    ///Write to fireStore

    const saveFirestore = () => {
      //Check if file exist in array by taking first 15 charcthers and compering them to array.
      let checkIfExists = savedTranslations.value.find(
        ({ id }) => id == RSLT.value.substring(0, 15)
      );

      //Check size of image
      checkImageSize();
      function checkImageSize() {
        let base64StringLength = base.value.length;
        alert(base64StringLength);

        ///Check image size
        if (base64StringLength >= 1000000) {
          alert("bigger then 1mb, need to resize!");
          globalToast("danger", "Photo is bigger then 1Mb, please resize.");
          imageResize(base.value);
        } else if (base64StringLength <= 1000000) {
          uploadDocument(checkIfExists);
          alert("no need to resize");
        }
      }

      // console.log(checkIfExists);

      /* // console.log("checkIfexists:",checkIfExists);

      if (RSLT.value == "") {
        globalToast("danger", "Not Saved! No text found, please try again. ");
      } else if (typeof checkIfExists !== "undefined") {
        if (RSLT.value.substring(0, 15) == checkIfExists.id) {
          globalToast("warning", "Document name already exists!");
        }
      } else if (typeof checkIfExists == "undefined") {
        savedTranslations.value = [];

        presentLoading();

        //Clear array before FireStore write and then firestore retrive

        // Add a new document in collection "cities"
        firebase
          .firestore()
          .collection(userUid.value)
          .doc(RSLT.value.substring(0, 15))
          .set({
            imageBase64: base.value,
            ocrText: RSLT.value,
            translatedText: translatedText.value
          })
          .then(() => {
            closeLoading();
            console.log("Document successfully written!");
            toast();
          })
          .then(() => {
            //  alert("Translation saved successfully!");
          })
          .catch(error => {
            console.error("Error writing document: ", error);
            closeLoading();
          });
      }*/
    };

    const uploadDocument = checkIfExists => {
      console.log(checkIfExists);

      if (RSLT.value == "") {
        globalToast("danger", "Not Saved! No text found, please try again. ");
      } else if (typeof checkIfExists !== "undefined") {
        if (RSLT.value.substring(0, 15) == checkIfExists.id) {
          globalToast("warning", "Document name already exists!");
        }
      } else if (typeof checkIfExists == "undefined") {
        savedTranslations.value = [];

        presentLoading();

        //Clear array before FireStore write and then firestore retrive

        // Add a new document in collection "cities"
        firebase
          .firestore()
          .collection(userUid.value)
          .doc(RSLT.value.substring(0, 15))
          .set({
            imageBase64: base.value,
            ocrText: RSLT.value,
            translatedText: translatedText.value
          })
          .then(() => {
            closeLoading();
            console.log("Document successfully written!");
            toast();
          })
          .then(() => {
            //  alert("Translation saved successfully!");
          })
          .catch(error => {
            console.error("Error writing document: ", error);
            closeLoading();
          });
      }
    };

    const retriveFirestore = () => {
      console.log("from retrive");
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

    // Select saved item

    const selectSavedItem = firestoreId => {
      console.log(firestoreId);
      console.log(savedTranslations.value);

      const result = savedTranslations.value.find(
        ({ id }) => id === firestoreId
      );

      console.log(result);

      console.log(result.image);

      base.value = result.image;
      RSLT.value = result.ocrText;
      translatedText.value = result.translatedText;
    };

    //Delete Item
    const deleteDoc = firestoreId => {
      savedTranslations.value = [];

      firebase
        .firestore()
        .collection(userUid.value)
        .doc(firestoreId)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          toastDelete();
        })
        .catch(error => {
          console.error("Error removing document: ", error);
        });
    };

    //SignOut
    const signOut = () => {
      firebase.auth().signOut();
      router.push({ path: "login" });
    };

    //Menu
    const openMenu = () => {
      console.log("open Menu");
      menuController.enable(true, "custom");
      menuController.open("custom");
    };

    const closeMenu = () => {
      menuController.close("custom");
    };

    //History

    const printUserInfo = () => {
      console.log(userAvatar);

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log(user);
          console.log(user.displayName);
        } else {
          // No user is signed in.
          console.log("not lodged", user);
        }
      });
    };

    //Send base64 Img to google functions
    const processOcr = () => {
      // googleFunc.useEmulator("localhost", 5001);

      presentLoading();
      var baseFire = base.value;

      console.log("basefire", baseFire);
      const sendToOcr = firebase.functions().httpsCallable("sendToOcr1");
      sendToOcr({ baseFire })
        .then(result => {
          console.log(result);
          console.log(result.data);
          const parseOcr = JSON.parse(result.data);
          RSLT.value = parseOcr;
        })
        .then(() => {
          closeLoading();
        });
    };

    //Send text results to google functions
    const processTranslate = () => {
      // googleFunc.useEmulator("localhost", 5001);
      presentLoading();
      console.log("present loading");
      const RSLTFire = RSLT.value;

      let selctedlang = selectedLang.value;
      const lang = langCode[0][selctedlang];
      const sendToTranslate = firebase
        .functions()
        .httpsCallable("processTranlateLang");

      sendToTranslate({ lang, RSLTFire })
        .then(result => {
          console.log(result);
          console.log(result.data);

          translatedText.value = JSON.parse(result.data);
        })
        .then(() => {
          closeLoading();
        });
    };

    /* Conditional element rendering*/

    let toogleImg = ref(false);

    watch(base, () => {
      if (base.value === "") {
        console.log("from base.value", base.value);
        printUserInfo;
        toogleImg.value = false;
      } else if (base.value !== "") {
        toogleImg.value = true;
      }
    });

    const closeLoading = async () => {
      await loadingController.dismiss();
    };

    /*load control*/

    const presentLoading = async () => {
      const loading = await loadingController.create({
        cssClass: "my-custom-class",
        message: "Please wait...",
        duration: true
      });

      await loading.present();
    };

    ///Conditonal rendering translate button

    watch(RSLT, () => {
      if (RSLT.value === "") {
        console.log("from RSLT.value = '' ", RSLT.value);
        showTranslateBtn.value = false;
      } else if (RSLT.value !== "") {
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
      console.log(translatedText.value);
      navigator.clipboard.writeText(translatedText.value);

      handleButtonClick();
      async function handleButtonClick() {
        const toast = await toastController.create({
          color: "dark",
          duration: 2000,
          message: "Copied to clipboard",
          showCloseButton: true
        });

        await toast.present();
      }
    };

    const toast = async () => {
      const toast = await toastController.create({
        color: "success",
        duration: 2000,
        message: "Saved successfully!",
        showCloseButton: true
      });

      await toast.present();
    };

    const globalToast = async (color, message) => {
      const toast = await toastController.create({
        color: color,
        duration: 2000,
        message: message,
        showCloseButton: true
      });

      await toast.present();
    };

    const toastDelete = async () => {
      const toast = await toastController.create({
        color: "secondary",
        duration: 2000,
        message: "Successfully deleted!",
        showCloseButton: true
      });

      await toast.present();
    };

    ////Language PICKER

    const selectedLang = ref("Hebrew");
    const langCode = [{ Hebrew: "he", Spanish: "es", Russian: "ru" }];

    const defaultColumnOptions = [["Hebrew", "Spanish", "Russian"]];
    async function openPicker(
      numColumns = 1,
      numOptions = 3,
      columnOptions = defaultColumnOptions
    ) {
      const picker = await pickerController.create({
        columns: getColumns(numColumns, numOptions, columnOptions),
        buttons: [
          {
            text: "Cancel",
            role: "cancel"
          },
          {
            text: "Confirm",
            handler: value => {
              console.log(`Got Value ${value}`) +
                console.log(value["col-0"].text);
              selectedLang.value = value["col-0"].text;
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
        });
      }

      return options;
    }

    return {
      add,
      copy,
      camera,
      trash,
      menu,
      close,
      bookmark,
      trash,
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
      openPicker,
      selectedLang,
      printUserInfo,
      userName,
      userAvatar,
      openMenu,
      signOut,
      closeMenu,
      userEmail,
      saveFirestore,
      retriveFirestore,
      savedTranslations,
      selectSavedItem,
      newPhoto,
      deleteDoc,
      pricetag,
      getImageSize,
      debugResize
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

.userAvatar {
  padding: 5px;
}

.userAvatar:hover {
  cursor: pointer;
}

.userAvatarImg {
  border: 2px solid;
}

.hamburgerMenu:hover {
  cursor: pointer;
  color: gray;
}

.hamburgerMenu {
  font-size: 60px;
}

ion-item:hover {
  /*--background-hover: red;*/
  --background: #bdc3c7;
  cursor: pointer;
}

.userEmail {
  margin: 0px;
}

.menuTitles {
  text-align: center;
}

.trash {
  --background-hover: #3880ff;
  --background-hover-opacity: 0.5;
  --color-hover: white;
}

.menuBookmark {
  vertical-align: middle;
  color: #f7c920;
}

.savedTranslationLabel {
  font-size: 1.2em;

  text-decoration: underline;
  font-weight: 500;
}

.savedItems {
  --inner-padding-end: none;
}

.signOut {
  font-size: 1.1em;
  font-weight: 450;
  /*--border-color: black;*/

  border-bottom: 2px solid #bdc3c7;
}

.has-header {
  --background: #86868630;
}
</style>
