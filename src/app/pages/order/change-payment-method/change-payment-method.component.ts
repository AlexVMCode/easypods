import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from 'src/app/shared/services/order.service';
import { AccountService } from 'src/app/shared/services/account.service';

@Component({
  selector: 'app-change-payment-method',
  templateUrl: './change-payment-method.component.html',
  styleUrls: ['./change-payment-method.component.css']
})
export class ChangePaymentMethodComponent implements OnInit {

  paymentMethodForm: FormGroup;
  orderId: number;
  paymentMethods: Array<any> = []
  submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ChangePaymentMethodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private accountService: AccountService
  ) {
    this.orderId = data ? data.id : 0;
    this.paymentMethodForm = this.formBuilder.group({
      orderId: [this.orderId, Validators.required],
      payMethodId: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });

    if (data) {
      this.paymentMethodForm.get('payMethodId')?.setValue(data.paymentMethodId);
    }
  }

  get f() {
    return this.paymentMethodForm.controls;
  }

  ngOnInit(): void {
    this.getPaymentMethods();
  }

  getPaymentMethods() {
    this.accountService.getPaymentMethods().subscribe({
      next: response => {
        if (response.isSuccess) {
          this.paymentMethods = response.resultData;
        }
      },
      error: error => {
        console.log(error)
      }
    })
  }

  savePaymentMethod() {
    let payMethodId = this.paymentMethodForm.get('payMethodId')?.value;
    this.orderService.changePaymentMethod(this.orderId, payMethodId).subscribe({
      next: (response) => {
        if (response.isSuccess) {

          let paymentMethod = this.paymentMethods.find(element => element.id == payMethodId);

          this.dialogRef.close(
            {
              change: true,
              payMethodId: payMethodId,
              payMethodName: paymentMethod.paymentName
            }
          )
        }
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
