 /* eslint-disable */
import { ref, onMounted, watch } from 'vue';
import { Plugins, CameraResultType, CameraSource, CameraPhoto, 
Capacitor, FilesystemDirectory } from "@capacitor/core";


var imageSrc = ref('e') ;
//var imageUrl = 'www'
//const imageSrc = "if u seee this imagesrc is not working"

export function usePhotoGallery() {
    const { Camera } = Plugins;
    const photos = 'www';

    const takePhoto = async () => {
      const cameraPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
 
      });

      console.log(cameraPhoto.webPath)
      var imageUrl = cameraPhoto.webPath 
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


  export{
     imageSrc 
  }


