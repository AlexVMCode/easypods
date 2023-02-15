import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../config/endpoints';
import { catchError, map, Observable } from 'rxjs';
import { Permission, PermissionAdapter } from '../models/permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends BaseService {

  constructor(private http: HttpClient, private adapter: PermissionAdapter) {
    super();
  }

  /**
   * @description Servicio para consultar permisos
   * @param rolId Rol
   * 
   */
  public getPermissions(rolId: number): Observable<Array<Permission>> {
    return this.http.get(`${URL_SERVICES.URL_PERMISSION}/${rolId}`)
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

  public saveLocalPermissions(permissions: Array<Permission>) {
    sessionStorage.setItem('permissions', JSON.stringify(permissions));
  }

  public getLocalPermissions(): Array<Permission> {
    let permissions: Array<Permission> = []
    let stringPermissions = sessionStorage.getItem('permissions');
    if (stringPermissions) {
      permissions = JSON.parse(stringPermissions);
    }
    return permissions;
  }

}
