import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from 'src/app/shared/services/account.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import Swal from 'sweetalert2/src/sweetalert2.js';

@Component({
  selector: 'app-admin-account',
  templateUrl: './admin-account.component.html',
  styleUrls: ['./admin-account.component.css'],
})
export class AdminAccountComponent implements OnInit {
  public nameMarket = '';
  lat: number = 0;
  lng: number = 0;
  public userId: any;
  public infoMarket: any = {};
  public listPaymentMethods: any;
  public listBanks: any;
  public listBankAccountTypes: any;
  public listCategories: any;
  public listDocumentType: any;

  /* start json body Market */
  public arrayMarket: any = {
    businessName: '',
    documentTypeId:'',
    documentNumber: '',
    address: '',
    marketCategoryId: '',
    latitude: '',
    longitude: '',
    email: '',
    phone: '',
    shippingCost: '',
    marketRate: '',
    isActive: '',
    temporaryClosed: false,
    attentionHolidays: false,
    catalogId: '',
    paymentMethods: '',
    deliveryCoverage: '',
  };

  /* end body json Market*/
  public paymentMethods: any = 0;
  public bank: any = 0;
  public accountType: any = 0;
  public accountNumber: any = null;
  public listTablePaymentMethods: any = [];

  public hourMonday: any;

  zoom: number = 16;
  /* start configuration day  */
  public toMonday: any;
  public fromMonday: any;
  public toTuesday: any;
  public fromTuesday: any;
  public toWednesday: any;
  public fromWednesday: any;
  public toThursday: any;
  public fromThursday: any;
  public toFriday: any;
  public fromFriday: any;
  public toSaturday: any;
  public fromSaturday: any;
  public toSunday: any;
  public fromSunday: any;
  /* end configuration day */
  public listTableSchedules: any = [];
  public saveAllAccount = false;
  public disabledPaymentMethods = false;
  constructor(
    public accountService: AccountService,
    public notificationService: NotificationService,
    public spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.getAllBanks();
    this.getBankAccountTypes();
    this.getAllPaymentMethods();
    this.getCategories();
    this.getDocumentsTypes();
  }

  public getLocation(consult: any) {
    if (!consult) {
      this.lat = Number(this.lat);
      this.lng = Number(this.lng);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          if (position.coords !== null) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
          } else {
            this.notificationService.notification(
              'info',
              '',
              'Active la ubicación del navegador'
            );
          }
        });
      } else {
        this.notificationService.notification(
          'info',
          '',
          'Este navegador no soporta la geolocalización.'
        );
      }
    }
  }


  public getAllPaymentMethods() {
    this.spinner.show();
    this.accountService.getPaymentMethods().subscribe(
      (result) => {
        if (result.isSuccess === true) {
          this.listPaymentMethods = result.resultData;
        } else {
          this.listPaymentMethods = [];
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.listPaymentMethods = [];
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
  }

  public getAllBanks() {
    this.spinner.show();
    this.accountService.getBanks().subscribe(
      (result) => {
        if (result.isSuccess === true) {
          this.listBanks = result.resultData;
        } else {
          this.listBanks = [];
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.listBanks = [];
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
  }

  public getBankAccountTypes() {
    this.spinner.show();
    this.accountService.getAccountTypes().subscribe(
      (result) => {
        if (result.isSuccess === true) {
          this.listBankAccountTypes = result.resultData;
        } else {
          this.listBankAccountTypes = [];
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.listBankAccountTypes = [];
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
  }

  public getCategories() {
    this.spinner.show();
    this.accountService.getCategory().subscribe(
      (result) => {
        if (result.isSuccess === true) {
          this.listCategories = result.resultData;
        } else {
          this.listCategories = [];
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.listCategories = [];
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
  }

  public saveAccount() {
    this.spinner.show();
    this.arrayMarket.marketPaymentMethods = this.listTablePaymentMethods;
    this.arrayMarket.marketSchedules = this.listTableSchedules;
    this.accountService.updateMarket(this.arrayMarket).subscribe(
      (result) => {
        if (result.isSuccess === true) {
          this.infoMarket = result.resultData;
          this.notificationService.notification('success', '', result.message);
          this.saveAllAccount = false;
        } else {
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.infoMarket = {};
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
  }

  public mapClicked($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
  }

  public modalCopySchedules() {
    Swal.fire({
      title: '',
      text: '¿Desea copiar este horario a los demás días?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.toTuesday = this.toMonday;
        this.fromTuesday = this.fromMonday;
        this.toWednesday = this.toMonday;
        this.fromWednesday = this.fromMonday;
        this.toThursday = this.toMonday;
        this.fromThursday = this.fromMonday;
        this.toFriday = this.toMonday;
        this.fromFriday = this.fromMonday;
        this.toSaturday = this.toMonday;
        this.fromSaturday = this.fromMonday;
        this.toSunday = this.toMonday;
        this.fromSunday = this.fromMonday;
        Swal.fire('Copiado', '', 'success');
      } else if (result.isDenied) {
      }
    });
  }

  public addPaymentMethods() {
    const paymentName = this.listPaymentMethods.filter(
      (itemPayment: any) => this.paymentMethods == itemPayment.id
    );
    const accountType = this.listBankAccountTypes.filter(
      (itemType: any) => this.accountType == itemType.id
    );
    let accountTypeName: any;
    if (accountType.length > 0) {
      accountTypeName = accountType[0].accountTypeName;
    } else {
      accountTypeName = null;
    }
    const bank = this.listBanks.filter(
      (itemBank: any) => this.bank == itemBank.id
    );
    let bankName: any;
    if (bank.length > 0) {
      bankName = bank[0].bankName;
    } else {
      bankName = null;
    }
    this.listTablePaymentMethods.push({
      paymentMethodId: this.paymentMethods,
      paymentName: paymentName[0].paymentName,
      bankId: this.bank,
      bankName: bankName,
      accountTypeId: this.accountType,
      accountTypeName: accountTypeName,
      accountNumber: this.accountNumber,
      qrCode: '',
    });
    this.paymentMethods = null;
    this.bank = null;
    this.accountType = null;
    this.accountNumber = null;
  }

  public saveTime() {
    this.saveAllAccount = true;
    if (this.listTableSchedules.length === 0) {
      this.listTableSchedules.push(
        {
          id: 0,
          dayOfWeek: 1,
          dayName: 'Domingo',
          startHour: this.toSunday,
          endHour: this.fromSunday,
        },
        {
          id: 0,
          dayOfWeek: 2,
          dayName: 'Lunes',
          startHour: this.toMonday,
          endHour: this.fromMonday,
        },
        {
          id: 0,
          dayOfWeek: 3,
          dayName: 'Martes',
          startHour: this.toTuesday,
          endHour: this.fromTuesday,
        },
        {
          id: 0,
          dayOfWeek: 4,
          dayName: 'Miércoles',
          startHour: this.toWednesday,
          endHour: this.fromWednesday,
        },
        {
          id: 0,
          dayOfWeek: 5,
          dayName: 'Jueves',
          startHour: this.toThursday,
          endHour: this.fromThursday,
        },
        {
          id: 0,
          dayOfWeek: 6,
          dayName: 'Viernes',
          startHour: this.toFriday,
          endHour: this.fromFriday,
        },
        {
          id: 0,
          dayOfWeek: 7,
          dayName: 'Sábado',
          startHour: this.toSaturday,
          endHour: this.fromSaturday,
        }
      );
    } else {
      this.listTableSchedules.forEach((element: any) => {
        switch (element.dayName) {
          case 'Lunes':
            element.startHour = this.toMonday;
            element.endHour = this.fromMonday;
            break;
          case 'Martes':
            element.startHour = this.toTuesday;
            element.endHour = this.fromTuesday;
            break;
          case 'Miércoles':
            element.startHour = this.toWednesday;
            element.endHour = this.fromWednesday;
            break;
          case 'Jueves':
            element.startHour = this.toThursday;
            element.endHour = this.fromThursday;
            break;
          case 'Viernes':
            element.startHour = this.toFriday;
            element.endHour = this.fromFriday;
            break;
          case 'Sábado':
            element.startHour = this.toSaturday;
            element.endHour = this.fromSaturday;
            break;
          case 'Domingo':
            element.startHour = this.toSunday;
            element.endHour = this.fromSunday;
            break;
        }
      });
    }
  }

  public uploadSchedules() {
    this.listTableSchedules.forEach((element: any) => {
      switch (element.dayName) {
        case 'Lunes':
          this.toMonday = element.startHour;
          this.fromMonday = element.endHour;
          break;
        case 'Martes':
          this.toTuesday = element.startHour;
          this.fromTuesday = element.endHour;
          break;
        case 'Miércoles':
          this.toWednesday = element.startHour;
          this.fromWednesday = element.endHour;
          break;
        case 'Jueves':
          this.toThursday = element.startHour;
          this.fromThursday = element.endHour;
          break;
        case 'Viernes':
          this.toFriday = element.startHour;
          this.fromFriday = element.endHour;
          break;
        case 'Sábado':
          this.toSaturday = element.startHour;
          this.fromSaturday = element.endHour;
          break;
        case 'Domingo':
          this.toSunday = element.startHour;
          this.fromSunday = element.endHour;
          break;
      }
    });
  }

  public changePaymentMethods(id: any) {
    if (id === '2') {
      this.disabledPaymentMethods = false;
    } else {
      this.disabledPaymentMethods = true;
    }
  }


  public getDocumentsTypes() {
    this.spinner.show();
    this.accountService.getDocumentType().subscribe(
      (result) => {
        if (result.isSuccess === true) {
          this.listDocumentType = result.resultData;
        } else {
          this.listDocumentType = [];
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.listDocumentType = [];
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
  }
}


