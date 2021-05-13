import { toastController, IonToast } from "@ionic/vue";

const globalToast = async (color, message) => {
  const toast = await toastController.create({
    color: color,
    duration: 2000,
    message: message,
    showCloseButton: true
  });

  await toast.present();
};

export default globalToast;
