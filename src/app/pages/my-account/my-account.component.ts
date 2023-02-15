import { NgxSpinnerService } from 'ngx-spinner';
import { Component, ElementRef, OnInit, Inject, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/shared/services/account.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { MouseEvent } from '@agm/core';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { UserService } from 'src/app/shared/services/user.service';
import { Users } from 'src/app/shared/models/users';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserFormComponent } from './user-form/user-form-component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
})
export class MyAccountComponent implements OnInit {
  public nameMarket = '';
  lat: number = 0;
  lng: number = 0;
  public userId: any;
  public marketId: number;
  public infoMarket: any = {};
  public listPaymentMethods: any;
  public listBanks: any;
  public listBankAccountTypes: any;
  public listCategories: any;

  /* start json body Market */
  public arrayMarket: any = {
    marketCategoryId: '',
    latitude: '',
    longitude: '',
    email: '',
    phone: '',
    shippingCost: '',
    marketRate: '',
    isActive: '',
    temporaryClosed: '',
    attentionHolidays: '',
    catalogId: '',
    paymentMethods: '',
    deliveryCoverage: '',
    maxConcurrentOrder: '',
    approximateDeliveryTime: ''
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

  // Users
  public users: Array<Users>;
  dataSource: MatTableDataSource<Users> = new MatTableDataSource<Users>();
  sorteable: MatSortable;
  displayedColumns: string[] = ['name', 'phone', 'rol', 'status', 'actions'];

  @ViewChild('scheduledOrdersPaginator', { static: false }) set paginator(pager: MatPaginator) {
    if (pager) this.dataSource.paginator = pager;
  }

  @ViewChild(MatSort, { static: false }) set sort(sorter: MatSort) {
    if (sorter) this.dataSource.sort = sorter;
  }

  constructor(
    private elementRef: ElementRef,
    public dialog: MatDialog,
    public accountService: AccountService,
    public userService: UserService,
    public notificationService: NotificationService,
    public spinner: NgxSpinnerService,
    public loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.userId = this.loginService.getCurrentUserId();
    this.marketId = Number(this.loginService.getCurrentMarketId());
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = '../assets/js/main.js';
    this.elementRef.nativeElement.appendChild(s);
    this.getAllPaymentMethods();
    this.getAllBanks();
    this.getBankAccountTypes();
    this.getCategories();
    this.getInfoMarket();
    this.getUsers();
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

  public getInfoMarket() {
    this.spinner.show();
    this.accountService.marketById(this.marketId).subscribe(
      (result) => {
        if (result.isSuccess === true) {
          this.infoMarket = result.resultData;

          this.arrayMarket = {
            id: this.infoMarket.id,
            businessName: this.infoMarket.businessName,
            documentTypeId: this.infoMarket.documentTypeId,
            documentType: this.infoMarket.documentType,
            documentNumber: this.infoMarket.documentNumber,
            marketCategoryId: this.infoMarket.marketCategoryId,
            latitude: this.infoMarket.latitude,
            longitude: this.infoMarket.longitude,
            email: this.infoMarket.email,
            phone: this.infoMarket.phone,
            shippingCost: this.infoMarket.shippingCost,
            marketRate: this.infoMarket.marketRate,
            isActive: this.infoMarket.isActive,
            temporaryClosed: this.infoMarket.temporaryClosed,
            attentionHolidays: this.infoMarket.attentionHolidays,
            catalogId: this.infoMarket.catalogId,
            deliveryCoverage: this.infoMarket.deliveryCoverage,
            address: this.infoMarket.address,
            maxConcurrentOrder: this.infoMarket.maxConcurrentOrder,
            approximateDeliveryTime: this.infoMarket.approximateDeliveryTime,
          };
          this.listTablePaymentMethods = this.infoMarket.marketPaymentMethods;
          this.listTableSchedules = this.infoMarket.marketSchedules;
          this.lat = this.infoMarket.latitude;
          this.lng = this.infoMarket.longitude;
          this.getLocation(false);
          this.uploadSchedules();
        } else {
          this.infoMarket = [];
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.infoMarket = [];
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
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

  public mapClicked($event: MouseEvent) {
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

  // **************** USERS **********************

  openDialog(userId: number = 0) {

    let user: Users | undefined = this.users.find(item => item.id == userId);

    const dialogRef = this.dialog.open(UserFormComponent, {
      data: user,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getUsers();
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public getUsers() {

    this.userService.getUsers(this.marketId).subscribe(
      response => {
        this.users = response;
        this.dataSource.data = (Object.values(this.users));
      },
      error => {
        this.users = [];
        this.notificationService.notification('info', '', error);
      }
    )
  }
}
