import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplaceStatusPipe } from './replaceStatus.pipe';
import { ReplaceRolPipe } from './replaceRol.pipe';
import { ReplaceStatusProductPipe } from './replaceStatusProduct.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [ReplaceStatusPipe, ReplaceStatusProductPipe, ReplaceRolPipe],
  exports: [ReplaceStatusPipe, ReplaceStatusProductPipe, ReplaceRolPipe],
})
export class SharedPipesModule { }
