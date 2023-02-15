import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/shared/models/permission';
import { PermissionService } from 'src/app/shared/services/permission.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  rolId: number = 0;
  permissions: Array<Permission> = [];

  showHome: boolean = false;
  showAccount: boolean = false;
  showOrder: boolean = false;
  showCatalog: boolean = false;

  constructor(private permissionService: PermissionService) { }

  ngOnInit(): void {
    this.permissions = this.permissionService.getLocalPermissions();
    this.validatePermission();
  }

  validatePermission() {
    for (const item of this.permissions) {
      switch (item.moduleName) {
        case '/home':
          this.showHome = true;
          break;
        case '/account':
          this.showAccount = true;
          break;
        case '/order':
          this.showOrder = true;
          break;
        case '/catalog':
          this.showCatalog = true;
          break;

        default:
          break;
      }
    }
  }
}
