import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, pipe, catchError } from 'rxjs';
import { URL_SERVICES } from '../config/endpoints';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService {

  constructor(public http: HttpClient) {
    super()
  }

  /**
   * @description Return account information per id.
   * @param idMarket
   */
   public marketById(idMarket: any): Observable<any> {
    return this.http.get(`${URL_SERVICES.URL_MARKET}/` + idMarket)
      .pipe(
        map((response: any) => {
          return response;
        }),
        pipe(
          catchError((error: any) => {
            return this.handleError(error)
          })
        )
      );
  }

  /**
   * @description Return payment methods
   */
   public getPaymentMethods(): Observable<any> {
    return this.http.get(`${URL_SERVICES.URL_PAYMENTMETHOD}`)
      .pipe(
        map((response: any) => {
          return response;
        }),
        pipe(
          catchError((error: any) => {
            return this.handleError(error)
          })
        )
      );
  }

  /**
   * @description Return banks
   */
   public getBanks(): Observable<any> {
    return this.http.get(`${URL_SERVICES.URL_BANKS}/GetBanks`)
      .pipe(
        map((response: any) => {
          return response;
        }),
        pipe(
          catchError((error: any) => {
            return this.handleError(error)
          })
        )
      );
  }

  /**
   * @description Return types of bank accounts
   */
   public getAccountTypes(): Observable<any> {
    return this.http.get(`${URL_SERVICES.URL_BANKS}/GetAccountTypes`)
      .pipe(
        map((response: any) => {
          return response;
        }),
        pipe(
          catchError((error: any) => {
            return this.handleError(error)
          })
        )
      );
  }

  /**
   * @description Return categories
   */
   public getCategory(): Observable<any> {
    return this.http.get(`${URL_SERVICES.URL_CATEGORY}/GetCategories`)
      .pipe(
        map((response: any) => {
          return response;
        }),
        pipe(
          catchError((error: any) => {
            return this.handleError(error)
          })
        )
      );
  }

  /**
   * @description Return categories
   */
   public updateMarket(params: any): Observable<any> {
    return this.http.post(`${URL_SERVICES.URL_MARKET}/AddOrUpdate`, params)
      .pipe(
        map((response: any) => {
          return response;
        }),
        pipe(
          catchError((error: any) => {
            return this.handleError(error)
          })
        )
      );
  }


  /**
   * @description Return types of documents
   */
   public getDocumentType(): Observable<any> {
    return this.http.get(`${URL_SERVICES.URL_DOCUMENT_TYPE}`)
      .pipe(
        map((response: any) => {
          return response;
        }),
        pipe(
          catchError((error: any) => {
            return this.handleError(error)
          })
        )
      );
  }
}
