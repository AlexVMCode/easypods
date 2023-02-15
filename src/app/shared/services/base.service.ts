import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor() { }

  /**
   * Method in charge of handling the errors
   * returned by the requests of the services
   * @param error with code
   * @return error exception
   */
   public handleError(error: any): any {
    if (error.hasOwnProperty('status')) {
      switch (error.status) {
        case 400:
        case 401:
        case 403:
        case 405:
        case 404:
        case 429:
        case 422:
          return throwError(() => ('Valide los datos enviados.'));
        case 500:
        case 503:
        case 504:
          return throwError(() => ('Error en el servidor, contacte el administrador'));
        default:
          return throwError(() => 'Error en el servidor');
          break;
      }
    } else {
      return throwError(() => new Error('No se ha podido encontrar el elemento solicitado'));
    }
  }
}
