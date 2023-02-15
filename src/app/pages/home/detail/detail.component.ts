import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Combo } from 'src/app/shared/interfaces/combo';
import { OrderDetailReport } from 'src/app/shared/interfaces/order-detail-report';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  detailForm: FormGroup;
  submitted: boolean = false;
  users: Array<Combo> = [];
  states: Array<Combo> = [];
  colors: Array<Combo> = [];
  ordersDetail: Array<OrderDetailReport> = [];
  filteredOrders: Array<OrderDetailReport> = [];
  dataSource: MatTableDataSource<OrderDetailReport> = new MatTableDataSource<OrderDetailReport>();
  sorteable: MatSortable;
  displayedColumns: string[] = ['orderNumber', 'client', 'statusName', 'paymentName', 'totalPurchase', 'shippingCost', 'createdAt', 'minutesDiff', 'userName', 'detail'];

  @ViewChild('scheduledOrdersPaginator', { static: false }) set paginator(pager: MatPaginator) {
    if (pager) this.dataSource.paginator = pager;
  }

  @ViewChild(MatSort, { static: false }) set sort(sorter: MatSort) {
    if (sorter) this.dataSource.sort = sorter;
  }

  constructor(
    public dialogRef: MatDialogRef<DetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.ordersDetail = data.ordersDetail;
    this.users = data.userList;
    this.states = data.statusList;
    this.colors = data.colorList;

    this.detailForm = this.formBuilder.group({
      userName: [data.userName ? data.userName : '', Validators.required],
      statusId: [data.statusId ? data.statusId : '', [Validators.required, Validators.pattern('^[0-9]*$')]],
      color: [data.color ? data.color : '']
    });
  }

  get f() {
    return this.detailForm.controls;
  }

  ngOnInit(): void {
    this.filterData();
  }

  filterData() {
    this.filteredOrders = [];
    this.ordersDetail.forEach(element => {
      let userName = this.detailForm.value.userName ? this.detailForm.value.userName : element.userName;
      let statusId = this.detailForm.value.statusId ? this.detailForm.value.statusId : element.statusId;
      let color = this.detailForm.value.color ? this.detailForm.value.color : element.color;
      if (element.userName == userName && element.statusId == statusId && element.color == color) {
        this.filteredOrders.push(element);
      }
    });
    this.dataSource.data = (Object.values(this.filteredOrders));
  }

  viewDetail(id: string) {
    this.dialogRef.close();
    this.router.navigate(['/order/detail/' + id]);
  }
}
