import { Pipe, PipeTransform } from '@angular/core';
import { StatusProductEnum } from '../enum/status-product-enum';

@Pipe({
  name: 'replaceStatusProduct',
})
export class ReplaceStatusProductPipe implements PipeTransform {
  constructor() { }
  transform(value: any, ...args: any[]): any {
    switch (value) {
      case 1:
        value = StatusProductEnum.Created;
        break;
      case 2:
        value = StatusProductEnum.AcceptedByCommerce;
        break;
      case 3:
        value = StatusProductEnum.RejectedByCommerce;
        break;
      case 4:
        value = StatusProductEnum.RequestChange;
        break;
      case 5:
        value = StatusProductEnum.ChangeAcceptedByClient;
        break;
      case 6:
        value = StatusProductEnum.ChangeRejectedByCustomer;
        break;
      default:
        break;
    }
    return value;
  }
}
