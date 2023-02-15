import { Pipe, PipeTransform } from '@angular/core';
import { Roles } from '../enum/roles';

@Pipe({
  name: 'replaceRol',
})
export class ReplaceRolPipe implements PipeTransform {
  constructor() { }
  transform(value: any, ...args: any[]): any {
    switch (value) {
      case 1:
        value = Roles.admin
        break;
      case 2:
        value = Roles.operario;
        break;
      case 7:
        value = Roles.superAdmin;
        break;

      default:
        break;
    }
    return value;
  }
}
