import { Router } from '@angular/router';
import {
  Component,
  OnInit,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/shared/services/login.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { Roles } from 'src/app/shared/enum/roles';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  public ordersList: any;
  public marketId: number;
  public userId: number;
  public rol: string;
  public statusList: any;
  public page: any = 1;
  public pageSize: any;
  p: number = 1;
  tableSizes: any = [3, 6, 9, 12];
  currentPage = 1;
  itemsPerPage = 10;
  public totalItems: any;
  public tablePaginationDropDowns = [
    { label: "5" },
    { label: "10" },
    { label: "20" }
  ]

  constructor(
    public notificationService: NotificationService,
    public spinner: NgxSpinnerService,
    public loginService: LoginService,
    public orderService: OrderService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.marketId = Number(this.loginService.getCurrentMarketId());
    this.userId = Number(this.loginService.getCurrentUserId());
    this.rol = this.loginService.getRol();
    this.getOrders(1, this.itemsPerPage);
    this.getStatus();
  }

  public getOrders(fromIndex?: number, toIndex?: any) {
    if (toIndex.value !== undefined) {
      toIndex = toIndex?.value
    }
    this.spinner.show();
    const params = {
      marketId: this.marketId,
      marketUserId: this.userId,
      fromIndex: fromIndex,
      toIndex: toIndex
    };

    if (this.rol == Roles.superAdmin || this.rol == Roles.admin) {
      params.marketUserId = 0;
    }

    this.orderService.getOrderById(params).subscribe(
      (result) => {
        if (result.isSuccess) {
          this.totalItems = result.resultData.allItems;
          this.ordersList = result.resultData.listOrders;
        } else {
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.ordersList = [];
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
  }

  public detailOrder(item: any) {
    this.router.navigate(['/order/detail/' + item.id], item);
  }

  public getStatus() {
    this.spinner.show();
    this.orderService.getStatusOrder().subscribe(
      (result) => {
        if (result.isSuccess) {
          this.statusList = result.resultData;
        } else {
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.statusList = [];
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }
  public pageChanged(event: any) {
    this.currentPage = event;
    this.getOrders(this.currentPage, this.itemsPerPage);
  }
  absoluteIndex(indexOnPage: number): number {
    return this.itemsPerPage * (this.currentPage - 1) + indexOnPage;
  }
}
