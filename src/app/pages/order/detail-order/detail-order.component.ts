import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatusDetailOrderEnum } from 'src/app/shared/enum/status-detail-order';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Users } from 'src/app/shared/models/users';
import { LoginService } from 'src/app/shared/services/login.service';
import { FileUtils } from 'src/app/shared/functions/file-utils';
import { TypeMessage } from 'src/app/shared/enum/type-message';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// import { NgAudioRecorderService, OutputFormat, RecorderState } from 'ng-audio-recorder';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { TakePhotoComponent } from 'src/app/components/take-photo/take-photo.component';
import { ChangePaymentMethodComponent } from '../change-payment-method/change-payment-method.component';
import { MatDrawer } from '@angular/material/sidenav';
import { SuggestChangeComponent } from '../suggest-change/suggest-change.component';
import { MessageChat } from 'src/app/shared/models/message-chat';
import { ManageResponsiblyComponent } from '../manage-responsibly/manage-responsibly.component';

import * as RecordRTC from 'recordrtc';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';


declare var bootstrap: any;

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.css'],
})

export class DetailOrderComponent implements OnInit {
  public ordersDetailList: any = [];
  public orderId: number;
  public marketId: number;
  public orderStatusId: number;
  public paymentStatus: boolean = false;
  public dispatchStatus: boolean = false;

  lat: number = 0;
  lng: number = 0;
  public zoom = 18;
  public historyChatList: Array<MessageChat> = [];

  public isCloseMsgChat = false;
  public idInterval: any;

  public nameSuggestedProduct: string;
  public imageSuggestedProduct: string;
  public priceSuggestedProduct: number;
  public quantitySuggestedProduct: number;
  public myModalChange: any;
  public modalChat: any;
  public itemModal: any;
  public users: Array<Users>;
  public file: any = null;
  public type: string;
  public link: string;
  public buttonsMessage: any = null;
  public headerImageMessage: any = null;

  public allowTypes: string;
  chatForm: FormGroup;
  submitted: boolean = false;
  showInputFile: boolean = false;
  showInputAudio: boolean = false;
  isInactiveOrder: boolean = false;
  TypeMessage = TypeMessage;

  // Record Audio
  recordingStarted: boolean = false;
  // recordingPaused: boolean = false;
  audioBlob: Blob;
  audioBlobURL: SafeUrl;
  // audioFile: File;
  private interval: any;
  private startTime: moment.Moment | null;
  audioRecordedTime: string = '00:00';
  ffmpeg = createFFmpeg({ log: true });



  recordRTC: RecordRTC;

  @ViewChild('drawer', { static: false }) matDrawer: MatDrawer;

  constructor(
    public dialog: MatDialog,
    // private ref: ChangeDetectorRef,
    private orderService: OrderService,
    private loginService: LoginService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer,
    // private audioRecorderService: NgAudioRecorderService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private routeActive: ActivatedRoute,
    private fileUtils: FileUtils
  ) {
    this.chatForm = this.formBuilder.group({
      message: ['', Validators.required]
    });

    // this.audioRecorderService.recorderError.subscribe(recorderErrorCase => {
    //   console.log(recorderErrorCase);
    //   // Handle Error
    // });
  }

  get f() {
    return this.chatForm.controls;
  }

  ngOnInit(): void {
    this.marketId = parseInt(this.loginService.getCurrentMarketId());
    this.orderId = parseInt(this.routeActive.snapshot.params['id']);
    this.allowTypes = this.fileUtils.getAllowTypesFormated();
    this.getDetailOrders();
    this.idInterval = setInterval(() => {
      this.getHistoryChatWA();
    }, 6000);
  }

  ngOnDestroy() {
    if (this.idInterval) {
      clearInterval(this.idInterval);
    }
    // this.abortAudioRecording();
  }

  // Listar detalle de pedido
  public getDetailOrders() {
    this.spinner.show();
    this.orderService.getDetailOrderById(this.orderId).subscribe(
      (result) => {
        if (result.isSuccess) {
          this.ordersDetailList = result.resultData;
          this.lat = parseFloat(this.ordersDetailList.clientLocation.latitude);
          this.lng = parseFloat(this.ordersDetailList.clientLocation.longitude);
          this.paymentStatus = this.ordersDetailList.orderPaymentReceived;
          this.getHistoryChatWA();
          this.validateShowActions();
          this.validateButtonDispatchOrder();
        } else {
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.ordersDetailList = [];
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
  }

  // Cambiar estado a producto
  public changeStatusProduct(
    orderId: number,
    detailId: number,
    orderStatusId: number,
    productStatusId: number,
    product: any
  ) {
    const params = {
      orderId: orderId,
      detailId: detailId,
      orderStatusId: orderStatusId,
      orderDetailStatusId: productStatusId,
      productName: "",
      value: 0,
      quantity: 0
    };

    if (productStatusId == 4) {
      params.productName = this.nameSuggestedProduct;
      params.value = this.priceSuggestedProduct;
      params.quantity = this.quantitySuggestedProduct;
    }

    this.spinner.show();
    this.orderService.changeStatusProduct(params).subscribe({
      next: (result) => {
        if (result.isSuccess) {
          this.getDetailOrders();
          product.productStatusId = productStatusId;
          let message = '';
          switch (productStatusId) {
            case 3:
              // Producto rechazado por comercio
              message = 'El producto ' + product.productName + ' será rechazado';
              this.headerImageMessage = {
                type: "image",
                image: {
                  link: product.productImage
                }
              };
              this.openModal(message);
              break;
            case 4:
              // Solicitud de cambio por comercio
              message =
                'Hola, por el momento no contamos con  ' +
                product.productName + " X " + product.productQuantity + " por un precio unitario de: $" + product.productPrice +
                ', le podemos sugerir ' +
                this.nameSuggestedProduct + " X " + this.quantitySuggestedProduct + ' por un precio unitario de: $' + this.priceSuggestedProduct;
              this.buttonsMessage = [
                {
                  type: "reply",
                  reply: {
                    id: 'CHANGE-' + this.itemModal.id + '-OK',
                    title: "Acepto 👍"
                  }
                },
                {
                  type: "reply",
                  reply: {
                    id: 'CHANGE-' + this.itemModal.id + '-NO',
                    title: "No gracias 👎"
                  }
                }
              ];
              this.headerImageMessage = {
                type: "image",
                image: {
                  link: this.imageSuggestedProduct
                }
              };
              this.openModal(message);
              break;

            default:
              break;
          }
        } else {
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      error: (error) => {
        this.ordersDetailList = [];
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    }
    );
  }

  // Despachar pedido
  public dispatchOrder() {
    const params = {
      orderId: this.orderId,
      orderStatusId: StatusDetailOrderEnum.Dispatched,
    };
    this.spinner.show();
    this.orderService.getChangeStatus(params).subscribe(
      (result) => {
        if (result.isSuccess) {
          let message =
            'El pedido ' +
            this.ordersDetailList.orderNumber +
            ' de ' +
            this.ordersDetailList.clientName +
            ' será despachado.' +
            'La dirección de entrega es: ' +
            this.ordersDetailList.clientLocation.address;
          this.notificationService.notification('success', '', message);
          this.chatForm.get('message')?.setValue(message);
          this.ordersDetailList.orderStatusId =
            StatusDetailOrderEnum.Dispatched;
          this.headerImageMessage = null;
          this.getChatWA();
          this.validateShowActions();
        } else {
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.ordersDetailList = [];
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
  }

  // Cancelar pedido
  public cancelOrder() {
    let responseDialog = this.notificationService.notificationButton(
      'warning',
      'Cancelar',
      '¿Está seguro que quiere cancelar el pedido?'
    );
    responseDialog.then((result: any) => {
      if (result.isConfirmed) {
        const params = {
          orderId: this.orderId,
          orderStatusId: StatusDetailOrderEnum.RejectedByCommerce,
        };
        this.spinner.show();
        this.orderService.getChangeStatus(params).subscribe(
          (result) => {
            if (result.isSuccess) {
              let message =
                'El pedido ' +
                this.ordersDetailList.orderNumber +
                ' de ' +
                this.ordersDetailList.clientName +
                ' se canceló con éxito.';
              this.chatForm.get('message')?.setValue(message);
              this.headerImageMessage = null;
              this.getChatWA();
              this.notificationService.notification('success', '', message);
              this.ordersDetailList.orderStatusId =
                StatusDetailOrderEnum.RejectedByCommerce;
              this.validateShowActions();
            } else {
              this.notificationService.notification('info', '', result.message);
            }
            this.spinner.hide();
          },
          (error) => {
            this.ordersDetailList = [];
            this.spinner.hide();
            this.notificationService.notification('info', '', error);
          }
        );
      }
    });
  }

  // Pedido entregado
  public deliveredOrder() {
    const params = {
      orderId: this.orderId,
      orderStatusId: StatusDetailOrderEnum.Delivered,
    };
    this.spinner.show();
    this.orderService.getChangeStatus(params).subscribe(
      (result) => {
        if (result.isSuccess) {
          let message =
            'El pedido ' +
            this.ordersDetailList.orderNumber +
            ' de ' +
            this.ordersDetailList.clientName +
            ' ya fue entregado.';
          this.notificationService.notification('success', '', message);
          this.isCloseMsgChat = true;
          let messageCustomer =
            'El pedido ' +
            this.ordersDetailList.orderNumber +
            ' de ' +
            this.ordersDetailList.clientName +
            ' ya fue entregado, gracias por su compra ¿recibiste bien tu compra?';
          this.chatForm.get('message')?.setValue(messageCustomer);
          this.buttonsMessage = [
            {
              type: "reply",
              reply: {
                id: 'RECEIVED-' + this.orderId + '-OK',
                title: "Si 👍"
              }
            },
            {
              type: "reply",
              reply: {
                id: 'RECEIVED-' + this.orderId + '-NO',
                title: "No 👎"
              }
            }
          ];
          this.ordersDetailList.orderStatusId = StatusDetailOrderEnum.Delivered;
          this.headerImageMessage = null;
          this.getChatWA();
          this.validateShowActions();
        } else {
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.ordersDetailList = [];
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
  }

  // Pedido no entregado
  public undeliveredOrder() {
    const params = {
      orderId: this.orderId,
      orderStatusId: StatusDetailOrderEnum.Undelivered,
    };
    this.spinner.show();
    this.orderService.getChangeStatus(params).subscribe(
      (result) => {
        if (result.isSuccess) {
          let message =
            'El pedido ' +
            this.ordersDetailList.orderNumber +
            ' de ' +
            this.ordersDetailList.clientName +
            ' no fue entregado.';
          this.notificationService.notification('warning', '', message);
          this.isCloseMsgChat = true;
          let messageCustomer =
            'El pedido ' +
            this.ordersDetailList.orderNumber +
            ' de ' +
            this.ordersDetailList.clientName +
            ' no pudo ser entregado. Por favor escribanos para revisar.';
          this.chatForm.get('message')?.setValue(messageCustomer);
          this.ordersDetailList.orderStatusId = StatusDetailOrderEnum.Undelivered;
          this.headerImageMessage = null;
          this.getChatWA();
          this.validateShowActions();
        } else {
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.ordersDetailList = [];
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
  }

  // Gestionar responsable
  public openManageResponsibly() {
    const dialogRef = this.dialog.open(ManageResponsiblyComponent, {
      data: {
        orderId: this.orderId,
        marketId: this.marketId,
        userName: this.ordersDetailList.userName
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.change) {
        this.notificationService.notification('info', 'Pedido asignado', 'Se ha asignado correctamente el pedido');
        this.getDetailOrders();
      }
    });
  }

  // Cambiar estado de pago
  public changePaymentStatus() {
    this.orderService.changePaymentStatus(this.orderId, !this.paymentStatus).subscribe({
      next: response => {
        if (response.isSuccess) {
          this.paymentStatus = !this.paymentStatus;
          this.validateButtonDispatchOrder();
        } else {
          this.notificationService.notification('danger', 'Error', 'Se ha presentado un error al cambiar el estado del pago');
        }
      },
      error: error => {
        console.log(error);
        this.notificationService.notification('danger', 'Error', 'Se ha presentado un error al cambiar el estado del pago');
      }
    })
  }

  // Cambiar método de pago
  public changePaymentMethod() {
    const dialogRef = this.dialog.open(ChangePaymentMethodComponent, {
      data: this.ordersDetailList
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data && data.change) {
        this.getDetailOrders();
        let message = 'El método de pago a sido cambiado a ' + data.payMethodName;
        this.type = TypeMessage.text;
        this.openModal(message);
        this.sendMessage();
      }
    });
  }

  // Sugerir cambio de producto
  public openSuggetsChange(orderStatusId: number, item: any) {
    this.orderStatusId = orderStatusId;
    this.itemModal = item;
    const dialogRef = this.dialog.open(SuggestChangeComponent, {
      data: item,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.change) {
        this.nameSuggestedProduct = data.productName;
        this.quantitySuggestedProduct = data.productQuantity;
        this.priceSuggestedProduct = data.productPrice;
        this.imageSuggestedProduct = data.productImage;
        this.changeStatusProduct(this.orderId, data.product.id, this.orderStatusId, 4, data.product);
      }
    });
  }

  // Validar boton despachar orden
  validateButtonDispatchOrder() {
    this.orderService.getDispatchStatus(this.orderId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dispatchStatus = response.resultData.validDispatch;
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  // *************************** CHAT ********************************************************

  // Actualizar historial de chat
  public getHistoryChatWA() {
    this.orderService.getHistoricalChat(this.orderId).subscribe({
      next: (messages) => {
        this.historyChatList = messages;
      },
      error: (error) => {
        this.ordersDetailList = [];
        this.notificationService.notification('info', '', error);
      }
    }
    );
  }

  public getChatWA() {
    this.submitted = true;
    if (this.chatForm.invalid) {
      return
    } else {
      if (this.chatForm.get('message')?.value) {
        this.type = TypeMessage.text;
        this.link = '';
        this.sendMessage();
      }
    }
  }

  // Enviar mensaje
  public sendMessage() {
    this.spinner.show();
    const params = {
      orderId: this.orderId,
      destination: this.ordersDetailList.clientWA,
      type: this.type,
      message: this.chatForm.get('message')?.value,
      link: this.link,
      isCloseMsg: this.isCloseMsgChat,
      buttons: this.buttonsMessage,
      header: this.headerImageMessage
    };

    this.orderService.sendMessageChat(params).subscribe(
      (result) => {
        if (result.isSuccess) {
          this.submitted = false;
          this.getHistoryChatWA();
          this.buttonsMessage = null;
        } else {
          this.notificationService.notification('info', '', result.message);
        }
        this.chatForm.get('message')?.setValue('');
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.chatForm.get('message')?.setValue('');
        this.buttonsMessage = null;
        this.notificationService.notification('info', '', error);
      }
    );
  }

  // Enviar información de pago
  public sendPaymentInformation() {
    this.orderService.sendPaymentInformation(this.orderId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.notificationService.notification('success', 'Información de pago enviada correctamente', '');
        } else {
          this.notificationService.notification('error', 'No se pudo enviar la información de pago', '');
          console.log(response);
        }
      },
      error: (error) => {
        this.notificationService.notification('error', 'No se pudo enviar la información de pago', '');
        console.log(error);
      }
    })
  }

  // Enviar resumen de pedido
  public sendOrderSummary() {
    this.orderService.sendOrderSummary(this.orderId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.notificationService.notification('success', 'Resumen de pedido enviado correctamente', '');
        } else {
          this.notificationService.notification('error', 'No se pudo enviar el resumen de pedido', '');
          console.log(response);
        }
      },
      error: (error) => {
        this.notificationService.notification('error', 'No se pudo enviar el resumen de pedido', '');
        console.log(error);
      }
    })
  }

  // Abrir modal
  public openModal(message?: string) {
    this.chatForm.get('message')?.setValue('');
    this.modalChat = new bootstrap.Modal(
      document.getElementById('exampleModalScrollable'),
      {
        keyboard: false,
      }
    );
    document.getElementById("viewChat")?.addEventListener("mouseover", (e: any) => {
      document.getElementById("inputChat")?.focus();
    });

    if (message) {
      this.chatForm.get('message')?.setValue(message);
    }
    this.modalChat.toggle();
  }

  // *************************** ACCIONES ********************************************************

  // Validar si pedido está activo para mostrar acciones
  validateShowActions() {
    if (this.ordersDetailList.orderStatusId == StatusDetailOrderEnum.RejectedByCommerce ||
      this.ordersDetailList.orderStatusId == StatusDetailOrderEnum.Delivered ||
      this.ordersDetailList.orderStatusId == StatusDetailOrderEnum.CancelByClient ||
      this.ordersDetailList.orderStatusId == StatusDetailOrderEnum.ReceivedByClient ||
      this.ordersDetailList.orderStatusId == StatusDetailOrderEnum.DeliveryWithNews ||
      this.ordersDetailList.orderStatusId == StatusDetailOrderEnum.Undelivered) {
      this.isInactiveOrder = true;
    } else {
      this.isInactiveOrder = false;
    }
  }

  // *************************** MULTIMEDIA ********************************************************

  public saveFile() {
    this.submitted = true;
    if (this.file) {
      const params = new FormData();
      params.append('file', this.file);
      this.orderService.saveFile(params).subscribe(
        response => {
          this.link = response.resultData;
          let extension = this.fileUtils.getExtension(this.link);
          let type = this.fileUtils.getType(extension);
          if (type) {
            this.type = type;
            this.showInputFile = false;
            this.showInputAudio = false;
            this.sendMessage();
          }
        },
        error => {
          console.log(error)
        }
      );
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.fileUtils.isAllowType(file.type)) {
        this.file = file;
        console.log(this.file);
      } else {
        this.file = null;
      }
    }
  }

  // *************************** AUDIO ********************************************************

  startRecording() {
    this.showInputAudio = true;
    this.recordingStarted = true;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.recordRTC = new RecordRTC(stream, {
        type: 'audio',
        mimeType: "audio/wav",
        sampleRate: 44100,
        numberOfAudioChannels: 2
      });
      this.startTime = moment();
      this.interval = setInterval(() => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time =
          this.toString(diffTime.minutes()) +
          ":" +
          this.toString(diffTime.seconds());
        this.audioRecordedTime = time;
      }, 1000);
      this.recordRTC.startRecording();
    });
  }

  async stopRecording() {
    this.recordingStarted = false;
    clearInterval(this.interval);
    this.recordRTC.stopRecording(async () => {
      this.audioBlob = this.recordRTC.getBlob();
      this.audioBlobURL = URL.createObjectURL(this.audioBlob);
      console.log(this.audioBlob);
      console.log(this.audioBlobURL);
      // aquí puedes convertir el archivo a formato mp3 utilizando una biblioteca como "ffmpeg.js"
      // Carga el archivo de audio grabado en ffmpeg
      await this.ffmpeg.load();
      this.ffmpeg.FS('writeFile', 'audio.wav', await fetchFile(this.audioBlob));

      // Convierte el archivo a formato mp3 utilizando FFmpeg
      await this.ffmpeg.run('-i', 'audio.wav', '-c:a', 'libmp3lame', 'output.mp3');

      // Lee el archivo convertido de la memoria de ffmpeg
      const data = this.ffmpeg.FS('readFile', 'output.mp3');
      const mp3Blob = new Blob([data.buffer], { type: 'audio/mp3' });
      this.audioBlobURL = URL.createObjectURL(mp3Blob);

      console.log(mp3Blob);
    });
  }

  async loadFFmpeg() {
    await this.ffmpeg.load();
  }


  // startRecording() {
  //   this.showInputAudio = true;
  //   this.recordingStarted = true;
  //   this.audioRecorderService.startRecording();
  //   this.startTime = moment();
  // this.interval = setInterval(() => {
  //   const currentTime = moment();
  //   const diffTime = moment.duration(currentTime.diff(this.startTime));
  //   const time =
  //     this.toString(diffTime.minutes()) +
  //     ":" +
  //     this.toString(diffTime.seconds());
  //   this.audioRecordedTime = time;
  // }, 1000);
  //   // this.audioRecorderService.getUserContent().then((mediaStream) => {
  //   //   console.log(mediaStream.getAudioTracks)
  //   // });
  // }

  // pauseRecording() {
  //   this.recordingPaused = true;
  //   this.audioRecorderService.pause();
  // }

  // resumeRecording() {
  //   this.recordingPaused = false;
  //   this.audioRecorderService.resume();
  // }

  // stopRecording() {
  //   this.recordingStarted = false;
  //   clearInterval(this.interval);
  //   let state = this.audioRecorderService.getRecorderState();
  //   if (state == RecorderState.RECORDING) {
  //     let outputFormat = OutputFormat.WEBM_BLOB;
  //     this.audioRecorderService.stopRecording(outputFormat).then((blob: Blob) => {
  //       this.audioBlob = blob;
  //       this.audioBlobURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
  //       // this._downloadFile(blob, 'audio/mp3', 'audio_chat');
  //     }).catch(errrorCase => {
  //       console.log(errrorCase);
  //       // Handle Error
  //     });
  //   }
  // }

  sendAudio() {
    console.log(this.audioBlob)
    this.file = new File([this.audioBlob], "audio.mp3", { lastModified: Date.now(), type: this.audioBlob.type });
    console.log(this.file);
    // this.saveFile();
    // this._downloadFile();
  }

  // _downloadFile(): any {
  //   // const blob = new Blob([data], { type: type });
  //   const url = window.URL.createObjectURL(this.audioBlob);
  //   //this.video.srcObject = stream;
  //   //const url = data;
  //   const anchor = document.createElement('a');
  //   anchor.download = 'audio';
  //   anchor.href = url;
  //   document.body.appendChild(anchor);
  //   anchor.click();
  //   document.body.removeChild(anchor);
  // }

  private toString(value: number): string {
    let val: string = value.toString();
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  // *************************** PHOTO ********************************************************

  showModalTakePhoto() {
    this.modalChat.hide();
    const dialogRef = this.dialog.open(TakePhotoComponent);
    dialogRef.afterClosed().subscribe(data => {
      this.link = data;
      let extension = this.fileUtils.getExtension(this.link);
      let type = this.fileUtils.getType(extension);
      if (type) {
        this.type = type;
        this.showInputFile = false;
        this.sendMessage();
        this.modalChat.toggle();
      }
    });
  }
}
