import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  State
} from "@stencil/core";
import { ImageCapture } from "image-capture";

@Component({
  tag: "capture-img",
  styleUrl: "capture-img.scss"
})
export class CaptureImg {
  videoElement: any;
  stream: any;

  @Element() el: HTMLElement;

  @Event() imageCaptured: EventEmitter<any>;

  componentDidLoad() {
    this.videoElement = this.el.querySelector("video");

    this.getDevice().then(videoSource => {
      this.getStream(videoSource);
    });
  }

  getStream(videoSource = undefined) {
    return navigator.mediaDevices
      .getUserMedia({
        video: {
          deviceId: videoSource ? { exact: videoSource.deviceId } : undefined
        }
      })
      .then(stream => this.gotStream(stream));
  }

  getDevice() {
    return navigator.mediaDevices.enumerateDevices().then(devices => {
      console.log(devices);
      return devices
        .filter(device => device.kind === "videoinput")
        .filter(device => device.label.indexOf("back") != -1)[0];
    });
  }

  gotStream(stream) {
    this.stream = stream;
    this.videoElement.srcObject = stream;

    return navigator.mediaDevices.enumerateDevices();
  }

  captureImage(event) {
    const mediaStreamTrack = this.stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(mediaStreamTrack);
    imageCapture.takePhoto().then(blob => {
      this.imageCaptured.emit(blob);
    });
  }

  render() {
    return (
      <div>
        <video id="video" autoplay />
        <ion-button onClick={(event: UIEvent) => this.captureImage(event)}>
          Capture image
        </ion-button>
      </div>
    );
  }
}
