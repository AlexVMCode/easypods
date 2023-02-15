import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

export const InterceptorSkipHeader = 'X-Skip-Interceptor';
export const HeaderAuthorization = 'Authorization';
export const HeaderContentType = 'Content-Type';

/**
 * Interceptor implementations class
 */
@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(public loginService: LoginService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let headers: any = {};
    if (!req.headers.has(HeaderContentType)) {
      if (
        !req.body ||
        (req.body && req.body.toString() !== '[object FormData]')
      ) {
        headers[HeaderContentType] = 'application/json';
      }
    } else {
      headers[HeaderContentType] = req.headers.get(HeaderContentType);
    }
    if (!req.headers.has(InterceptorSkipHeader)) {
        const token = this.loginService.getCurrentApiKey();
        if (token) {
          headers[HeaderAuthorization] = `Bearer ${token}`;
          req = req.clone({
            setHeaders: headers,
          });
        }
        return next.handle(req);

    }
    req.headers.delete(InterceptorSkipHeader);
    return next.handle(req);
  }
}
