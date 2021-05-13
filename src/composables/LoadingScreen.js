import { loadingController } from "@ionic/vue";

const closeLoading = async () => {
  await loadingController.dismiss();
};

export default closeLoading;
/*loading screen modal*/

const presentLoading = async () => {
  const loading = await loadingController.create({
    cssClass: "my-custom-class",
    message: "Please wait...",
    duration: true
  });

  await loading.present();
};

export { presentLoading, closeLoading };
