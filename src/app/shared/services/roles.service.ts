import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { URL_SERVICES } from '../config/endpoints';
import { RoleAdapter, Roles } from '../models/roles';

import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService {

  constructor(private http: HttpClient, private adapter: RoleAdapter) {
    super();
  }

  /**
   * @description Servicio para consultar roles
   */
  public getRoles(): Observable<Array<Roles>> {
    return this.http.get(`${URL_SERVICES.URL_ROLES}/GetRoles`)
      .pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
      .pipe(
        map((response: any) =>
          response.resultData.map(
            (item: any) => this.adapter.adapt(item)
          )
        )
      );
  }
}
