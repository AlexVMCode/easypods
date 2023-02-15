import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminAccountRoutingModule } from './admin-account-routing.module';
import { AdminAccountComponent } from './admin-account.component';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    AdminAccountComponent
  ],
  imports: [
    CommonModule,
    AdminAccountRoutingModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCiwLx6J9KctQ6tnqcP8xgKaRrm--L7Sw8'
    })
  ],
  exports: [
    AgmCoreModule
  ]
})
export class AdminAccountModule { }
