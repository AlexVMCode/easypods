import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogRoutingModule } from './catalog-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class CatalogModule { }
