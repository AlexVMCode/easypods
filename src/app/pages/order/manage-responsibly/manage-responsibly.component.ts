import { Component, OnInit, Inject } from '@angular/core';
import { map, Observable, startWith } from 'rxjs';
import { Users } from 'src/app/shared/models/users';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from 'src/app/shared/services/user.service';
import { FormControl } from '@angular/forms';
import { OrderService } from 'src/app/shared/services/order.service';
import { StatusDetailOrderEnum } from 'src/app/shared/enum/status-detail-order';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-responsibly',
  templateUrl: './manage-responsibly.component.html',
  styleUrls: ['./manage-responsibly.component.css']
})
export class ManageResponsiblyComponent implements OnInit {

  public orderId: number;
  public marketId: number;
  public users: Array<Users>;
  public options: string[] = [];
  public filteredOptions: Observable<string[]>;
  public myControl = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<ManageResponsiblyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private orderService: OrderService,
    private notificationService: NotificationService,
  ) {
    if (data) {
      this.orderId = data.orderId;
      this.marketId = data.marketId;
    }
  }

  ngOnInit(): void {
    this.getUsers();
  }

  // Listar usuarios
  public getUsers() {
    this.userService.getUsers(this.marketId).subscribe(
      response => {
        this.users = response;
        response.forEach(item => {
          this.options.push(item.userName);
        })
        if (this.data.userName) {
          this.filterUser(this.data.userName);
        } else {
          this.filterUser('');
        }
      },
      error => {
        this.users = [];
        this.notificationService.notification('info', '', error);
      }
    )
  }

  public getUserId(userName: string | null) {
    let user: Users | undefined = this.users.find(item => item.userName == userName);
    return user ? user.id : null;
  }

  filterUser(userName: string) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.myControl.setValue(userName);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  // Asignar usuario a pedido
  public setUserToOrder() {
    let userId = this.getUserId(this.myControl.value);

    if (userId) {
      this.orderService.setUserToOrder(userId, this.orderId).subscribe(
        response => {
          if (response.isSuccess) {
            const params = {
              orderId: this.orderId,
              orderStatusId: StatusDetailOrderEnum.Assigned,
            };
            this.orderService.getChangeStatus(params).subscribe(
              response => {
                if (response.isSuccess) {

                  this.dialogRef.close({
                    change: true
                  });

                } else {
                  console.log(response);
                  this.notificationService.notification('info', '', response.message);
                }
              },
              error => {
                console.log(error);
                this.notificationService.notification('info', '', error);
              }
            )
          } else {
            console.log(response);
            this.notificationService.notification('info', '', response.message);
          }
        },
        error => {
          this.users = [];
          this.notificationService.notification('info', '', error);
        }
      )
    } else {
      console.log(userId);
    }
  }
}
