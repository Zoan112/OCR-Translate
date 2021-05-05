/* eslint-disable */
import { ref, onMounted, watch } from "vue";
import {
  Plugins,
  CameraResultType,
  CameraSource,
  CameraDirection,
  CameraPhoto,
  Capacitor,
  FilesystemDirectory,
  quality
} from "@capacitor/core";

const { Browser } = Plugins;
var imageSrc = ref("e");
var base = ref("");

export function usePhotoGallery() {
  const { Camera } = Plugins;

  const takePhoto = async () => {
    const cameraPhoto = await Camera.getPhoto({
      source: CameraSource.Camera,
      direction: CameraDirection.Rear,
      quality: 10,
      resultType: CameraResultType.Base64
    });

    var imageUrl = cameraPhoto.webPath;
    var imageBase = cameraPhoto.base64String;
    var imageDataUrl = cameraPhoto.dataUrl;
    var imagePath = cameraPhoto.path;
    var imageexif = cameraPhoto.exif;
    var imageuru = cameraPhoto.Uri;

    console.log("base64:", imageBase);
    console.log("DataUrl:", imageDataUrl);
    console.log("webPath:", imageUrl);
    console.log("Path:", imagePath);

    console.log("Exif:", imageexif);
    console.log("uri:", imageuru);
    sendtoBase(imageBase);

    console.log(imageUrl);
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
