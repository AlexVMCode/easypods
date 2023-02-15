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
import { PermissionService } from '../services/permission.service';
import { Permission } from '../models/permission';

/**
 * Guard general implementations class
 */
@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {

  rolId: number = 0;


  constructor(
    private router: Router,
    public loginService: LoginService,
    public permissionService: PermissionService
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let canPermission: boolean = false;
    let permissions: Array<Permission> = this.permissionService.getLocalPermissions();
    for (const item of permissions) {
      if (state.url.includes(item.moduleName)) {
        canPermission = true;
      }
    }
    return canPermission;
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
}
