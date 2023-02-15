import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { ImageModel } from 'src/app/shared/models/image.model';
import { ChatService } from '../../shared/services/chat.service';
import { UserFormComponent } from '../../pages/my-account/user-form/user-form-component';
import { MatDialogRef } from '@angular/material/dialog';
import { FileUtils } from 'src/app/shared/functions/file-utils';

@Component({
  selector: 'app-take-photo',
  templateUrl: './take-photo.component.html',
  styleUrls: ['./take-photo.component.css']
})
export class TakePhotoComponent implements OnInit {

  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();
  public imageModel: ImageModel;
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  private linkFile: string;

  constructor(
    public dialogRef: MatDialogRef<UserFormComponent>,
    private chatService: ChatService,
    private fileUtils: FileUtils
  ) {
    this.imageModel = new ImageModel();
  }

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.toggleWebcam();
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.imageModel.ImageBase64 = webcamImage.imageAsDataUrl;
    this.pictureTaken.emit(webcamImage);
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public getUrlImage() {
    let blob = this.fileUtils.base64ToFile(this.imageModel.ImageBase64);
    let file: File = new File([blob], 'snapchot.jpeg', { type: blob.type });
    const params = new FormData();
    params.append('file', file);
    this.chatService.saveFile(params).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.linkFile = response.resultData;
          this.dialogRef.close(this.linkFile);
        }
      },
      error: (error) => {
        console.log(error)
      }
    });
  }
}
