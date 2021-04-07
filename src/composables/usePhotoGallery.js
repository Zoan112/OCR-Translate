 /* eslint-disable */
import { ref, onMounted, watch } from 'vue';
import { Plugins, CameraResultType, CameraSource, CameraPhoto, 
Capacitor, FilesystemDirectory } from "@capacitor/core";


var imageSrc = ref('e') ;
var base = ref('')

export function usePhotoGallery() {
    const { Camera } = Plugins;
  

    const takePhoto = async () => {
      const cameraPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        quality: 100,
 
      });

      var imageUrl = cameraPhoto.webPath 
      var imageBase = cameraPhoto.base64String
      sendtoBase(imageBase)

      console.log(imageUrl)
      sendtoVue(imageUrl)
    };
  
    return {
      takePhoto
    };

   
  }

   

  export function sendtoVue(x){
    imageSrc.value = ref(x)
    console.log('from: send to vue', imageSrc)
 //return ref(imageSrc)
  }

  export function sendtoBase(x){
    base.value = x
  }



  export{
     imageSrc,
     base
  }


