import { AuthGuard } from './shared/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { PagesBlankComponent } from './pages/pages-blank/pages-blank.component';
import { PagesContactComponent } from './pages/pages-contact/pages-contact.component';
import { PagesError404Component } from './pages/pages-error404/pages-error404.component';
import { PagesFaqComponent } from './pages/pages-faq/pages-faq.component';
import { PagesLoginComponent } from './pages/pages-login/pages-login.component';
import { PagesRegisterComponent } from './pages/pages-register/pages-register.component';
import { UsersProfileComponent } from './pages/users-profile/users-profile.component';
import { MarketComponent } from './pages/market/market.component';
import { PermissionGuard } from './shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    redirectTo: 'pages-login',
    pathMatch: 'full',
  },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'alerts', component: AlertsComponent },
  { path: 'accordion', component: AccordionComponent },
  { path: 'pages-blank', component: PagesBlankComponent },
  { path: 'pages-contact', component: PagesContactComponent },
  { path: 'pages-error404', component: PagesError404Component },
  { path: 'pages-faq', component: PagesFaqComponent },
  { path: 'pages-login', component: PagesLoginComponent },
  { path: 'pages-register', component: PagesRegisterComponent },
  { path: 'user-profile', component: UsersProfileComponent },
  {
    path: 'market',
    canActivate: [AuthGuard],
    component: MarketComponent
  },
  {
    path: 'home',
    canActivateChild: [AuthGuard, PermissionGuard],
    loadChildren: () =>
      import('./pages/home/home.module').then(
        (m) => m.HomeModule
      ),
  },
  {
    path: 'account',
    canActivateChild: [AuthGuard, PermissionGuard],
    loadChildren: () =>
      import('./pages/my-account/my-account.module').then(
        (m) => m.MyAccountModule
      ),
  },
  {
    path: 'order',
    canActivateChild: [AuthGuard, PermissionGuard],
    loadChildren: () =>
      import('./pages/order/order.module').then(
        (m) => m.OrderModule
      ),
  },
  {
    path: 'adminaccount',
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('./pages/admin-account/admin-account.module').then(
        (m) => m.AdminAccountModule
      ),
  },
  {
    path: 'catalog',
    canActivateChild: [AuthGuard, PermissionGuard],
    loadChildren: () =>
      import('./pages/catalog/catalog.module').then(
        (m) => m.CatalogModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
