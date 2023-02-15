import { Pipe, PipeTransform } from '@angular/core';
import { StatusOrderEnum } from '../enum/status-order-enum';

@Pipe({
  name: 'replaceStatus',
})
export class ReplaceStatusPipe implements PipeTransform {
  constructor() { }
  transform(value: any, ...args: any[]): any {
    switch (value) {
      case 1:
        value = StatusOrderEnum.Created;
        break;
      case 2:
        value = StatusOrderEnum.Assigned;
        break;
      case 3:
        value = StatusOrderEnum.AcceptedByTrade;
        break;
      case 4:
        value = StatusOrderEnum.RejectedByCommerce;
        break;
      case 5:
        value = StatusOrderEnum.Dispatched;
        break;
      case 6:
        value = StatusOrderEnum.Delivered;
        break;
      case 7:
        value = StatusOrderEnum.CancelByClient;
        break;
      case 8:
        value = StatusOrderEnum.ReceivedByClient;
        break;
      case 9:
        value = StatusOrderEnum.DeliveryWithNews;
        break;

      default:
        break;
    }
    return value;
  }
}
