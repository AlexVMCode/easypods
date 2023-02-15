import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { Roles } from 'src/app/shared/enum/roles';
import { LoginService } from 'src/app/shared/services/login.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  myControl = new FormControl('');
  markets: Array<any> = [];
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor(
    private notificationService: NotificationService,
    private loginService: LoginService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    let rol: string = this.loginService.getRol();
    if (rol != Roles.superAdmin) {
      this.router.navigateByUrl('/order');
    }
    this.getMarkets();
  }

  getMarkets() {
    this.loginService.getMarkets().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.markets = response.resultData;
          this.markets.forEach(item => {
            this.options.push(item.businessName);
          });
          this.options.sort();
          this.filterMarkets();
        }
      },
      error: (err) => {
        console.log(err);
        this.markets = [];
        this.notificationService.notification('info', '', err);
      }
    })
  }

  filterMarkets() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getMarketByName(businessName: string) {
    let market: any = this.markets.find(item => item.businessName == businessName);
    return market;
  }

  setMarket() {
    if (this.myControl.value) {
      let market = this.getMarketByName(this.myControl.value);
      sessionStorage.setItem('marketId', market.id);
      sessionStorage.setItem('businessName', market.businessName);
      this.router.navigateByUrl('/home');
    }
  }
}
