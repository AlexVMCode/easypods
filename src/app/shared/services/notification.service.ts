import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  public notification(icon: any, title: string, text: string) {
    Swal.fire({
      icon,
      title,
      text
    });
  }

  public notificationButton(icon: any, title: any, text: any): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      icon,
      cancelButtonText: 'No',
      confirmButtonText: 'Si',
      showCancelButton: true,
      text,
      title
    });
  }
}
