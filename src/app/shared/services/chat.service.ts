import { Injectable } from '@angular/core';
import { Observable, pipe, map, catchError } from 'rxjs';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends BaseService {

  constructor(public http: HttpClient) {
    super();
  }

  /**
   * @description Guardar archivo en API
   * @param params
   */
  public saveFile(params: FormData): Observable<any> {
    return this.http.post(`${URL_SERVICES.URL_CHAT}/SaveMediaContent`, params).pipe(
      map((response: any) => {
        return response;
      }),
      pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
    );
  }

}
