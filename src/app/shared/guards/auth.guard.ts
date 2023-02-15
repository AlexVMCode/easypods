import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { UrlTree } from '@angular/router';
import { NotificationService } from '../services/notification.service';

/**
 * Guard general implementations class
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  public ruta: any;

  constructor(
    private router: Router,
    public loginService: LoginService,
    public notificationService: NotificationService
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.ruta = route;
    return this.loginService.isAuthenticated().then((isAuth: boolean) => {
      if (isAuth) {
        return true;
      } else {
        if (document.location.href.includes('logout')) {
          sessionStorage.setItem('url', document.location.href);
        }
        this.loginService.logout(false);
        return false;
      }
    });
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate(next, state);
  }

  // TODO validar los menús

  /* Scroll through the _nav.ts menus to validate permissions. */
  /* public validateMenu() {
    let valueMenu = true;
    let subMenu: any;
    const permission = navItems.filter(
      (menu) => this.ruta._routerState.url === menu.url
    );
    navItems.forEach(element => {
      if(element.children !== undefined){
        subMenu = element.children?.filter((submenu) =>
        this.ruta._routerState.url.includes(submenu.url));
      }
    });
    if (permission.length > 0 || subMenu.length > 0) {
      valueMenu = true;
    } else {
      valueMenu = false;
    }
    return valueMenu;
  } */
}
