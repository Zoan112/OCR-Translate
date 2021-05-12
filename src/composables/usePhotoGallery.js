/* eslint-disable */
import { ref, onMounted, watch } from "vue";
import {
  Plugins,
  CameraResultType,
  CameraSource,
  CameraDirection
} from "@capacitor/core";

import { isPlatform } from "@ionic/vue";

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
  };

  return {
    takePhoto
  };
}

export function sendtoBase(x) {
  base.value = x;
}

export { base };
