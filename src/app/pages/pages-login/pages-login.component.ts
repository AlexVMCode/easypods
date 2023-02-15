import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, HostListener, OnInit } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { Permission } from 'src/app/shared/models/permission';

@Component({
  selector: 'app-pages-login',
  templateUrl: './pages-login.component.html',
  styleUrls: ['./pages-login.component.css'],
})
export class PagesLoginComponent implements OnInit {
  public listCountry = {
    name_en: 'Colombia',
    name_es: 'Colombia',
    dial_code: '+57',
    code: 'CO',
  };
  public isLoggin: any = false;
  public phone: any;
  public displayTime: any;
  public timerInterval: any;
  public code: any;
  public input1: any;
  public input2: any;
  public input3: any;
  public input4: any;

  constructor(
    public loginService: LoginService,
    public notificationService: NotificationService,
    public spinner: NgxSpinnerService,
    public router: Router
  ) { }

  ngOnInit(): void { }

  public login() {
    this.spinner.show();
    const params = {
      phone: '57' + this.phone,
    };
    this.loginService.login(params).subscribe(
      (result) => {
        if (result.isSuccess === true) {
          this.isLoggin = true;
          this.timer();
        } else {
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
  }

  timer() {
    let minute = 5;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.displayTime = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      if (seconds == 0) {
        this.router.navigateByUrl('/account');
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  public validateOTP() {
    this.spinner.show();
    this.code = this.input1 + this.input2 + this.input3 + this.input4;
    const params = {
      phone: '57' + this.phone,
      codeOtp: this.code,
    };
    this.loginService.validateCode(params).subscribe(
      (result) => {
        if (result.isSuccess === true) {
          this.loginService.initSession(result);
        } else {
          this.notificationService.notification('info', '', result.message);
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    );
  }

  public resendCode() {
    this.isLoggin = false;
    this.phone = null;
    this.displayTime = null;
  }

  public messageRegister() {
    this.notificationService.notification(
      'success',
      '',
      'Contacte el administrador para la creación del perfil'
    );
  }

  /* method for OTP code validation fields */
  @HostListener('keyup', ['$event']) onKeyDown(e: any) {
    if (e.srcElement.maxLength === e.srcElement.value.length) {
      e.preventDefault();

      let nextControl: any = e.srcElement.nextElementSibling;
      // Searching for next similar control to set it focus
      while (true) {
        if (nextControl) {
          if (nextControl.type === e.srcElement.type) {
            nextControl.focus();
            return;
          } else {
            nextControl = nextControl.nextElementSibling;
          }
        } else {
          return;
        }
      }
    }
    if (e.srcElement.value.length == 0) {
      e.preventDefault();
      let prevNode = e.srcElement.previousElementSibling;
      while (true) {
        if (prevNode) {
          if (prevNode.type === e.srcElement.type) {
            prevNode.focus();
            return;
          } else {
            prevNode = prevNode.previousElementSibling;
          }
        } else {
          return;
        }
      }
    }
  }
}
