import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { LoginService } from 'src/app/shared/services/login.service';
import { Roles } from 'src/app/shared/enum/roles';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public userName: string;
  public rol: string;
  public businessName: string;
  public showOption: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document,
    public loginService: LoginService) { }

  ngOnInit(): void {
    this.userName = this.loginService.getCurrentUserName();
    this.rol = this.loginService.getRol();
    this.businessName = this.loginService.getBusinessName();
    if (this.rol == Roles.superAdmin) {
      this.showOption = true;
    }
  }
  sidebarToggle() {
    //toggle sidebar function
    this.document.body.classList.toggle('toggle-sidebar');
  }

  public logout() {
    this.loginService.logout();
  }
}
