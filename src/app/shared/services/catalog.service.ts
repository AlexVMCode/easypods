import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, pipe } from 'rxjs';
import { BaseService } from './base.service';
import { URL_SERVICES } from '../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class CatalogService extends BaseService {

  constructor(public http: HttpClient) {
    super();
  }

  /**
   * @description Servicio para consultar catálogo de productos
   */
  public getCatalog(marketId: string): Observable<any> {
    return this.http.get(`${URL_SERVICES.URL_CATALOG}/GetProducts`, {
      headers: {
        marketId: marketId
      },
    }).pipe(
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

  /**
   * @description Servicio para cambiar estado de producto
   */
  public changeStatus(marketId: string, productId: string, status: boolean): Observable<any> {
    return this.http.post(`${URL_SERVICES.URL_CATALOG}/SaveMarketProduct`, {
      marketId: marketId,
      productId: productId,
      checkSelected: status,
    }).pipe(
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
