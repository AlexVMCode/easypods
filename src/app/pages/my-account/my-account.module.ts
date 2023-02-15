import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MyAccountRoutingModule } from './my-account-routing.module';

import { AgmCoreModule } from '@agm/core';
import { UserFormComponent } from './user-form/user-form-component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [UserFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyAccountRoutingModule,
    MatDialogModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCiwLx6J9KctQ6tnqcP8xgKaRrm--L7Sw8'
    })
  ],
  exports: [
    AgmCoreModule
  ]
})
export class MyAccountModule { }
