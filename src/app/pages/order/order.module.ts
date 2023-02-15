import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { DetailOrderComponent } from './detail-order/detail-order.component';

import { AgmCoreModule } from '@agm/core';
import { OrderComponent } from './order.component';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// import { NgAudioRecorderModule } from 'ng-audio-recorder';
import { ChangePaymentMethodComponent } from './change-payment-method/change-payment-method.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AddProductComponent } from './add-product/add-product.component';
import { SuggestChangeComponent } from './suggest-change/suggest-change.component';
import { ManageResponsiblyComponent } from './manage-responsibly/manage-responsibly.component';

@NgModule({
  declarations: [OrderComponent, DetailOrderComponent, ChangePaymentMethodComponent, AddProductComponent, SuggestChangeComponent, ManageResponsiblyComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCiwLx6J9KctQ6tnqcP8xgKaRrm--L7Sw8',
    }),
    SharedPipesModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatAutocompleteModule,
    // NgAudioRecorderModule,
    MatSidenavModule
  ],
  exports: [AgmCoreModule, SharedPipesModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrderModule { }
