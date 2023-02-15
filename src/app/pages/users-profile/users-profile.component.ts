import { LoginService } from './../../shared/services/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-profile',
  templateUrl: './users-profile.component.html',
  styleUrls: ['./users-profile.component.css']
})
export class UsersProfileComponent implements OnInit {
  public userName: any;

  constructor(public loginService: LoginService) { }

  ngOnInit(): void {
    this.userName = this.loginService.getCurrentUserName();
  }

}
