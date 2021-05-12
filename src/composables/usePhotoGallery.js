/* eslint-disable */
import { ref, onMounted, watch } from "vue";
import {
  Plugins,
  CameraResultType,
  CameraSource,
  CameraDirection,
  CameraPhoto
  // Capacitor,
  //FilesystemDirectory,
  // quality
} from "@capacitor/core";

import { isPlatform } from "@ionic/vue";

var imageSrc = ref("e");
var base = ref("");

export function usePhotoGallery() {
  const { Camera } = Plugins;

  const takePhoto = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      direction: CameraDirection.Rear,
      quality: 10
    });

    var imageBase = cameraPhoto.base64String;

    console.log("base64:", imageBase);

    sendtoBase(imageBase);

    sendtoVue(imageUrl);
  };

  return {
    takePhoto
  };
}

export function sendtoVue(x) {
  imageSrc.value = ref(x);
  console.log("from: send to vue", imageSrc);
  //return ref(imageSrc)
}

export function sendtoBase(x) {
  base.value = x;
}

export { imageSrc, base };
