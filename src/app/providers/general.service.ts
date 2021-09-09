import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  loading:any;
  constructor(
    public alertController: AlertController,
  	public loadingController: LoadingController,
  	public toastController: ToastController
  ) { }

  async presentAlert(h, m) {
    const alert = await this.alertController.create({
      header: h,
      message: m,
      buttons: ['OK']
    });

    await alert.present();
  }

   async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please Wait',
      showBackdrop: true
    });
    await this.loading.present();
  }

  stopLoading(){
  	this.loading.dismiss();
  }
}
