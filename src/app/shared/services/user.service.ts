import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { URL_SERVICES } from '../config/endpoints';
import { UserAdapter, Users } from '../models/users';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(private http: HttpClient, private adapter: UserAdapter) {
    super();
  }

  /**
   * @description Servicio para consultar usuarios
   */
  public getUsers(marketId: number): Observable<Array<Users>> {
    return this.http.get(`${URL_SERVICES.URL_USER}/${marketId}`)
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

  /**
   * @description Servicio para guardar usuarios
   */
  public saveUser(user: Users): Observable<Users> {
    return this.http.post(`${URL_SERVICES.URL_USER}/AddOrUpdate`, user)
      .pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
      .pipe(
        map((response: any) =>
          this.adapter.adapt(response.resultData)
        )
      );
  }

}
