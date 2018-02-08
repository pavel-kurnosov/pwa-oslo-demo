import { Component, Listen, Prop, State } from "@stencil/core";
import { LoadingController, AlertController } from "@ionic/core";

@Component({
  tag: "app-home",
  styleUrl: "app-home.scss"
})
export class AppHome {
  @Prop({ connect: "ion-loading-controller" })
  loadingCtrl: LoadingController;

  @Prop({ connect: "ion-alert-controller" })
  alertCtrl: AlertController;

  @Listen("imageCaptured")
  imageCapturedHandler(event: CustomEvent) {
    console.log("Received the custom event: ", event.detail);
    this.loadingCtrl.create().then(loading => {
      loading.present();
      fetch("https://YOUR_PROJECT.cloudfunctions.net/images", {
        method: "POST",
        body: event.detail
      })
        .then(response => response.json())
        .catch(error => {
          console.error("Error:", error);
          loading.dismiss();
        })
        .then(response => {
          this.alertCtrl
            .create({
              title: response.hotdog
                ? "This is HotDog!"
                : "Oh No, it is not HotDog!",
              buttons: ["Dismiss"]
            })
            .then(alert => {
              alert.present();
            });
          loading.dismiss();
        });
    });
  }
  render() {
    return (
      <ion-page class="show-page">
        <ion-header md-height="56px">
          <ion-toolbar color="primary">
            <ion-title>Is it hot dog?</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <capture-img />
        </ion-content>
      </ion-page>
    );
  }
}
