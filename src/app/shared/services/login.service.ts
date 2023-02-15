import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable, pipe } from 'rxjs';
import { BaseService } from './base.service';
import { URL_SERVICES } from '../config/endpoints';
import { Roles } from '../enum/roles';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends BaseService {
  public hasSession = false;
  public token: any;

  constructor(
    private permissionService: PermissionService,
    public router: Router,
    public http: HttpClient
  ) {
    super();
  }

  /**
   * @description This service manages the access to the application.
   * @param phone
   */
  public login(params: any): Observable<any> {
    return this.http.post(`${URL_SERVICES.URL_SECURITY}/LoginByPhone`, params).pipe(
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
   * @description This service saves the session token in sessionStorage.
   * @author Juliana Buitrago.
   * @sprint 2
   * @param none.
   */
  public initSession(response: any): void {
    if (response !== null) {
      this.hasSession = true;
      sessionStorage.setItem('token', response.resultData.token);
      sessionStorage.setItem('marketId', response.resultData.id);
      sessionStorage.setItem('userId', response.resultData.marketUserId);
      sessionStorage.setItem('rolId', response.resultData.rolId);
      sessionStorage.setItem('rol', response.resultData.rol);
      sessionStorage.setItem('businessName', response.resultData.businessName);
      sessionStorage.setItem('userName', response.resultData.userName);

      if (sessionStorage.getItem('url') !== null) {
        const url: any = sessionStorage.getItem('url');
        const splittedUrl = url.split('?', 1);
        const orderId = splittedUrl[0].split('/', 6);
        this.router.navigateByUrl('/order/detail/' + orderId[5]);
      } else {
        this.getPermissions(response.resultData.rol);
      }
    } else {
      this.hasSession = false;
      sessionStorage.removeItem('token');
    }
    return;
  }

  getPermissions(rolName: string) {
    let rolId = parseInt(this.getRolId());
    this.permissionService.getPermissions(rolId).subscribe({
      next: (response) => {
        this.permissionService.saveLocalPermissions(response);
        switch (rolName) {
          case Roles.superAdmin:
            this.router.navigateByUrl('/market')
            break;
          case Roles.admin:
            this.router.navigateByUrl('/home')
            break;
          case Roles.operario:
            this.router.navigateByUrl('/order')
            break;

          default:
            break;
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  /**
   * @description This service manages the access to the application.
   * @param codeOTP, phone
   */
  public validateCode(params: any): Observable<any> {
    return this.http.post(`${URL_SERVICES.URL_SECURITY}/ValidateCodeOtp`, params).pipe(
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
   * @description This service return all markets
   */
  public getMarkets(): Observable<any> {
    return this.http.get(`${URL_SERVICES.URL_SECURITY}/GetMarkets`).pipe(
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
   * @description This service closes the session of the user entered.
   * @param none.
   */
  public logout(button: boolean = true): void {
    if (button) {
      sessionStorage.removeItem('url');
    }
    sessionStorage.clear();
    this.router.navigateByUrl('/pages-login');
    this.hasSession = false;
  }

  /**
   * @description This service returns if the user is logged in.
   * @param none.
   */
  public isLoggedIn(): any {
    const apiKey = this.getCurrentApiKey();
    if (apiKey) {
      this.hasSession = true;
    }
    return this.hasSession;
  }

  /**
   * @description This service returns whether or not the user is logged in.
   * @param none.
   */
  public isAuthenticated(): any {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.isLoggedIn());
      }, 100);
    });
    return promise;
  }

  /**
   * @description This service returns the apikey of bussiness.
   * @param none.
   */
  public getCurrentApiKey(): string {
    return sessionStorage.getItem('token')!;
  }

  /**
   * @description This service returns the user id
   * @param none.
   */
  public getCurrentUserId(): string {
    return sessionStorage.getItem('userId')!;
  }

  /**
   * @description This service returns the user name
   * @param none.
   */
  public getCurrentUserName(): string {
    return sessionStorage.getItem('userName')!;
  }

  /**
   * @description This service returns the market id
   * @param none.
   */
  public getCurrentMarketId(): string {
    return sessionStorage.getItem('marketId')!;
  }

  /**
   * @description This service returns the rol
   * @param none.
   */
  public getRol(): string {
    return sessionStorage.getItem('rol')!;
  }

  /**
   * @description This service returns the rol
   * @param none.
   */
  public getRolId(): string {
    return sessionStorage.getItem('rolId')!;
  }

  /**
   * @description This service returns the businessName
   * @param none.
   */
  public getBusinessName(): string {
    return sessionStorage.getItem('businessName')!;
  }
}
